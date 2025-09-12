import { Food } from "./locations";

export interface MassLiveFavorite extends Food {
  locationId: string;
  locationName: string;
  mapOrder: number; // Order by location on the map (not priority)
}

export const massLiveFavorites: MassLiveFavorite[] = [
  {
    id: "marions-fried-dough-fried-butter",
    name: "Fried Butter",
    vendor: "Marion's Fried Dough",
    locationId: "new-england-avenue",
    locationName: "New England Avenue",
    mapOrder: 1,
    isRecommended: true
  },
  {
    id: "masslive-favorite-doughco",
    name: "DoughCo",
    vendor: "Anna's Fried Dough",
    locationId: "east-road",
    locationName: "East Road",
    mapOrder: 2
  },
  {
    id: "masslive-favorite-dilly-dilly-dog",
    name: "Dilly Dilly Dog",
    vendor: "Giant Corn Dog Factory",
    locationId: "west-road",
    locationName: "West Road",
    mapOrder: 3
  },
  {
    id: "masslive-favorite-turducken-sandwich",
    name: "Turducken Sandwich",
    vendor: "New England Craft Beer Pub",
    locationId: "avenue-of-states",
    locationName: "Avenue of States",
    mapOrder: 4
  },
  {
    id: "masslive-favorite-bacon-waffle-burger",
    name: "Bacon Waffle Burger",
    vendor: "Macken's Specialty Sliders",
    locationId: "state-buildings",
    locationName: "The State Buildings (Outside Massachusetts Building)",
    mapOrder: 5
  },
  {
    id: "masslive-favorite-moonugs",
    name: "MooNugs",
    vendor: "Moolicious",
    locationId: "springfield-road",
    locationName: "Springfield Road",
    mapOrder: 6
  },
  {
    id: "masslive-favorite-big-sexy",
    name: "The Big Sexy",
    vendor: "The Broccoli Bar",
    locationId: "springfield-road",
    locationName: "Springfield Road",
    mapOrder: 7
  },
  {
    id: "masslive-favorite-bbq-sundae",
    name: "BBQ Sundae",
    vendor: "Porky's",
    locationId: "commonwealth-avenue",
    locationName: "Commonwealth Avenue",
    mapOrder: 8
  },
  {
    id: "masslive-favorite-giant-mozzarella-stick",
    name: "Giant Mozzarella Stick",
    vendor: "Angela's Pizza",
    locationId: "commonwealth-avenue",
    locationName: "Commonwealth Avenue",
    mapOrder: 9
  },
  {
    id: "masslive-favorite-smacarons",
    name: "S'macarons",
    vendor: "Vermont Marshmallow Company",
    locationId: "state-buildings",
    locationName: "The State Buildings (Vermont Building)",
    mapOrder: 10
  }
];

// Helper function to get MassLive favorites by map order
export const getMassLiveFavoritesByPriority = (limit?: number): MassLiveFavorite[] => {
  const sorted = massLiveFavorites.sort((a, b) => a.mapOrder - b.mapOrder);
  return limit ? sorted.slice(0, limit) : sorted;
};

// Helper function to get favorites for a specific location
export const getMassLiveFavoritesForLocation = (locationId: string): MassLiveFavorite[] => {
  return massLiveFavorites.filter(fav => fav.locationId === locationId);
};
