export const MAPBOX_TOKEN = "pk.eyJ1IjoiYWJkZWxqaG9uYXRhbiIsImEiOiJjbW1jNXY0bncwMnc2MnBxNm00ZzBveGZvIn0.rP_64V5XYIAPk6OnOBoAKw";

export const MAP_CONFIG = {
  style: "mapbox://styles/mapbox/satellite-v9",
  center: [-74.257609, -13.137296],
  zoom: 16.5,
  pitch: 0,
  bearing: 0,
  antialias: true,
  maxZoom: 19.5,
};

// Coordenadas del overlay
export const CORNERS = [
  [-74.258683, -13.136444], // top-left
  [-74.257176, -13.136440], // top-right
  [-74.257171, -13.137917], // bottom-right
  [-74.258678, -13.137921]  // bottom-left
];

// imagen del plano
export const OVERLAY_IMAGE_URL = "./assets/overlays/plano.png";

// opacidad inicial
export const DEFAULT_OVERLAY_OPACITY = 0.8;