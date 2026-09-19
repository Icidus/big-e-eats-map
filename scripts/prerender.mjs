import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { build } from 'vite';

const base = process.env.BASE_PATH ?? '/';
const template = await readFile('dist/index.html', 'utf8');
await build({ build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr' } });
const { renderPage, getPageSeo, renderSeoHead, indexablePaths, SITE_URL } = await import('../dist-ssr/entry-server.js');
function pageHtml(path, content) {
  return template
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, () => `<!-- seo:start -->\n${renderSeoHead(getPageSeo(path))}\n<!-- seo:end -->`)
    .replace('<div id="root"></div>', () => `<div id="root">${content}</div>`);
}
for (const path of indexablePaths) {
  const directory = `dist${path === '/' ? '' : path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, pageHtml(path, renderPage(path, base)));
}
// A real 404 body also disables indexing on hosts with SPA fallback routing.
await writeFile('dist/404.html', pageHtml('/404', renderPage('/404', base)));
// Emit real files for interactive routes so a custom 404 does not break deep links.
for (const path of ['/map', '/plan', '/drinks', '/masslive-favorites']) {
  await mkdir(`dist${path}`, { recursive: true });
  await writeFile(`dist${path}/index.html`, pageHtml(path, ''));
}
const entries = indexablePaths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
console.log(`Generated ${indexablePaths.length} search-ready pages.`);
