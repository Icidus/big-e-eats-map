import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface BackFallback {
  to: string;
  label: string;
}

/** Router state an originating link can pass so the destination's Back button can name where it returns to. */
export interface BackLinkState {
  backLabel: string;
}

const HEADER_BUTTON_CLASSES = "min-h-11 border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary";

/**
 * Context-aware Back control for page headers. When the visitor arrived from inside the app it goes back
 * one history step, labelled by the originating link's `backLabel` state; opened cold it links to `fallback`.
 */
export function BackButton({ fallback, className = HEADER_BUTTON_CLASSES }: { fallback: BackFallback; className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const canGoBack = location.key !== "default";
  const backLabel = (location.state as Partial<BackLinkState> | null)?.backLabel;

  if (!canGoBack) {
    return (
      <Button asChild variant="outline" className={className}>
        <Link to={fallback.to}><ArrowLeft aria-hidden="true" />{fallback.label}</Link>
      </Button>
    );
  }

  return (
    <Button type="button" variant="outline" className={className} onClick={() => navigate(-1)}>
      <ArrowLeft aria-hidden="true" />{backLabel ?? "Back"}
    </Button>
  );
}
