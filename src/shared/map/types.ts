import type { LngLatBounds } from "@shared/lib/geo";

export type MapPoint = {
  id: string | number;
  coordinates: readonly [number, number];
  title: string;
  category: string;
};

export type MapAdapter = {
  getBounds(): LngLatBounds | null;
  setCenter(center: readonly [number, number], zoom?: number): void;
  setZoom(zoom: number): void;
  onBoundsChange(callback: (bounds: LngLatBounds) => void): () => void;
};
