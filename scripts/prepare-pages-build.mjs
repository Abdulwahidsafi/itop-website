import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { publishedRoutes, sitePageMeta, siteUrl } from '../src/siteMeta.mjs';

const output = new URL('../dist/client/', import.meta.url);
const html = await readFile(new URL('index.html', output), 'utf8');
const escapeHtml = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function pageHtml(route) {
  const meta=sitePageMeta(route);
  const tags=[
    `<meta name="robots" content="${meta.indexable ? 'index,follow' : 'noindex,follow'}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="iTop Phones &amp; Repair Center" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${siteUrl}assets/itop-logo.png" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  ];
  if(meta.canonical) tags.push(`<link rel="canonical" href="${meta.canonical}" />`, `<meta property="og:url" content="${meta.canonical}" />`);
  return html.replace(/<title>[^<]*<\/title>/, '<title>'+escapeHtml(meta.title)+'</title>')
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, '$1'+escapeHtml(meta.description)+'$2')
    .replace('</head>', tags.join('\n    ')+'\n  </head>');
}
for (const route of publishedRoutes) {
  await mkdir(new URL(route, output), {recursive:true});
  await writeFile(new URL(route+'index.html', output),pageHtml(route));
}
await writeFile(new URL('404.html',output),pageHtml('page-not-found'));
await writeFile(new URL('sitemap.xml',output),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+publishedRoutes.map(route=>`  <url><loc>${escapeHtml(siteUrl+route)}</loc></url>`).join('\n')+'\n</urlset>\n');
await writeFile(new URL('.nojekyll', output), '');

