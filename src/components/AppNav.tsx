import { Compass, Home, Mail, Map as MapIcon, MapPinned, Store } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { readBrowseSearch } from "@/features/discovery/lastBrowse";
import { useFoodPlan } from "@/features/plan/FoodPlanProvider";

export function AppNav() {
  const { itemIds } = useFoodPlan();
  // Re-read on every navigation so the tab tracks the latest remembered browse search.
  useLocation();
  const browseTo = `/browse${readBrowseSearch()}`;
  const planLabel = `My Plan, ${itemIds.length} ${itemIds.length === 1 ? "item" : "items"}`;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-primary bg-card pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:bottom-auto md:border-b-2 md:border-t-0"
    >
      <div className="mx-auto flex max-w-7xl items-stretch justify-around md:justify-end md:gap-1 md:px-6">
        <AppNavLink to="/" end icon={Home} label="Home" />
        <AppNavLink to={browseTo} icon={Compass} label="Browse" />
        <AppNavLink to="/vendors" icon={Store} label="Vendors" />
        <AppNavLink to="/map" icon={MapIcon} label="Map" />
        <AppNavLink to="/plan" icon={MapPinned} label="My Plan" ariaLabel={planLabel} badge={itemIds.length} />
        <a
          href={`mailto:contact@bigeeats.com?subject=${encodeURIComponent("Big E Eats — listing question")}`}
          className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:min-h-11 md:flex-none md:flex-row md:gap-2 md:px-3 md:text-xs"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          Contact
        </a>
      </div>
    </nav>
  );
}

function AppNavLink({ to, end, icon: Icon, label, ariaLabel, badge }: {
  to: string;
  end?: boolean;
  icon: typeof Home;
  label: string;
  ariaLabel?: string;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={ariaLabel ?? label}
      className={({ isActive }) =>
        cn(
          "relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:flex-none md:px-3 md:min-h-11 md:flex-row md:gap-2 md:text-xs",
          isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
        )
      }
    >
      <span className="relative">
        <Icon className="h-5 w-5" aria-hidden="true" />
        {badge !== undefined && badge > 0 ? (
          <span aria-hidden="true" className="absolute -right-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-secondary px-1 font-mono text-[10px] font-bold leading-4 text-secondary-foreground">
            {badge}
          </span>
        ) : null}
      </span>
      <span aria-hidden={ariaLabel !== undefined}>{label}</span>
    </NavLink>
  );
}
