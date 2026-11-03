import fs from 'node:fs/promises';
import {validateRetailProducts} from '../src/retailProducts.mjs';
const products = validateRetailProducts(JSON.parse(await fs.readFile(new URL('../src/retail-products.json',import.meta.url),'utf8')));
for (const product of products) {
  if (product.status !== 'published') throw new Error('Keep drafts outside the public website snapshot: '+product.id);
  if (product.image) await fs.access(new URL('../public/'+product.image,import.meta.url));
}
console.log('Verified '+products.length+' approved retail products.');
