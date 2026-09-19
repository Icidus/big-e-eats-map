import { ExternalLink } from "lucide-react";
import { vendorLinksById } from "@/features/catalog/vendors";

export function VendorLinks({ vendorId }: { vendorId: string }) {
  const links = vendorLinksById.get(vendorId);
  if (!links?.length) return null;
  return <div className="flex flex-wrap gap-x-4">
    {links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {link.label}<ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>)}
  </div>;
}
