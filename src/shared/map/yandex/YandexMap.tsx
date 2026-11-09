import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { LocateFixed, LoaderCircle, MapPin, Minus, Plus } from "lucide-react";
import { env } from "@shared/config/env";
import type { LngLat, LngLatBounds } from "@shared/lib/geo";
import type { Poi } from "@domains/poi";
import { loadYmaps3 } from "./loadYmaps3";
import type { YandexReactComponents } from "./ymaps3";

type Props = {
  pois: Poi[];
  onBoundsChange: (bounds: LngLatBounds) => void;
  onSelectPoi: (poi: Poi) => void;
  onLocateError: (message: string) => void;

  selectionMode?: boolean;
  selectedPoint?: LngLat | null;
  onPointSelect?: (coordinates: LngLat) => void;
};

const BELARUS_CENTER: [number, number] = [27.56, 53.9];

function isBounds(value: unknown): value is LngLatBounds {
  if (!Array.isArray(value) || value.length !== 2) return false;
  return value.every((point) => Array.isArray(point) && point.length >= 2 && point.every((n) => typeof n === "number"));
}

function isLngLat(value: unknown): value is LngLat {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1]) &&
    Math.abs(value[0]) <= 180 &&
    Math.abs(value[1]) <= 90
  );
}

export function YandexMap({ pois, onBoundsChange, onSelectPoi, onLocateError, selectionMode = false, selectedPoint = null, onPointSelect, }: Props) {
  const [components, setComponents] = useState<YandexReactComponents | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(6);
  const [mapRef, setMapRef] = useState<{ update: (props: Record<string, unknown>) => void } | null>(null);


  const initialLocation = useMemo(
    () => ({
      center: BELARUS_CENTER,
      zoom: 6,
    }),
    [],
  );

  useEffect(() => {
    let active = true;
    loadYmaps3(env.yandexMapsApiKey)
      .then((loaded) => { if (active) setComponents(loaded); })
      .catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : "Ошибка загрузки карты"); });
    return () => { active = false; };
  }, []);

  const handleMapUpdate = useCallback((event: unknown) => {
    if (typeof event !== "object" || event === null || !("location" in event)) return;
    const location = (event as { location?: { bounds?: unknown } }).location;
    if (location?.bounds && isBounds(location.bounds)) onBoundsChange(location.bounds);
  }, [onBoundsChange]);

  const handleMapClick = useCallback(
    (object: unknown, event: unknown) => {
      if (!selectionMode || !onPointSelect || object) return;

      if (
        typeof event !== "object" ||
        event === null ||
        !("coordinates" in event)
      ) {
        return;
      }

      const coordinates = event.coordinates;

      if (isLngLat(coordinates)) {
        onPointSelect(coordinates);
      }
    },
    [selectionMode, onPointSelect],
  );

  const clusterMethod = useMemo(
    () => components?.clusterByGrid({ gridSize: 64 }),
    [components],
  );

  const marker = useCallback((feature: { id: string | number; geometry: { coordinates: readonly [number, number] } }) => {
    if (!components) return null;
    const Marker = components.YMapMarker as ComponentType<Record<string, unknown>>;
    const poi = pois.find((item) => String(item.id) === String(feature.id));
    return (
      <Marker key={String(feature.id)} coordinates={feature.geometry.coordinates}>
        <button
          type="button"
          className={`poi-map-marker ${poi?.category === "eco_tourism" ? "poi-map-marker-nature" : ""}`}
          aria-label={poi?.name ?? "Точка интереса"}
          onClick={() => { if (poi) onSelectPoi(poi); }}
        >
          <MapPin size={18} fill="currentColor" />
        </button>
      </Marker>
    );
  }, [components, onSelectPoi, pois]);

  const cluster = useCallback((coordinates: readonly [number, number], features: Array<{ id: string | number }>) => {
    if (!components) return null;
    const Marker = components.YMapMarker as ComponentType<Record<string, unknown>>;
    return (
      <Marker coordinates={coordinates}>
        <div className="poi-cluster" aria-label={`Объектов: ${features.length}`}>{features.length}</div>
      </Marker>
    );
  }, [components]);

  const features = useMemo(() => pois.map((poi) => ({
    type: "Feature" as const,
    id: poi.id,
    geometry: { type: "Point" as const, coordinates: poi.location.coordinates },
    properties: { name: poi.name, category: poi.category },
  })), [pois]);

  const locate = () => {
    if (!navigator.geolocation) {
      onLocateError("Браузер не поддерживает геолокацию");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        mapRef?.update({ location: { center: [coords.longitude, coords.latitude], zoom: 14, duration: 450 } });
      },
      (error) => onLocateError(error.code === error.PERMISSION_DENIED ? "Разреши доступ к геолокации в настройках браузера" : "Не удалось определить местоположение"),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  if (loadError) return <div className="map-status map-status-error"><MapPin size={28} /><strong>Карта пока недоступна</strong><span>{loadError}</span></div>;
  if (!components || !clusterMethod) return <div className="map-status"><LoaderCircle className="animate-spin" size={28} /><span>Загружаем карту Беларуси…</span></div>;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener, YMapControls, YMapFeatureDataSource, YMapLayer, YMapClusterer, YMapZoomControl, YMapGeolocationControl } = components;

  const SelectedMarker = components.YMapMarker as ComponentType<
    Record<string, unknown>
  >;

  return (
    <div className="yandex-map-root">
      <YMap
        location={initialLocation}
        mode="vector"
        behaviors={["drag", "scrollZoom", "dblClick", "multiTouch"]}
        ref={(instance: unknown) => setMapRef(instance as typeof mapRef)}
      >
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        <YMapListener
          layer="any"
          onUpdate={handleMapUpdate}
          onClick={handleMapClick}
        />

        {selectionMode && selectedPoint && (
          <SelectedMarker coordinates={selectedPoint}>
            <div
              className="poi-selected-marker"
              aria-label="Выбранное расположение объекта"
            >
              <MapPin size={30} fill="currentColor" />
            </div>
          </SelectedMarker>
        )}
        <YMapFeatureDataSource id="getawaymap-poi" />
        <YMapLayer source="getawaymap-poi" type="markers" zIndex={1800} />
        <YMapClusterer
          method={clusterMethod}
          features={features}
          marker={marker}
          cluster={cluster}
        />
        <YMapControls position="right">
          <YMapZoomControl />
          <YMapGeolocationControl />
        </YMapControls>
      </YMap>
      <div className="map-floating-controls">
        <button type="button" aria-label="Приблизить карту" onClick={() => { const next = Math.min(zoom + 1, 19); setZoom(next); mapRef?.update({ location: { zoom: next, duration: 200 } }); }}><Plus size={19} /></button>
        <button type="button" aria-label="Отдалить карту" onClick={() => { const next = Math.max(zoom - 1, 3); setZoom(next); mapRef?.update({ location: { zoom: next, duration: 200 } }); }}><Minus size={19} /></button>
        <button type="button" aria-label="Моё местоположение" onClick={locate}><LocateFixed size={19} /></button>
      </div>
      <div className="map-attribution">© Яндекс Карты</div>
    </div>
  );
}
