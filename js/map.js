import {
  MAPBOX_TOKEN,
  MAP_CONFIG,
  CORNERS,
  OVERLAY_IMAGE_URL,
  DEFAULT_OVERLAY_OPACITY,
} from "./config.js";
import { LOTES } from "./data.js";

/** Detecta si coordenadas parecen UTM (metros) en vez de lng/lat */
function looksLikeUTM(featureCollection) {
  const f = featureCollection?.features?.[0];
  if (!f) return false;

  const coords =
    f.geometry?.type === "Polygon"
      ? f.geometry.coordinates?.[0]?.[0]
      : f.geometry?.type === "MultiPolygon"
      ? f.geometry.coordinates?.[0]?.[0]?.[0]
      : null;

  if (!coords || coords.length < 2) return false;

  const [x, y] = coords;
  return Math.abs(x) > 180 || Math.abs(y) > 90;
}

/** Calcula bounds de un FeatureCollection (WGS84) */
function getBoundsFromGeoJSON(fc) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const f of fc.features || []) {
    const geom = f.geometry;
    if (!geom) continue;

    const points =
      geom.type === "Polygon"
        ? geom.coordinates.flat(1)
        : geom.type === "MultiPolygon"
        ? geom.coordinates.flat(2)
        : [];

    for (const pt of points) {
      const [x, y] = pt;
      if (typeof x !== "number" || typeof y !== "number") continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY))
    return null;

  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

/* =========================
   LABEL POINTS (ROBUSTO)
   ========================= */

function polygonAreaCentroid(ring) {
  if (!ring || ring.length < 3) return null;

  const pts = ring.slice();
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) pts.push(first);

  let A = 0,
    Cx = 0,
    Cy = 0;

  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cross = x0 * y1 - x1 * y0;
    A += cross;
    Cx += (x0 + x1) * cross;
    Cy += (y0 + y1) * cross;
  }

  A *= 0.5;
  if (Math.abs(A) < 1e-12) return null;

  Cx /= 6 * A;
  Cy /= 6 * A;
  return [Cx, Cy];
}

function pointInPoly(point, ring) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

function bboxOfRing(ring) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

function findInteriorPoint(ring) {
  const { minX, minY, maxX, maxY } = bboxOfRing(ring);
  const steps = 14;

  for (let s = 0; s <= steps; s++) {
    for (let t = 0; t <= steps; t++) {
      const x = minX + (maxX - minX) * (s / steps);
      const y = minY + (maxY - minY) * (t / steps);
      if (pointInPoly([x, y], ring)) return [x, y];
    }
  }

  // último recurso
  let x = 0,
    y = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
  }
  return [x / ring.length, y / ring.length];
}

function getLabelPointFromPolygon(feature) {
  const ring = feature.geometry?.coordinates?.[0];
  if (!ring) return MAP_CONFIG.center;

  // Bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  let bestPoint = null;
  let bestDist = -Infinity;

  const steps = 30; // más alto = mejor precisión

  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const x = minX + (maxX - minX) * (i / steps);
      const y = minY + (maxY - minY) * (j / steps);

      if (!pointInPoly([x, y], ring)) continue;

      // distancia mínima a bordes
      let minDist = Infinity;

      for (let k = 0; k < ring.length - 1; k++) {
        const [x1, y1] = ring[k];
        const [x2, y2] = ring[k + 1];

        const dx = x2 - x1;
        const dy = y2 - y1;

        const t =
          ((x - x1) * dx + (y - y1) * dy) /
          (dx * dx + dy * dy);

        const px = x1 + Math.max(0, Math.min(1, t)) * dx;
        const py = y1 + Math.max(0, Math.min(1, t)) * dy;

        const dist = Math.hypot(x - px, y - py);
        if (dist < minDist) minDist = dist;
      }

      if (minDist > bestDist) {
        bestDist = minDist;
        bestPoint = [x, y];
      }
    }
  }

  return bestPoint || ring[0];
}

// ✅ Exportado para que app.js lo pueda usar cuando cambias estado
export function buildCentroidFC(lotesFC) {
  return {
    type: "FeatureCollection",
    features: (lotesFC.features || []).map((f) => {
      const manualPoint = f.properties?.labelPoint;
      const center =
        Array.isArray(manualPoint) && manualPoint.length === 2
          ? manualPoint
          : getLabelPointFromPolygon(f) || MAP_CONFIG.center;

      return {
        type: "Feature",
        properties: {
          id: f.properties?.id,
          estado: (f.properties?.estado || "disponible").toLowerCase(),
        },
        geometry: { type: "Point", coordinates: center },
      };
    }),
  };
}

