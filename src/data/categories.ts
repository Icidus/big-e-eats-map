// src/data/categories.ts
// Category + categorization helper utilities to enrich foods at runtime
// without editing the source data by hand.

export type Category =
  | 'beer'
  | 'cocktail'
  | 'wine'
  | 'cider'
  | 'mocktail'
  | 'coffee'
  | 'tea'
  | 'lemonade'
  | 'smoothie'
  | 'milkshake'
  | 'soda'
  | 'water'
  | 'drink'
  | 'burger'
  | 'hot-dog'
  | 'corn-dog'
  | 'pizza'
  | 'sandwich'
  | 'taco'
  | 'nachos'
  | 'poutine'
  | 'fries-tots'
  | 'bbq'
  | 'sausage-brat'
  | 'gyro'
  | 'kebab'
  | 'wings'
  | 'seafood'
  | 'chowder-soup'
  | 'noodles-rice'
  | 'potato'
  | 'salad'
  | 'pretzel'
  | 'waffle'
  | 'donut'
  | 'cookie'
  | 'cake-pastry'
  | 'candy'
  | 'ice-cream'
  | 'sundae'
  | 'breakfast'
  | 'vegan-veg'
  | 'other';

// Use type-only imports to avoid runtime cycles
import type { Food as BaseFood, Location as BaseLocation } from './locations';

