export type LngLat = [number, number];

export function haversineM(a: LngLat, b: LngLat) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad, dLon = (b[0] - a[0]) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function formatDistance(m: number) {
  if (m < 950) return `${Math.round(m / 10) * 10} m`;
  return `${(m / 1000).toFixed(m < 10000 ? 1 : 0).replace(".", ",")} km`;
}

/** Dairesel doğruluk alanı için GeoJSON çokgeni */
export function circlePolygon(center: LngLat, radiusM: number, steps = 48): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = center, rad = Math.PI / 180;
  const dLat = radiusM / 111320, dLng = radiusM / (111320 * Math.cos(lat * rad));
  const ring: LngLat[] = [];
  for (let i = 0; i <= steps; i++) { const t = (i / steps) * 2 * Math.PI; ring.push([lng + dLng * Math.cos(t), lat + dLat * Math.sin(t)]); }
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } };
}

export const directionsUrl = (to: LngLat, from?: LngLat) =>
  `https://www.google.com/maps/dir/?api=1&destination=${to[1]},${to[0]}${from ? `&origin=${from[1]},${from[0]}` : ""}&travelmode=driving`;
