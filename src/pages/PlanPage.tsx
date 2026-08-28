import { Check, Map, MapPin, Share2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { itemsById, locations } from "@/features/catalog/catalog";
import type { CatalogItem, FairLocation } from "@/features/catalog/catalog";
import { useFoodPlan } from "@/features/plan/FoodPlanProvider";
import { decodeSharedItems, encodeSharedItems, groupPlanItems } from "@/features/plan/planStore";

export interface PlanViewProps {
  items: CatalogItem[];
  locations: FairLocation[];
  checkedIds: string[];
  onToggleChecked(id: string): void;
  onRemove(id: string): void;
}

export function PlanView({
  items,
  locations: fairLocations,
  checkedIds,
  onToggleChecked,
  onRemove,
}: PlanViewProps): JSX.Element {
  const groups = groupPlanItems(items, fairLocations);
  const checked = new Set(checkedIds);

  if (!groups.length) {
    return (
      <section className="border border-dashed border-primary/40 bg-card px-5 py-10 text-center shadow-[5px_5px_0_hsl(var(--secondary)/0.25)]" aria-labelledby="empty-plan-title">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">No stops stamped yet</p>
        <h2 id="empty-plan-title" className="mt-2 font-serif text-3xl font-bold">Start a delicious route.</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Save the treats worth crossing the fairgrounds for, then check them off as you go.</p>
        <nav className="mt-6 flex flex-wrap justify-center gap-3" aria-label="Browse food categories">
          <Button asChild variant="outline" className="min-h-11"><Link to="/browse">Browse all food</Link></Button>
          <Button asChild variant="secondary" className="min-h-11"><Link to="/browse?tags=drinks">Browse drinks</Link></Button>
          <Button asChild variant="outline" className="min-h-11"><Link to="/browse?categories=desserts">Browse desserts</Link></Button>
        </nav>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group, index) => (
        <section key={group.id} className="field-guide-reveal" aria-labelledby={`plan-group-${group.id}`}>
          <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-primary/30 pb-3">
            <div className="flex items-end gap-3">
              <span className="font-mono text-xs font-bold tabular-nums text-primary" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{group.id === "tbd" ? "Ask at the fair desk" : `${group.items.length} planned stop${group.items.length === 1 ? "" : "s"}`}</p>
                <h2 id={`plan-group-${group.id}`} className="font-serif text-2xl font-bold tracking-tight">{group.name}</h2>
              </div>
            </div>
            {group.mapImage ? <Link to={`/location/${group.id}`} className="inline-flex min-h-11 items-center gap-2 border border-primary/50 bg-card px-3 text-sm font-bold text-primary underline-offset-4 transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label={`View location map for ${group.name}`}><Map className="h-4 w-4" aria-hidden="true" />View location map</Link> : null}
          </div>
          <ol className="mt-4 grid gap-3">
            {group.items.map((item) => {
              const isChecked = checked.has(item.id);
              return (
                <li key={item.id} className={`group flex gap-3 border border-primary/20 bg-card p-4 shadow-[3px_3px_0_hsl(var(--secondary)/0.22)] ${isChecked ? "border-primary/55" : ""}`}>
                  <label className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center" htmlFor={`plan-check-${item.id}`}>
                    <input id={`plan-check-${item.id}`} type="checkbox" checked={isChecked} onChange={() => onToggleChecked(item.id)} className="h-5 w-5 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label={`Mark ${item.name} as ${isChecked ? "not visited" : "visited"}`} />
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className={`font-serif text-xl font-bold leading-tight ${isChecked ? "line-through" : ""}`}>{item.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-primary">{item.vendor}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{group.name}</p>
                        {isChecked ? <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide"><Check className="h-3.5 w-3.5" aria-hidden="true" />Visited</p> : null}
                      </div>
                      <Button type="button" variant="ghost" className="min-h-11 shrink-0 text-primary hover:bg-[hsl(0_74%_42%)] hover:text-white" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name} from my plan`}><Trash2 aria-hidden="true" />Remove</Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

export function PlanPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const { itemIds, checkedIds, mergeItems, removeItem, replaceItems, toggleChecked } = useFoodPlan();
  const [feedback, setFeedback] = useState("");
  const rawSharedItems = searchParams.getAll("items").join(",");
  const hasSharedItems = searchParams.has("items");
  const shared = useMemo(() => decodeSharedItems(rawSharedItems, itemsById), [rawSharedItems]);
  const plannedItems = useMemo(
    () => itemIds.map((id) => itemsById.get(id)).filter((item): item is CatalogItem => Boolean(item)),
    [itemIds],
  );

  function clearSharedParam() {
    const next = new URLSearchParams(searchParams);
    next.delete("items");
    setSearchParams(next, { replace: true });
  }

  function applyShared(mode: "merge" | "replace") {
    if (!shared.itemIds.length) {
      setFeedback("No shared items are available to add.");
      clearSharedParam();
      return;
    }

    if (mode === "merge") {
      mergeItems(shared.itemIds);
      setFeedback(`Added ${shared.itemIds.length} shared item${shared.itemIds.length === 1 ? "" : "s"} to your plan.`);
    } else {
      replaceItems(shared.itemIds);
      setFeedback(`Replaced your plan with ${shared.itemIds.length} shared item${shared.itemIds.length === 1 ? "" : "s"}.`);
    }
    clearSharedParam();
  }

  async function sharePlan() {
    const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
    const shareUrl = new URL("plan", baseUrl);
    shareUrl.searchParams.set("items", encodeSharedItems(itemIds));
    const shareData = { title: "My Big E Food Plan", text: "My Big E food plan", url: shareUrl.toString() };
    const browserNavigator = typeof globalThis.navigator === "undefined" ? undefined : globalThis.navigator;

    try {
      if (typeof browserNavigator?.share === "function") {
        await browserNavigator.share(shareData);
        setFeedback("Your food plan was shared.");
        toast("Your food plan was shared.");
        return;
      }
      if (browserNavigator?.clipboard && typeof browserNavigator.clipboard.writeText === "function") {
        await browserNavigator.clipboard.writeText(shareUrl.toString());
        setFeedback("Share link copied to your clipboard.");
        toast("Share link copied to your clipboard.");
        return;
      }
      setFeedback("Sharing is not available in this browser.");
      toast("Sharing is not available in this browser.");
    } catch {
      const message = typeof browserNavigator?.share === "function"
        ? "Your food plan was not shared."
        : "Couldn't copy the share link.";
      setFeedback(message);
      toast(message);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(hsl(var(--secondary)/0.16)_1px,transparent_1px)] bg-[size:13px_13px] text-foreground">
      <header className="border-b-4 border-primary bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-9 sm:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-secondary">The Big E · route card</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">My Food Plan</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/90">A fair-day itinerary for the bites you do not want to miss.</p></div><Button type="button" variant="secondary" className="min-h-11 border border-secondary-foreground/20" onClick={() => void sharePlan()} disabled={!itemIds.length}><Share2 aria-hidden="true" />Share my plan</Button></div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {feedback ? <p role="status" className="mb-6 border-l-4 border-primary bg-card px-4 py-3 text-sm font-semibold shadow-[3px_3px_0_hsl(var(--secondary)/0.22)]">{feedback}</p> : null}
        {hasSharedItems ? <section className="mb-7 border-2 border-secondary bg-card p-5 shadow-[6px_6px_0_hsl(var(--primary)/0.16)]" aria-labelledby="shared-plan-title"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">A friend sent a route</p><h2 id="shared-plan-title" className="mt-1 font-serif text-2xl font-bold">Review shared food plan</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{shared.itemIds.length} shared item{shared.itemIds.length === 1 ? " is" : "s are"} available to add. {shared.missingIds.length ? `${shared.missingIds.length} shared item${shared.missingIds.length === 1 ? " could" : "s could"} not be found in the current catalog.` : ""}</p><div className="mt-4 flex flex-wrap gap-3">{shared.itemIds.length ? <><Button type="button" className="min-h-11" onClick={() => applyShared("replace")}>Replace my plan</Button><Button type="button" variant="outline" className="min-h-11" onClick={() => applyShared("merge")}>Merge with my plan</Button></> : <Button type="button" variant="outline" className="min-h-11" onClick={clearSharedParam}>Dismiss shared plan</Button>}</div></section> : null}
        <PlanView items={plannedItems} locations={locations} checkedIds={checkedIds} onToggleChecked={toggleChecked} onRemove={removeItem} />
      </main>
    </div>
  );
}
