import { describe, expect, it } from "vitest";
import { catalogData } from "@/features/catalog/catalog";

const requiredNewVendors = [
  "Tater Tot Heaven", "Cantina Louie", "Deep-fried Calzones", "Golden K-Dog",
  "K’s Japanese Restaurant Food Court", "McLaughlin Family Homemade Ice Cream",
  "Moose Joose Slush", "Rickey’s Jerky", "Simply Gluten Free", "Spudtastic",
  "Sweet & Salty", "Tripp’s Farmhouse Café",
];

const requiredReturningVendors = [
  "The Big E Bakery", "All American Craft Beer Bar & Grill", "Apple Fries", "Barbie’s Ice Cream",
  "Big Kahuna’s", "Boricua Bites", "Broccoli Bar", "Buni’s Bakery", "Butcher Boys", "Calabrese Market",
  "Chocolate Moonshine", "Chompers", "Cinnamon Saloon", "Crave Café", "Dolly’s Honky Tonk",
  "Downeast Cider Garden", "Dr. Vegetable", "Dribbles", "E.B.’s", "Kora & Mila's Cookie Dough",
  "Ferrindino Maple", "Fluffy’s Hand Cut Donuts", "Granville Country Store", "Harpoon Beer Hall",
  "Hofbrauhaus Beer Garden", "Jack’s Fries", "Jim’s Deep Fried Taco", "Las Kangris Food Truck",
  "LuAnn’s Bakery", "Macho Taco", "Meatball Factory", "Moolicious Farm", "NOLA Cajun Kitchen & Raw Bar",
  "Poppie’s Fresh Onion Rings", "Porky’s BBQ Concessions", "Poutine Gourmet", "Rudy’s Pizza", "Rudy’s Slush",
  "Sam Adams Beer Garden", "Steaming Tender", "Storrowton Soup Shack", "The Donut Family",
  "The Indian Restaurant in the Food Court", "The Italian Pavillion", "The Mick", "The New England Craft Beer Pub",
  "The Paddock", "Tootsie’s Fried Dough", "V-One Vodka", "Veggie Patch", "W.A.V.E. Mocktail Bar",
  "West Springfield Lions Club", "White Hut in the Food Court", "Wurst Haus", "Yankee Boy",
];

const foodCourtOnlyVendors = ["Calabrese Market", "E.B.’s", "Hofbrauhaus Beer Garden"];

