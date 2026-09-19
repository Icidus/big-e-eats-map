import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import { AppRoutes } from "./App";
export { getPageSeo, indexablePaths, renderSeoHead, SITE_URL } from "@/features/seo/seo";

export function renderPage(path: string, base: string): string {
  const location = `${base.replace(/\/$/, "")}${path}`;
  return renderToString(<TooltipProvider><FoodPlanProvider><StaticRouter basename={base} location={location}><AppRoutes /></StaticRouter></FoodPlanProvider></TooltipProvider>);
}
