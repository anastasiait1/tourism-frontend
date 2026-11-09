
import { http } from "@shared/api/http";
import {
  poiSchema,
  createPoiPayloadSchema,
  poiCreateResponseSchema,
  poiMediaResponseSchema,
  type Poi,
  type CreatePoiPayload,
  type PoiCreateResponse,
  type PoiMediaResponse,
} from "../model/poi.schemas";

export const poiApi = {
  // Получение объектов в пределах видимой области карты.
  async getByBbox(
    bbox: string,
    signal?: AbortSignal,
  ): Promise<Poi[]> {
    const params = new URLSearchParams({ bbox });

    const result = await http<unknown[]>(
      `/pois?${params.toString()}`,
      { signal, auth: false },
    );

    return result.map((item) => poiSchema.parse(item));
  },

  // Получение подробной информации об объекте.
  async getById(
    id: string | number,
    signal?: AbortSignal,
  ): Promise<Poi> {
    const result = await http<unknown>(
      `/pois/${encodeURIComponent(String(id))}`,
      { signal, auth: false },
    );

    return poiSchema.parse(result);
  },

  // Создание нового объекта.
  async create(
    payload: CreatePoiPayload,
  ): Promise<PoiCreateResponse> {
    const validatedPayload = createPoiPayloadSchema.parse(payload);

    const result = await http<unknown>("/pois", {
      method: "POST",
      body: validatedPayload,
    });

    return poiCreateResponseSchema.parse(result);
  },

  // Загрузка одной фотографии для уже созданного объекта.
  async uploadMedia(
    id: string | number,
    file: File,
  ): Promise<PoiMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await http<unknown>(
      `/pois/${encodeURIComponent(String(id))}/media`,
      {
        method: "POST",
        body: formData,
      },
    );

    return poiMediaResponseSchema.parse(result);
  },
};
