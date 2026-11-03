import test from 'node:test';
import assert from 'node:assert/strict';
import {publishedRoutes, sitePageMeta, siteUrl} from '../src/siteMeta.mjs';
import {readFile} from 'node:fs/promises';
const esc = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;');

test('public metadata uses the agreed business domain',()=>{
  assert.equal(siteUrl, 'https://itopgroup.co.uk/');
});
test('every published route has static titles, descriptions and matching canonical URLs',async()=>{
  for(const route of publishedRoutes){
    const meta=sitePageMeta(route), html=await readFile(`dist/client/${route}index.html`,'utf8');
    assert.ok(html.includes(`<title>${esc(meta.title)}</title>`),route);
    assert.ok(html.includes(`name="description" content="${esc(meta.description)}"`),route);
    assert.ok(html.includes(`rel="canonical" href="${siteUrl+route}"`),route);
    assert.ok(html.includes(`property="og:title" content="${esc(meta.title)}"`),route);
  }
  const sitemap=await readFile('dist/client/sitemap.xml','utf8');
  assert.equal((sitemap.match(/<loc>/g)||[]).length,publishedRoutes.length);
  assert.equal(new Set(publishedRoutes).size,publishedRoutes.length);
  const notFound=await readFile('dist/client/404.html','utf8');
  assert.ok(notFound.includes('noindex,follow'));
  assert.ok(!notFound.includes('rel="canonical"'));
  for(const route of ['unknown','repairs/apple/unknown','wholesale/missing']) assert.equal(sitePageMeta(route).indexable,false);
});
