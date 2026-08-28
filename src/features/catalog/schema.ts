import { z } from "zod";
import { CATEGORIES, DIETARY_CLAIMS, TAGS, type CategoryId } from "./taxonomy";

const categoryIds = CATEGORIES.map(([id]) => id) as [CategoryId, ...CategoryId[]];

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
  description: z.string().min(1),
  categoryIds: z.array(z.enum(categoryIds)).min(1),
  tagIds: z.array(z.enum(TAGS)),
  dietaryClaims: z.array(z.enum(DIETARY_CLAIMS)),
  isNewFor2026: z.boolean(),
  source: sourceSchema,
});

export const fairLocationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().positive(),
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
