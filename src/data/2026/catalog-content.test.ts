import { describe, expect, it } from "vitest";
import { catalogData } from "@/features/catalog/catalog";

const requiredNewVendors = [
  "Tater Tot Heaven", "Cantina Louie", "Deep-fried Calzones", "Golden K-Dog",
  "K’s Japanese Restaurant Food Court", "McLaughlin Family Homemade Ice Cream",
  "Moose Joose Slush", "Rickey’s Jerky", "Simply Gluten Free", "Spudtastic",
  "Sweet & Salty", "Tripp’s Farmhouse Café", "Craic Sauce", "Delaney's Market",
  "Iona's Kitchen", "Madhrasi",
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
const trustedFoodSources = new Set([
  "https://www.instagram.com/bearssmokehouse/p/DdZ3QdOR-Dq/",
  "https://www.instagram.com/bearssmokehouse/p/DdbbxEexE89/",
  "https://www.instagram.com/delaneysmarket/reel/DdUu84VxgCx/",
  "https://www.instagram.com/friskiefries/p/DdbwANtjM56/",
  "https://www.instagram.com/itskelewele31/p/DdCEoieBf2j/",
  "https://www.instagram.com/joeysdelimarket/p/DdT9iPdOjRa/",
  "https://www.instagram.com/cremebru.la/reel/DdbyWuox2U0/",
  "https://www.instagram.com/tripps_207/p/DdeZBh4x4P3/",
  "https://www.instagram.com/tripps_207/p/DdZ_1_oDFYE/",
  "https://www.thebige.com/p/food2/newfoods",
  "https://www.thebige.com/p/food2/bargain-bites",
  "https://www.thebige.com/p/thingstodo/avenue/maine-building",
  "https://www.thebige.com/p/thingstodo/avenue/massachusetts-building",
  "https://www.wbur.org/news/2026/09/03/the-big-e-multi-state-fair-food-newsletter",
  "https://www.pressherald.com/2026/09/08/a-foodie-festival-the-big-e-state-fair-overflows-with-maine-eats/",
  "https://www.beanrg.com/harpoonbeerhall",
  "https://www.masslive.com/the-big-e/2026/09/everything-we-ate-at-the-big-e-prices-ratings-and-our-favorites.html",
  "https://www.masslive.com/ne-where/2026/09/the-big-e-eaters-guide-2026-what-to-eat-and-where-to-find-it.html",
]);

describe("2026 catalog content", () => {
  it("contains only sourced 2026 records", () => {
    expect(catalogData.items.length).toBeGreaterThan(0);
    for (const item of catalogData.items) {
      expect(item.year).toBe(2026);
      for (const source of [item.source, ...(item.supportingSources ?? [])]) {
        expect(trustedFoodSources.has(source.url), source.url).toBe(true);
      }
      expect(item.source.accessedOn).toMatch(/^2026-09-19$|^2026-09-17$|^2026-09-16$|^2026-09-14$|^2026-09-07$|^2026-08-27$/);
    }
  });

  it.each(requiredNewVendors)("includes new vendor %s", (vendor) => {
    expect(catalogData.items.some((item) => item.vendor === vendor)).toBe(true);
  });

  it("includes newly published Massachusetts Building food entries", () => {
    const expectedEntries = [
      ["cindy-drive-in-cake-shake", "Cindy's Drive-in", "Cake Shake"],
      ["craic-sauce-hot-sauce", "Craic Sauce", "Hot Sauce"],
      ["creme-bru-la-creme-brulee", "Crème Bru LA", "Crème Brûlée"],
      ["delaneys-market-popover-sandwiches", "Delaney's Market", "Popover Sandwiches"],
      ["finn-cakes-finnish-pancake", "Finn Cakes", "Finnish Pancake"],
      ["iona-kitchen-southern-food", "Iona's Kitchen", "Southern Food"],
      ["itskelewele31-ghanaian-inspired-food", "ItsKelewele31 LLC", "Ghanaian-inspired Food"],
      ["janiks-pierogi-cafe-pierogi", "Janik's Pierogi Café", "Pierogi"],
      ["joeys-deli-create-your-own-dinners", "Joey's Deli & Market", "Create-your-own Dinners"],
      ["koffee-kup-bakery-baked-goods", "Koffee Kup Bakery", "Made-from-scratch Baked Goods"],
      ["mackens-sliders-bbq-cowboy-slider", "Mackens Sliders", "BBQ Cowboy Slider"],
      ["mackens-sliders-garlic-bomb-slider", "Mackens Sliders", "Garlic Bomb Slider"],
      ["mackens-sliders-bacon-waffle-slider", "Mackens Sliders", "Bacon Waffle Slider"],
      ["mackens-sliders-vegetarian-caprese-slider", "Mackens Sliders", "Vegetarian Caprese Slider"],
      ["mackens-sliders-french-fries", "Mackens Sliders", "French Fries"],
      ["madhrasi-specialty-chai", "Madhrasi", "Specialty Chai"],
      ["main-street-deli-pilgrim-sandwich", "Main Street Deli", "Pilgrim Sandwich"],
      ["main-street-deli-thanksgiving-bowl", "Main Street Deli", "Thanksgiving Bowl"],
      ["maureens-sweet-shoppe-handmade-chocolates", "Maureen's Sweet Shoppe", "Handmade Chocolates"],
      ["simply-dip-licious-dips", "Simply Dip-Licious", "Dips"],
      ["sweet-babus-gluten-free-granola", "Sweet Babu's", "Gluten-free Granola"],
      ["sweet-babus-maple-roasted-nuts", "Sweet Babu's", "Maple Roasted Nuts"],
      ["the-bone-sauce-wings", "The Bone Sauce", "Wings"],
    ];

    for (const [id, vendor, name] of expectedEntries) {
      const item = catalogData.itemsById.get(id);
      expect(item?.vendor).toBe(vendor);
      expect(item?.name).toBe(name);
      expect(item?.locationIds).toEqual(["avenue-of-states"]);
      expect(item?.source.url).toBe("https://www.thebige.com/p/thingstodo/avenue/massachusetts-building");
      expect(item?.source.accessedOn).toBe("2026-09-16");
    }
  });

  it("includes food details reported by WBUR and the Portland Press Herald", () => {
    const expectedEntries = [
      ["paddock-the-maple-slider", "The Paddock", "The Maple"],
      ["paddock-the-smash-slider", "The Paddock", "The Smash"],
      ["paddock-the-ancho-slider", "The Paddock", "The Ancho"],
      ["paddock-the-mac-slider", "The Paddock", "The Mac"],
      ["fields-fields-blueberry-leaf-tea", "Fields Fields Blueberries", "Blueberry Leaf Tea"],
      ["valley-view-orchard-pies-whoopie-pies", "Valley View Orchard Pies", "Whoopie Pies"],
      ["valley-view-orchard-pies-blueberry-pie", "Valley View Orchard Pies", "Blueberry Pie"],
      ["valley-view-orchard-pies-frozen-drinks", "Valley View Orchard Pies", "Frozen Drinks"],
      ["hawkes-lobster-roll", "Hawke's", "Maine Lobster Roll"],
      ["tree-of-life-maple-farm-maple-products", "Tree of Life Maple Farm", "Maple Products"],
    ];

    for (const [id, vendor, name] of expectedEntries) {
      const item = catalogData.itemsById.get(id);
      expect(item?.vendor).toBe(vendor);
      expect(item?.name).toBe(name);
      expect(item?.source.url).toMatch(/wbur\.org|pressherald\.com/);
      expect(item?.source.accessedOn).toBe("2026-09-17");
    }
  });

  it("includes the newly published Harpoon and Maine Building menu details", () => {
    const expectedEntries = [
      ["harpoon-the-plain-jane-loaded-pretzel-bites", "Harpoon Beer Hall", "The Plain Jane Loaded Pretzel Bites"],
      ["harpoon-buffalo-chicken-loaded-pretzel-bites", "Harpoon Beer Hall", "Buffalo Chicken Loaded Pretzel Bites"],
      ["harpoon-maple-bourbon-pretzel-bites", "Harpoon Beer Hall", "Maple Bourbon Pretzel Bites"],
      ["harpoon-nacho-average-chicken-bacon-ranch-pretzel-bites", "Harpoon Beer Hall", "Nacho Average Chicken Bacon Ranch Pretzel Bites"],
      ["harpoon-colossal-fried-shrimp-skewers", "Harpoon Beer Hall", "Colossal Fried Shrimp Skewers"],
      ["harpoon-deli-style-smoked-corned-beef-sandwich", "Harpoon Beer Hall", "Deli Style Smoked Corned Beef Sandwich"],
      ["harpoon-classic-smoked-corned-beef-sandwich", "Harpoon Beer Hall", "Classic Smoked Corned Beef Sandwich"],
      ["harpoon-korean-style-smoked-corned-beef-sandwich", "Harpoon Beer Hall", "Korean Style Smoked Corned Beef Sandwich"],
      ["tree-of-life-maple-farm-maple-syrup", "Tree of Life Maple Farm", "Maple Syrup"],
      ["tree-of-life-maple-farm-maple-cream", "Tree of Life Maple Farm", "Maple Cream"],
      ["tree-of-life-maple-farm-maple-candies", "Tree of Life Maple Farm", "Maple Candies"],
      ["tree-of-life-maple-farm-maple-cotton-candy", "Tree of Life Maple Farm", "Maple Cotton Candy"],
      ["tree-of-life-maple-farm-maple-coffee", "Tree of Life Maple Farm", "Maple Coffee"],
      ["tree-of-life-maple-farm-maple-milkshake", "Tree of Life Maple Farm", "Maple Milkshake"],
      ["royal-rose-wild-blueberry-beverage", "Royal Rose", "Wild Blueberry Beverage"],
      ["bluet-sparkling-wild-blueberry-wine", "Bluet", "Sparkling Wild Blueberry Wine"],
      ["run-amok-meadery-craft-mead", "Run Amok Meadery", "Craft Mead"],
    ];

    for (const [id, vendor, name] of expectedEntries) {
      const item = catalogData.itemsById.get(id);
      expect(item?.vendor).toBe(vendor);
      expect(item?.name).toBe(name);
      expect(item?.locationIds).toEqual(vendor === "Harpoon Beer Hall" ? ["new-england-avenue"] : ["avenue-of-states"]);
      expect(item?.source.url).toBe(vendor === "Harpoon Beer Hall"
        ? "https://www.beanrg.com/harpoonbeerhall"
        : "https://www.thebige.com/p/thingstodo/avenue/maine-building");
      expect(item?.source.accessedOn).toBe("2026-09-17");
    }
  });

  it("includes MassLive opening-day foods with mapable areas", () => {
    const expectedEntries = [
      ["fluffys-samoa-doughnut", "Fluffy’s Hand Cut Donuts", "Samoa Doughnut", ["new-england-avenue"]],
      ["jamaican-jewelz-maple-jerk-chicken-plate", "Jamaican Jewelz", "Maple Jerk Chicken Plate", ["avenue-of-states"]],
      ["dannys-spuds-pulled-pork-baked-potato", "Danny’s Spuds", "Pulled Pork Baked Potato", ["avenue-of-states"]],
      ["vermont-marshmallow-company-smored-oreo", "Vermont Marshmallow Company", "S’mored Oreo", ["avenue-of-states"]],
      ["boricua-bites-cheese-dog", "Boricua Bites", "Cheese Dog", ["the-front-porch"]],
      ["boricua-bites-bacalaito", "Boricua Bites", "Bacalaito", ["the-front-porch"]],
      ["new-hampshire-building-apple-nachos", "New Hampshire Building", "Apple Nachos", ["avenue-of-states"]],
      ["big-e-chocolate-pickle-tacos", "The Big E", "Chocolate Pickle Tacos", []],
    ] as const;

    for (const [id, vendor, name, locationIds] of expectedEntries) {
      const item = catalogData.itemsById.get(id);
      expect(item?.vendor).toBe(vendor);
      expect(item?.name).toBe(name);
      expect(item?.locationIds).toEqual(locationIds);
      expect(item?.source).toEqual({
        publisher: "MassLive",
        title: "Everything we ate at The Big E: Prices, ratings and our favorites",
        url: "https://www.masslive.com/the-big-e/2026/09/everything-we-ate-at-the-big-e-prices-ratings-and-our-favorites.html",
        accessedOn: "2026-09-19",
      });
    }
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

  it("defines the ordered editorial collections", () => {
    const expectedCollections = [
      ["wildest-new-foods", ["white-hut-uncrusta-double-burger", "yankee-boy-wagyu-beef-surf-n-turf-burger", "meatball-factory-sushi-corndog", "macho-taco-birria-bomb", "veggie-patch-fried-deviled-eggs"]],
      ["cocktails-and-mocktails", ["wave-caramel-apple-mocktail", "cantina-louie-frozen-margarita-mocktail", "broccoli-bar-broccarita", "calabrese-alcoholic-bellinis", "v-one-snow-globe-martini", "v-one-caramel-apple", "v-one-salted-caramel-espresso-martini", "v-one-ultra-premium-vodka-seltzer"]],
      ["desserts-worth-the-detour", ["big-e-bakery-peanut-butter-cream-puff", "tootsies-deep-fried-cheesecake", "fluffys-cookie-butter-cheesecake-donut", "ferrindino-maple-creemee-bacon-waffle", "moolicious-campfire-on-a-stick"]],
      ["gluten-free-fair-food", ["fields-fields-wild-blueberry-crisp", "simply-gluten-free-funnel-cakes", "simply-gluten-free-fried-oreos", "simply-gluten-free-corndogs", "simply-gluten-free-chicken-tenders", "simply-gluten-free-jumbo-mozzarella-stick", "simply-gluten-free-fountain-lemonade", "tripps-hashbrown-breakfast-sandwich", "tripps-donuts", "tripps-brownies", "tripps-fried-oreos", "tripps-chicken-fingers", "tripps-grass-fed-burgers", "tripps-french-fries", "luanns-build-your-own-brownie-bar", "sweet-babus-gluten-free-granola"]],
      ["fall-flavors", ["moose-joose-fall-in-a-cup", "cinnamon-saloon-apple-cider-slush", "sam-adams-headless-pumpkin-cider", "wave-caramel-apple-mocktail", "sweet-and-salty-pumpkin-spice-dirty-soda"]],
      ["savory-food-on-a-stick", ["cantina-louie-corn-on-a-stick", "nola-hush-puppy-skewers"]],
      ["bargain-bites-day", [
        "captain-nemos-savory-snack-wrap", "indian-restaurant-mixed-veggie-pakora", "west-springfield-lions-bacon-cheeseburger",
        "golden-kdog-cinnamozz-ball", "ny-style-pizza-hot-honey-chicken-pizza", "sugar-shakers-small-funnel-cake",
        "the-big-cheese-cheese-curds", "poutine-gourmet-mini-poutine", "kora-milas-cookie-dough-stick",
        "french-fry-corndog", "funnel-cake-waffle-cone", "carnival-candy-cotton-candy", "midway-slice-of-cheese-pizza",
      ]],
      ["maine-food-stops", [
        "maine-aquaculture-smoked-salmon-on-a-stick", "maine-aquaculture-captn-elis-root-beer", "maine-lobster-roll",
        "maine-potato-board-baked-potato", "fields-fields-wild-blueberry-crisp", "fire-and-co-wood-fired-pizza",
        "qp-burger-food-truck-burger", "qp-burger-food-truck-hot-dog",
      ]],
    ];
    expect(catalogData.collections.filter((collection) => !["masslive-must-try", "masslive-opening-day", "new-for-2026"].includes(collection.id)).map((collection) => [collection.id, collection.itemIds])).toEqual(expectedCollections);
  });

  it("keeps the constrained collections aligned with their source-backed metadata", () => {
    for (const itemId of catalogData.collectionsById.get("cocktails-and-mocktails")?.itemIds ?? []) {
      const item = catalogData.itemsById.get(itemId);
      expect(item?.categoryIds.some((id) => id === "cocktails" || id === "mocktails"), itemId).toBe(true);
    }

    const glutenFreeIds = catalogData.items.filter((item) => item.dietaryClaims.includes("gluten-free")).map((item) => item.id);
    expect(catalogData.collectionsById.get("gluten-free-fair-food")?.itemIds).toEqual(glutenFreeIds);

    for (const itemId of catalogData.collectionsById.get("savory-food-on-a-stick")?.itemIds ?? []) {
      const item = catalogData.itemsById.get(itemId);
      expect(item?.tagIds).toContain("food-on-a-stick");
      expect(item?.tagIds).toContain("savory");
    }
  });

  it("publishes the official Bargain Bites specials as a dated collection", () => {
    const collection = catalogData.collectionsById.get("bargain-bites-day");

    expect(collection?.title).toBe("Bargain Bites Day");
    expect(collection?.description).toContain("September 21");
    expect(collection?.source).toEqual({
      publisher: "The Big E",
      title: "Bargain Bites Day",
      url: "https://www.thebige.com/p/food2/bargain-bites",
      accessedOn: "2026-09-07",
    });

    const itemNames = collection?.itemIds.map((itemId) => catalogData.itemsById.get(itemId)?.name);
    expect(itemNames).toEqual([
      "Nemo’s Savory Snack Wrap",
      "Mixed Veggie Pakora",
      "Bacon Cheeseburger",
      "Cinnamozz Ball",
      "Hot Honey Chicken Pizza",
      "Small Funnel Cake",
      "Cheese Curds",
      "Mini Poutine",
      "Cookie Dough Stick",
      "Corndog",
      "Waffle Cone",
      "Cotton Candy",
      "Slice of Cheese Pizza",
    ]);
  });

  it("publishes official Maine Building food stops as a sourced collection", () => {
    const collection = catalogData.collectionsById.get("maine-food-stops");

    expect(collection?.title).toBe("Maine Food Stops");
    expect(collection?.description).toContain("Maine Building");
    expect(collection?.source).toEqual({
      publisher: "The Big E",
      title: "Maine Building",
      url: "https://www.thebige.com/p/thingstodo/avenue/maine-building",
      accessedOn: "2026-09-14",
    });

    expect(collection?.itemIds.map((itemId) => catalogData.itemsById.get(itemId)?.name)).toEqual([
      "Smoked Salmon on a Stick",
      "Capt’n Eli’s Root Beer",
      "Maine Lobster Roll",
      "Maine Baked Potato",
      "Wild Blueberry Crisp",
      "Wood-fired Pizza",
      "Burger",
      "Hot Dog",
    ]);
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
