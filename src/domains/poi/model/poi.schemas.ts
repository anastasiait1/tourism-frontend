
import { z } from "zod";

export const poiStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export const poiCategorySchema = z.enum([
  "eco_tourism",
  "heritage",
  "city",
  "unusual",
]);

export const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const poiSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  description: z.string().default(""),
  category: z.string(),
  status: poiStatusSchema,
  location: geoPointSchema,
  created_by: z.union([z.string(), z.number()]).nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const createPoiPayloadSchema = z.object({
  name: z.string().trim().min(3, "Название должно содержать минимум 3 символа").max(100, "Название не должно превышать 100 символов"),
  description: z.string().trim().min(1, "Добавь описание объекта").max(2000, "Описание не должно превышать 2000 символов"),
  category: poiCategorySchema,
  location: geoPointSchema,
});

export const poiCreateResponseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: poiStatusSchema,
  message: z.string().optional(),
});

export const poiMediaResponseSchema = z.object({
  url: z.string(),
});

export type Poi = z.infer<typeof poiSchema>;
export type GeoPoint = z.infer<typeof geoPointSchema>;
export type CreatePoiPayload = z.infer<typeof createPoiPayloadSchema>;
export type PoiCreateResponse = z.infer<typeof poiCreateResponseSchema>;
export type PoiMediaResponse = z.infer<typeof poiMediaResponseSchema>;
