import type { ComponentType } from "react";

type Ymaps3Module = {
  ready: Promise<void>;
  import: {
    (moduleName: string): Promise<Record<string, unknown>>; 
    registerCdn: (cdnUrl: string, moduleSpecifier: string) => void;
  };
};
declare global {
  interface Window {
    ymaps3?: Ymaps3Module;
  }
}
export type YandexReactComponents = {
  YMap: ComponentType<Record<string, unknown>>;
  YMapDefaultSchemeLayer: ComponentType<Record<string, unknown>>;
  YMapDefaultFeaturesLayer: ComponentType<Record<string, unknown>>;
  YMapMarker: ComponentType<Record<string, unknown>>;
  YMapListener: ComponentType<Record<string, unknown>>;
  YMapControls: ComponentType<Record<string, unknown>>;
  YMapFeatureDataSource: ComponentType<Record<string, unknown>>;
  YMapLayer: ComponentType<Record<string, unknown>>;
  YMapClusterer: ComponentType<Record<string, unknown>>;
  YMapZoomControl: ComponentType<Record<string, unknown>>;
  YMapGeolocationControl: ComponentType<Record<string, unknown>>;
  clusterByGrid: (options: { gridSize: number }) => unknown;
};