/* =========================
   MAP
   ========================= */

export function createMap() {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  const map = new mapboxgl.Map({
    container: "map",
    ...MAP_CONFIG,
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-right");
  map.addControl(
    new mapboxgl.ScaleControl({ maxWidth: 120, unit: "metric" }),
    "bottom-right"
  );

  map.on("error", (e) => {
    console.error("MAPBOX ERROR:", e?.error || e);
  });

  map.on("load", () => {
    // Loader off
    const loader = document.getElementById("mapLoader");
    if (loader) loader.classList.add("hidden");

    // === 1) Overlay raster (plano) ===
    if (!map.getSource("overlay-plano")) {
      map.addSource("overlay-plano", {
        type: "image",
        url: OVERLAY_IMAGE_URL,
        coordinates: CORNERS,
      });
    }

    if (!map.getLayer("overlay-plano-layer")) {
      map.addLayer({
        id: "overlay-plano-layer",
        type: "raster",
        source: "overlay-plano",
        paint: { "raster-opacity": DEFAULT_OVERLAY_OPACITY },
      });
    }

    // === 2) Lotes GeoJSON ===
    if (!LOTES?.features?.length) {
      console.error("LOTES está vacío. Revisa js/data.js");
      return;
    }

    if (looksLikeUTM(LOTES)) {
      console.error(
        "Tus LOTES parecen estar en UTM (metros). Mapbox necesita WGS84 [lng,lat]. Convierte antes de dibujar."
      );
      // los cargo igual para debug, pero se verán mal
    }

    if (!map.getSource("lotes")) {
      map.addSource("lotes", { type: "geojson", data: LOTES });
    } else {
      map.getSource("lotes").setData(LOTES);
    }

    // Fill
    if (!map.getLayer("lotes-fill")) {
      map.addLayer({
        id: "lotes-fill",
        type: "fill",
        source: "lotes",
        paint: {
          "fill-color": [
            "match",
            ["downcase", ["get", "estado"]],
            "disponible",
            "#4a9b7f",
            "reservado",
            "#c9a86c",
            "vendido",
            "#c0392b",
            "#888",
          ],
          "fill-opacity": 0.35,
        },
      });
    }

    // Line
    if (!map.getLayer("lotes-line")) {
      map.addLayer({
        id: "lotes-line",
        type: "line",
        source: "lotes",
        paint: {
          "line-color": "#ffffff",
          "line-width": 1.8,
          "line-opacity": 1,
        },
      });
    }

    // === 3) Labels (círculo + texto en el centro del lote) ===
    const centroides = buildCentroidFC(LOTES);

    if (!map.getSource("lotes-centroides")) {
      map.addSource("lotes-centroides", { type: "geojson", data: centroides });
    } else {
      map.getSource("lotes-centroides").setData(centroides);
    }

    // Círculo
    if (!map.getLayer("lotes-badge")) {
      map.addLayer({
        id: "lotes-badge",
        type: "circle",
        source: "lotes-centroides",
        paint: {
          "circle-color": [
            "match",
            ["downcase", ["get", "estado"]],
            "disponible",
            "#4a9b7f",
            "reservado",
            "#c9a86c",
            "vendido",
            "#c0392b",
            "#888",
          ],
          "circle-radius": 12,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-opacity": 0.95,
        },
      });
    }

    // Texto
    if (!map.getLayer("lotes-label")) {
      map.addLayer({
        id: "lotes-label",
        type: "symbol",
        source: "lotes-centroides",
        layout: {
          "text-field": ["get", "id"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 11,
          "text-allow-overlap": true,
          "text-anchor": "center",
        },
        paint: {
          "text-color": "#ffffff",
        },
      });
    }

    // === 4) Auto-zoom a los lotes ===
    const b = getBoundsFromGeoJSON(LOTES);
    if (b) {
      // map.fitBounds(b, { padding: 60, maxZoom: 19 });
    } else {
      console.warn("No pude calcular bounds de LOTES (¿geometría rara?).");
    }

    console.log("LOTES features:", LOTES.features.length);
    console.log("Primer feature:", LOTES.features[0]);
  });

  return map;
}

export function setOverlayOpacity(map, opacity01) {
  if (!map?.getLayer("overlay-plano-layer")) return;
  map.setPaintProperty("overlay-plano-layer", "raster-opacity", opacity01);
}
