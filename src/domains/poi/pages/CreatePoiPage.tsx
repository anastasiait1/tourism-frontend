import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { FormEvent } from "react";
import type { LngLat } from "@shared/lib/geo";
import { poiCategories } from "@shared/config/categories";
import { PoiLocationPicker } from "../components/PoiLocationPicker";
import { poiApi } from "../api/poiApi";
import { createPoiPayloadSchema } from "../model/poi.schemas";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function CreatePoiPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("eco_tourism");
  const [location, setLocation] = useState<LngLat | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [createdPoiId, setCreatedPoiId] = useState<string | number | null>(null);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const previews = useMemo(
    () => files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    })),
    [files],
  );

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";

    const nextFiles = [...files];
    let validationError = "";

    for (const file of selectedFiles) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        validationError = "Можно загружать только PNG и JPEG.";
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        validationError = "Размер одного изображения не должен превышать 5 МБ.";
        continue;
      }

      if (nextFiles.length >= MAX_FILES) {
        validationError = "Можно добавить не более 5 изображений.";
        break;
      }

      nextFiles.push(file);
    }

    setFiles(nextFiles);
    setFileError(validationError);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((current) => current.filter((file) => file !== fileToRemove));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let poiId = createdPoiId;

      // Создаём объект только один раз.
      // При повторной отправке после ошибки загрузки файлов
      // используем уже полученный ID.
      if (poiId === null) {
        const validation = createPoiPayloadSchema.safeParse({
          name,
          description,
          category,
          location: location
            ? { type: "Point", coordinates: location }
            : undefined,
        });

        if (!validation.success) {
          setError(validation.error.issues[0]?.message ?? "Проверь введённые данные.");
          return;
        }

        const response = await poiApi.create(validation.data);
        poiId = response.id;
        setCreatedPoiId(poiId);
      }

      // Загружаем изображения последовательно.
      for (const file of files) {
        await poiApi.uploadMedia(poiId, file);
        setFiles((current) => current.filter((item) => item !== file));
      }

      setIsCompleted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось отправить объект.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
  return (
    <main className="objects-page">
      <div className="objects-page__empty">
        <h1>Объект отправлен на модерацию!</h1>
        <p>
          Спасибо за вклад в развитие GetAwayMap.
          После проверки объект появится на карте.
        </p>

        {createdPoiId !== null && (
          <Link
            className="objects-page__add"
            to={`/objects/${createdPoiId}`}
          >
            Посмотреть созданный объект
          </Link>
        )}

        <Link to="/objects">
          Перейти к объектам
        </Link>
      </div>
    </main>
  );
}

  return (
    <main className="objects-page">
      <Link to="/objects">← Вернуться к объектам</Link>

      <header className="objects-page__header">
        <div>
          <h1>Добавить новое место</h1>
          <p>Поделись интересным местом с другими путешественниками.</p>
        </div>
      </header>

      <form className="poi-create-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Название объекта
          <input
            className="form-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={3}
            maxLength={100}
            required
            disabled={createdPoiId !== null}
            placeholder="Например, Мирский замок"
          />
        </label>

        <label className="form-label">
          Описание
          <textarea
            className="form-input poi-create-form__textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            required
            disabled={createdPoiId !== null}
            placeholder="Расскажи об этом месте..."
          />
        </label>

        <label className="form-label">
          Категория
          <select
            className="form-input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={createdPoiId !== null}
          >
            {poiCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.icon} {item.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <PoiLocationPicker
            value={location}
            onChange={setLocation}
          />
        </div>

        <section className="poi-create-form__files">
          <h2>Фотографии</h2>
          <p>До 5 изображений в формате PNG или JPEG, не более 5 МБ каждое.</p>

          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            disabled={createdPoiId !== null}
            onChange={handleFilesChange}
          />

          {fileError && <p className="field-error">{fileError}</p>}

          <div className="poi-create-form__previews">
            {previews.map(({ file, url }) => (
              <div className="poi-create-form__preview" key={`${file.name}-${file.lastModified}`}>
                <img src={url} alt={file.name} />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file)}
                  disabled={createdPoiId !== null}
                >
                  Удалить
                </button>
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p className="form-error" role="alert">
            {createdPoiId !== null
              ? `Объект уже создан. Не удалось загрузить все фотографии: ${error}. Попробуй отправить оставшиеся ещё раз.`
              : error}
          </p>
        )}

        <button
          className="button button-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Отправляем..."
            : createdPoiId !== null
              ? "Повторить загрузку фотографий"
              : "Отправить на модерацию"}
        </button>
      </form>
    </main>
  );
}