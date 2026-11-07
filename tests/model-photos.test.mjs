import test from 'node:test';
import assert from 'node:assert/strict';
import { modelPhoto, modelPhotoData } from '../src/modelPhotos.mjs';
import { repairBrands } from '../src/repairCatalogue.mjs';
test('every listed model has an exact branded image and retained source', () => {
  const models = repairBrands.flatMap(brand => brand.models.map(model => ({brand: brand.name, model: model.name})));
  assert.equal(modelPhotoData.length, models.length);
  for (const item of models) {
    const photo=modelPhoto(item.brand,item.model);
    assert.ok(photo, item.model);
    assert.equal(photo.model,item.model);
    assert.equal(photo.brand,item.brand);
    assert.equal(new URL(photo.src).protocol,'https:');
    assert.equal(new URL(photo.source).protocol,'https:');
    assert.ok(photo.sourceModel);
  }
});
test('similar generations, sizes and brands never borrow another model photo', () => {
  for (const model of ['iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 12 mini']) assert.equal(modelPhoto('Apple',model).model,model);
  assert.notEqual(modelPhoto('Apple','iPhone 12 Pro').src,modelPhoto('Apple','iPhone 12 Pro Max').src);
  assert.equal(modelPhoto('Apple','iPhone 12 Pro M'),null);
  assert.equal(modelPhoto('Samsung','iPhone 12 Pro'),null);
  assert.equal(modelPhoto('Apple',''),null);
  assert.equal(modelPhoto('Apple','iPhone 99'),null);
  assert.equal(modelPhoto(' Apple ',' iphone 12 pro ').model,'iPhone 12 Pro');
});
