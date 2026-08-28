export const CATEGORIES = [
  ["cocktails", "Cocktails"], ["mocktails", "Mocktails"], ["beer-cider", "Beer & Cider"],
  ["nonalcoholic-drinks", "Nonalcoholic Drinks"], ["desserts", "Desserts"],
  ["ice-cream", "Ice Cream"], ["donuts-pastries", "Donuts & Pastries"], ["candy", "Candy"],
  ["burgers", "Burgers"], ["hot-dogs-corndogs", "Hot Dogs & Corndogs"],
  ["sandwiches", "Sandwiches"], ["tacos-mexican", "Tacos & Mexican"],
  ["pizza-italian", "Pizza & Italian"], ["barbecue", "Barbecue"],
  ["seafood", "Seafood"], ["potatoes-fries", "Potatoes & Fries"],
  ["breakfast", "Breakfast"], ["snacks-sides", "Snacks & Sides"],
  ["other-savory", "Other Savory"],
] as const;

export const TAGS = [
  "drinks", "alcoholic", "nonalcoholic", "sweet", "savory", "spicy", "fried",
  "food-on-a-stick", "pickle", "birria", "hot-honey", "pumpkin", "apple",
  "fall-flavors", "chocolate", "maple", "bacon", "cheese", "new-vendor",
] as const;

export const DIETARY_CLAIMS = ["gluten-free", "vegetarian", "vegan"] as const;

export type CategoryId = (typeof CATEGORIES)[number][0];
export type TagId = (typeof TAGS)[number];
export type DietaryClaim = (typeof DIETARY_CLAIMS)[number];
