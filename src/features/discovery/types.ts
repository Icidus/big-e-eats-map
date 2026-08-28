import type { CategoryId, DietaryClaim, TagId } from "@/features/catalog/taxonomy";

export type SortMode = "relevance" | "name" | "vendor" | "location";

export interface DiscoveryState {
  query: string;
  categoryIds: CategoryId[];
  tagIds: TagId[];
  dietaryClaims: DietaryClaim[];
  locationIds: string[];
  vendorIds: string[];
  collectionId?: string;
  sort?: SortMode;
}

export const EMPTY_DISCOVERY_STATE: DiscoveryState = {
  query: "",
  categoryIds: [],
  tagIds: [],
  dietaryClaims: [],
  locationIds: [],
  vendorIds: [],
};
