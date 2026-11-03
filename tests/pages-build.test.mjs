import test from 'node:test';
import assert from 'node:assert/strict';
import { businessPageMeta } from '../src/businessPageMeta.mjs';
import { mainPageRoutes } from '../src/siteMeta.mjs';
import { repairPageRoutes, repairPageMeta } from '../src/repairCatalogue.mjs';
import { readFile, access } from 'node:fs/promises';

test('publishes compiled pages and assets at the custom domain root', async () => {
  for (const route of [...mainPageRoutes, ...repairPageRoutes]) {
    const html = await readFile(`dist/client/${route}index.html`, 'utf8');
    if (repairPageRoutes.includes(route)) assert.ok(html.includes('<title>'+repairPageMeta(route).title+'</title>'), 'repair page must identify its model in its HTML title');
    const businessMeta=businessPageMeta[route.replace(/\/$/,'')];
    if (businessMeta) assert.ok(html.includes('<title>'+businessMeta.title.replaceAll('&','&amp;')+'</title>'), 'business routes need their own static titles');
    assert(!html.includes('/src/main.jsx'), 'Pages must publish compiled JavaScript');
    assert(!html.includes('/itop-website/'), 'custom domain pages must not retain the repository prefix');
    const assets = [...html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)].map(match => match[1]);
    assert(assets.some(path => path.endsWith('.js')), 'page must reference its compiled entry');
    for (const path of assets) await access(`dist/client/${path.slice(1)}`);
  }
  for (const image of ['itop-logo.png', 'protection.png', 'power.png', 'audio.png']) await access(`dist/client/assets/${image}`);
  await access('dist/client/.nojekyll');
});
