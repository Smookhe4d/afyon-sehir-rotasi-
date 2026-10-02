import type { StyleSpecification, LayerSpecification } from "maplibre-gl";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

/** Sıcak, krem tonlu "Apple Maps" havası: OpenFreeMap (OSM) vektör haritası çalışma anında yeniden boyanır. */
const C = {
  land: "#F4EDE0", park: "#DCE4C3", wood: "#CFDAB4", water: "#B9D6DD", sand: "#EBDDBE",
  building: "#E9DCC5", buildingEdge: "#DCCBAE",
  roadMinor: "#FFFFFF", roadMain: "#FFFBF3", roadMainEdge: "#E3D3B6", roadTrunk: "#F9DFB8", roadTrunkEdge: "#E2B67D",
  rail: "#D8CBB4", text: "#4A4338", textMuted: "#7A7060", halo: "#FBF6EC", waterText: "#5B8794",
};

function recolor(l: LayerSpecification): LayerSpecification | null {
  const id = l.id;
  if (id === "natural_earth") return null;
  if (id.startsWith("poi_") || id.startsWith("road_one_way") || id.includes("shield")) return null;
  const set = (paint: Record<string, unknown>) => { l.paint = { ...(l.paint ?? {}), ...paint } as never; };
  if (l.type === "background") set({ "background-color": C.land });
  else if (id === "park") set({ "fill-color": C.park, "fill-opacity": 0.9, "fill-outline-color": "rgba(0,0,0,0)" });
  else if (id === "park_outline") set({ "line-color": "rgba(150,170,110,0.35)" });
  else if (id === "landcover_wood") set({ "fill-color": C.wood, "fill-opacity": 0.8 });
  else if (id === "landcover_grass") set({ "fill-color": C.park, "fill-opacity": 0.7 });
  else if (id === "landcover_sand") set({ "fill-color": C.sand });
  else if (id === "landcover_ice" || id === "landcover_wetland") set({ "fill-opacity": 0.4 });
  else if (id.startsWith("landuse_")) set({ "fill-color": id === "landuse_residential" ? "#F0E6D3" : "#EDE3CE" });
  else if (id.startsWith("water") && l.type === "fill") set({ "fill-color": C.water });
  else if (id.startsWith("waterway")) { if (l.type === "line") set({ "line-color": C.water }); else set({ "text-color": C.waterText, "text-halo-color": C.halo }); }
  else if (id.startsWith("water_name")) set({ "text-color": C.waterText, "text-halo-color": C.halo });
  else if (id === "building") set({ "fill-color": C.building, "fill-outline-color": C.buildingEdge });
  else if (id === "building-3d") set({ "fill-extrusion-color": C.building, "fill-extrusion-opacity": 0.85 });
  else if (l.type === "line" && /casing/.test(id)) set({ "line-color": /trunk|primary|motorway/.test(id) ? C.roadTrunkEdge : C.roadMainEdge });
  else if (l.type === "line" && /rail|transit/.test(id)) set({ "line-color": C.rail });
  else if (l.type === "line" && /trunk_primary|motorway/.test(id)) set({ "line-color": C.roadTrunk });
  else if (l.type === "line" && /path_pedestrian/.test(id)) set({ "line-color": "#CDBA97" });
  else if (l.type === "line" && /^(road|bridge|tunnel)_/.test(id)) set({ "line-color": /secondary|street/.test(id) ? C.roadMain : C.roadMinor });
  else if (id.startsWith("boundary")) set({ "line-color": "#C8B79A" });
  else if (l.type === "symbol") set({ "text-color": /village|other|highway-name/.test(id) ? C.textMuted : C.text, "text-halo-color": C.halo, "text-halo-width": 1.6 });
  return l;
}

export async function loadWarmStyle(): Promise<StyleSpecification | string> {
  try {
    const res = await fetch(STYLE_URL);
    if (!res.ok) throw new Error(String(res.status));
    const style = (await res.json()) as StyleSpecification;
    style.layers = style.layers.map(recolor).filter((l): l is LayerSpecification => l !== null);
    return style;
  } catch {
    return STYLE_URL; // ağ/biçim sorunu olursa orijinal stil
  }
}
