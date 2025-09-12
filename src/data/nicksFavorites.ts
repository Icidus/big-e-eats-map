import { Food } from "./locations";

export interface NicksFavorite extends Food {
  locationId: string;
  locationName: string;
  mapOrder: number; // Order by location on the map (not priority)
}

export const nicksFavorites: NicksFavorite[] = [
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
    id: "nicks-favorite-doughco",
    name: "DoughCo",
    vendor: "Anna's Fried Dough",
    locationId: "east-road",
    locationName: "East Road",
    mapOrder: 2
  },
  {
    id: "nicks-favorite-dilly-dilly-dog",
    name: "Dilly Dilly Dog",
    vendor: "Giant Corn Dog Factory",
    locationId: "west-road",
    locationName: "West Road",
    mapOrder: 3
  },
  {
    id: "nicks-favorite-turducken-sandwich",
    name: "Turducken Sandwich",
    vendor: "New England Craft Beer Pub",
    locationId: "avenue-of-states",
    locationName: "Avenue of States",
    mapOrder: 4
  },
  {
    id: "nicks-favorite-bacon-waffle-burger",
    name: "Bacon Waffle Burger",
    vendor: "Macken's Specialty Sliders",
    locationId: "state-buildings",
    locationName: "The State Buildings (Outside Massachusetts Building)",
    mapOrder: 5
  },
  {
    id: "nicks-favorite-moonugs",
    name: "MooNugs",
    vendor: "Moolicious",
    locationId: "springfield-road",
    locationName: "Springfield Road",
    mapOrder: 6
  },
  {
    id: "nicks-favorite-big-sexy",
    name: "The Big Sexy",
    vendor: "The Broccoli Bar",
    locationId: "springfield-road",
    locationName: "Springfield Road",
    mapOrder: 7
  },
  {
    id: "nicks-favorite-bbq-sundae",
    name: "BBQ Sundae",
    vendor: "Porky's",
    locationId: "commonwealth-avenue",
    locationName: "Commonwealth Avenue",
    mapOrder: 8
  },
  {
    id: "nicks-favorite-giant-mozzarella-stick",
    name: "Giant Mozzarella Stick",
    vendor: "Angela's Pizza",
    locationId: "commonwealth-avenue",
    locationName: "Commonwealth Avenue",
    mapOrder: 9
  },
  {
    id: "nicks-favorite-smacarons",
    name: "S'macarons",
    vendor: "Vermont Marshmallow Company",
    locationId: "state-buildings",
    locationName: "The State Buildings (Vermont Building)",
    mapOrder: 10
  }
];

// Helper function to get Nick's favorites by map order
export const getNicksFavoritesByPriority = (limit?: number): NicksFavorite[] => {
  const sorted = nicksFavorites.sort((a, b) => a.mapOrder - b.mapOrder);
  return limit ? sorted.slice(0, limit) : sorted;
};

// Helper function to get favorites for a specific location
export const getNicksFavoritesForLocation = (locationId: string): NicksFavorite[] => {
  return nicksFavorites.filter(fav => fav.locationId === locationId);
};
