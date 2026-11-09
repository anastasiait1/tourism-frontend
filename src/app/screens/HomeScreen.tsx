import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin, Search, SlidersHorizontal, X, LoaderCircle } from "lucide-react";
import { usePoisByBounds, type Poi } from "@domains/poi";
import { getCategoryLabel, poiCategories } from "@shared/config/categories";
import type { LngLatBounds } from "@shared/lib/geo";
import { YandexMap } from "@shared/map/yandex";

const INITIAL_BOUNDS: LngLatBounds = [[23.1, 51.2], [32.8, 56.2]];

export function HomeScreen() {
  const [bounds, setBounds] = useState<LngLatBounds | null>(INITIAL_BOUNDS);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const poisQuery = usePoisByBounds(bounds);
  const pois = poisQuery.data ?? [];
  const visiblePois = useMemo(() => pois.filter((poi) => {
    const matchesSearch = `${poi.name} ${poi.description}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (!category || poi.category === category);
  }), [pois, search, category]);

  const onBoundsChange = (nextBounds: LngLatBounds) => setBounds(nextBounds);

  return (
    <div className="home-layout home-layout-map">
      <section className="map-stage" aria-label="Интерактивная карта Беларуси">
        <YandexMap
          pois={visiblePois}
          onBoundsChange={onBoundsChange}
          onSelectPoi={setSelectedPoi}
          onLocateError={setMapError}
        />
        {poisQuery.isFetching && <div className="map-loading"><LoaderCircle size={14} className="animate-spin" /> Обновляем объекты…</div>}
        {mapError && <div className="map-toast" role="status">{mapError}<button type="button" onClick={() => setMapError(null)} aria-label="Закрыть"><X size={14} /></button></div>}
        {selectedPoi && (
          <article className="poi-popup">
            <button className="poi-popup-close" type="button" onClick={() => setSelectedPoi(null)} aria-label="Закрыть карточку"><X size={17} /></button>
            <span className="poi-popup-category">{getCategoryLabel(selectedPoi.category)}</span>
            <h3>{selectedPoi.name}</h3>
            <p>{selectedPoi.description}</p>
            <span className="poi-popup-coordinates">{selectedPoi.location.coordinates.join(", ")}</span>
          </article>
        )}
      </section>

      <aside className={`home-panel map-side-panel ${sheetExpanded ? "sheet-expanded" : ""}`}>
        <button className="sheet-handle" type="button" onClick={() => setSheetExpanded((value) => !value)} aria-label="Развернуть или свернуть панель"><span /></button>
        <div className="panel-intro">
          <p className="eyebrow">ТВОЁ СЛЕДУЮЩЕЕ ПРИКЛЮЧЕНИЕ</p>
          <h1>Открывай Беларусь по-новому</h1>
          <p className="panel-description">Интересные места и маршруты от людей, которые знают Беларусь.</p>
        </div>

        <label className="search-field">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти место на карте…" aria-label="Поиск объектов на карте" />
          <button type="button" aria-label="Сбросить поиск" onClick={() => setSearch("")}><X size={16} /></button>
          <SlidersHorizontal size={17} />
        </label>

        <div>
          <h2 className="section-heading">Категории</h2>
          <div className="category-chips">
            <button type="button" className={!category ? "category-chip active" : "category-chip"} onClick={() => setCategory(null)}>Все</button>
            {poiCategories.map((item) => (
              <button type="button" key={item.value} className={category === item.value ? "category-chip active" : "category-chip"} onClick={() => setCategory(category === item.value ? null : item.value)}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="poi-list-heading">
          <h2 className="section-heading">Места на карте</h2>
          <span>{visiblePois.length}</span>
        </div>
        <div className="poi-list" aria-live="polite">
          {poisQuery.isLoading ? <div className="list-state"><LoaderCircle size={18} className="animate-spin" /> Загружаем места…</div>
            : poisQuery.isError ? <div className="list-state list-error">Не удалось загрузить места. Попробуй переместить карту.</div>
            : visiblePois.length === 0 ? <div className="list-state">В этой области пока нет объектов. Попробуй изменить масштаб или область карты.</div>
            : visiblePois.map((poi) => (
              <button className={`poi-list-item ${selectedPoi?.id === poi.id ? "selected" : ""}`} type="button" key={poi.id} onClick={() => setSelectedPoi(poi)}>
                <span className="poi-list-icon"><MapPin size={17} /></span>
                <span className="poi-list-copy"><strong>{poi.name}</strong><small>{getCategoryLabel(poi.category)}</small></span>
                <span className="poi-list-arrow">↗</span>
              </button>
            ))}
        </div>

        <div className="panel-bottom">
          <div className="panel-callout">
            <span className="callout-icon"><Compass size={21} /></span>
            <div><strong>Создай свой маршрут</strong><p>Собери любимые места в одно путешествие</p></div>
          </div>
          <Link className="button button-primary panel-route-button" to="/routes">Перейти к маршрутам</Link>
        </div>
      </aside>
    </div>
  );
}
