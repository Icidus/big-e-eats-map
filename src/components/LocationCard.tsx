import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Utensils } from "lucide-react";
import { Location } from "@/data/locations";
import { Link } from "react-router-dom";

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  const recommendedCount = location.foods.filter(food => food.isRecommended).length;
  
  return (
    <Card className="shadow-card hover:shadow-festival transition-all duration-300 hover:scale-[1.02] border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <Badge variant="secondary" className="text-xs">
            {location.foods.length} vendors
          </Badge>
          {recommendedCount > 0 && (
            <Badge variant="default" className="text-xs bg-accent text-accent-foreground">
              {recommendedCount} recommended
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-bold text-foreground">{location.name}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm leading-relaxed">
          {location.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">
            Featured: {location.foods.slice(0, 2).map(food => food.name).join(', ')}
            {location.foods.length > 2 && '...'}
          </span>
        </div>
        <Link to={`/location/${location.id}`}>
          <Button variant="festival" className="w-full font-medium">
            Explore Food Options
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}