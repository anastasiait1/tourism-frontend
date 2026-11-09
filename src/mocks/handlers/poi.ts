import { http, HttpResponse } from "msw";
import { mockPois } from "../fixtures/pois";
import { createPoiPayloadSchema } from "@domains/poi/model/poi.schemas";

const STORAGE_KEY = "getawaymap-mock-pois";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type StoredPoi = (typeof mockPois)[number] & {
  media?: string[];
  created_at?: string;
};

function loadPois(): StoredPoi[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw) as StoredPoi[];
    }
  } catch {
    console.warn("Не удалось загрузить моковые объекты из localStorage");
  }

  return [...mockPois];
}

const pois: StoredPoi[] = loadPois();

function savePois() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pois));
  } catch {
    console.warn("Не удалось сохранить моковые объекты в localStorage");
  }
}

let nextId =
  Math.max(0, ...pois.map((poi) => Number(poi.id) || 0)) + 1;

export const poiHandlers = [
  // GET /api/v1/pois?bbox=...
  http.get("/api/v1/pois", ({ request }) => {
    const url = new URL(request.url);
    const bbox = url.searchParams.get("bbox");

    if (!bbox) {
      return HttpResponse.json(
        { detail: "Параметр bbox обязателен" },
        { status: 422 },
      );
    }

    const values = bbox.split(",").map(Number);

    if (
      values.length !== 4 ||
      !values.every(Number.isFinite)
    ) {
      return HttpResponse.json(
        {
          detail:
            "bbox должен содержать min_lon,min_lat,max_lon,max_lat",
        },
        { status: 422 },
      );
    }

    const [minLon, minLat, maxLon, maxLat] = values;

    const items = pois.filter((poi) => {
      const [lon, lat] = poi.location.coordinates;

      return (
        poi.status === "approved" &&
        lon >= minLon &&
        lon <= maxLon &&
        lat >= minLat &&
        lat <= maxLat
      );
    });

    return HttpResponse.json(items);
  }),

  // GET /api/v1/pois/:id
  http.get("/api/v1/pois/:id", ({ params }) => {
    const id = String(params.id);

    const poi = pois.find(
      (item) => String(item.id) === id,
    );

    if (!poi) {
      return HttpResponse.json(
        { detail: "Объект не найден" },
        { status: 404 },
      );
    }

    return HttpResponse.json(poi);
  }),

  // POST /api/v1/pois
  http.post("/api/v1/pois", async ({ request }) => {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return HttpResponse.json(
        { detail: "Некорректный JSON" },
        { status: 400 },
      );
    }

    const validation = createPoiPayloadSchema.safeParse(body);

    if (!validation.success) {
      return HttpResponse.json(
        {
          detail: "Некорректные данные объекта",
          errors: validation.error.flatten(),
        },
        { status: 422 },
      );
    }

    const newPoi = {
      id: nextId++,
      ...validation.data,
      status: "pending" as const,
      created_by: null,
      created_at: new Date().toISOString(),
      media: [],
    };

    pois.push(newPoi);
    savePois();

    return HttpResponse.json(
      {
        id: newPoi.id,
        status: newPoi.status,
        message: "Объект отправлен на модерацию",
      },
      { status: 201 },
    );
  }),

  // POST /api/v1/pois/:id/media
  http.post(
    "/api/v1/pois/:id/media",
    async ({ params, request }) => {
      const id = String(params.id);

      const poi = pois.find(
        (item) => String(item.id) === id,
      );

      if (!poi) {
        return HttpResponse.json(
          { detail: "Объект не найден" },
          { status: 404 },
        );
      }

      const formData = await request.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return HttpResponse.json(
          { detail: "Файл не передан" },
          { status: 422 },
        );
      }

      if (!["image/png", "image/jpeg"].includes(file.type)) {
        return HttpResponse.json(
          { detail: "Допустимы только PNG и JPEG" },
          { status: 422 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return HttpResponse.json(
          { detail: "Размер файла не должен превышать 5 МБ" },
          { status: 413 },
        );
      }

      const mediaUrl = `/static/uploads/mock-${id}-${encodeURIComponent(file.name)}`;

      poi.media ??= [];
      poi.media.push(mediaUrl);

      savePois();

      return HttpResponse.json(
        {
          url: mediaUrl,
        },
        { status: 200 },
      );
    },
  ),
];
