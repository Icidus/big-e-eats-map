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
    id: "new-england-avenue",
    name: "New England Avenue",
    description: "Classic New England cuisine and regional specialties",
    foods: [
      { id: "1", name: "New England Clam Chowder", vendor: "Coastal Kitchen", price: "$8", description: "Creamy, hearty chowder with fresh clams", isRecommended: true },
      { id: "2", name: "Lobster Roll", vendor: "Maine Catch", price: "$18", description: "Fresh lobster in a toasted roll", isRecommended: true },
      { id: "3", name: "Apple Cider Donuts", vendor: "Orchard Fresh", price: "$6", description: "Warm, cinnamon-sugar donuts", isRecommended: true },
      { id: "4", name: "Maple Syrup Funnel Cake", vendor: "Sweet Treats", price: "$9", description: "Classic funnel cake with pure maple syrup" },
    ]
  },
  {
    id: "front-porch",
    name: "The Front Porch",
    description: "Home-style comfort food and traditional favorites",
    foods: [
      { id: "5", name: "BBQ Pulled Pork", vendor: "Porch BBQ", price: "$12", description: "Slow-cooked pork with tangy sauce", isRecommended: true },
      { id: "6", name: "Mac & Cheese", vendor: "Comfort Kitchen", price: "$8", description: "Creamy three-cheese blend", isRecommended: true },
      { id: "7", name: "Cornbread", vendor: "Southern Style", price: "$4", description: "Sweet, buttery cornbread" },
      { id: "8", name: "Sweet Tea", vendor: "Porch Beverages", price: "$3", description: "Traditional southern sweet tea" },
    ]
  },
  {
    id: "commonwealth-avenue",
    name: "Commonwealth Avenue",
    description: "International flavors and diverse cuisines",
    foods: [
      { id: "9", name: "Fish & Chips", vendor: "British Bites", price: "$14", description: "Beer-battered cod with chips", isRecommended: true },
      { id: "10", name: "Italian Sausage", vendor: "Roma Kitchen", price: "$10", description: "Grilled sausage with peppers and onions", isRecommended: true },
      { id: "11", name: "Gyro", vendor: "Mediterranean Corner", price: "$11", description: "Lamb and beef with tzatziki sauce" },
      { id: "12", name: "Pierogies", vendor: "Polish Palace", price: "$9", description: "Traditional potato-filled dumplings" },
    ]
  },
  {
    id: "food-court",
    name: "Food Court",
    description: "Quick bites and festival favorites",
    foods: [
      { id: "13", name: "Fair Fries", vendor: "Golden Spuds", price: "$7", description: "Crispy seasoned fries", isRecommended: true },
      { id: "14", name: "Corn Dogs", vendor: "Stick Food", price: "$6", description: "Classic corn-battered hot dogs", isRecommended: true },
      { id: "15", name: "Cotton Candy", vendor: "Spun Sugar", price: "$5", description: "Classic pink and blue cotton candy", isRecommended: true },
      { id: "16", name: "Lemonade", vendor: "Fresh Squeeze", price: "$4", description: "Fresh-squeezed lemonade" },
    ]
  },
  {
    id: "avenue-of-states",
    name: "Avenue of States",
    description: "Regional specialties from across America",
    foods: [
      { id: "17", name: "Texas BBQ Brisket", vendor: "Lone Star Grill", price: "$15", description: "Slow-smoked brisket with dry rub", isRecommended: true },
      { id: "18", name: "California Fish Tacos", vendor: "West Coast Eats", price: "$12", description: "Grilled fish with avocado and salsa" },
      { id: "19", name: "Chicago Deep Dish Pizza", vendor: "Windy City Slice", price: "$8", description: "Thick crust pizza slice" },
      { id: "20", name: "Louisiana Gumbo", vendor: "Bayou Kitchen", price: "$10", description: "Spicy seafood and sausage gumbo", isRecommended: true },
    ]
  },
  {
    id: "craft-common",
    name: "Craft Common",
    description: "Artisanal foods and craft beverages",
    foods: [
      { id: "21", name: "Craft Beer Flight", vendor: "Local Brewery", price: "$12", description: "Four 4oz pours of local brews", isRecommended: true },
      { id: "22", name: "Artisan Cheese Board", vendor: "Craft Dairy", price: "$16", description: "Local cheeses with crackers and fruit" },
      { id: "23", name: "Gourmet Grilled Cheese", vendor: "Melted Bliss", price: "$9", description: "Three cheese blend on sourdough", isRecommended: true },
      { id: "24", name: "Craft Soda", vendor: "Bubble Works", price: "$4", description: "Small-batch flavored sodas" },
    ]
  },
  {
    id: "east-road",
    name: "East Road",
    description: "Asian cuisine and international street food",
    foods: [
      { id: "25", name: "Pad Thai", vendor: "Thai Garden", price: "$11", description: "Traditional stir-fried noodles", isRecommended: true },
      { id: "26", name: "Korean BBQ Tacos", vendor: "Seoul Food", price: "$13", description: "Bulgogi beef in soft tortillas" },
      { id: "27", name: "Ramen Bowl", vendor: "Noodle House", price: "$12", description: "Rich pork broth with fresh noodles", isRecommended: true },
      { id: "28", name: "Spring Rolls", vendor: "Fresh Rolls", price: "$7", description: "Vegetable spring rolls with peanut sauce" },
    ]
  },
  {
    id: "west-road",
    name: "West Road",
    description: "Mexican and Latin American specialties",
    foods: [
      { id: "29", name: "Street Tacos", vendor: "Taco Libre", price: "$3 each", description: "Authentic corn tortilla tacos", isRecommended: true },
      { id: "30", name: "Elote", vendor: "Corn Corner", price: "$5", description: "Mexican street corn with cotija cheese", isRecommended: true },
      { id: "31", name: "Churros", vendor: "Sweet Sticks", price: "$6", description: "Fried dough with cinnamon sugar", isRecommended: true },
      { id: "32", name: "Horchata", vendor: "Agua Fresca", price: "$4", description: "Traditional rice drink with cinnamon" },
    ]
  },
  {
    id: "springfield-road",
    name: "Springfield Road",
    description: "Local Springfield favorites and New England classics",
    foods: [
      { id: "33", name: "Springfield-Style Chili Dogs", vendor: "Local Legend", price: "$8", description: "Hot dogs with local chili recipe", isRecommended: true },
      { id: "34", name: "Whoopie Pies", vendor: "Pioneer Bakery", price: "$5", description: "Chocolate cakes with cream filling" },
      { id: "35", name: "Fried Dough", vendor: "Dough Works", price: "$6", description: "Classic fried dough with powdered sugar", isRecommended: true },
      { id: "36", name: "Apple Cider", vendor: "Orchard Fresh", price: "$4", description: "Fresh pressed apple cider" },
    ]
  },
  {
    id: "industrial-avenue",
    name: "Industrial Avenue",
    description: "Hearty meals and comfort food",
    foods: [
      { id: "37", name: "Philly Cheesesteak", vendor: "Steel City Subs", price: "$12", description: "Sliced steak with cheese on a roll", isRecommended: true },
      { id: "38", name: "Buffalo Wings", vendor: "Wing Factory", price: "$10", description: "Spicy wings with blue cheese" },
      { id: "39", name: "Loaded Nachos", vendor: "Nacho Palace", price: "$11", description: "Tortilla chips with all the fixings", isRecommended: true },
      { id: "40", name: "Craft Beer", vendor: "Brewery Stand", price: "$6", description: "Local and regional craft beers" },
    ]
  },
  {
    id: "hampden-avenue",
    name: "Hampden Avenue",
    description: "Traditional New England fare",
    foods: [
      { id: "41", name: "Clam Cakes", vendor: "Coastal Treats", price: "$8", description: "Fried clam fritters", isRecommended: true },
      { id: "42", name: "Fish Sandwich", vendor: "Harbor Catch", price: "$10", description: "Beer-battered fish on a bun" },
      { id: "43", name: "Lobster Mac & Cheese", vendor: "Luxury Comfort", price: "$16", description: "Mac and cheese with fresh lobster", isRecommended: true },
      { id: "44", name: "Blueberry Pie", vendor: "Berry Good Pies", price: "$7", description: "Fresh Maine blueberry pie" },
    ]
  },
  {
    id: "young-building",
    name: "Young Building",
    description: "Agricultural showcase with farm-fresh options",
    foods: [
      { id: "45", name: "Farm Fresh Corn", vendor: "Harvest Stand", price: "$3", description: "Butter and salt roasted corn", isRecommended: true },
      { id: "46", name: "Apple Crisp", vendor: "Orchard Kitchen", price: "$7", description: "Warm apple crisp with vanilla ice cream" },
      { id: "47", name: "Fresh Milk", vendor: "Dairy Barn", price: "$3", description: "Cold fresh milk from local farms", isRecommended: true },
      { id: "48", name: "Honey Sticks", vendor: "Bee Happy", price: "$2", description: "Pure local honey sticks" },
    ]
  },
  {
    id: "better-living-center",
    name: "Better Living Center",
    description: "Health-conscious and modern cuisine options",
    foods: [
      { id: "49", name: "Quinoa Bowl", vendor: "Healthy Harvest", price: "$12", description: "Quinoa with roasted vegetables", isRecommended: true },
      { id: "50", name: "Acai Bowl", vendor: "Superfood Station", price: "$10", description: "Acai with granola and fresh fruit" },
      { id: "51", name: "Green Smoothie", vendor: "Juice Bar", price: "$8", description: "Kale, spinach, apple, and ginger smoothie", isRecommended: true },
      { id: "52", name: "Veggie Wrap", vendor: "Plant Power", price: "$9", description: "Hummus and vegetable wrap" },
    ]
  },
  {
    id: "new-england-center",
    name: "New England Center",
    description: "Regional showcase of New England's finest foods",
    foods: [
      { id: "53", name: "Baked Beans", vendor: "Boston Tradition", price: "$6", description: "Slow-baked beans with molasses", isRecommended: true },
      { id: "54", name: "Clam Strip Roll", vendor: "Cape Cod Kitchen", price: "$14", description: "Fried clam strips on a toasted roll" },
      { id: "55", name: "Maple Candy", vendor: "Vermont Sweets", price: "$5", description: "Pure maple sugar candy", isRecommended: true },
      { id: "56", name: "Cranberry Juice", vendor: "Bog Berry", price: "$4", description: "Fresh cranberry juice" },
    ]
  },
  {
    id: "state-buildings",
    name: "The State Buildings",
    description: "Specialties from all six New England states",
    foods: [
      { id: "57", name: "Maine Lobster Roll", vendor: "Pine Tree State", price: "$20", description: "Fresh Maine lobster on a split-top bun", isRecommended: true },
      { id: "58", name: "Vermont Cheddar", vendor: "Green Mountain Dairy", price: "$8", description: "Aged Vermont cheddar with crackers" },
      { id: "59", name: "Rhode Island Coffee Milk", vendor: "Ocean State Treats", price: "$4", description: "Traditional RI coffee-flavored milk", isRecommended: true },
      { id: "60", name: "Connecticut Pizza", vendor: "Nutmeg State Slice", price: "$6", description: "New Haven-style apizza slice" },
      { id: "61", name: "New Hampshire Apple Cider", vendor: "Live Free Orchard", price: "$4", description: "Fresh-pressed cider from NH apples" },
      { id: "62", name: "Massachusetts Baked Beans", vendor: "Bay State Kitchen", price: "$7", description: "Traditional Boston baked beans", isRecommended: true },
    ]
  }
];