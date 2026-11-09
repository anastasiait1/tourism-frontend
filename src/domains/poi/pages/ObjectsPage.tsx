
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePoisByBounds } from "../hooks/usePoisByBounds";
import { poiCategories, getCategoryLabel } from "@shared/config/categories";
import type { Poi } from "../model/poi.schemas";
import type { LngLatBounds } from "@shared/lib/geo";

const BELARUS_BOUNDS: LngLatBounds = [
  [23.1, 51.2],
  [32.8, 56.2],
];

export function ObjectsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const bounds = useMemo(() => BELARUS_BOUNDS, []);
  const { data: pois = [], isLoading, isError, error } = usePoisByBounds(bounds);

  const filteredPois = pois.filter((poi: Poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(search.toLowerCase()) ||
      poi.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || poi.category === category;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <main className="objects-page"><p>Загружаем объекты...</p></main>;
  }

  if (isError) {
    return (
      <main className="objects-page">
        <h1>Объекты</h1>
        <p role="alert">
          Не удалось загрузить объекты: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="objects-page">
      <header className="objects-page__header">
        <div>
          <h1>Интересные места Беларуси</h1>
          <p>Исследуйте природные, исторические и необычные места.</p>
        </div>

        <Link className="objects-page__add" to="/objects/new">
          + Добавить объект
        </Link>
      </header>

      <div className="objects-page__filters">
        <input
          type="search"
          placeholder="Поиск объектов..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Поиск объектов"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Категория объектов"
        >
          <option value="all">Все категории</option>
          {poiCategories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.icon} {item.label}
            </option>
          ))}
        </select>
      </div>

      <p className="objects-page__count">
        Найдено объектов: {filteredPois.length}
      </p>

      {filteredPois.length === 0 ? (
        <div className="objects-page__empty">
          <h2>Объекты не найдены</h2>
          <p>Попробуйте изменить поисковый запрос или категорию.</p>
        </div>
      ) : (
        <div className="objects-grid">
          {filteredPois.map((poi) => (
            <article className="object-card" key={poi.id}>
              <div className="object-card__content">
                <span className="object-card__category">
                  {getCategoryLabel(poi.category)}
                </span>

                <h2>{poi.name}</h2>

                <p>
                  {poi.description || "Описание пока не добавлено."}
                </p>

                <Link to={`/objects/${poi.id}`}>
                  Подробнее →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
