import { LocationCard } from "@/components/LocationCard";
import { MassLiveFavoritesSection } from "@/components/MassLiveFavorites";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Calendar, Users, CupSoda } from "lucide-react";
import { locations } from "@/data/locations";
import { getDrinks, augmentLocations } from "@/data/categories";
import { massLiveFavorites } from "@/data/massLiveFavorites";
import { useState } from "react";
import heroImage from "@/assets/big-e-hero.jpg";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Augment foods with categories/tags for richer search
  const augmented = augmentLocations(locations);
  const filteredLocations = augmented.filter((location) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      location.name.toLowerCase().includes(q) ||
      location.description.toLowerCase().includes(q) ||
      location.foods.some((food) =>
        food.name.toLowerCase().includes(q) ||
        food.vendor.toLowerCase().includes(q) ||
        food.primaryCategory.toLowerCase().includes(q) ||
        food.tags.some((t) => t.toLowerCase().includes(q))
      )
    );
  });

  // Also surface individual food matches across all locations
  const matchingFoods = (() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [] as Array<{
      id: string;
      name: string;
      vendor: string;
      locationId: string;
      locationName: string;
      price?: string | null;
      category?: string;
      tags?: string[];
    }>;
    return augmented.flatMap((loc) =>
      loc.foods
        .filter((food) =>
          food.name.toLowerCase().includes(q) ||
          food.vendor.toLowerCase().includes(q) ||
          (food.description?.toLowerCase().includes(q) ?? false) ||
          food.primaryCategory.toLowerCase().includes(q) ||
          food.tags.some((t) => t.toLowerCase().includes(q))
        )
        .map((food) => ({
          id: `${loc.id}-${food.id}`,
          name: food.name,
          vendor: food.vendor,
          locationId: loc.id,
          locationName: loc.name,
          price: food.price ?? null,
          category: food.primaryCategory,
          tags: food.tags,
        }))
    );
  })();

  const totalFoods = augmented.reduce((acc, location) => acc + location.foods.length, 0);
  const totalRecommended = augmented.reduce((acc, location) =>
    acc + location.foods.filter((food) => food.isRecommended).length,
    0
  );

  // Build a drinks list across all locations using categorization
  const drinks = getDrinks(locations).map((f) => ({
    id: `${f.locationId}-${f.id}`,
    name: f.name,
    vendor: f.vendor,
    locationId: f.locationId,
    locationName: f.locationName,
    price: f.price ?? null,
  }));
  const topDrinks = drinks.slice(0, 12);
  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-primary-foreground px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                Big E Fair 2025
              </h1>
              <p className="text-xl md:text-2xl mb-6 drop-shadow-md opacity-95">
                Your Family's Guide to the Best Fair Food + MassLive Favorites
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-sm px-3 py-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  September 2025
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-sm px-3 py-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  {locations.length} Locations
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-sm px-3 py-1">
                  <Users className="w-4 h-4 mr-2" />
                  Family Friendly
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section (always visible, above search) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-16 relative z-10">
          <Card className="shadow-card bg-card/95 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{locations.length}</div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </CardContent>
          </Card>
          <Card className="shadow-card bg-card/95 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{totalFoods}</div>
              <div className="text-sm text-muted-foreground">Food Options</div>
            </CardContent>
          </Card>
          <Card className="shadow-card bg-card/95 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{massLiveFavorites.length}</div>
              <div className="text-sm text-muted-foreground">MassLive Favorites</div>
            </CardContent>
          </Card>
          <Card className="shadow-card bg-card/95 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{totalRecommended}</div>
              <div className="text-sm text-muted-foreground">Recommended</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Find Your Perfect Fair Food</h2>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search locations, foods, or vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} and {matchingFoods.length} item{matchingFoods.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </CardContent>
        </Card>

        {/* When searching, show item results prominently */}
        {isSearching && matchingFoods.length > 0 && (
          <Card className="shadow-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Items matching "{searchTerm}"</h2>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {matchingFoods.length} Items
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {matchingFoods.map((item) => (
                  <Card key={item.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.vendor}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{item.locationName}</span>
                            {item.category && (
                              <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {item.price && (
                            <Badge variant="outline" className="text-xs">{item.price}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <a href={`/big-e-eats-map/location/${item.locationId}?q=${encodeURIComponent(item.name)}`} className="text-primary text-sm font-medium hover:underline">
                          View at this location
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        

  {/* MassLive Favorites Section */}
  {!isSearching && <MassLiveFavoritesSection limit={6} showMassLiveLink={true} />}

        {/* Drinks Section */}
        {!isSearching && topDrinks.length > 0 && (
          <Card className="shadow-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CupSoda className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Drinks (Alcoholic & Non-Alcoholic)</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {drinks.length} Options
                  </Badge>
                  <a href="/big-e-eats-map/drinks" className="text-sm text-primary font-medium hover:underline">Browse all drinks</a>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topDrinks.map((item) => (
                  <Card key={item.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.vendor}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {item.locationName}
                          </div>
                        </div>
                        <div className="text-right">
                          {item.price && (
                            <Badge variant="outline" className="text-xs">{item.price}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <a href={`/big-e-eats-map/location/${item.locationId}`} className="text-primary text-sm font-medium hover:underline">
                          View location
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

  {/* Search Section moved to top */}

        {/* Locations Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              {isSearching ? 'Matching Locations' : 'Fair Locations'}
            </h2>
          </div>
          
          {filteredLocations.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try searching for different food items, vendors, or locations.
                </p>
                <Button variant="festival" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}
        </div>

  {/* Items grid moved above; no duplicate here */}

        {/* Footer */}
        {!isSearching && (
          <Card className="shadow-card bg-gradient-warm">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Ready for the Big E?</h3>
              <p className="text-accent-foreground/80 mb-4">
                Your family's ultimate guide to the best food at New England's Great State Fair.
                Save this site and plan your perfect fair food adventure!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="bg-accent-foreground/20 text-accent-foreground">
                  Mobile Optimized
                </Badge>
                <Badge variant="secondary" className="bg-accent-foreground/20 text-accent-foreground">
                  Easy Navigation
                </Badge>
                <Badge variant="secondary" className="bg-accent-foreground/20 text-accent-foreground">
                  Family Friendly
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;