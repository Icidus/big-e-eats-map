import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert(urls.includes('https://bigeeats.com/vendors/annas-fried-dough'));
assert(!urls.some((url) => url.includes('?') || url.endsWith('/plan')));
for (const url of urls) {
  const path = new URL(url).pathname;
  const file = `dist${path === '/' ? '' : path}/index.html`;
  assert(existsSync(file), `Missing generated page: ${file}`);
  const html = readFileSync(file, 'utf8');
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, file);
  assert(html.includes(`rel="canonical" href="${url}"`), file);
  assert(html.includes('<h1'), `No initial content: ${file}`);
  assert(html.includes('application/ld+json'), file);
}
const anna = readFileSync('dist/vendors/annas-fried-dough/index.html', 'utf8');
assert(anna.includes('Doughco'));
assert(anna.includes('East Road'));
assert(readFileSync('dist/robots.txt', 'utf8').includes('Sitemap: https://bigeeats.com/sitemap.xml'));
assert(readFileSync('dist/404.html', 'utf8').includes('noindex, follow'));
console.log(`SEO checks passed: ${urls.length} crawlable pages, canonical URLs, content and sitemap.`);
