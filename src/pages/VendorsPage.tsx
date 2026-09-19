import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VendorLinks } from "@/components/discovery/VendorLinks";
import { vendorDirectory } from "@/features/catalog/vendors";
import { locationsById } from "@/features/catalog/catalog";
import { normalizeSearchText } from "@/features/discovery/search";

export function VendorsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  const results = vendorDirectory.filter((vendor) => {
    const text = normalizeSearchText([vendor.name, ...vendor.items.map((item) => item.name)].join(" "));
    return terms.every((term) => text.includes(term));
  });
  return <div className="min-h-screen bg-[radial-gradient(hsl(var(--secondary)/0.15)_1px,transparent_1px)] bg-[size:13px_13px]">
    <header className="border-b-4 border-secondary bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-secondary">The Big E · Meet the makers</p>
        <h1 className="mt-2 font-serif text-4xl font-black sm:text-5xl">Browse vendors</h1>
        <p className="mt-3 max-w-2xl leading-6">Find your favorite food stand, explore its menu, and follow the vendor for the latest updates.</p>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="border border-primary/25 bg-card p-5 shadow-[6px_6px_0_hsl(var(--secondary)/0.32)]" aria-label="Vendor search">
        <label htmlFor="vendor-search" className="font-mono text-xs font-bold uppercase tracking-wide">Find a vendor</label>
        <div className="relative mt-2"><Search className="absolute left-3 top-4 h-4 w-4 text-primary" aria-hidden="true" /><Input id="vendor-search" type="search" value={query} onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })} placeholder="Search by vendor or food…" className="h-12 pl-10 text-base" /></div>
      </section>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-b border-primary/25 pb-3">
        <p role="status" className="font-semibold">{results.length} of {vendorDirectory.length} vendors &amp; food stands</p>
        <p className="text-sm text-muted-foreground">A–Z · Verified links added as we research</p>
      </div>
      {results.length ? <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((vendor) => <article key={vendor.id} className="flex flex-col border border-primary/20 border-t-4 border-t-secondary bg-card p-5 shadow-[4px_4px_0_hsl(var(--secondary)/0.3)]">
        <h2 className="font-serif text-2xl font-bold">{vendor.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{vendor.items.length} {vendor.items.length === 1 ? "listing" : "listings"} · {vendor.locationIds.map((id) => locationsById.get(id)?.name).join(" · ") || "Location not yet announced"}</p>
        <Link to={`/vendors/${vendor.id}`} className="mt-3 inline-flex min-h-11 items-center font-bold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`View ${vendor.name} menu`}>View menu →</Link>
        <div className="mt-auto border-t border-dashed border-primary/20 pt-1"><VendorLinks vendorId={vendor.id} /></div>
      </article>)}</div> : <div className="mt-5 border border-dashed border-primary/40 bg-card p-8 text-center"><p className="font-serif text-2xl font-bold">No vendors match your search.</p><button onClick={() => setParams({})} className="mt-3 min-h-11 font-semibold text-primary underline">Show all vendors</button></div>}
    </main>
  </div>;
}
