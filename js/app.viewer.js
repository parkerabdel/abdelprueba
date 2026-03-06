import { createMap, setOverlayOpacity } from "./map.js";
import { showLotePopup, hidePopup } from "./popup.js";
import { LOTES } from "./data.js";

const PROJECT_URL = "./data/proyecto.json"; // ✅ el archivo que subirás a internet

async function loadProjectJSON() {
  try {
    const res = await fetch(PROJECT_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json && typeof json === "object" ? json : {};
  } catch (err) {
    console.warn("No se pudo cargar proyecto.json:", err);
    return {};
  }
}

function applyToLOTES(project) {
  const estados = project?.estados || {};
  const datos = project?.datos || {};

  for (const f of LOTES.features) {
    const id = f.properties?.id;
    if (!id) continue;

    if (estados[id]) f.properties.estado = String(estados[id]).toLowerCase();
    if (datos[id]) Object.assign(f.properties, datos[id]);
  }
}

const map = createMap();

// UI: Opacity Slider (sí se mantiene)
function initOpacityUI() {
  const slider = document.getElementById("opacitySlider");
  const val = document.getElementById("opacityVal");
  if (!slider) return;

  slider.addEventListener("input", (e) => {
    const v = Number(e.target.value || 0);
    const opacity = Math.max(0, Math.min(1, v / 100));
    if (val) val.textContent = `${v}%`;
    try { setOverlayOpacity(map, opacity); } catch {}
  });
}

// Popup (solo ver)
function openPopupForFeature(feature) {
  if (!feature) return;
  const id = feature.properties?.id;
  if (!id) return;

  const real = LOTES.features.find((x) => x.properties?.id === id) || feature;

  showLotePopup(real, {
    canEdit: false, // ✅ viewer: no edita
  });
}

// Eventos
function initMapEvents() {
  map.on("load", () => {
    map.on("click", "lotes-fill", (e) => {
      e.originalEvent?.stopPropagation?.();
      openPopupForFeature(e.features?.[0]);
    });

    if (map.getLayer("lotes-badge")) {
      map.on("click", "lotes-badge", (e) => {
        e.originalEvent?.stopPropagation?.();
        openPopupForFeature(e.features?.[0]);
      });
    }

    map.on("mouseenter", "lotes-fill", () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", "lotes-fill", () => (map.getCanvas().style.cursor = ""));
    if (map.getLayer("lotes-badge")) {
      map.on("mouseenter", "lotes-badge", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "lotes-badge", () => (map.getCanvas().style.cursor = ""));
    }

    map.on("click", (e) => {
      const hits = map.queryRenderedFeatures(e.point, { layers: ["lotes-fill", "lotes-badge"] });
      if (!hits.length) hidePopup();
    });
  });
}

// ✅ Cargar proyecto.json y aplicar antes de mostrar
(async () => {
  const project = await loadProjectJSON();
  applyToLOTES(project);

  // refrescar fuente si ya existe
  map.on("load", () => {
    const src = map.getSource("lotes");
    if (src) src.setData(LOTES);
  });

  initOpacityUI();
  initMapEvents();
})();
