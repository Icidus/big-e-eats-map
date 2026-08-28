import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Beef, CupSoda, Dessert, GlassWater, Search, Soup, Wheat } from "lucide-react";
import { LocationCard } from "@/components/LocationCard";
import { CatalogStatusNotice } from "@/components/discovery/CatalogStatusNotice";
import { CategoryTile } from "@/components/discovery/CategoryTile";
import { CollectionCard } from "@/components/discovery/CollectionCard";
import { catalogItems, collections, itemsById, locations } from "@/features/catalog/catalog";
import { useFoodPlan } from "@/features/plan/FoodPlanProvider";

const cravings = [
  { id: "cocktails", label: "Cocktails", icon: GlassWater, kind: "category" as const },
  { id: "mocktails", label: "Mocktails", icon: CupSoda, kind: "category" as const },
  { id: "desserts", label: "Desserts", icon: Dessert, kind: "category" as const },
  { id: "burgers", label: "Burgers", icon: Beef, kind: "category" as const },
  { id: "potatoes-fries", label: "Potatoes & Fries", icon: Wheat, kind: "category" as const },
  { id: "spicy", label: "Spicy", icon: Soup, kind: "tag" as const },
];

const flavorPicks = [["pickle", "Pickle"], ["birria", "Birria"], ["hot-honey", "Hot honey"], ["pumpkin", "Pumpkin"], ["apple", "Apple"], ["fall-flavors", "Fall flavors"]] as const;

const Index = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { itemIds } = useFoodPlan();
  const populatedLocations = locations
    .map((location) => ({ location, itemCount: catalogItems.filter((item) => item.locationIds.includes(location.id)).length }))
    .filter(({ itemCount }) => itemCount > 0)
    .sort((first, second) => first.location.order - second.location.order);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return navigate("/browse");
    navigate(`/browse?${new URLSearchParams({ q: value }).toString()}`);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(hsl(var(--secondary)/0.16)_1px,transparent_1px)] bg-[size:13px_13px] text-foreground">
      <header className="border-b-4 border-primary bg-[hsl(var(--hero-ink))] text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-secondary">West Springfield · Field notes</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div className="field-guide-reveal"><p className="font-serif text-xl font-bold sm:text-2xl">Big E 2026 Food Guide</p><h1 className="mt-1 font-serif text-4xl font-black leading-none tracking-tight sm:text-5xl">Find your next Big E bite</h1></div>
            <p className="max-w-xs border-l-2 border-secondary pl-3 text-sm leading-5 text-primary-foreground">A first look at the official new-food listings, gathered for an easy fair-day wander.</p>
          </div>
          <form className="mt-7 max-w-2xl" onSubmit={submitSearch} role="search">
            <label htmlFor="home-search" className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">Search 2026 food</label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" /><input id="home-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Apple, hot honey, a vendor…" className="h-12 w-full border-2 border-primary-foreground/75 bg-card px-10 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary" /></div>
              <button type="submit" className="min-h-12 border-2 border-secondary bg-secondary px-5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary">Search food guide</button>
            </div>
          </form>
        </div>
      </header>
      <CatalogStatusNotice />

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-9 sm:px-6 lg:px-8">
        <section aria-labelledby="cravings-heading"><SectionHeading eyebrow="Start with a craving" id="cravings-heading">Which corner are you hungry for?</SectionHeading><div className="mt-5 grid gap-3 min-[460px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">{cravings.map((craving) => <CategoryTile key={craving.id} {...craving} count={catalogItems.filter((item) => craving.kind === "tag" ? item.tagIds.includes(craving.id) : item.categoryIds.includes(craving.id)).length} />)}</div></section>

        <section aria-labelledby="collections-heading"><SectionHeading eyebrow="A few ready-made routes" id="collections-heading">2026 collection cards</SectionHeading><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{collections.map((collection) => <CollectionCard key={collection.id} collection={collection} itemCount={collection.itemIds.filter((id) => itemsById.has(id)).length} />)}</div></section>

        <section className="border-y-2 border-secondary/55 py-7" aria-labelledby="flavor-heading"><SectionHeading eyebrow="Marked in the margin" id="flavor-heading">Editor&apos;s flavor picks</SectionHeading><div className="mt-5 flex flex-wrap gap-2">{flavorPicks.map(([id, label]) => <Link key={id} to={`/browse?tags=${id}`} className="min-h-11 border border-primary/35 bg-card px-4 py-2 text-sm font-bold text-primary shadow-[2px_2px_0_hsl(var(--secondary)/0.32)] transition-colors hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">{label}</Link>)}</div></section>

        <section aria-labelledby="locations-heading"><SectionHeading eyebrow="Follow the fair map" id="locations-heading">Browse by location</SectionHeading><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">These are the fair stops named by at least one confirmed 2026 listing. An item with more than one listed stop appears in each of them.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{populatedLocations.map(({ location, itemCount }) => <LocationCard key={location.id} location={location} itemCount={itemCount} />)}</div></section>

        <section className="border-2 border-primary bg-[hsl(var(--hero-ink))] p-5 text-primary-foreground shadow-[7px_7px_0_hsl(var(--secondary)/0.72)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-7" aria-labelledby="plan-heading"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Keep your route handy</p><h2 id="plan-heading" className="mt-2 font-serif text-3xl font-bold">My Food Plan</h2><p className="mt-1 text-sm text-primary-foreground">{itemIds.length} {itemIds.length === 1 ? "bite" : "bites"} saved for your fair day.</p></div><Link to="/plan" className="mt-5 inline-flex min-h-11 items-center justify-center border-2 border-secondary bg-secondary px-5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-primary-foreground sm:mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary" aria-label={`My Food Plan, ${itemIds.length} saved ${itemIds.length === 1 ? "bite" : "bites"}`}>View my plan</Link></section>
      </main>
    </div>
  );
};

function SectionHeading({ eyebrow, id, children }: { eyebrow: string; id: string; children: string }) {
  return <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p><h2 id={id} className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{children}</h2></div>;
}

export default Index;
