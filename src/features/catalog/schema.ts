import { z } from "zod";
import { CATEGORIES, DIETARY_CLAIMS, TAGS, type CategoryId } from "./taxonomy";

const categoryIds = CATEGORIES.map(([id]) => id) as [CategoryId, ...CategoryId[]];

export const FAIRGROUND_BOUNDS = { south: 42.088, north: 42.096, west: -72.626, east: -72.61 } as const;

export interface FairCoordinates {
  lat: number;
  lng: number;
  source: string;
  precision: "mapped" | "estimated";
}

// Cast needed because tsconfig.app.json disables strictNullChecks (strict: false), which
// makes Zod's own object-shape inference mark every field optional regardless of the
// schema, so z.object(...)'s inferred type can't be assigned to ZodType<FairCoordinates>
// without help. The schema's runtime validation (min/max/enum) is unaffected.
export const coordinateSchema: z.ZodType<FairCoordinates> = z.object({
  lat: z.number().min(FAIRGROUND_BOUNDS.south).max(FAIRGROUND_BOUNDS.north),
  lng: z.number().min(FAIRGROUND_BOUNDS.west).max(FAIRGROUND_BOUNDS.east),
  source: z.string().min(1),
  precision: z.enum(["mapped", "estimated"]),
}) as z.ZodType<FairCoordinates>;

export const sourceSchema = z.object({
  publisher: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  accessedOn: z.string().min(1),
});

export const catalogItemSchema = z.object({
  id: z.string().min(1),
  year: z.literal(2026),
  name: z.string().min(1),
  vendor: z.string().min(1),
  locationIds: z.array(z.string().min(1)).default([]),
  description: z.string().min(1).optional(),
  categoryIds: z.array(z.enum(categoryIds)).min(1),
  tagIds: z.array(z.enum(TAGS)),
  dietaryClaims: z.array(z.enum(DIETARY_CLAIMS)),
  isNewFor2026: z.boolean(),
  source: sourceSchema,
  coordinates: coordinateSchema.optional(),
});

export const fairLocationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().positive(),
  coordinates: coordinateSchema.optional(),
});

export const editorialCollectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  itemIds: z.array(z.string().min(1)),
  source: sourceSchema.optional(),
});

export type CatalogItem = z.infer<typeof catalogItemSchema>;
export type FairLocation = z.infer<typeof fairLocationSchema>;
export type EditorialCollection = z.infer<typeof editorialCollectionSchema>;
