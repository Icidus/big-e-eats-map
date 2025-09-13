import { getDrinks } from "@/data/categories";
import { locations } from "@/data/locations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CupSoda, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function DrinksPage() {
  const drinks = getDrinks(locations);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-gradient-festival text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <span className="inline-flex items-center text-primary-foreground hover:underline text-sm mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </span>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <CupSoda className="w-6 h-6" />
            <h1 className="text-2xl md:text-3xl font-bold">All Drinks</h1>
          </div>
          <p className="text-primary-foreground/90">Browse all alcoholic and non-alcoholic drinks across the fair.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CupSoda className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{drinks.length} Drink Options</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {drinks.map((f) => (
                <Card key={`${f.locationId}-${f.id}`} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{f.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{f.vendor}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {f.locationName}
                        </div>
                      </div>
                      <div className="text-right">
                        {f.price && (
                          <Badge variant="outline" className="text-xs">{f.price}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <a href={`/big-e-eats-map/location/${f.locationId}?q=${encodeURIComponent(f.name)}`} className="text-primary text-sm font-medium hover:underline">
                        View at this location
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
