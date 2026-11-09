
export type LngLat = readonly [longitude: number, latitude: number];
export type LngLatBounds = readonly [southWest: LngLat, northEast: LngLat];
export function boundsToBbox(bounds: LngLatBounds): string {
  const [first, second] = bounds;

  const values = [...first, ...second];

  if (!values.every(Number.isFinite)) {
    throw new Error("Границы карты содержат некорректные координаты");
  }

  const [lon1, lat1] = first;
  const [lon2, lat2] = second;

  if (
    Math.abs(lon1) > 180 ||
    Math.abs(lon2) > 180 ||
    Math.abs(lat1) > 90 ||
    Math.abs(lat2) > 90
  ) {
    throw new Error("Координаты границ карты выходят за допустимый диапазон");
  }

  // Нормализуем порядок координат.
  // Это защищает от ситуации, когда карта передаёт точки в обратном порядке.
  const minLon = Math.min(lon1, lon2);
  const minLat = Math.min(lat1, lat2);
  const maxLon = Math.max(lon1, lon2);
  const maxLat = Math.max(lat1, lat2);

  return [minLon, minLat, maxLon, maxLat]
    .map((value) => Number(value.toFixed(6)))
    .join(",");
}
