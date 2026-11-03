import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { wholesaleProducts, filterWholesaleProducts, catalogueQuoteItems } from '../src/wholesaleCatalogue.mjs';
import { wholesaleProductName } from '../src/wholesalePresentation.mjs';
import { wholesaleStylePhoto } from '../src/wholesalePhotos.mjs';

test('shared photos cover matching styles across models and exist on disk', () => {
  const expected = { Frame:16, Fashion:2, Colourful:33, Shockproof:63, Bracket:7, Blurred:21, Shiny:46, Thin:56, 'Packaged Magnetic':11 };
  for (const [style, count] of Object.entries(expected)) {
    const products = wholesaleProducts.filter(p => p.name.startsWith(style + ' Case — '));
    assert.equal(products.length, count, style);
    const paths = new Set(products.map(p => wholesaleStylePhoto(p).path));
    assert.equal(paths.size, 1);
    assert.ok(existsSync(new URL('../public/' + [...paths][0], import.meta.url)));
  }
  for (const product of wholesaleProducts) {
    const photo=wholesaleStylePhoto(product);
    assert.ok(photo,product.id);
    assert.ok(existsSync(new URL('../public/'+photo.path,import.meta.url)),product.id);
  }
});

test('colourful listings in fashion collections use the colourful photo', () => {
  const products = wholesaleProducts.filter(p => p.collection.includes('Fashion') && p.name.startsWith('Colourful'));
  assert.ok(products.length > 0);
  for (const p of products) assert.equal(wholesaleStylePhoto(p).path, 'images/wholesale/colourful.jpeg');
});

test('catalogue count, exceptional selling prices and quote selection are preserved', () => {
  assert.equal(wholesaleProducts.length, 330);
  assert.equal(filterWholesaleProducts('A14 shockproof')[0].cataloguePricePence, 128);
  assert.equal(filterWholesaleProducts('11 Pro Max colourful')[0].cataloguePricePence, 199);
  const product = filterWholesaleProducts('16 Pro blurred')[0];
  assert.ok(wholesaleStylePhoto(product));
  assert.equal(catalogueQuoteItems([{id:product.id, quantity:'2', unit:'Items'}])[0].product, wholesaleProductName(product));
});
