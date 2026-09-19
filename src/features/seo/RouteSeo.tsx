import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageSeo, renderSeoHead } from "./seo";

/** Keep navigation metadata aligned with the HTML generated at build time. */
export function RouteSeo() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const template = document.createElement("template");
    template.innerHTML = renderSeoHead(getPageSeo(pathname + search));
    document.head.querySelectorAll('title, meta[name="description"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]').forEach((node) => node.remove());
    document.head.append(template.content);
  }, [pathname, search]);
  return null;
}
