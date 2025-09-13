export interface Food {
  id: string;
  name: string;
  vendor: string;
  price?: string;
  description?: string;
  isRecommended?: boolean;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  foods: Food[];
}

export const locations: Location[] = [
  {
    "id": "new-england-avenue",
    "name": "New England Avenue",
    "description": "New England Avenue is the entry point for many visitors entering the fair from the main parking lot. It starts at Gate 9A and stretches out toward the heart of the fair — where the Court of Honor Stage and Coliseum are. New England Avenue is a great starting point, since it’s got some of the best food options at the fair. Just be careful not to fill up too quickly before you get to explore.",
    "foods": [
      {
        "id": "barbies-ice-cream-shoppe-ice-cream",
        "name": "Ice Cream",
        "vendor": "Barbie’s Ice Cream Shoppe",
        "description": null
      },
      {
        "id": "barbies-ice-cream-shoppe-fancy-waffle-cones",
        "name": "Fancy Waffle Cones",
        "vendor": "Barbie’s Ice Cream Shoppe",
        "description": null
      },
      {
        "id": "barbies-ice-cream-shoppe-upside-down-banana-split",
        "name": "Upside Down Banana Split",
        "vendor": "Barbie’s Ice Cream Shoppe",
        "description": null
      },
      {
        "id": "barbies-ice-cream-shoppe-frozen-bananas",
        "name": "Frozen Bananas",
        "vendor": "Barbie’s Ice Cream Shoppe",
        "description": null
      },
      {
        "id": "barbies-ice-cream-shoppe-barbie-ice-cream",
        "name": "Barbie Ice Cream (Strawberry Ice Cream with Birthday Cake Crumbles)",
        "vendor": "Barbie’s Ice Cream Shoppe",
        "description": null
      },
      {
        "id": "barbies-ice-cream-shoppe-cracker-jack-sundae",
        "name": "Cracker Jack Sundae",
        "vendor": "Barbie’s Ice Cream Shoppe",
        "description": null
      },
      {
        "id": "billies-baked-potato-baked-potatoes",
        "name": "Baked Potatoes",
        "vendor": "Billie’s Baked Potato",
        "description": null
      },
      {
        "id": "big-e-cream-puff-bakery-big-e-cream-puff",
        "name": "Big E Cream Puff",
        "vendor": "Big E Cream Puff Bakery",
        "description": null
      },
      {
        "id": "big-e-cream-puff-bakery-big-e-clair",
        "name": "Big E-clair",
        "vendor": "Big E Cream Puff Bakery",
        "description": null
      },
      {
        "id": "big-e-cream-puff-bakery-espresso-cream-puff",
        "name": "Espresso Cream Puff",
        "vendor": "Big E Cream Puff Bakery",
        "description": null
      },
      {
        "id": "butcher-boys-london-broil-sandwich",
        "name": "London Broil Sandwich",
        "vendor": "Butcher Boys",
        "description": null
      },
      {
        "id": "butcher-boys-gyros",
        "name": "Gyros",
        "vendor": "Butcher Boys",
        "description": null
      },
      {
        "id": "butcher-boys-italian-sausage",
        "name": "Italian Sausage",
        "vendor": "Butcher Boys",
        "description": null
      },
      {
        "id": "chans-original-chicken-on-a-stick-chicken-on-a-stick",
        "name": "Chicken-on-a-Stick",
        "vendor": "Chan’s Original Chicken-on-a-Stick",
        "description": null
      },
      {
        "id": "chans-original-chicken-on-a-stick-noodles",
        "name": "Noodles",
        "vendor": "Chan’s Original Chicken-on-a-Stick",
        "description": null
      },
      {
        "id": "chans-original-chicken-on-a-stick-egg-rolls",
        "name": "Egg Rolls",
        "vendor": "Chan’s Original Chicken-on-a-Stick",
        "description": null
      },
      {
        "id": "chompers-fried-croquette-balls-bacon-cheeseburger",
        "name": "Fried Croquette Balls with flavors like Bacon Cheeseburger",
        "vendor": "Chompers",
        "description": null
      },
      {
        "id": "chompers-chicken-parm-chompers",
        "name": "Chicken Parm Chompers",
        "vendor": "Chompers",
        "isRecommended": true,
        "description": null
      },
      {
        "id": "chompers-fried-croquette-balls-taco",
        "name": "Fried Croquette Balls with flavors like Taco",
        "vendor": "Chompers",
        "description": null
      },
      {
        "id": "chompers-fried-croquette-balls-vegetarian-potato-corn",
        "name": "Fried Croquette Balls with flavors like Vegetarian Potato & Corn",
        "vendor": "Chompers",
        "description": null
      },
      {
        "id": "delucas-caramel-apple-sundae",
        "name": "Caramel Apple Sundae",
        "vendor": "Deluca’s",
        "description": null
      },
      {
        "id": "delucas-chicken-parm-sandwich",
        "name": "Chicken Parm Sandwich",
        "vendor": "Deluca’s",
        "description": null
      },
      {
        "id": "delucas-deep-fried-meatballs-on-a-stick",
        "name": "Deep-fried Meatballs on a Stick",
        "vendor": "Deluca’s",
        "description": null
      },
      {
        "id": "delucas-toasted-garlic-bread-bowl",
        "name": "Toasted Garlic Bread Bowl",
        "vendor": "Deluca’s",
        "description": null
      },
      {
        "id": "delucas-deep-fried-ice-cream-sandwich",
        "name": "Deep-Fried Ice Cream Sandwich",
        "vendor": "Deluca’s",
        "description": null
      },
      {
        "id": "dimitris-greek-food-pita",
        "name": "Pita",
        "vendor": "Dimitri’s Greek Food",
        "description": null
      },
      {
        "id": "dimitris-greek-food-falafel",
        "name": "Falafel",
        "vendor": "Dimitri’s Greek Food",
        "description": null
      },
      {
        "id": "dimitris-greek-food-hummus",
        "name": "Hummus",
        "vendor": "Dimitri’s Greek Food",
        "description": null
      },
      {
        "id": "dimitris-greek-food-baklava",
        "name": "Baklava",
        "vendor": "Dimitri’s Greek Food",
        "description": null
      },
      {
        "id": "dimitris-greek-food-gyros",
        "name": "Gyros",
        "vendor": "Dimitri’s Greek Food",
        "description": null
      },
      {
        "id": "dimitris-greek-food-kabobs",
        "name": "Kabobs",
        "vendor": "Dimitri’s Greek Food",
        "description": null
      },
      {
        "id": "fluffys-hand-cut-donuts-giant-donuts-with-toppings",
        "name": "Giant Donuts with Toppings",
        "vendor": "Fluffy’s Hand Cut Donuts",
        "description": null
      },
      {
        "id": "fluffys-hand-cut-donuts-giant-donuts",
        "name": "Giant Donuts",
        "vendor": "Fluffy’s Hand Cut Donuts",
        "description": null
      },
      {
        "id": "fluffys-hand-cut-donuts-donut-sundaes",
        "name": "Donut Sundaes",
        "vendor": "Fluffy’s Hand Cut Donuts",
        "description": null
      },
      {
        "id": "fluffys-hand-cut-donuts-pickle-donut",
        "name": "Pickle Donut",
        "vendor": "Fluffy’s Hand Cut Donuts",
        "description": null
      },
      {
        "id": "harpoon-beer-experience-craft-beer",
        "name": "Craft Beer",
        "vendor": "Harpoon Beer Experience",
        "description": null
      },
      {
        "id": "harpoon-beer-experience-hard-seltzer",
        "name": "Hard Seltzer",
        "vendor": "Harpoon Beer Experience",
        "description": null
      },
      {
        "id": "harpoon-beer-experience-loaded-pretzel-bites",
        "name": "Loaded Pretzel Bites",
        "vendor": "Harpoon Beer Experience",
        "description": null
      },
      {
        "id": "harpoon-beer-experience-giant-shrimp-skewers",
        "name": "Giant Shrimp Skewers",
        "vendor": "Harpoon Beer Experience",
        "description": null
      },
      {
        "id": "the-hub-cheese-dogs",
        "name": "Cheese Dogs",
        "vendor": "The Hub",
        "description": null
      },
      {
        "id": "the-hub-chili-dogs",
        "name": "Chili Dogs",
        "vendor": "The Hub",
        "description": null
      },
      {
        "id": "the-hub-burgers",
        "name": "Burgers",
        "vendor": "The Hub",
        "description": null
      },
      {
        "id": "the-hub-fries",
        "name": "Fries",
        "vendor": "The Hub",
        "description": null
      },
      {
        "id": "the-hub-chicken-tenders",
        "name": "Chicken Tenders",
        "vendor": "The Hub",
        "description": null
      },
      {
        "id": "luanns-bakery-specialty-cupcakes",
        "name": "Specialty Cupcakes",
        "vendor": "LuAnn’s Bakery",
        "description": null
      },
      {
        "id": "luanns-bakery-maple-bacon-cupcake",
        "name": "Maple Bacon Cupcake",
        "vendor": "LuAnn’s Bakery",
        "description": null
      },
      {
        "id": "luanns-bakery-bucket-cakes",
        "name": "Bucket Cakes",
        "vendor": "LuAnn’s Bakery",
        "description": null
      },
      {
        "id": "marions-fried-dough-fried-kool-aid",
        "name": "Fried Kool-Aid",
        "vendor": "Marion’s Fried Dough",
        "description": null
      },
      {
        "id": "marions-fried-dough-fried-jelly-beans",
        "name": "Fried Jelly Beans",
        "vendor": "Marion’s Fried Dough",
        "description": null
      },
      {
        "id": "marions-fried-dough-fried-butter",
        "name": "Fried Butter",
        "vendor": "Marion’s Fried Dough",
        "isRecommended": true,
        "description": null
      },
      {
        "id": "marions-fried-dough-fried-dough",
        "name": "Fried Dough",
        "vendor": "Marion’s Fried Dough",
        "description": null
      },
      {
        "id": "marions-fried-dough-fried-oreos",
        "name": "Fried Oreos",
        "vendor": "Marion’s Fried Dough",
        "description": null
      },
      {
        "id": "ny-style-pizza-pizza-slices",
        "name": "Pizza Slices",
        "vendor": "NY Style Pizza",
        "description": null
      },
      {
        "id": "ny-style-pizza-pickle-pizza",
        "name": "Pickle Pizza",
        "vendor": "NY Style Pizza",
        "description": null
      },
      {
        "id": "penalty-box-pub-frozen-cocktails",
        "name": "Frozen Cocktails",
        "vendor": "Penalty Box Pub",
        "description": null
      },
      {
        "id": "penalty-box-pub-beer",
        "name": "Beer",
        "vendor": "Penalty Box Pub",
        "description": null
      },
      {
        "id": "penalty-box-pub-hard-seltzer",
        "name": "Hard Seltzer",
        "vendor": "Penalty Box Pub",
        "description": null
      },
      {
        "id": "piches-beignets-beignets",
        "name": "Beignets",
        "vendor": "Piche’s Beignets",
        "description": null
      },
      {
        "id": "piches-beignets-beignet-sundaes",
        "name": "Beignet Sundaes",
        "vendor": "Piche’s Beignets",
        "description": null
      },
      {
        "id": "piches-beignets-fried-oreos",
        "name": "Fried Oreos",
        "vendor": "Piche’s Beignets",
        "description": null
      },
      {
        "id": "piches-beignets-funnel-cake-sundaes",
        "name": "Funnel Cake Sundaes",
        "vendor": "Piche’s Beignets",
        "description": null
      },
      {
        "id": "piches-beignets-funnel-cakes",
        "name": "Funnel Cakes",
        "vendor": "Piche’s Beignets",
        "description": null
      },
      {
        "id": "piches-beignets-fried-snickers",
        "name": "Fried Snickers",
        "vendor": "Piche’s Beignets",
        "description": null
      },
      {
        "id": "piches-beignets-fried-reeses-peanut-butter-cups",
        "name": "Fried Reese’s Peanut Butter Cups",
        "vendor": "Piche’s Beignets",
        "description": null
      },
      {
        "id": "reds-red-apples-candy-apples",
        "name": "Candy Apples",
        "vendor": "Red’s Red Apples",
        "description": null
      },
      {
        "id": "reds-red-apples-samoa-apples",
        "name": "Samoa Apples",
        "vendor": "Red’s Red Apples",
        "description": null
      },
      {
        "id": "reds-red-apples-pickle-popcorn",
        "name": "Pickle Popcorn",
        "vendor": "Red’s Red Apples",
        "description": null
      },
      {
        "id": "soup-r-bowl-soups",
        "name": "Soups",
        "vendor": "Soup-R Bowl",
        "description": null
      },
      {
        "id": "soup-r-bowl-chili",
        "name": "Chili",
        "vendor": "Soup-R Bowl",
        "description": null
      },
      {
        "id": "soup-r-bowl-bread-bowls",
        "name": "Bread Bowls",
        "vendor": "Soup-R Bowl",
        "description": null
      },
      {
        "id": "soup-r-bowl-regular-bowls",
        "name": "Regular Bowls",
        "vendor": "Soup-R Bowl",
        "description": null
      },
      {
        "id": "soup-r-bowl-maple-marshmallow-drizzled-sweet-potato-fries",
        "name": "Maple Marshmallow Drizzled Sweet Potato Fries",
        "vendor": "Soup-R Bowl",
        "description": null
      },
      {
        "id": "super-dog-6-inch-dog-on-a-stick",
        "name": "6-inch Dog-on-a-Stick",
        "vendor": "Super Dog",
        "description": null
      },
      {
        "id": "super-dog-12-inch-super-dog",
        "name": "12-inch Super Dog",
        "vendor": "Super Dog",
        "description": null
      },
      {
        "id": "super-dog-18-inch-mega-dog",
        "name": "18-inch Mega Dog",
        "vendor": "Super Dog",
        "description": null
      },
      {
        "id": "stellas-milk-cookies-homemade-chocolate-chip-cookies-in-a-cone-or-bucket",
        "name": "Homemade Chocolate Chip Cookies in a Cone or Bucket",
        "vendor": "Stella’s Milk & Cookies",
        "description": null
      },
      {
        "id": "stellas-milk-cookies-milk",
        "name": "Milk",
        "vendor": "Stella’s Milk & Cookies",
        "description": null
      },
      {
        "id": "stellas-milk-cookies-2nd-location-cookies",
        "name": "Cookies",
        "vendor": "Stella’s Milk & Cookies (2nd location)",
        "description": "Stella’s location near the Court of Honor Stage"
      },
      {
        "id": "stellas-milk-cookies-2nd-location-muffin-tops",
        "name": "Muffin Tops",
        "vendor": "Stella’s Milk & Cookies (2nd location)",
        "description": "Stella’s location near the Court of Honor Stage"
      },
      {
        "id": "sugar-shakers-deep-fried-whoopie-pie",
        "name": "Deep-Fried Whoopie Pie",
        "vendor": "Sugar Shakers (Funnel Cakes)",
        "description": null
      },
      {
        "id": "sugar-shakers-funnel-cake",
        "name": "Funnel Cake",
        "vendor": "Sugar Shakers (Funnel Cakes)",
        "description": null
      },
      {
        "id": "sugar-shakers-giant-eclairs",
        "name": "Giant Eclairs",
        "vendor": "Sugar Shakers (Funnel Cakes)",
        "description": null
      },
      {
        "id": "tootsies-fried-dough-fried-oreos",
        "name": "Fried Oreos",
        "vendor": "Tootsie’s Fried Dough",
        "description": null
      },
      {
        "id": "tootsies-fried-dough-dough-nuggets",
        "name": "Dough Nuggets",
        "vendor": "Tootsie’s Fried Dough",
        "description": null
      },
      {
        "id": "tootsies-fried-dough-fried-candy-bars",
        "name": "Fried Candy Bars",
        "vendor": "Tootsie’s Fried Dough",
        "description": null
      },
      {
        "id": "tots-a-lot-chicken-tot-pie",
        "name": "Chicken Tot Pie",
        "vendor": "Tots-A-Lot",
        "isRecommended": true,
        "description": null
      },
      {
        "id": "tots-a-lot-loaded-tots",
        "name": "Loaded Tots",
        "vendor": "Tots-A-Lot",
        "description": null
      },
      {
        "id": "tots-a-lot-apple-dumpling-tots",
        "name": "Apple Dumpling Tots",
        "vendor": "Tots-A-Lot",
        "description": null
      },
      {
        "id": "tots-a-lot-bacon-mac-cheese-tots",
        "name": "Bacon Mac & Cheese Tots",
        "vendor": "Tots-A-Lot",
        "description": null
      },
      {
        "id": "tots-a-lot-vegan-tots",
        "name": "Vegan Tots",
        "vendor": "Tots-A-Lot",
        "description": null
      },
      {
        "id": "wild-bills-curly-fries-chicken-tenders",
        "name": "Chicken Tenders",
        "vendor": "Wild Bill’s Curly Fries",
        "description": null
      },
      {
        "id": "wild-bills-curly-fries-foot-long-corn-dogs",
        "name": "Foot-Long Corn Dogs",
        "vendor": "Wild Bill’s Curly Fries",
        "description": null
      },
      {
        "id": "wild-bills-curly-fries-curly-fries",
        "name": "Curly Fries",
        "vendor": "Wild Bill’s Curly Fries",
        "description": null
      }
    ]
  },
{
  "id": "the-front-porch",
  "name": "The Front Porch",
  "description": "The Front Porch is a subsection of the fair near the Court of Honor Stage that debuted in 2022. It’s a nice little corner with some cozy seats tucked away in the shade. It’s a welcome oasis near some high-traffic areas on the fairground. If you get overwhelmed by the crowds, this is a good place to take a break.",
  "foods": [
    {
      "id": "bakery-on-brewer-apple-fritters",
      "name": "Apple Fritters",
      "vendor": "Bakery on Brewer",
      "description": null
    },
    {
      "id": "bakery-on-brewer-blueberry-fritters",
      "name": "Blueberry Fritters",
      "vendor": "Bakery on Brewer",
      "description": null
    },
    {
      "id": "bakery-on-brewer-pumpkin-fritters",
      "name": "Pumpkin Fritters",
      "vendor": "Bakery on Brewer",
      "description": null
    },
    {
      "id": "bakery-on-brewer-apple-cider",
      "name": "Apple Cider",
      "vendor": "Bakery on Brewer",
      "description": null
    },
    {
      "id": "boardwok-noodles-noodle-bowls",
      "name": "Noodle Bowls",
      "vendor": "Boardwok Noodles",
      "description": null
    },
    {
      "id": "boardwok-noodles-rice-bowls",
      "name": "Rice Bowls",
      "vendor": "Boardwok Noodles",
      "description": null
    },
    {
      "id": "boardwok-noodles-teriyaki",
      "name": "Teriyaki",
      "vendor": "Boardwok Noodles",
      "description": null
    },
    {
      "id": "granville-country-store-mac-melt",
      "name": "Mac Melt (Mac & Cheese Melt)",
      "vendor": "Granville Country Store",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "pioneer-valley-poppers-kettle-corn",
      "name": "Kettle Corn",
      "vendor": "Pioneer Valley Poppers",
      "description": null
    },
    {
      "id": "soulfully-vegan-options",
      "name": "Vegan options",
      "vendor": "SoulFully",
      "description": null
    },
    {
      "id": "soulfully-spicy-pb-j-burger",
      "name": "Spicy PB&J Burger",
      "vendor": "SoulFully",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "soulfully-hot-dogs",
      "name": "Hot Dogs",
      "vendor": "SoulFully",
      "description": null
    },
    {
      "id": "soulfully-loaded-fries",
      "name": "Loaded Fries",
      "vendor": "SoulFully",
      "description": null
    },
    {
      "id": "soulfully-milkshakes",
      "name": "Milkshakes",
      "vendor": "SoulFully",
      "description": null
    },
    {
      "id": "wave-mocktails-mocktails",
      "name": "Mocktails",
      "vendor": "W.A.V.E. Mocktails",
      "description": null
    },
    {
      "id": "wave-mocktails-shreks-swampwater",
      "name": "Shrek’s Swampwater",
      "vendor": "W.A.V.E. Mocktails",
      "description": null
    }
  ]
},
{
  "id": "commonwealth-avenue",
  "name": "Commonwealth Avenue",
  "description": "If New England Avenue is the main entry point for The Big E, then Commonwealth Avenue is the main hub. This is one of the longest stretches of road at the fair and holds a huge number of vendors. Because of that, it tends to get pretty crowded. Fortunately, there are a lot of little side roads you can take to get in and out of the thoroughfare. I recommend slipping through the Craft Common or the road behind the C Barn that leads to West Road.",
  "foods": [
    {
      "id": "amys-sweet-treats-ice-cream",
      "name": "Ice Cream",
      "vendor": "Amy’s Sweet Treats",
      "description": null
    },
    {
      "id": "amys-sweet-treats-crazy-milkshakes",
      "name": "Crazy Milkshakes",
      "vendor": "Amy’s Sweet Treats",
      "description": null
    },
    {
      "id": "amys-sweet-treats-hot-honey-sundae",
      "name": "Hot Honey Sundae",
      "vendor": "Amy’s Sweet Treats",
      "description": null
    },
    {
      "id": "angelas-pizza-giant-mozzarella-stick",
      "name": "Giant Mozzarella Stick",
      "vendor": "Angela’s Pizza",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "angelas-pizza-pickle-pizza",
      "name": "Pickle Pizza",
      "vendor": "Angela’s Pizza",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "angelas-pizza-mexican-street-corn-pizza",
      "name": "Mexican Street Corn Pizza",
      "vendor": "Angela’s Pizza",
      "description": null
    },
    {
      "id": "angelas-pizza-normal-pizza",
      "name": "Normal Pizza",
      "vendor": "Angela’s Pizza",
      "description": null
    },
    {
      "id": "billies-baked-potato-baked-potatoes",
      "name": "Baked Potatoes",
      "vendor": "Billie’s Baked Potato",
      "description": null
    },
    {
      "id": "butcher-boys-london-broil-sandwich",
      "name": "London Broil Sandwich",
      "vendor": "Butcher Boys",
      "description": null
    },
    {
      "id": "butcher-boys-gyros",
      "name": "Gyros",
      "vendor": "Butcher Boys",
      "description": null
    },
    {
      "id": "butcher-boys-italian-sausage",
      "name": "Italian Sausage",
      "vendor": "Butcher Boys",
      "description": null
    },
    {
      "id": "captain-nemos-hot-diggid-e-dog",
      "name": "Hot Diggid-E Dog",
      "vendor": "Captain Nemo’s",
      "description": null
    },
    {
      "id": "captain-nemos-sundae-supper-keg-tots",
      "name": "Sundae Supper Keg Tots",
      "vendor": "Captain Nemo’s",
      "description": null
    },
    {
      "id": "captain-nemos-pot-roast-patty-melt",
      "name": "Pot Roast Patty Melt",
      "vendor": "Captain Nemo’s",
      "description": null
    },
    {
      "id": "donut-family-cinn-a-roll-donuts",
      "name": "Cinn-a-roll Donuts",
      "vendor": "Donut Family",
      "description": null
    },
    {
      "id": "donut-family-mini-donuts",
      "name": "Mini Donuts",
      "vendor": "Donut Family",
      "description": null
    },
    {
      "id": "jacks-fries-chicken-tenders",
      "name": "Chicken Tenders",
      "vendor": "Jack’s Fries",
      "description": null
    },
    {
      "id": "jacks-fries-corn-dogs",
      "name": "Corn Dogs",
      "vendor": "Jack’s Fries",
      "description": null
    },
    {
      "id": "jacks-fries-millennium-chips",
      "name": "Millennium Chips",
      "vendor": "Jack’s Fries",
      "description": null
    },
    {
      "id": "jacks-fries-dough-nuggets",
      "name": "Dough Nuggets",
      "vendor": "Jack’s Fries",
      "description": null
    },
    {
      "id": "jacks-fries-funnel-cakes",
      "name": "Funnel Cakes",
      "vendor": "Jack’s Fries",
      "description": null
    },
    {
      "id": "jungle-juice-smoothies-tie-dye-smoothie",
      "name": "Tie-Dye Smoothie",
      "vendor": "Jungle Juice Smoothies",
      "description": null
    },
    {
      "id": "jungle-juice-smoothies-berry-jalapeno-smoothie",
      "name": "Berry-Jalapeno Smoothie",
      "vendor": "Jungle Juice Smoothies",
      "description": null
    },
    {
      "id": "local-brewer-showcase-rotating-lineup-of-local-breweries",
      "name": "Rotating lineup of local breweries",
      "vendor": "Local Brewer Showcase (Near the Court of Honor State)",
      "description": null
    },
    {
      "id": "millies-pierogi-millies-masterpiece",
      "name": "Millie’s Masterpiece",
      "vendor": "Millie’s Pierogi",
      "description": null
    },
    {
      "id": "millies-pierogi-pierogi",
      "name": "Pierogi",
      "vendor": "Millie’s Pierogi",
      "description": null
    },
    {
      "id": "pickle-barrel-pickles",
      "name": "Pickles",
      "vendor": "Pickle Barrel",
      "description": null
    },
    {
      "id": "pickle-barrel-apple-cider",
      "name": "Apple Cider",
      "vendor": "Pickle Barrel",
      "description": null
    },
    {
      "id": "poppies-belgian-waffles-fried-cheesecake",
      "name": "Fried Cheesecake",
      "vendor": "Poppie’s Belgian Waffles",
      "description": null
    },
    {
      "id": "poppies-belgian-waffles-belgian-waffles",
      "name": "Belgian Waffles",
      "vendor": "Poppie’s Belgian Waffles",
      "description": null
    },
    {
      "id": "poppies-belgian-waffles-corn-dogs",
      "name": "Corn Dogs",
      "vendor": "Poppie’s Belgian Waffles",
      "description": null
    },
    {
      "id": "poppies-belgian-waffles-fried-twinkies",
      "name": "Fried Twinkies",
      "vendor": "Poppie’s Belgian Waffles",
      "description": null
    },
    {
      "id": "poppies-belgian-waffles-dubai-waffle",
      "name": "Dubai Waffle",
      "vendor": "Poppie’s Belgian Waffles",
      "description": null
    },
    {
      "id": "porky-bbq-sundae",
      "name": "BBQ Sundae",
      "vendor": "Porky’s",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "porky-pulled-pork",
      "name": "Pulled Pork",
      "vendor": "Porky’s",
      "description": null
    },
    {
      "id": "porky-giant-turkey-legs",
      "name": "Giant Turkey Legs",
      "vendor": "Porky’s",
      "description": null
    },
    {
      "id": "porky-bbq-brisket-sandwich",
      "name": "BBQ Brisket Sandwich",
      "vendor": "Porky’s",
      "description": null
    },
    {
      "id": "porky-bbq-split",
      "name": "BBQ Split",
      "vendor": "Porky’s",
      "description": null
    },
    {
      "id": "porky-mac-cheese",
      "name": "Mac & Cheese",
      "vendor": "Porky’s",
      "description": null
    },
    {
      "id": "porky-hambo-sandwich",
      "name": "Hambo Sandwich",
      "vendor": "Porky’s",
      "description": null
    },
    {
      "id": "reds-red-apples-gourmet-apples",
      "name": "Gourmet Apples",
      "vendor": "Red’s Red Apples",
      "description": null
    },
    {
      "id": "reds-red-apples-caramel-apples",
      "name": "Caramel Apples",
      "vendor": "Red’s Red Apples",
      "description": null
    },
    {
      "id": "reds-red-apples-candy-apples",
      "name": "Candy Apples",
      "vendor": "Red’s Red Apples",
      "description": null
    },
    {
      "id": "reds-red-apples-caramel-corn",
      "name": "Caramel Corn",
      "vendor": "Red’s Red Apples",
      "description": null
    },
    {
      "id": "reds-red-apples-cotton-candy",
      "name": "Cotton Candy",
      "vendor": "Red’s Red Apples",
      "description": null
    },
    {
      "id": "roasted-corn-in-a-cup-flamin-hot-cheetos-corn",
      "name": "Flamin’ Hot Cheetos Corn",
      "vendor": "Roasted Corn in a Cup",
      "description": null
    },
    {
      "id": "roasted-corn-in-a-cup-parmesan-corn",
      "name": "Parmesan Corn",
      "vendor": "Roasted Corn in a Cup",
      "description": null
    },
    {
      "id": "roasted-corn-in-a-cup-mexican-style-corn",
      "name": "Mexican Style Corn",
      "vendor": "Roasted Corn in a Cup",
      "description": null
    },
    {
      "id": "schroders-cheese-curds-cheese-curds",
      "name": "Cheese Curds",
      "vendor": "Schroder’s Cheese Curds",
      "description": null
    },
    {
      "id": "tootsies-fried-dough-fried-oreos",
      "name": "Fried Oreos",
      "vendor": "Tootsie’s Fried Dough",
      "description": null
    },
    {
      "id": "tootsies-fried-dough-dough-nuggets",
      "name": "Dough Nuggets",
      "vendor": "Tootsie’s Fried Dough",
      "description": null
    },
    {
      "id": "tootsies-fried-dough-fried-candy-bars",
      "name": "Fried Candy Bars",
      "vendor": "Tootsie’s Fried Dough",
      "description": null
    },
    {
      "id": "veggie-patch-frozen-cheesecakes",
      "name": "Frozen Cheesecakes",
      "vendor": "Veggie Patch",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "veggie-patch-frozen-banana",
      "name": "Frozen Banana",
      "vendor": "Veggie Patch",
      "description": null
    },
    {
      "id": "veggie-patch-cheesesteak-eggroll",
      "name": "Cheesesteak Eggroll",
      "vendor": "Veggie Patch",
      "description": null
    },
    {
      "id": "veggie-patch-deep-fried-pickles",
      "name": "Deep-fried Pickles",
      "vendor": "Veggie Patch",
      "description": null
    },
    {
      "id": "veggie-patch-vegetable-tempura",
      "name": "Vegetable Tempura",
      "vendor": "Veggie Patch",
      "description": null
    },
    {
      "id": "veggie-patch-tempura-plate",
      "name": "Tempura Plate",
      "vendor": "Veggie Patch"
    },
    {
      "id": "veggie-patch-buffalo-cauliflower-wings",
      "name": "Buffalo Cauliflower Wings",
      "vendor": "Veggie Patch",
      "description": null
    },
    {
      "id": "wings-n-fries-buffalo-chicken-eggroll",
      "name": "Buffalo Chicken Eggroll",
      "vendor": "Wings-N-Fries",
      "description": null
    },
    {
      "id": "wings-n-fries-chicken-waffle-on-a-stick",
      "name": "Chicken Waffle on a Stick",
      "vendor": "Wings-N-Fries",
      "description": null
    },
    {
      "id": "wings-n-fries-poutine",
      "name": "Poutine",
      "vendor": "Wings-N-Fries",
      "description": null
    },
    {
      "id": "wings-n-fries-roasted-corn-on-the-cob",
      "name": "Roasted Corn on the Cob",
      "vendor": "Wings-N-Fries",
      "description": null
    },
    {
      "id": "wurst-haus-german-giant-10-inch-bratwurst",
      "name": "German Giant 10-inch Bratwurst",
      "vendor": "Wurst Haus",
      "description": null
    },
    {
      "id": "wurst-haus-beer-boot",
      "name": "Beer Boot",
      "vendor": "Wurst Haus",
      "description": null
    },
    {
      "id": "wurst-haus-the-mighty-pretzel",
      "name": "The Mighty Pretzel",
      "vendor": "Wurst Haus",
      "description": null
    },
    {
      "id": "wurst-haus-porky-pretzel-bites",
      "name": "Porky Pretzel Bites",
      "vendor": "Wurst Haus",
      "description": null
    },
    {
      "id": "wurst-haus-gebraten-potato-pancakes",
      "name": "Gebraten Potato Pancakes",
      "vendor": "Wurst Haus",
      "description": null
    }
  ]
},
{
  "id": "food-court",
  "name": "Food Court",
  "description": "The Food Court is a changeup from the rest of the fair. Instead of long roads, this is a dense cluster of wonderful food vendors that also has some nice seating and shade. If you need a break from walking all day, this is a good destination.",
  "foods": [
    {
      "id": "big-e-cream-puff-bakery-big-e-cream-puff",
      "name": "Big E Cream Puff",
      "vendor": "Big E Cream Puff Bakery",
      "description": null
    },
    {
      "id": "big-e-cream-puff-bakery-big-e-clair",
      "name": "Big E-Clair",
      "vendor": "Big E Cream Puff Bakery",
      "description": null
    },
    {
      "id": "big-e-cream-puff-bakery-espresso-cream-puff",
      "name": "Espresso Cream Puff",
      "vendor": "Big E Cream Puff Bakery",
      "description": null
    },
    {
      "id": "calabrese-market-paninis",
      "name": "Paninis",
      "vendor": "Calabrese Market",
      "description": null
    },
    {
      "id": "calabrese-market-cucumber-salads",
      "name": "Cucumber Salads",
      "vendor": "Calabrese Market",
      "description": null
    },
    {
      "id": "calabrese-market-pasta-salads",
      "name": "Pasta Salads",
      "vendor": "Calabrese Market",
      "description": null
    },
    {
      "id": "calabrese-market-caprese-salads",
      "name": "Caprese Salads",
      "vendor": "Calabrese Market",
      "description": null
    },
    {
      "id": "cannoli-king-cannoli-dip",
      "name": "Cannoli Dip",
      "vendor": "Cannoli King",
      "description": null
    },
    {
      "id": "cannoli-king-cannoli-donut",
      "name": "Cannoli Donut",
      "vendor": "Cannoli King",
      "description": null
    },
    {
      "id": "cannoli-king-cannoli-cake-bomb",
      "name": "Cannoli Cake Bomb",
      "vendor": "Cannoli King",
      "description": null
    },
    {
      "id": "the-clam-box-clam-chowder-in-a-bread-bowl",
      "name": "Clam Chowder in a Bread Bowl",
      "vendor": "The Clam Box",
      "description": null
    },
    {
      "id": "the-clam-box-fried-seafood",
      "name": "Fried Seafood",
      "vendor": "The Clam Box",
      "description": null
    },
    {
      "id": "the-clam-box-shrimp-tacos",
      "name": "Shrimp Tacos",
      "vendor": "The Clam Box",
      "description": null
    },
    {
      "id": "the-clam-box-whole-belly-clams",
      "name": "Whole Belly Clams",
      "vendor": "The Clam Box",
      "description": null
    },
    {
      "id": "the-clam-box-clam-fritter-doughnut",
      "name": "Clam Fritter Doughnut",
      "vendor": "The Clam Box",
      "description": null
    },
    {
      "id": "the-clam-box-oyster-tacos",
      "name": "Oyster Tacos",
      "vendor": "The Clam Box",
      "description": null
    },
    {
      "id": "the-clam-box-beer",
      "name": "Beer",
      "vendor": "The Clam Box",
      "description": null
    },
    {
      "id": "ebs-food-for-fun-fried-shepherds-pie",
      "name": "Fried Shepherd’s Pie",
      "vendor": "EB’s Food For Fun",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "ebs-food-for-fun-fried-mac-cheese",
      "name": "Fried Mac & Cheese",
      "vendor": "EB’s Food For Fun",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "ebs-food-for-fun-fried-mac-cheese-balls-bacon",
      "name": "Fried Mac & Cheese Balls w/ Bacon",
      "vendor": "EB’s Food For Fun"
    },
    {
      "id": "hofbrauhaus-oktoberfest-biergarten-bratwurst-in-a-blanket",
      "name": "Bratwurst in a Blanket",
      "vendor": "Hofbrauhaus Oktoberfest Biergarten",
      "description": null
    },
    {
      "id": "hofbrauhaus-oktoberfest-biergarten-potato-pancakes",
      "name": "Potato Pancakes",
      "vendor": "Hofbrauhaus Oktoberfest Biergarten",
      "description": null
    },
    {
      "id": "hofbrauhaus-oktoberfest-biergarten-fried-camembert-cheese",
      "name": "Fried Camembert Cheese",
      "vendor": "Hofbrauhaus Oktoberfest Biergarten"
    },
    {
      "id": "hofbrauhaus-oktoberfest-biergarten-pork-chops",
      "name": "Pork Chops",
      "vendor": "Hofbrauhaus Oktoberfest Biergarten",
      "description": null
    },
    {
      "id": "hofbrauhaus-oktoberfest-biergarten-home-made-pretzels",
      "name": "Home-Made Pretzels",
      "vendor": "Hofbrauhaus Oktoberfest Biergarten",
      "description": null
    },
    {
      "id": "hofbrauhaus-oktoberfest-biergarten-fried-spatzle-with-cheese-sauce",
      "name": "Fried Spätzle with Cheese Sauce",
      "vendor": "Hofbrauhaus Oktoberfest Biergarten",
      "description": null
    },
    {
      "id": "the-indian-restaurant-chicken-tikka-masala",
      "name": "Chicken Tikka Masala",
      "vendor": "The Indian Restaurant",
      "description": null
    },
    {
      "id": "the-indian-restaurant-naan-bread",
      "name": "Naan Bread",
      "vendor": "The Indian Restaurant",
      "description": null
    },
    {
      "id": "the-indian-restaurant-mix-parathas",
      "name": "Mix Parathas (Sweet and savory crepes)",
      "vendor": "The Indian Restaurant",
      "description": null
    },
    {
      "id": "las-kangris-food-truck-yellow-rice-with-pigeon-peas",
      "name": "Yellow Rice with Pigeon Peas",
      "vendor": "Las Kangris Food Truck",
      "description": null
    },
    {
      "id": "las-kangris-food-truck-baked-pork",
      "name": "Baked Pork",
      "vendor": "Las Kangris Food Truck",
      "description": null
    },
    {
      "id": "las-kangris-food-truck-baked-chicken",
      "name": "Baked Chicken",
      "vendor": "Las Kangris Food Truck",
      "description": null
    },
    {
      "id": "las-kangris-food-truck-green-bananas-al-mojo",
      "name": "Green Bananas “al mojo,”",
      "vendor": "Las Kangris Food Truck",
      "description": null
    },
    {
      "id": "las-kangris-food-truck-tres-leches-cake",
      "name": "Tres Leches Cake",
      "vendor": "Las Kangris Food Truck",
      "description": null
    },
    {
      "id": "top-the-crust-pizza",
      "name": "Pizza",
      "vendor": "Top The Crust",
      "description": null
    },
    {
      "id": "top-the-crust-dessert-pizza",
      "name": "Dessert Pizza",
      "vendor": "Top The Crust",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "white-hut-burgers",
      "name": "Burgers",
      "vendor": "White Hut",
      "description": null
    },
    {
      "id": "white-hut-fries",
      "name": "Fries",
      "vendor": "White Hut",
      "description": null
    },
    {
      "id": "white-hut-chicken-tenders",
      "name": "Chicken Tenders",
      "vendor": "White Hut",
      "description": null
    },
    {
      "id": "white-hut-quadfather-burger",
      "name": "Quadfather Burger",
      "vendor": "White Hut",
      "isRecommended": true,
      "description": null
    },
    {
      "id": "white-hut-two-foot-chili-cheese-dog",
      "name": "Two-foot Chili Cheese Dog",
      "vendor": "White Hut",
      "description": null
    },
    {
      "id": "the-ultimate-bbq-3-pigs-in-a-bun",
      "name": "3 Pigs in a Bun",
      "vendor": "The Ultimate BBQ",
      "description": null
    },
    {
      "id": "the-ultimate-bbq-choco-baco-frenzy",
      "name": "Choco-Baco Frenzy",
      "vendor": "The Ultimate BBQ",
      "description": null
    },
    {
      "id": "the-ultimate-bbq-pulled-pork-mac-cheese",
      "name": "Pulled Pork Mac & Cheese",
      "vendor": "The Ultimate BBQ",
      "description": null
    },
    {
      "id": "the-ultimate-bbq-chocolate-dipped-bacon",
      "name": "Chocolate-Dipped Bacon",
      "vendor": "The Ultimate BBQ",
      "description": null
    },
    {
      "id": "the-ultimate-bbq-ultimate-cowboy-nachos",
      "name": "Ultimate Cowboy Nachos",
      "vendor": "The Ultimate BBQ",
      "description": null
    },
    {
      "id": "the-ultimate-bbq-bbq-waffles",
      "name": "BBQ Waffles",
      "vendor": "The Ultimate BBQ",
      "description": null
    },
    {
      "id": "the-ultimate-bbq-mac-cheese-waffles",
      "name": "Mac & Cheese Waffles",
      "vendor": "The Ultimate BBQ",
      "description": null
    }
  ]
},
{
  "id": "avenue-of-states",
  "name": "Avenue of States",
  "description": "This is the main road through the back part of the fair — and probably the easiest road to recognize. This is the road that has buildings modeled after the state houses of all six New England states. While the state buildings are some of The Big E’s best destinations, don’t overlook the Avenue of States itself. It has some great places to stop for food and drinks. It also has the fair’s lone sit-down restaurant, Storrowton Tavern & Carriage House, which is open year-round.",
  "foods": [
    {
      "id": "new-england-craft-beer-pub-beer-a-misu",
      "name": "Beer-a-Misu",
      "vendor": "New England Craft Beer Pub",
      "isRecommended": true
    },
    {
      "id": "new-england-craft-beer-pub-turducken-sandwich",
      "name": "Turducken Sandwich",
      "vendor": "New England Craft Beer Pub",
      "isRecommended": true
    },
    {
      "id": "new-england-craft-beer-pub-thanksgiving-nachos",
      "name": "Thanksgiving Nachos",
      "vendor": "New England Craft Beer Pub",
      "isRecommended": true
    },
    {
      "id": "new-england-craft-beer-pub-pork-belly-lollipops",
      "name": "Pork Belly Lollipops",
      "vendor": "New England Craft Beer Pub"
    },
    {
      "id": "new-england-craft-beer-pub-lobster-mac-cheese",
      "name": "Lobster Mac & Cheese",
      "vendor": "New England Craft Beer Pub"
    },
    {
      "id": "new-england-craft-beer-pub-pulled-pork-popover",
      "name": "Pulled Pork-stuffed Popover",
      "vendor": "New England Craft Beer Pub"
    },
    {
      "id": "new-england-craft-beer-pub-craft-beer",
      "name": "Craft Beer",
      "vendor": "New England Craft Beer Pub"
    },
    {
      "id": "sam-adams-beer-garden-cider-glazed-pulled-pork-grilled-cheese",
      "name": "Cider-Glazed Pulled Pork Grilled Cheese",
      "vendor": "Sam Adams Beer Garden",
      "isRecommended": true
    },
    {
      "id": "sam-adams-beer-garden-pizza",
      "name": "Pizza",
      "vendor": "Sam Adams Beer Garden"
    },
    {
      "id": "sam-adams-beer-garden-grande-nachos",
      "name": "Grande Nachos",
      "vendor": "Sam Adams Beer Garden"
    },
    {
      "id": "sam-adams-beer-garden-general-tsos-pizza",
      "name": "General Tsos Pizza",
      "vendor": "Sam Adams Beer Garden"
    },
    {
      "id": "storrowton-soup-shack-soups",
      "name": "Soups",
      "vendor": "Storrowton Soup Shack"
    },
    {
      "id": "storrowton-soup-shack-chowder",
      "name": "Chowder",
      "vendor": "Storrowton Soup Shack"
    },
    {
      "id": "storrowton-soup-shack-mac-cheese",
      "name": "Mac & Cheese",
      "vendor": "Storrowton Soup Shack"
    },
    {
      "id": "storrowton-soup-shack-bread-bowls",
      "name": "Bread Bowls",
      "vendor": "Storrowton Soup Shack"
    },
    {
      "id": "storrowton-tavern-ice-cream-cake-ball",
      "name": "Ice Cream Cake Ball",
      "vendor": "Storrowton Tavern & Carriage House",
      "isRecommended": true
    },
    {
      "id": "storrowton-tavern-dessert-ball",
      "name": "Dessert Ball",
      "vendor": "Storrowton Tavern & Carriage House"
    },
    {
      "id": "storrowton-tavern-full-lunch-dinner-menu",
      "name": "Full Lunch/Dinner Menu",
      "vendor": "Storrowton Tavern & Carriage House"
    }
  ]
},
{
  "id": "craft-common",
  "name": "Craft Common",
  "description": "The Craft Common has always been a part of the fair, representing one of The Big E’s few green spaces. But it’s historically been limited to mostly shops. This year, Steaming Tender is moving in and bringing its legendary bread pudding. It might be one of the most purely delicious foods at the fair. Meanwhile, the Craft Common also has additional locations for Ferrindino Maple and Pioneer Valley Poppers. It also gives visitors a rare chance to take a break under some trees and touch some grass.",
  "foods": [
    {
      "id": "steaming-tender-bread-pudding",
      "name": "Bread Pudding",
      "vendor": "Steaming Tender",
      "isRecommended": true
    },
    {
      "id": "ferrindino-maple-bacon-hot-dog",
      "name": "Ferrindino Maple Bacon Hot Dog",
      "vendor": "Ferrindino Maple"
    },
    {
      "id": "ferrindino-maple-creemee-sundae",
      "name": "Maple Creemee Sundae",
      "vendor": "Ferrindino Maple"
    },
    {
      "id": "ferrindino-maple-creemee-latte",
      "name": "Maple Creemee Latte",
      "vendor": "Ferrindino Maple"
    },
    {
      "id": "pioneer-valley-poppers-kettle-corn",
      "name": "Kettle Corn",
      "vendor": "Pioneer Valley Poppers"
    },
    {
      "id": "pioneer-valley-poppers-lemonade",
      "name": "Lemonade",
      "vendor": "Pioneer Valley Poppers"
    }
  ]
},
{
  "id": "east-road",
  "name": "East Road",
  "description": "East Road is a key connecting road that passes by the Mallory Complex (the building with the farm animals) and the Midway before passing by the Food Court. It also loops around the Young Building. If you walk around long enough, you’ll probably find yourself on East Road. While you’re here, you might as well get something to eat. East Road has undergone changes this year. The Deviled Egg is not at the fair, while Mr. Pickle moved to Springfield Road. Meanwhile, Macho Taco and Apple Fries are now located here.",
  "foods": [
    {
      "id": "annas-fried-dough-doughco",
      "name": "“Doughco” (Fried Dough Taco)",
      "vendor": "Anna’s Fried Dough",
      "isRecommended": true
    },
    {
      "id": "jims-deep-fried-tacos-bbq-brisket-mac",
      "name": "Deep-Fried BBQ Brisket Mac Tacos",
      "vendor": "Jim’s Deep-Fried Tacos",
      "isRecommended": true
    },
    {
      "id": "macho-taco-empanada-tacos",
      "name": "Empanada Tacos",
      "vendor": "Macho Taco",
      "isRecommended": true
    },
    {
      "id": "annas-fried-dough-fried-dough",
      "name": "Fried Dough",
      "vendor": "Anna’s Fried Dough"
    },
    {
      "id": "annas-fried-dough-fried-dough-bites",
      "name": "Fried Dough Bites",
      "vendor": "Anna’s Fried Dough"
    },
    {
      "id": "apple-fries-jolly-ranchers-slush",
      "name": "Jolly Ranchers Extreme Slush",
      "vendor": "Apple Fries"
    },
    {
      "id": "apple-fries-apple-fries",
      "name": "Apple Fries",
      "vendor": "Apple Fries"
    },
    {
      "id": "apple-fries-bacon-caramel-apple-fries",
      "name": "Bacon Caramel Apple Fries",
      "vendor": "Apple Fries"
    },
    {
      "id": "apple-fries-apple-fry-sundaes",
      "name": "Apple Fry Sundaes",
      "vendor": "Apple Fries"
    },
    {
      "id": "athletic-brewing-non-alcoholic-beers",
      "name": "Non-alcoholic Beers",
      "vendor": "Athletic Brewing"
    },
    {
      "id": "bacon-bomb-bacon-wrapped-burger",
      "name": "Bacon-wrapped Burger with BBQ Sauce",
      "vendor": "Bacon Bomb"
    },
    {
      "id": "bunis-cinnamon-rolls-gourmet",
      "name": "Gourmet Cinnamon Rolls",
      "vendor": "Buni’s Cinnamon Rolls"
    },
    {
      "id": "bunis-cinnamon-rolls-sundaes",
      "name": "Cinnamon Roll Sundaes",
      "vendor": "Buni’s Cinnamon Rolls"
    },
    {
      "id": "hot-fresh-mini-donuts",
      "name": "Mini Donuts",
      "vendor": "Hot & Fresh Mini Donuts"
    },
    {
      "id": "jims-deep-fried-tacos-general",
      "name": "Deep-Fried Tacos (varieties including Pot Roast Sundae & Buffalo Chicken)",
      "vendor": "Jim’s Deep-Fried Tacos"
    },
    {
      "id": "macho-taco-birria-tacos",
      "name": "Birria Tacos",
      "vendor": "Macho Taco"
    },
    {
      "id": "macho-taco-al-pastor-tacos",
      "name": "Al Pastor Tacos",
      "vendor": "Macho Taco"
    },
    {
      "id": "macho-taco-fried-stuffed-pepper",
      "name": "Fried Stuffed Pepper",
      "vendor": "Macho Taco"
    },
    {
      "id": "mini-donut-express-bag",
      "name": "Mini Donuts by the Bag",
      "vendor": "Mini Donut Express"
    },
    {
      "id": "sassys-sweet-potatoes-loaded",
      "name": "Loaded Potatoes",
      "vendor": "Sassy’s Sweet Potatoes"
    },
    {
      "id": "sassys-sweet-potatoes-mac-cheese",
      "name": "Mac & Cheese Potatoes",
      "vendor": "Sassy’s Sweet Potatoes"
    },
    {
      "id": "sassys-sweet-potatoes-smores",
      "name": "S’mores Potatoes",
      "vendor": "Sassy’s Sweet Potatoes"
    }
  ]
},
{
  "id": "west-road",
  "name": "West Road",
  "description": "West Road is the wide-open connecting road leading to the back part of the fair. It runs between the Midway and the Coliseum before ending at The Big E Arena.",
  "foods": [
    {
      "id": "giant-corn-dog-factory-dilly-dilly-dog",
      "name": "Dilly Dilly Dog",
      "vendor": "Giant Corn Dog Factory",
      "isRecommended": true
    },
    {
      "id": "west-springfield-lions-club-flatliner-burger",
      "name": "Flatliner Burger",
      "vendor": "West Springfield Lions Club",
      "isRecommended": true
    },
    {
      "id": "agawam-lions-club-bacon-mac-cone",
      "name": "Bacon Mac & Cheese in a Cone",
      "vendor": "Agawam Lions Club",
      "isRecommended": true
    },
    {
      "id": "agawam-lions-club-bbq",
      "name": "BBQ",
      "vendor": "Agawam Lions Club"
    },
    {
      "id": "agawam-lions-club-chicken-dinner",
      "name": "Chicken Dinner",
      "vendor": "Agawam Lions Club"
    },
    {
      "id": "agawam-lions-club-pulled-bbq-chicken-sandwich",
      "name": "Pulled BBQ Chicken Sandwich",
      "vendor": "Agawam Lions Club"
    },
    {
      "id": "agawam-lions-club-all-in-a-cone",
      "name": "All-in-a-Cone (Meatball, Pulled Chicken, Shepherd’s Pie)",
      "vendor": "Agawam Lions Club"
    },
    {
      "id": "ann-maries-candies-general",
      "name": "Candies, Fudge, Nuts",
      "vendor": "Ann Marie’s Candies"
    },
    {
      "id": "big-kahunas-gyros",
      "name": "Gyros",
      "vendor": "Big Kahuna’s"
    },
    {
      "id": "big-kahunas-dorito-gyro",
      "name": "Dorito Gyro",
      "vendor": "Big Kahuna’s"
    },
    {
      "id": "big-kahunas-falafel",
      "name": "Falafel",
      "vendor": "Big Kahuna’s"
    },
    {
      "id": "big-kahunas-gluten-friendly",
      "name": "Gluten-Friendly Options",
      "vendor": "Big Kahuna’s"
    },
    {
      "id": "big-kahunas-dr-pepper-pickle-juice",
      "name": "Dr. Pepper Pickle Juice",
      "vendor": "Big Kahuna’s"
    },
    {
      "id": "cotton-candy-stall-tajin-apples",
      "name": "Tajin Candy Apples",
      "vendor": "Cotton Candy Stall"
    },
    {
      "id": "fried-factory-blooming-onion",
      "name": "Blooming Onion",
      "vendor": "Fried Factory"
    },
    {
      "id": "fried-factory-chicken-fries-buckets",
      "name": "Chicken Strips/Fries Buckets",
      "vendor": "Fried Factory"
    },
    {
      "id": "fried-factory-spiral-spuds",
      "name": "Spiral Spuds",
      "vendor": "Fried Factory"
    },
    {
      "id": "giant-corn-dog-factory-giant-corn-dogs",
      "name": "Giant Corn Dogs",
      "vendor": "Giant Corn Dog Factory"
    },
    {
      "id": "giant-corn-dog-factory-korean-dog",
      "name": "Korean Dog",
      "vendor": "Giant Corn Dog Factory"
    },
    {
      "id": "giant-corn-dog-factory-elote-dog",
      "name": "Elote Corn Dog",
      "vendor": "Giant Corn Dog Factory"
    },
    {
      "id": "moolicious-ice-cream",
      "name": "Ice Cream",
      "vendor": "Moolicious"
    },
    {
      "id": "moolicious-sundaes",
      "name": "Sundaes",
      "vendor": "Moolicious"
    },
    {
      "id": "moolicious-floats",
      "name": "Floats",
      "vendor": "Moolicious"
    },
    {
      "id": "moolicious-moonut",
      "name": "Moo-nut",
      "vendor": "Moolicious"
    },
    {
      "id": "moolicious-moo-bomb",
      "name": "Moo Bomb",
      "vendor": "Moolicious"
    },
    {
      "id": "moolicious-cornbread-sundae",
      "name": "Cornbread Sundae",
      "vendor": "Moolicious"
    },
    {
      "id": "opa-opa-saloon-draft-beer",
      "name": "Local Draft Beer",
      "vendor": "Opa Opa Saloon"
    },
    {
      "id": "pickle-barrel-sirloin-tips",
      "name": "Sirloin Tips",
      "vendor": "Pickle Barrel Sirloin Tips"
    },
    {
      "id": "pickle-barrel-sirloin-pita",
      "name": "Sirloin Pita",
      "vendor": "Pickle Barrel Sirloin Tips"
    },
    {
      "id": "pig-park-bbq-sandwiches",
      "name": "BBQ Sandwiches",
      "vendor": "Pig Park BBQ"
    },
    {
      "id": "pig-park-bbq-memphis-ribs",
      "name": "Memphis Ribs",
      "vendor": "Pig Park BBQ"
    },
    {
      "id": "pig-park-bbq-bbq-bowls",
      "name": "BBQ Bowls",
      "vendor": "Pig Park BBQ"
    },
    {
      "id": "pig-park-bbq-the-bomb-nachos",
      "name": "“The Bomb” Nachos",
      "vendor": "Pig Park BBQ"
    },
    {
      "id": "west-springfield-lions-club-burgers",
      "name": "Burgers",
      "vendor": "West Springfield Lions Club"
    },
    {
      "id": "west-springfield-lions-club-grilled-cheese",
      "name": "Grilled Cheese",
      "vendor": "West Springfield Lions Club"
    },
    {
      "id": "west-springfield-lions-club-reubens",
      "name": "Reubens",
      "vendor": "West Springfield Lions Club"
    },
    {
      "id": "west-springfield-lions-club-reuben-burger",
      "name": "Reuben Burger",
      "vendor": "West Springfield Lions Club"
    },
    {
      "id": "yankee-boy-lobster-tots",
      "name": "Tots topped with Lobster",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-bbq-ribs",
      "name": "BBQ Ribs",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-mac-cheese",
      "name": "Mac & Cheese",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-lobster-dinners",
      "name": "Lobster Dinners",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-exotic-burgers",
      "name": "Exotic Meat Burgers",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-lobster-nachos",
      "name": "Lobster Nachos",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-lobster-volcano",
      "name": "Lobster Volcano",
      "vendor": "Yankee Boy/International Lobster House"
    }
  ]
},
{
  "id": "springfield-road",
  "name": "Springfield Road",
  "description": "Springfield Road can be easy to miss if you’re not looking for it. Just keep an eye out for the big yellow slide. This road, which is the entry point for Gate 7, has some of the most popular vendors at the fair, including the main location for Moolicious. This year, they have MooNugs, which are little handheld ice cream treats that look like chicken nuggets and come with dipping sauce. There are also some changes this year: Waffulicious did not return, while The Broccoli Bar and Mr. Pickle have moved in. Finally, Ferrindino Maple’s main stand has moved inside the Better Living Center.",
  "foods": [
    {
      "id": "moolicious-moonugs",
      "name": "MooNugs",
      "vendor": "Moolicious",
      "isRecommended": true
    },
    {
      "id": "moolicious-cornbread-sundae",
      "name": "Cornbread Sundae",
      "vendor": "Moolicious",
      "isRecommended": true
    },
    {
      "id": "sweet-salty-butterbeer",
      "name": "Butterbeer",
      "vendor": "Sweet & Salty",
      "isRecommended": true
    },
    {
      "id": "broccoli-bar-big-sexy-platter",
      "name": "The Big Sexy Platter",
      "vendor": "The Broccoli Bar",
      "isRecommended": true
    },
    {
      "id": "all-american-craft-beer-sliders",
      "name": "Specialty Sliders",
      "vendor": "All-American Craft Beer Bar & Grill"
    },
    {
      "id": "all-american-craft-beer-big-mick-e",
      "name": "The Big Mick “E”",
      "vendor": "All-American Craft Beer Bar & Grill"
    },
    {
      "id": "all-american-craft-beer-loaded-fries",
      "name": "Loaded Fries",
      "vendor": "All-American Craft Beer Bar & Grill"
    },
    {
      "id": "all-american-craft-beer-polish-bomb",
      "name": "Polish “Bomb”",
      "vendor": "All-American Craft Beer Bar & Grill"
    },
    {
      "id": "broccoli-bar-tempura",
      "name": "Tempura",
      "vendor": "The Broccoli Bar"
    },
    {
      "id": "broccoli-bar-dumplings",
      "name": "Dumplings",
      "vendor": "The Broccoli Bar"
    },
    {
      "id": "dr-vegetable-corn-dogs",
      "name": "Corn Dogs",
      "vendor": "Dr. Vegetable"
    },
    {
      "id": "dr-vegetable-fried-veggies",
      "name": "Fried Veggies",
      "vendor": "Dr. Vegetable"
    },
    {
      "id": "dr-vegetable-onion-rings",
      "name": "Onion Rings",
      "vendor": "Dr. Vegetable"
    },
    {
      "id": "dr-vegetable-mozzarella-sticks",
      "name": "Mozzarella Sticks",
      "vendor": "Dr. Vegetable"
    },
    {
      "id": "moolicious-moonut",
      "name": "Moo-nut",
      "vendor": "Moolicious"
    },
    {
      "id": "mr-pickle-fried-pickles",
      "name": "Fried Pickles",
      "vendor": "Mr. Pickle"
    },
    {
      "id": "mr-pickle-maple-bacon-corn-ribs",
      "name": "Maple Bacon Corn Ribs",
      "vendor": "Mr. Pickle"
    },
    {
      "id": "poutine-gourmet-classic",
      "name": "Classic Poutine",
      "vendor": "Poutine Gourmet"
    },
    {
      "id": "poutine-gourmet-pulled-pork",
      "name": "Pulled Pork Poutine",
      "vendor": "Poutine Gourmet"
    },
    {
      "id": "poutine-gourmet-chicken-bacon-ranch",
      "name": "Chicken Bacon Ranch Poutine",
      "vendor": "Poutine Gourmet"
    },
    {
      "id": "rudys-pizza-pizza",
      "name": "Pizza",
      "vendor": "Rudy’s Pizza"
    },
    {
      "id": "rudys-pizza-flaming-hot-cheeto-pickle",
      "name": "Flaming Hot Cheeto Pickle Pizza",
      "vendor": "Rudy’s Pizza"
    },
    {
      "id": "super-dog-6-inch",
      "name": "6-inch Dog-on-a-Stick",
      "vendor": "Super Dog"
    },
    {
      "id": "super-dog-12-inch",
      "name": "12-inch Super Dog",
      "vendor": "Super Dog"
    },
    {
      "id": "super-dog-18-inch",
      "name": "18-inch Mega Dog",
      "vendor": "Super Dog"
    },
    {
      "id": "sweet-salty-popcorn",
      "name": "Flavored Popcorn",
      "vendor": "Sweet & Salty"
    },
    {
      "id": "sweet-salty-pretzel-bites",
      "name": "Pretzel Bites",
      "vendor": "Sweet & Salty"
    },
    {
      "id": "sweet-salty-frozen-oreo",
      "name": "Frozen Oreo",
      "vendor": "Sweet & Salty"
    },
    {
      "id": "wisconsin-hot-cheese-monster-mozzarella",
      "name": "Monster Mozzarella",
      "vendor": "Wisconsin Hot Cheese"
    },
    {
      "id": "wisconsin-hot-cheese-cheddar-nuggets",
      "name": "Cheddar Nuggets",
      "vendor": "Wisconsin Hot Cheese"
    },
    {
      "id": "wisconsin-hot-cheese-mozzarella-fingers",
      "name": "Mozzarella Fingers",
      "vendor": "Wisconsin Hot Cheese"
    },
    {
      "id": "yankee-boy-lobster-tots",
      "name": "Tots topped with Lobster",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-bbq-ribs",
      "name": "BBQ Ribs",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-mac-cheese",
      "name": "Mac & Cheese",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-lobster-dinners",
      "name": "Lobster Dinners",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-exotic-burgers",
      "name": "Exotic Meat Burgers",
      "vendor": "Yankee Boy/International Lobster House"
    },
    {
      "id": "yankee-boy-lobster-nachos",
      "name": "Lobster Nachos",
      "vendor": "Yankee Boy/International Lobster House"
    }
  ]
},
{
  "id": "industrial-avenue",
  "name": "Industrial Avenue",
  "description": "Industrial Avenue is tucked between the Better Living Center and the main road. It’s also home to some of the biggest tents at the fair. For many, it’s the land of a thousand places to get a drink, with a stretch of about 100 yards where there seems to be about a dozen different spots serving drinks. A lot of them blend together, but it’s one of the liveliest stretches of the fair.",
  "foods": [
    {
      "id": "top-the-crust-mac-daddy-pizza",
      "name": "Mac Daddy Pizza",
      "vendor": "Top The Crust",
      "isRecommended": true
    },
    {
      "id": "anthonys-craft-corner-craft-beers",
      "name": "Craft Beers",
      "vendor": "Anthony’s Craft Corner"
    },
    {
      "id": "big-e-martini-bar-cocktails",
      "name": "Cocktails",
      "vendor": "Big E Martini Bar"
    },
    {
      "id": "deep-south-food-company-pizzas",
      "name": "Pizzas",
      "vendor": "Deep South Food Company"
    },
    {
      "id": "deep-south-food-company-beer-hall",
      "name": "Beer Hall",
      "vendor": "Deep South Food Company"
    },
    {
      "id": "deep-south-food-company-cocktails",
      "name": "Cocktails",
      "vendor": "Deep South Food Company"
    },
    {
      "id": "dollys-honky-tonk-beer-boot",
      "name": "Beer Boot",
      "vendor": "Dolly’s Honky Tonk"
    },
    {
      "id": "dollys-honky-tonk-cowboy-nachos",
      "name": "Cowboy Nachos topped with Pickled Eggs and Pickled Kielbasa",
      "vendor": "Dolly’s Honky Tonk"
    },
    {
      "id": "empanadas-savory",
      "name": "Savory Empanadas",
      "vendor": "Empanadas"
    },
    {
      "id": "empanadas-nutella",
      "name": "Nutella Empanadas",
      "vendor": "Empanadas"
    },
    {
      "id": "emmas-wine-garden-wine",
      "name": "Wine",
      "vendor": "Emma’s Wine Garden"
    },
    {
      "id": "jack-daniels-cocktails",
      "name": "Cocktails",
      "vendor": "Jack Daniels"
    },
    {
      "id": "mojito-bar-giant-mojitos",
      "name": "Giant Mojitos",
      "vendor": "Mojito Bar"
    },
    {
      "id": "mojito-bar-giant-margaritas",
      "name": "Giant Margaritas",
      "vendor": "Mojito Bar"
    },
    {
      "id": "mojito-bar-rum-buckets",
      "name": "Rum Buckets",
      "vendor": "Mojito Bar"
    },
    {
      "id": "olde-fashion-lemonade-refreshers",
      "name": "Lemonade Refreshers",
      "vendor": "Olde Fashion Lemonade"
    },
    {
      "id": "olde-fashion-lemonade-dubai-waffle",
      "name": "Dubai Waffle",
      "vendor": "Olde Fashion Lemonade"
    },
    {
      "id": "sangria-shack-blueberry-lemon-sangria",
      "name": "Blueberry Lemon Sangria",
      "vendor": "Sangria Shack"
    },
    {
      "id": "spiked-iced-coffee",
      "name": "Spiked Iced Coffee",
      "vendor": "Spiked Iced Coffee"
    },
    {
      "id": "top-the-crust-gourmet-pizzas",
      "name": "Gourmet Pizzas",
      "vendor": "Top The Crust"
    },
    {
      "id": "top-the-crust-crab-rangoon-pizza",
      "name": "Crab Rangoon Pizza",
      "vendor": "Top The Crust"
    },
    {
      "id": "wormtown-brewery-craft-beers",
      "name": "Craft Beers",
      "vendor": "Wormtown Brewery"
    }
  ]
},
{
  "id": "hampden-avenue",
  "name": "Hampden Avenue",
  "description": "Hampden Avenue runs between Gate 1 and the main plaza with the Court of Honor Stage. There aren’t as many food vendors here. Instead, you’ll find lots of shops and animal attractions. Still, there are some quality food and drink options here — especially coffee.",
  "foods": [
    {
      "id": "big-e-bakery-cream-puffs",
      "name": "Cream Puffs",
      "vendor": "Big E Bakery"
    },
    {
      "id": "big-e-bakery-eclairs",
      "name": "Eclairs",
      "vendor": "Big E Bakery"
    },
    {
      "id": "cinnamon-saloon-cinnamon-rolls",
      "name": "Cinnamon Rolls",
      "vendor": "Cinnamon Saloon"
    },
    {
      "id": "cinnamon-saloon-apple-crisp",
      "name": "Apple Crisp",
      "vendor": "Cinnamon Saloon"
    },
    {
      "id": "cinnamon-saloon-muffins",
      "name": "Muffins",
      "vendor": "Cinnamon Saloon"
    },
    {
      "id": "cinnamon-saloon-coffee",
      "name": "Coffee",
      "vendor": "Cinnamon Saloon"
    },
    {
      "id": "cinnamon-saloon-oreo-cookie-cinnamon-bun",
      "name": "Oreo Cookie Cinnamon Bun",
      "vendor": "Cinnamon Saloon"
    },
    {
      "id": "cinnamon-saloon-tie-dye-smoothie",
      "name": "Tie-Dye Smoothie",
      "vendor": "Cinnamon Saloon"
    },
    {
      "id": "koras-cookie-dough-stick-deep-fried",
      "name": "Deep-Fried Cookie Dough",
      "vendor": "Kora’s Cookie Dough on a Stick"
    },
    {
      "id": "koras-cookie-dough-stick-bacon-berry",
      "name": "Bacon Berry Cookie Dough",
      "vendor": "Kora’s Cookie Dough on a Stick"
    },
    {
      "id": "koras-cookie-dough-stick-sundae",
      "name": "Deep-Fried Cookie Dough Sundae",
      "vendor": "Kora’s Cookie Dough on a Stick"
    },
    {
      "id": "omar-gourmet-coffee-coffee",
      "name": "Coffee",
      "vendor": "Omar Gourmet Coffee"
    },
    {
      "id": "omar-gourmet-coffee-drinks",
      "name": "Drinks",
      "vendor": "Omar Gourmet Coffee"
    },
    {
      "id": "omar-gourmet-coffee-brownie-sundae",
      "name": "Brownie Sundae",
      "vendor": "Omar Gourmet Coffee"
    },
    {
      "id": "omar-gourmet-coffee-cinnamon-buns",
      "name": "Cinnamon Buns",
      "vendor": "Omar Gourmet Coffee"
    },
    {
      "id": "omar-gourmet-coffee-cookies",
      "name": "Cookies",
      "vendor": "Omar Gourmet Coffee"
    },
    {
      "id": "west-springfield-firehouse-egg-breakfast",
      "name": "Full Egg Breakfast",
      "vendor": "West Springfield Firehouse Restaurant"
    },
    {
      "id": "west-springfield-firehouse-breakfast-sandwiches",
      "name": "Breakfast Sandwiches",
      "vendor": "West Springfield Firehouse Restaurant"
    },
    {
      "id": "west-springfield-firehouse-deli-sandwiches",
      "name": "Deli Sandwiches",
      "vendor": "West Springfield Firehouse Restaurant"
    },
    {
      "id": "west-springfield-firehouse-chowder",
      "name": "Chowder",
      "vendor": "West Springfield Firehouse Restaurant"
    },
    {
      "id": "west-springfield-firehouse-burgers",
      "name": "Burgers",
      "vendor": "West Springfield Firehouse Restaurant"
    },
    {
      "id": "west-springfield-firehouse-hot-dogs",
      "name": "Hot Dogs",
      "vendor": "West Springfield Firehouse Restaurant"
    }
  ]
},
{
  "id": "young-building",
  "name": "Young Building",
  "description": "The Young Building, sometimes called the International Building, has large doors on each side that allow for easy access—though it’s easy to get turned around inside. It’s full of commercial vendors and has several bar setups. Instead of a speakeasy, the Young Building now features the Smoking Dragon Bar and a new Christmas-themed bar.",
  "foods": [
    {
      "id": "mick-express-cookie-croissant",
      "name": "Chocolate Chip Cookie Croissant",
      "vendor": "The Mick Express",
      "isRecommended": true
    },
    {
      "id": "crave-cafe-strawberry-dubai-cup",
      "name": "Strawberry Dubai Cup",
      "vendor": "Crave Cafe",
      "isRecommended": true
    },
    {
      "id": "smoking-dragon-bar-cocktails",
      "name": "Smoking Cocktails",
      "vendor": "The Smoking Dragon Bar",
      "isRecommended": true
    },
    {
      "id": "austrian-hideaway-craft-beers",
      "name": "Craft Beers",
      "vendor": "The Austrian Hideaway"
    },
    {
      "id": "crazy-boba-bubble-tea",
      "name": "Bubble Tea",
      "vendor": "Crazy Boba"
    },
    {
      "id": "crazy-boba-candied-strawberries",
      "name": "Candied Strawberries on a Stick",
      "vendor": "Crazy Boba"
    },
    {
      "id": "chocolate-moonshine-specialty-chocolates",
      "name": "Specialty Chocolates",
      "vendor": "Chocolate Moonshine"
    },
    {
      "id": "mick-express-polish-godfather",
      "name": "Polish Godfather Sandwich",
      "vendor": "The Mick Express"
    },
    {
      "id": "spirited-christmas-bar-cocktails",
      "name": "Holiday-themed Cocktails",
      "vendor": "The Spirited Christmas Bar"
    },
    {
      "id": "villa-of-lebanon-hummus",
      "name": "Hummus",
      "vendor": "Villa of Lebanon"
    },
    {
      "id": "villa-of-lebanon-meat-pies",
      "name": "Meat Pies",
      "vendor": "Villa of Lebanon"
    },
    {
      "id": "villa-of-lebanon-baklava",
      "name": "Baklava",
      "vendor": "Villa of Lebanon"
    },
    {
      "id": "villa-of-lebanon-kofta-kabobs",
      "name": "Kofta Kabobs",
      "vendor": "Villa of Lebanon"
    }
  ]
},
{
  "id": "better-living-center",
  "name": "Better Living Center",
  "description": "The Better Living Center, like the Young Building, is filled with commercial vendors. It’s also home to The Emporium, which serves the new and improved Craz-E Burger.",
  "foods": [
    {
      "id": "emporium-craz-e-burger",
      "name": "Craz-E Burger",
      "vendor": "The Emporium",
      "isRecommended": true
    },
    {
      "id": "emporium-spic-e-burger",
      "name": "Spic-E Burger",
      "vendor": "The Emporium",
      "isRecommended": true
    },
    {
      "id": "cantina-margarita-cotton-candy",
      "name": "Margarita topped with Cotton Candy",
      "vendor": "The Cantina",
      "isRecommended": true
    },
    {
      "id": "nook-strawberry-dubai-cup",
      "name": "Strawberry Dubai Cup",
      "vendor": "The Nook",
      "isRecommended": true
    },
    {
      "id": "ferrindino-maple-warm-apple-creemee-sundae",
      "name": "Warm Apple Maple Creemee Sundae",
      "vendor": "Ferrindino Maple",
      "isRecommended": true
    },
    {
      "id": "cantina-margarita",
      "name": "Margarita topped with Cotton Candy",
      "vendor": "The Cantina"
    },
    {
      "id": "dribbles-coffee",
      "name": "Coffee",
      "vendor": "Dribbles"
    },
    {
      "id": "dribbles-mini-doughnuts",
      "name": "Mini Doughnuts with Sauces",
      "vendor": "Dribbles"
    },
    {
      "id": "dribbles-sweet-crepes",
      "name": "Sweet Crepes",
      "vendor": "Dribbles"
    },
    {
      "id": "emporium-insanit-e-burger",
      "name": "Insanit-E Burger",
      "vendor": "The Emporium"
    },
    {
      "id": "ferrindino-maple-bacon-hot-dog",
      "name": "Ferrindino Maple Bacon Hot Dog",
      "vendor": "Ferrindino Maple"
    },
    {
      "id": "ferrindino-maple-creemee-sundae",
      "name": "Maple Creemee Sundae",
      "vendor": "Ferrindino Maple"
    },
    {
      "id": "ferrindino-maple-creemee-latte",
      "name": "Maple Creemee Latte",
      "vendor": "Ferrindino Maple"
    },
    {
      "id": "wine-loft-charcuterie",
      "name": "Charcuterie Boards",
      "vendor": "The Wine Loft"
    },
    {
      "id": "wine-loft-wine-flights",
      "name": "Wine Flights",
      "vendor": "The Wine Loft"
    }
  ]
},
{
  "id": "new-england-center",
  "name": "New England Center",
  "description": "The New England Center is the only place at the fair where you can watch Big E Cream Puffs being made. While there are multiple spots at the fair to buy them, this building is where the magic happens.",
  "foods": [
    {
      "id": "big-e-cream-puff-bakery-cream-puff",
      "name": "Big E Cream Puff",
      "vendor": "Big E Cream Puff Bakery",
      "isRecommended": true
    },
    {
      "id": "big-e-cream-puff-bakery-eclair",
      "name": "Big E-clair",
      "vendor": "Big E Cream Puff Bakery",
      "isRecommended": true
    },
    {
      "id": "big-e-cream-puff-bakery-espresso-cream-puff",
      "name": "Espresso Cream Puff",
      "vendor": "Big E Cream Puff Bakery",
      "isRecommended": true
    }
  ]
},
{
  "id": "state-buildings",
  "name": "State Buildings",
  "description": "The State Buildings are replicas of the actual state houses of New England, each filled with small businesses and associations representing their state. They feature unique foods and products, with some of the fair’s most iconic offerings.",
  "foods": [
    {
      "id": "rhode-island-dels-lemonade",
      "name": "Del’s Lemonade",
      "vendor": "Rhode Island",
      "isRecommended": true
    },
    {
      "id": "rhode-island-seafood-bread-bowl",
      "name": "Seafood (Quahogs or Chowder in a Bread Bowl)",
      "vendor": "Rhode Island",
      "isRecommended": true
    },
    {
      "id": "rhode-island-friskie-fries",
      "name": "Creative Fries",
      "vendor": "Friskie Fries (Rhode Island)",
      "isRecommended": true
    },
    {
      "id": "rhode-island-wrights-cookie-ice-cream-sandwich",
      "name": "Cookie Ice Cream Sandwich",
      "vendor": "Wright’s Dairy Farm (Rhode Island)",
      "isRecommended": true
    },
    {
      "id": "massachusetts-mackens-sliders",
      "name": "Specialty Sliders",
      "vendor": "Macken’s (Massachusetts)",
      "isRecommended": true
    },
    {
      "id": "massachusetts-valley-malt-beer-garden",
      "name": "Valley Malt Beer Garden Tap List (Dubai Chocolate Imperial Stout)",
      "vendor": "Valley Malt Beer Garden (Massachusetts)",
      "isRecommended": true
    },
    {
      "id": "vermont-cider",
      "name": "Cider",
      "vendor": "Vermont",
      "isRecommended": true
    },
    {
      "id": "vermont-pizza",
      "name": "Pizza",
      "vendor": "Vermont",
      "isRecommended": true
    },
    {
      "id": "vermont-desserts",
      "name": "Desserts",
      "vendor": "Vermont",
      "isRecommended": true
    },
    {
      "id": "vermont-ben-and-jerrys",
      "name": "Ben & Jerry’s (Special Location)",
      "vendor": "Ben & Jerry’s (Vermont)",
      "isRecommended": true
    },
    {
      "id": "vermont-marshmallow-smacarons",
      "name": "S’mores Macarons (S’Macarons)",
      "vendor": "Vermont Marshmallow Company",
      "isRecommended": true
    },
    {
      "id": "maine-baked-potato",
      "name": "Maine Baked Potato",
      "vendor": "Maine",
      "isRecommended": true
    },
    {
      "id": "maine-blueberry-treats",
      "name": "Blueberry Treats",
      "vendor": "Maine",
      "isRecommended": true
    },
    {
      "id": "connecticut-bears-smokehouse-bbq",
      "name": "BBQ",
      "vendor": "Bear’s Smokehouse (Connecticut)",
      "isRecommended": true
    },
    {
      "id": "new-hampshire-zacks-mac-attack",
      "name": "Mac N’ Cheese",
      "vendor": "Zack’s Mac Attack (New Hampshire)",
      "isRecommended": true
    },
    {
      "id": "new-hampshire-kettle-corn",
      "name": "Kettle Corn",
      "vendor": "New Hampshire Kettle Corn",
      "isRecommended": true
    }
  ]
}
];