export const poiCategories = [
  { value: "eco_tourism", label: "Природа", icon: "🌿", marker: "nature" },
  { value: "heritage", label: "История", icon: "🏛️", marker: "heritage" },
  { value: "city", label: "Город", icon: "🏙️", marker: "city" },
  { value: "unusual", label: "Необычное", icon: "✨", marker: "unusual" },
] as const;

export type PoiCategory = (typeof poiCategories)[number]["value"];

export function getCategoryLabel(category: string): string {
  return poiCategories.find((item) => item.value === category)?.label ?? "Другое";
}
