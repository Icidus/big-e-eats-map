import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, MapPin, DollarSign } from "lucide-react";
import { locations, Food } from "@/data/locations";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const location = locations.find(loc => loc.id === id);

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

  const recommendedFoods = location.foods.filter(food => food.isRecommended);
  const allFoods = location.foods;

  const FoodItem = ({ food }: { food: Food }) => (
    <Card className="shadow-card hover:shadow-warm transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">{food.name}</h4>
              {food.isRecommended && (
                <Star className="w-4 h-4 text-accent fill-accent" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{food.vendor}</p>
            {food.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{food.description}</p>
            )}
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
        {/* Recommended Section */}
        {recommendedFoods.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-accent fill-accent" />
              <h2 className="text-2xl font-bold text-foreground">Recommended Picks</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendedFoods.map(food => (
                <FoodItem key={food.id} food={food} />
              ))}
            </div>
          </section>
        )}

        <Separator className="my-8" />

        {/* All Foods Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">All Food Options</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allFoods.map(food => (
              <FoodItem key={food.id} food={food} />
            ))}
          </div>
        </section>

        {/* Simple Map Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Location Map</h2>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="bg-muted rounded-lg p-8 text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
                <p className="text-muted-foreground mb-4">
                  Interactive map feature coming soon! For now, look for the signs and ask fair staff for directions.
                </p>
                <Button variant="warm" size="sm">
                  Get Directions from Staff
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}