describe("2026 catalog content", () => {
  it("contains only sourced 2026 records", () => {
    expect(catalogData.items.length).toBeGreaterThan(0);
    for (const item of catalogData.items) {
      expect(item.year).toBe(2026);
      expect(item.source.url).toBe("https://www.thebige.com/p/food2/newfoods");
      expect(item.source.accessedOn).toBe("2026-08-27");
    }
  });

  it.each(requiredNewVendors)("includes new vendor %s", (vendor) => {
    expect(catalogData.items.some((item) => item.vendor === vendor)).toBe(true);
  });

  it("does not duplicate a vendor/item identity", () => {
    const keys = catalogData.items.map((item) => `${item.vendor.toLowerCase()}::${item.name.toLowerCase()}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("covers every named returning-vendor section with an explicitly named food", () => {
    for (const vendor of requiredReturningVendors) {
      expect(catalogData.items.some((item) => item.vendor === vendor)).toBe(true);
    }
  });

  it("keeps the two Push-Up Sushi Pop fillings as distinct stable records", () => {
    const spicyTuna = catalogData.itemsById.get("ks-japanese-spicy-tuna-roll-push-up-sushi-pop");
    const california = catalogData.itemsById.get("ks-japanese-california-roll-push-up-sushi-pop");

    expect(spicyTuna?.name).toBe("Spicy Tuna Roll Push-Up Sushi Pop");
    expect(spicyTuna?.tagIds).toContain("spicy");
    expect(california?.name).toBe("California Roll Push-Up Sushi Pop");
    expect(california?.tagIds).not.toContain("spicy");
    expect(catalogData.itemsById.has("ks-japanese-push-up-sushi-pops")).toBe(false);
  });

  it("publishes every current location without a map association", () => {
    for (const location of catalogData.locations) {
      expect(location).not.toHaveProperty("mapImage");
    }
  });

  it("uses the controlled taxonomy on every imported record", () => {
    for (const item of catalogData.items) {
      expect(item.categoryIds.length).toBeGreaterThan(0);
    }
  });

  it("maps the exact Food Court, East Road vendor label only to the Food Court", () => {
    const compoundLabelItems = catalogData.items.filter((item) => foodCourtOnlyVendors.includes(item.vendor));
    expect(compoundLabelItems.length).toBeGreaterThan(0);
    for (const item of compoundLabelItems) {
      expect(item.locationIds).toEqual(["food-court"]);
    }
  });

  it("defines only the six requested ordered editorial collections", () => {
    const expectedCollections = [
      ["wildest-new-foods", ["white-hut-uncrusta-double-burger", "yankee-boy-wagyu-beef-surf-n-turf-burger", "meatball-factory-sushi-corndog", "macho-taco-birria-bomb", "veggie-patch-fried-deviled-eggs"]],
      ["cocktails-and-mocktails", ["wave-caramel-apple-mocktail", "cantina-louie-frozen-margarita-mocktail", "broccoli-bar-broccarita", "calabrese-alcoholic-bellinis", "v-one-snow-globe-martini", "v-one-caramel-apple", "v-one-salted-caramel-espresso-martini", "v-one-ultra-premium-vodka-seltzer"]],
      ["desserts-worth-the-detour", ["big-e-bakery-peanut-butter-cream-puff", "tootsies-deep-fried-cheesecake", "fluffys-cookie-butter-cheesecake-donut", "ferrindino-maple-creemee-bacon-waffle", "moolicious-campfire-on-a-stick"]],
      ["gluten-free-fair-food", ["simply-gluten-free-funnel-cakes", "simply-gluten-free-fried-oreos", "simply-gluten-free-corndogs", "simply-gluten-free-chicken-tenders", "simply-gluten-free-jumbo-mozzarella-stick", "simply-gluten-free-fountain-lemonade", "tripps-hashbrown-breakfast-sandwich", "tripps-donuts", "tripps-brownies", "tripps-fried-oreos", "tripps-chicken-fingers", "tripps-grass-fed-burgers", "tripps-french-fries", "luanns-build-your-own-brownie-bar"]],
      ["fall-flavors", ["moose-joose-fall-in-a-cup", "cinnamon-saloon-apple-cider-slush", "sam-adams-headless-pumpkin-cider", "wave-caramel-apple-mocktail", "sweet-and-salty-pumpkin-spice-dirty-soda"]],
      ["savory-food-on-a-stick", ["cantina-louie-corn-on-a-stick", "nola-hush-puppy-skewers"]],
    ];
    expect(catalogData.collections.map((collection) => [collection.id, collection.itemIds])).toEqual(expectedCollections);
  });

  it("keeps the constrained collections aligned with their source-backed metadata", () => {
    const cocktailIds = catalogData.items
      .filter((item) => item.categoryIds.includes("cocktails") || item.categoryIds.includes("mocktails"))
      .map((item) => item.id);
    expect([...catalogData.collectionsById.get("cocktails-and-mocktails")?.itemIds ?? []].sort()).toEqual(cocktailIds.sort());

    const glutenFreeIds = catalogData.items.filter((item) => item.dietaryClaims.includes("gluten-free")).map((item) => item.id);
    expect(catalogData.collectionsById.get("gluten-free-fair-food")?.itemIds).toEqual(glutenFreeIds);

    for (const itemId of catalogData.collectionsById.get("savory-food-on-a-stick")?.itemIds ?? []) {
      const item = catalogData.itemsById.get(itemId);
      expect(item?.tagIds).toContain("food-on-a-stick");
      expect(item?.tagIds).toContain("savory");
    }
  });
});

describe("2026 location coordinates", () => {
  const estimatedLocationIds = ["the-front-porch", "food-court", "craft-common", "industrial-avenue", "new-england-center"];

  it("places every location on the map", () => {
    for (const location of catalogData.locations) {
      expect(location.coordinates, `${location.id} has no coordinates`).toBeDefined();
    }
  });

  it("marks exactly the hand-placed locations as estimated", () => {
    const estimated = catalogData.locations.filter((location) => location.coordinates?.precision === "estimated").map((location) => location.id).sort();
    expect(estimated).toEqual([...estimatedLocationIds].sort());
  });
});
