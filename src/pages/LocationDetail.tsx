import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Star, MapPin, DollarSign, Search, X, User } from "lucide-react";
import { locations, Food } from "@/data/locations";
import { getMassLiveFavoritesForLocation } from "@/data/massLiveFavorites";
import { getLocationMapPath, PLACEHOLDER_MAP } from "@/assets/maps/mapUtils";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const routerLocation = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const location = locations.find(loc => loc.id === id);

  // Load map image when location changes
  useEffect(() => {
    if (!location) return;
    
    const loadMapImage = async () => {
      setMapLoading(true);
      try {
        // Try to dynamically import the map image
        const mapModule = await import(`@/assets/maps/locations/${location.id}.png`);
        setMapImage(mapModule.default);
      } catch (error) {
        console.log(`No map found for ${location.id}, using placeholder`);
        setMapImage(null);
      } finally {
        setMapLoading(false);
      }
    };

    loadMapImage();
  }, [location]);

  // Populate search from query param (for deep links from Home)
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [routerLocation.search]);

  if (!location) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="max-w-md shadow-card">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold mb-2">Location Not Found</h2>
            <p className="text-muted-foreground mb-4">The location you're looking for doesn't exist.</p>
            <Link to="/">
              <Button variant="festival">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter foods based on search query
  const filteredFoods = location.foods.filter(food => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      food.name.toLowerCase().includes(query) ||
      food.vendor.toLowerCase().includes(query) ||
      (food.description && food.description.toLowerCase().includes(query))
    );
  });

  const recommendedFoods = filteredFoods.filter(food => food.isRecommended);
  const allFoods = filteredFoods;
  const massLiveFavorites = getMassLiveFavoritesForLocation(location.id);

  // Group foods by vendor
  const groupedFoods = allFoods.reduce((acc, food) => {
    if (!acc[food.vendor]) {
      acc[food.vendor] = [];
    }
    acc[food.vendor].push(food);
    return acc;
  }, {} as Record<string, Food[]>);

  const groupedRecommended = recommendedFoods.reduce((acc, food) => {
    if (!acc[food.vendor]) {
      acc[food.vendor] = [];
    }
    acc[food.vendor].push(food);
    return acc;
  }, {} as Record<string, Food[]>);

  const clearSearch = () => setSearchQuery("");

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-accent/30 text-foreground rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const VendorGroup = ({ vendor, foods, showVendorName = true }: { vendor: string; foods: Food[]; showVendorName?: boolean }) => {
    const hasMassLiveFavorite = foods.some(food => 
      massLiveFavorites.some(fav => fav.name === food.name && fav.vendor === food.vendor)
    );
    
    return (
      <Card className={`shadow-card hover:shadow-warm transition-all duration-200 ${hasMassLiveFavorite ? 'border-l-4 border-l-accent' : ''}`}>
        <CardContent className="p-4">
          {showVendorName && (
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <h3 className="text-lg font-bold text-foreground">
                {highlightText(vendor, searchQuery)}
              </h3>
              {hasMassLiveFavorite && (
                <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  MassLive Pick
                </Badge>
              )}
            </div>
          )}
          <div className="space-y-3">
            {foods.map(food => {
              const massLiveFavorite = massLiveFavorites.find(fav => 
                fav.name === food.name && fav.vendor === food.vendor
              );
              
              return (
                <div key={food.id} className={`flex items-start justify-between ${massLiveFavorite ? 'bg-accent/5 p-2 rounded-lg' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {highlightText(food.name, searchQuery)}
                      </h4>
                      {food.isRecommended && (
                        <Star className="w-4 h-4 text-accent fill-accent" />
                      )}
                      {massLiveFavorite && (
                        <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
                          MassLive Pick
                        </Badge>
                      )}
                    </div>
                    {food.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {highlightText(food.description, searchQuery)}
                      </p>
                    )}
                  </div>
                  {food.price && (
                    <Badge variant="outline" className="ml-2 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {food.price.replace('$', '')}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-festival text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6" />
            <h1 className="text-2xl md:text-3xl font-bold">{location.name}</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">{location.description}</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              {allFoods.length} Food Options
            </Badge>
            <Badge variant="secondary" className="bg-accent/20 text-primary-foreground border-accent/30">
              {recommendedFoods.length} Recommended
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Search Food Options</h2>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by food name, vendor, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing {allFoods.length} result{allFoods.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* No Results Message */}
        {searchQuery && allFoods.length === 0 && (
          <section className="mb-8">
            <Card className="shadow-card">
              <CardContent className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  No food options match your search for "{searchQuery}". Try searching for something else.
                </p>
                <Button onClick={clearSearch} variant="outline">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* MassLive Favorites Section */}
        {massLiveFavorites.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">MassLive Favorites Here</h2>
              <Link to="/masslive-favorites">
                <Badge variant="outline" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  View All Picks
                </Badge>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {massLiveFavorites.map(favorite => {
                const food = allFoods.find(f => f.name === favorite.name && f.vendor === favorite.vendor);
                if (!food) return null;
                return (
                  <Card key={favorite.id} className="shadow-card border-l-4 border-l-accent">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              MassLive Pick
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-foreground mb-1">{favorite.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{favorite.vendor}</p>
                        </div>
                        {food.price && (
                          <Badge variant="outline" className="ml-2 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {food.price.replace('$', '')}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommended Section */}
        {recommendedFoods.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-accent fill-accent" />
              <h2 className="text-2xl font-bold text-foreground">Recommended Picks</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(groupedRecommended).map(([vendor, foods]) => (
                <VendorGroup key={vendor} vendor={vendor} foods={foods} />
              ))}
            </div>
          </section>
        )}

        <Separator className="my-8" />

        {/* All Foods Section */}
        {allFoods.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {searchQuery ? 'Search Results' : 'All Food Options'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedFoods).map(([vendor, foods]) => (
                <VendorGroup key={vendor} vendor={vendor} foods={foods} />
              ))}
            </div>
          </section>
        )}

        {/* Map Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Location Map</h2>
          <Card className="shadow-card">
            <CardContent className="p-6">
              {mapLoading ? (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              ) : mapImage ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden">
                    <Dialog>
                      <DialogTrigger asChild>
                        <img 
                          src={mapImage} 
                          alt={`Map of ${location.name}`}
                          className="w-full h-auto max-h-96 object-contain bg-muted rounded-lg cursor-zoom-in"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl">
                        <img src={mapImage} alt={`Map of ${location.name} (large)`} className="w-full h-auto" />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      Use this map to locate food vendors in this area.
                    </p>
                    <Button variant="warm" size="sm">
                      Get Directions from Staff
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    Map coming soon! For now, look for the signs and ask fair staff for directions.
                  </p>
                  <Button variant="warm" size="sm">
                    Get Directions from Staff
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}