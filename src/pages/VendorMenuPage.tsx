import { Link, useParams } from "react-router-dom";
import { ItemCard } from "@/components/discovery/ItemCard";
import { VendorLinks } from "@/components/discovery/VendorLinks";
import { CatalogStatusNotice } from "@/components/discovery/CatalogStatusNotice";
import { locationsById } from "@/features/catalog/catalog";
import { vendorDirectory } from "@/features/catalog/vendors";
import { useFoodPlan } from "@/features/plan/FoodPlanProvider";
import NotFound from "./NotFound";

export function VendorMenuPage() {
  const { id } = useParams();
  const vendor = vendorDirectory.find((entry) => entry.id === id);
  const { addItem, removeItem, hasItem } = useFoodPlan();
  if (!vendor) return <NotFound />;

  return <div className="min-h-screen bg-background">
    <header className="border-b-4 border-secondary bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/vendors" className="inline-flex min-h-11 items-center font-semibold underline">← All vendors</Link>
        <h1 className="mt-3 font-serif text-4xl font-black">{vendor.name} at The Big E 2026</h1>
        <p className="mt-3">{vendor.items.length} food and drink listings{vendor.locationIds.length ? ` · ${vendor.locationIds.map((locationId) => locationsById.get(locationId)?.name).join(" · ")}` : ""}</p>
      </div>
    </header>
    <CatalogStatusNotice />
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <VendorLinks vendorId={vendor.id} />
      <p className="my-4 text-sm text-muted-foreground">Explore the sourced menu below. Open a food’s details for its citation. Menus and availability can change.</p>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {vendor.items.map((item) => <ItemCard key={item.id} item={item} locationsById={locationsById} isInPlan={hasItem(item.id)} onAdd={() => addItem(item.id)} onRemove={() => removeItem(item.id)} />)}
      </div>
      <Link to={`/browse?vendors=${encodeURIComponent(vendor.id)}`} className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary underline">Search and filter this menu</Link>
    </main>
  </div>;
}
