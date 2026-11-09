
import { Link, useParams } from "react-router-dom";
import { usePoiById } from "../hooks/usePoiById";
import { getCategoryLabel } from "@shared/config/categories";

export function PoiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: poi, isLoading, isError, error } = usePoiById(id);

  if (isLoading) {
    return (
      <main className="poi-detail">
        <p>Загружаем информацию об объекте...</p>
      </main>
    );
  }

  if (isError || !poi) {
    return (
      <main className="poi-detail">
        <Link to="/objects">← К каталогу</Link>
        <h1>Не удалось загрузить объект</h1>
        <p role="alert">
          {error?.message ?? "Объект не найден"}
        </p>
      </main>
    );
  }

  const [longitude, latitude] = poi.location.coordinates;

  return (
    <main className="poi-detail">
      <Link className="poi-detail__back" to="/objects">
        ← Вернуться к каталогу
      </Link>

      <article className="poi-detail__content">
        <span className="poi-detail__category">
          {getCategoryLabel(poi.category)}
        </span>

        <h1>{poi.name}</h1>

        <p className="poi-detail__description">
          {poi.description || "Описание пока не добавлено."}
        </p>

        <section className="poi-detail__section">
          <h2>Расположение</h2>

          <p>
            Широта: {latitude.toFixed(6)}
          </p>

          <p>
            Долгота: {longitude.toFixed(6)}
          </p>
        </section>

        <section className="poi-detail__section">
          <h2>Статус объекта</h2>

          <span className={`poi-detail__status poi-detail__status--${poi.status}`}>
            {poi.status === "approved" && "Одобрен"}
            {poi.status === "pending" && "На модерации"}
            {poi.status === "rejected" && "Отклонён"}
          </span>
        </section>
      </article>
    </main>
  );
}
