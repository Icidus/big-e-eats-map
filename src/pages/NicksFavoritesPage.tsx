import { NicksFavoritesSection } from "@/components/NicksFavorites";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { nicksFavorites } from "@/data/nicksFavorites";

const NicksFavoritesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-festival text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Nick's Favorites</h1>
              <p className="text-primary-foreground/90 text-lg">
                Hand-picked must-try foods at the Big E
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              <Star className="w-4 h-4 mr-2" />
              {nicksFavorites.length} Curated Picks
            </Badge>
            <Badge variant="secondary" className="bg-accent/20 text-primary-foreground border-accent/30">
              <MapPin className="w-4 h-4 mr-2" />
              Map Ordered
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/20 rounded-lg flex-shrink-0">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">About Nick's Picks</h2>
                <p className="text-muted-foreground mb-4">
                  With dozens of vendors and hundreds of food options, it can be pretty overwhelming to try and actually pick out what to eat at the fair. 
                  With that in mind, here are Nick's picks for what folks should eat at the fair. You don't need to try all 10, but if you're looking to narrow things down, here's the short list.
                </p>
                <p className="text-sm text-muted-foreground/80 mb-4 italic">
                  Note: These are not ranked by preference. They're just ordered by where they are on the map.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Personally Tested</Badge>
                  <Badge variant="outline">Priority Ranked</Badge>
                  <Badge variant="outline">Updated 2025</Badge>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Based on the comprehensive Big E food guide by MassLive:
                  </p>
                  <a 
                    href="https://www.masslive.com/the-big-e/2025/09/the-big-e-eaters-guide-2025-what-to-eat-and-where-to-find-it.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Read the Full MassLive Big E Eater's Guide 2025
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Nick's Favorites */}
        <NicksFavoritesSection showHeader={false} limit={undefined} showMap={true} />

        {/* Tips Section */}
        <Card className="shadow-card bg-gradient-warm mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-accent-foreground mb-4">Pro Tips from Nick</h3>
            <ul className="space-y-2 text-accent-foreground/90">
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                <span>All 10 picks are equally great - there's no wrong choice!</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                <span>Come hungry and pace yourself - these are substantial portions</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                <span>Use the map to plan your route efficiently around the fair</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                <span>Don't be afraid to share - it's the best way to try more options</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Attribution Footer */}
        <Card className="shadow-card bg-muted/50 mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Source & Attribution</h3>
            <p className="text-muted-foreground mb-4">
              Nick's curated favorites are based on extensive research and the comprehensive Big E Eater's Guide 2025 by MassLive.
            </p>
            <a 
              href="https://www.masslive.com/the-big-e/2025/09/the-big-e-eaters-guide-2025-what-to-eat-and-where-to-find-it.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              Read the Complete MassLive Big E Eater's Guide 2025
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NicksFavoritesPage;
