import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { MassLiveFavorite, getMassLiveFavoritesByPriority } from "@/data/massLiveFavorites";

interface MassLiveFavoriteCardProps {
  favorite: MassLiveFavorite;
  compact?: boolean;
}

export const MassLiveFavoriteCard = ({ favorite, compact = false }: MassLiveFavoriteCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-warm transition-all duration-200 border-l-4 border-l-accent">
      <CardContent className={`p-${compact ? '4' : '6'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                MassLive Pick
              </Badge>
            </div>
            <h3 className={`font-bold text-foreground mb-1 ${compact ? 'text-lg' : 'text-xl'}`}>
              {favorite.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {favorite.vendor}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3" />
              {favorite.locationName}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Link to={`/location/${favorite.locationId}`}>
            <Button variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground">
              Visit Location
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {favorite.locationName}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

interface MassLiveFavoritesSectionProps {
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
  showMassLiveLink?: boolean;
  showMap?: boolean;
}

export const MassLiveFavoritesSection = ({ 
  limit = 10, 
  showHeader = true, 
  compact = false,
  showMassLiveLink = false,
  showMap = false
}: MassLiveFavoritesSectionProps) => {
  const favorites = getMassLiveFavoritesByPriority(limit);
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(false);

  // Load MassLive favorites map
  useEffect(() => {
    if (!showMap) return;
    
    const loadMapImage = async () => {
      setMapLoading(true);
      try {
  const mapModule = await import(`@/assets/maps/locations/nicks-favorites.png`);
        setMapImage(mapModule.default);
      } catch (error) {
  console.log('No MassLive favorites map found');
        setMapImage(null);
      } finally {
        setMapLoading(false);
      }
    };

    loadMapImage();
  }, [showMap]);

  return (
    <section className="mb-12">
      {showMap && (
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">MassLive Favorites Map</h3>
            </div>
            {mapLoading ? (
              <div className="bg-muted rounded-lg p-8 text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            ) : mapImage ? (
              <div className="rounded-lg overflow-hidden">
                <Dialog>
                  <DialogTrigger asChild>
                    <img 
                      src={mapImage} 
                      alt="MassLive Favorites Location Map"
                      className="w-full h-auto max-h-96 object-contain bg-muted rounded-lg cursor-zoom-in"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl">
                    <img src={mapImage} alt="MassLive Favorites Map (large)" className="w-full h-auto" />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Map showing all MassLive favorite locations coming soon!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">MassLive Favorites</h2>
              <p className="text-muted-foreground">10 must-try foods (ordered by map location)</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            {favorites.length} Picks
          </Badge>
        </div>
      )}
      
      <div className={`grid gap-${compact ? '4' : '6'} ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {favorites.map((favorite) => (
          <MassLiveFavoriteCard 
            key={favorite.id} 
            favorite={favorite} 
            compact={compact}
          />
        ))}
      </div>
      
      {limit && favorites.length >= limit && (
        <div className="text-center mt-6">
          <Link to="/masslive-favorites">
            <Button variant="festival" size="lg">
              View All MassLive Favorites
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
      
      {showMassLiveLink && (
        <div className="text-center mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Based on the comprehensive Big E food guide by MassLive
          </p>
          <a 
            href="https://www.masslive.com/the-big-e/2025/09/the-big-e-eaters-guide-2025-what-to-eat-and-where-to-find-it.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
          >
            Read the Full MassLive Big E Eater's Guide 2025
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </section>
  );
};
