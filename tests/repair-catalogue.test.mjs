import test from 'node:test';
import assert from 'node:assert/strict';
import { repairBrands, repairPageRoutes, findRepairPage, repairPageMeta } from '../src/repairCatalogue.mjs';
test('every model has a unique refreshable route and resolves to its brand and model',()=>{
  assert.equal(new Set(repairPageRoutes).size,repairPageRoutes.length);
  for (const brand of repairBrands) {
    assert.equal(findRepairPage('repairs/'+brand.id+'/').brand.name,brand.name);
    for (const model of brand.models) {
      const page=findRepairPage(model.route);
      assert.equal(page.valid,true);
      assert.equal(page.model.name,model.name);
      assert.equal(page.brand.name,brand.name);
      assert.ok(repairPageMeta(model.route).title.includes(model.name));
    }
  }
});
test('unknown or partial paths do not select a different phone',()=>{
  for(const route of ['repairs/iphone/iphone-14-pro-fake','repairs/unknown/model','repairs/iphone-extra','repairs/iphone/iphone-14/extra']) assert.equal(findRepairPage(route).valid,false);
  assert.equal(findRepairPage('repairs/iphone/iphone-14-pro-max/').model.name,'iPhone 14 Pro Max');
});

test('expanded directory includes verified latest models and preserves existing links',()=>{
  for (const [route,name] of [
    ['repairs/iphone/iphone-18-pro/','iPhone 18 Pro'],
    ['repairs/iphone/iphone-18-pro-max/','iPhone 18 Pro Max'],
    ['repairs/iphone/iphone-16e/','iPhone 16e'],
    ['repairs/iphone/iphone-se-2022/','iPhone SE (2022)'],
    ['repairs/samsung/galaxy-s26-ultra/','Galaxy S26 Ultra'],
    ['repairs/samsung/galaxy-a57/','Galaxy A57'],
    ['repairs/google/pixel-11-pro-xl/','Pixel 11 Pro XL'],
    ['repairs/google/pixel-10a/','Pixel 10a'],
  ]) assert.equal(findRepairPage(route).model.name,name);
  for (const brand of repairBrands) for (const model of brand.models) assert.ok(model.series);
  assert.equal(findRepairPage('repairs/iphone/iphone-18-plus/').valid,false);
});