// Order matters: first matching rule wins for primaryCategory.
// Keep patterns lowercased; we lowercase inputs before testing.
const RULES: Array<{
  category: Category;
  patterns: RegExp[];
  addTags?: string[];
}> = [
  // Alcoholic first (specific → general)
  { category: 'beer',     patterns: [/beer(?!-a-misu)/, /\bcraft beers?\b/, /\bdraft beer\b/i] },
  { category: 'cocktail', patterns: [/\bcocktails?\b/, /\bmargaritas?\b/, /\bmojitos?\b/, /\brum buckets?\b/, /\bsmoking cocktails?\b/] },
  { category: 'wine',     patterns: [/\bwine\b/, /\bwine flights?\b/, /\bsangria\b/] },
  { category: 'cider',    patterns: [/\bcider\b/] },

  // Non-alcoholic drink types
  { category: 'mocktail', patterns: [/\bmocktails?\b/] },
  { category: 'milkshake',patterns: [/\bmilkshakes?\b/] },
  { category: 'smoothie', patterns: [/\bsmoothies?\b/, /\btie-?dye smoothie\b/] },
  { category: 'coffee',   patterns: [/\bcoffee\b/, /\bespresso\b/, /\biced coffee\b/] },
  { category: 'tea',      patterns: [/\bbubble tea\b/, /\btea\b/] },
  { category: 'lemonade', patterns: [/\blemonade\b/, /\b(?:strawberry|pink|blue)\s+lemonade\b/i, /\b(?:limeade|orangeade|cherryade)\b/i] },
  { category: 'soda',     patterns: [/\bsoda\b/, /\b(pop|soft drink)\b/i, /\b(dr\.?\s*pepper|coca-?cola|pepsi|mountain dew|sprite|root beer|ginger ale)\b/i] },
  // Treat generic juices as drinks (fallback is 'drink' tag also handles this)
  { category: 'drink',    patterns: [/\bjuice(s)?\b/] },
  { category: 'water',    patterns: [/\bwater\b/] },
  { category: 'drink',    patterns: [/\bdrinks?\b/] },

  // Savory mains / sides
  { category: 'burger',       patterns: [/\bburger(s)?\b/, /\bsliders?\b/] },
  { category: 'hot-dog',      patterns: [/\bhot ?dogs?\b/, /\bcheese dogs?\b/, /\bchili dogs?\b/] },
  { category: 'corn-dog',     patterns: [/\bcorn ?dogs?\b/, /\bdog-on-a-stick\b/] },
  { category: 'pizza',        patterns: [/\bpizzas?\b/] },
  { category: 'sandwich',     patterns: [/\bsandwich(es)?\b/, /\bpatty melt\b/, /\breuben\b/, /\bgrilled cheese\b/] },
  { category: 'taco',         patterns: [/\btacos?\b/] },
  { category: 'nachos',       patterns: [/\bnachos?\b/] },
  { category: 'poutine',      patterns: [/\bpoutine\b/] },
  { category: 'fries-tots',   patterns: [/\bfries\b/, /\btots?\b/, /\bcurly fries\b/, /\bmillennium chips\b/, /\bspiral spuds\b/] },
  { category: 'bbq',          patterns: [/\bbbq\b/, /\bpulled pork\b/, /\bbrisket\b/, /\bribs?\b|memphis ribs/] },
  { category: 'sausage-brat', patterns: [/\bsausage\b/, /\bbratwurst\b/, /\bkielbasa\b/] },
  { category: 'gyro',         patterns: [/\bgyro(s)?\b/] },
  { category: 'kebab',        patterns: [/\bkabob(s)?\b|kebab(s)?/] },
  { category: 'wings',        patterns: [/\bwings?\b/] },
  { category: 'seafood',      patterns: [/\bclam(s)?\b/, /\bchowder\b/, /\blobster\b/, /\bshrimp\b/, /\boyster(s)?\b/, /\bfish\b/, /\bseafood\b/] },
  { category: 'chowder-soup', patterns: [/\bsoups?\b/, /\bchowder\b/] },
  { category: 'noodles-rice', patterns: [/\bnoodles?\b/, /\bnoodle bowls?\b/, /\brice\b/, /\brice bowls?\b/, /\bteriyaki\b/, /\bspätzle\b/] },
  { category: 'potato',       patterns: [/\bbaked potatoes?\b/, /\bpotatoes?\b/, /\bpotato pancakes?\b/, /\bsweet potatoes?\b/] },
  { category: 'salad',        patterns: [/\bsalads?\b|caprese/i] },
  { category: 'pretzel',      patterns: [/\bpretzels?\b/, /\bpretzel bites?\b/] },
  { category: 'waffle',       patterns: [/\bwaffles?\b/, /\bwaffle\b/] },

  // Desserts / sweets
  { category: 'donut',        patterns: [/\bdonuts?\b|doughnuts?/i] },
  { category: 'cookie',       patterns: [/\bcookies?\b|cookie dough/i] },
  { category: 'cake-pastry',  patterns: [/\bcake\b/, /\bpuff\b/, /\beclair\b/, /\bmac( |&|and)?cheese\b(?!.*(burger|dog))/i, /\bstrudel\b/, /\bparatha(s)?\b/, /\bcrepes?\b/, /\bempanadas?\b/] },
  { category: 'candy',        patterns: [/\bcandy\b/, /\bcaramel\b/, /\bchocolate\b/, /\bfudge\b/, /\btwinkies?\b/, /\bsnickers\b/, /\breese’?s\b/] },
  { category: 'ice-cream',    patterns: [/\bice cream\b/, /\bcreemee\b/, /\bfloats?\b/, /\bmoo-?nut\b/, /\bmilk & cookies\b/] },
  { category: 'sundae',       patterns: [/\bsundae(s)?\b/] },

  // Dietary / time of day
  { category: 'breakfast',    patterns: [/\bbreakfast\b/, /\bmuffins?\b/, /\bfritters?\b/, /\bcinnamon\b/] },
  { category: 'vegan-veg',    patterns: [/\bvegan\b/, /\bvegetarian\b/, /\bfalafel\b/, /\bhummus\b/, /\bvegetable\b/] },

  // Fallback
  { category: 'other',        patterns: [/.*/] },
];

