import L from "leaflet";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export function markerIcon(label: string, count: number | null, modifiers: string[]): L.DivIcon {
  const countHtml = count === null ? "" : `<span class="fair-map-marker-count">${count}</span>`;
  const modifierClass = modifiers.filter(Boolean).join(" ");
  return L.divIcon({
    className: "fair-map-marker-wrapper",
    html: `<span class="fair-map-marker ${modifierClass}">${escapeHtml(label)}${countHtml}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -28],
  });
}
