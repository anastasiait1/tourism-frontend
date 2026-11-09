
import { useState } from "react";
import type { LngLat, LngLatBounds } from "@shared/lib/geo";
import { YandexMap } from "@shared/map/yandex/YandexMap";

type Props = {
  value: LngLat | null;
  onChange: (coordinates: LngLat) => void;
};

export function PoiLocationPicker({ value, onChange }: Props) {
  const [error, setError] = useState("");

  const handlePointSelect = (coordinates: LngLat) => {
    onChange(coordinates);
    setError("");
  };

  const handleBoundsChange = (_bounds: LngLatBounds) => {
    // Границы нужны YandexMap, но для выбора точки здесь не используются.
  };

  return (
    <section className="poi-location-picker">
      <div className="poi-location-picker__header">
        <h3>Расположение объекта</h3>
        <p>
          Нажми на карту, чтобы выбрать место расположения объекта.
        </p>
      </div>

      <div className="poi-location-picker__coordinates">
        <label>
          Долгота
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            value={value?.[0] ?? ""}
            onChange={(event) => {
              const longitude = Number(event.target.value);

              if (
                event.target.value === "" ||
                !Number.isFinite(longitude) ||
                longitude < -180 ||
                longitude > 180
              ) {
                setError("Долгота должна быть от -180 до 180");
                return;
              }

              onChange([longitude, value?.[1] ?? 53.9]);
              setError("");
            }}
            placeholder="Например, 27.56"
          />
        </label>

        <label>
          Широта
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            value={value?.[1] ?? ""}
            onChange={(event) => {
              const latitude = Number(event.target.value);

              if (
                event.target.value === "" ||
                !Number.isFinite(latitude) ||
                latitude < -90 ||
                latitude > 90
              ) {
                setError("Широта должна быть от -90 до 90");
                return;
              }

              onChange([value?.[0] ?? 27.56, latitude]);
              setError("");
            }}
            placeholder="Например, 53.9"
          />
        </label>
      </div>

      {error && (
        <p className="poi-location-picker__error" role="alert">
          {error}
        </p>
      )}

      <div className="poi-location-picker__map">
        <YandexMap
          pois={[]}
          onBoundsChange={handleBoundsChange}
          onSelectPoi={() => {}}
          onLocateError={setError}
          selectionMode
          selectedPoint={value}
          onPointSelect={handlePointSelect}
        />
      </div>

      <p className="poi-location-picker__hint">
        {value
          ? `Выбраны координаты: ${value[1].toFixed(6)}, ${value[0].toFixed(6)}`
          : "Точка ещё не выбрана"}
      </p>
    </section>
  );
}