// Extra facet tags that aren’t primary categories but help search
const TAG_RULES: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: 'alcoholic', patterns: [/\bbeer\b/, /\bcocktail(s)?\b/, /\bwine\b/, /\bcider\b/, /\bsangria\b/, /\brum\b/, /\bmargarita\b/] },
  { tag: 'non-alcoholic', patterns: [/\bmocktail(s)?\b/, /\blemonade\b/, /\bsmoothie(s)?\b/, /\bmilkshake(s)?\b/, /\bcoffee\b/, /\btea\b/, /\bapple cider\b/] },
  { tag: 'fried', patterns: [/\bfried\b/] },
  { tag: 'dessert', patterns: [/\bcake\b|\bcupcake\b|\bpie\b|\bice cream\b|\bcreemee\b|\bwaffle\b|\bdonut\b|\bcookie\b|\bbaklava\b/i] },
  { tag: 'spicy', patterns: [/\bjalapeño|\bhot\b(?! honey)/i] },
  { tag: 'maple', patterns: [/\bmaple\b/] },
  { tag: 'pickle', patterns: [/\bpickle\b/] },
];

function safeLower(s?: string | null): string {
  return (s ?? '').toString().trim().toLowerCase();
}

export type CategorizedFood = BaseFood & {
  primaryCategory: Category;
  tags: string[];
};

/**
 * Infer a primary category and tags from a Food record.
 * Specific rules first; first match wins for primaryCategory.
 */
export function categorizeFood(input: BaseFood): CategorizedFood {
  const name = safeLower(input.name);
  const vendor = safeLower(input.vendor);
  const hayName = name;           // Use name for primary category detection
  const hayFull = `${name} ${vendor}`; // Use name+vendor for tag enrichment
  let primary: Category | null = null;

  for (const rule of RULES) {
    // IMPORTANT: Only test the item name for primary category to avoid
    // vendor names (e.g., "Beer Experience") forcing a drink category.
    if (rule.patterns.some((re) => re.test(hayName))) {
      primary = rule.category;
      break;
    }
  }

  const tags = new Set<string>();
  for (const tr of TAG_RULES) {
    if (tr.patterns.some((re) => re.test(hayFull))) tags.add(tr.tag);
  }

  // Helpful derived tag: treat any alcohol category as 'alcoholic'
  const alcoholicCats: Category[] = ['beer', 'cocktail', 'wine', 'cider'];
  if (primary && alcoholicCats.includes(primary)) tags.add('alcoholic');

  // Drinks umbrella for convenience filtering
  const drinkCats: Category[] = [
    'beer','cocktail','wine','cider','mocktail','coffee','tea','lemonade','smoothie','milkshake','soda','water','drink'
  ];
  if (primary && drinkCats.includes(primary)) tags.add('drink');

  // Dessert umbrella
  const dessertCats: Category[] = ['ice-cream','sundae','donut','cookie','cake-pastry','candy','waffle'];
  if (primary && dessertCats.includes(primary)) tags.add('dessert');

  return {
    ...input,
    primaryCategory: primary ?? 'other',
    tags: Array.from(tags).sort(),
  };
}

/** Map every food in every location to include categories. */
export type WithCategorizedFoods<L extends BaseLocation> = Omit<L, 'foods'> & {
  foods: CategorizedFood[];
};

export function augmentLocations<L extends BaseLocation>(locations: L[]): WithCategorizedFoods<L>[] {
  return locations.map((loc) => ({
    ...loc,
    foods: loc.foods.map((f) => categorizeFood(f)),
  }));
}

/** Convenience: grab all foods of a given category across locations. */
export function getFoodsByCategory(locations: BaseLocation[], category: Category) {
  return augmentLocations(locations)
    .flatMap((l) =>
      l.foods.map((f) => ({
        ...(f as CategorizedFood),
        locationId: l.id,
        locationName: l.name,
      }))
    )
    .filter((f) => (f as CategorizedFood).primaryCategory === category);
}

/** Convenience: grab all “drinks” (any drink type, incl. beer/cocktails). */
export function getDrinks(locations: BaseLocation[]) {
  const drinkSet = new Set<Category>([
    'beer','cocktail','wine','cider','mocktail','coffee','tea','lemonade','smoothie','milkshake','soda','water','drink'
  ]);
  return augmentLocations(locations)
    .flatMap((l) =>
      l.foods.map((f) => ({
        ...(f as CategorizedFood),
        locationId: l.id,
        locationName: l.name,
      }))
    )
    .filter((f) => drinkSet.has((f as CategorizedFood).primaryCategory));
}
