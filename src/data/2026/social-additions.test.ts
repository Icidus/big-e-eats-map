import { expect, it } from 'vitest';
import { catalogItems } from '@/features/catalog/catalog';
it('includes confirmed social-menu foods with exact post citations and no invented newness', () => {
  for (const name of ['Bucket of Moinks','Bear Necessit-E Sandwich','Hot Popovers with Flavored Butter','Rhode Island-style Calamari','Kelewele','Jollof Arancini','Turkey Tails on a Stick','Hibiscus Sun','Mango Paradise','Lychee Bloom','Lavender Moon','Chicken Pot Hand Pie','Pulled Pork Mac & Cheese Hand Pie','Shepherd’s Hand Pie','Warm Apple Hand Pie']) {
    const item = catalogItems.find(i=>i.name===name);
    expect(item, name).toBeDefined();
    expect(item?.source.url).toMatch(/instagram.com\/.*\/(p|reel)\//);
    expect(item?.isNewFor2026).toBe(false);
    expect(item?.dietaryClaims).toEqual([]);
  }
  expect(catalogItems.find(i=>i.vendor==="Joey's Deli & Market" && i.name==='Whoopie Pies')).toBeDefined();
});
