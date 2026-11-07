import test from 'node:test';
import assert from 'node:assert/strict';
import {benchmarkRepairPrices} from '../src/benchmarkRepairPrices.mjs';
import {repairPriceOptions,repairDeposit,hasRepairPrices} from '../src/repairPrices.mjs';
import {repairBrands} from '../src/repairCatalogue.mjs';

test('iPhone back glass respects every generation boundary and leaves unapproved models unpriced',()=>{
  for(const [models,price] of [
    [['iPhone 11','iPhone 11 Pro Max','iPhone 12 mini','iPhone 13 mini','iPhone 14 Plus','iPhone 14 Pro Max'],6000],
    [['iPhone 15','iPhone 15 Plus','iPhone 15 Pro Max','iPhone 16','iPhone 16 Plus','iPhone 16e','iPhone 16 Pro Max'],7500],
    [['iPhone 17','iPhone 17e','iPhone Air','iPhone 17 Pro','iPhone 17 Pro Max'],8500],
  ])for(const model of models){const option=repairPriceOptions(model,'Back glass replacement')[0];assert.equal(option.pricePence,price,model);assert.equal(repairDeposit(price).depositPence,price<8000?2000:2500);assert.equal(hasRepairPrices(model),true);}
  for(const model of ['iPhone XR','iPhone X','iPhone SE (2022)','iPhone 18 Pro','iPhone 18 Pro Max','iPhone Duo','iPhone 140'])assert.deepEqual(repairPriceOptions(model,'Back glass replacement'),[]);
});
test('every benchmark price is exactly 10 percent below its checked source, with a valid balance',()=>{
  const keys=new Set();
  const phoneNames=new Set(repairBrands.flatMap(brand=>brand.models.map(model=>model.name)));
  for(const row of benchmarkRepairPrices){
    assert.ok(Number.isSafeInteger(row.sourcePence)&&row.sourcePence>0);
    assert.equal(row.pricePence,Math.round(row.sourcePence*9/10));
    assert.ok(repairDeposit(row.pricePence).balancePence>=0);
    assert.equal(new URL(row.sourceUrl).hostname,'www.ismash.com');
    assert.equal(row.checkedAt,'2026-11-07');
    assert.ok(row.sourceTitle&&row.sourceVariantIds.length);
    if(row.device==='Phone')assert.ok(phoneNames.has(row.model),row.model);
    if(row.device==='Laptop')assert.ok(row.sourceTitle.includes(row.model.match(/A[0-9]{4}/)[0]),row.model);
    const key=[row.model,row.issue,row.id].join('|');assert.ok(!keys.has(key),key);keys.add(key);
    assert.equal(repairPriceOptions(row.model,row.issue).find(item=>item.id===row.id).pricePence,row.pricePence);
  }
});
test('model, part and repair distinctions survive the import without inventing premium parts',()=>{
  assert.equal(repairPriceOptions('Galaxy S24 Ultra','Screen replacement')[0].pricePence,17910);
  assert.equal(repairPriceOptions('Galaxy S24 Ultra','Battery replacement')[0].pricePence,5850);
  assert.equal(repairPriceOptions('Galaxy S24 Ultra','Battery replacement').length,1);
  const fold=repairPriceOptions('Galaxy Z Flip5','Screen replacement');assert.equal(fold.length,2);assert.equal(fold.find(item=>item.label.includes('Inner')).pricePence,25110);assert.equal(fold.find(item=>item.label.includes('Outer')).pricePence,10710);
  const camera=repairPriceOptions('Pixel 8a','Camera / speaker / microphone');assert.equal(camera.find(item=>item.label.includes('Ultra Wide')).pricePence,7110);assert.equal(camera.find(item=>item.label.endsWith('· Wide')).pricePence,8910);
  assert.equal(repairPriceOptions('iPad 10th Gen (2022)','Screen replacement')[0].pricePence,8910);assert.match(repairPriceOptions('iPad 10th Gen (2022)','Screen replacement')[0].note,/not the LCD/);
  assert.equal(repairPriceOptions('MacBook Air 13 inch (A2337)','Screen replacement')[0].pricePence,26910);
  assert.equal(repairPriceOptions('iPhone 17 Pro Max','Screen replacement')[0].pricePence,9900);
  for(const model of ['Galaxy S24 Ultr','Galaxy S26 Ultra','Pixel 10a','iPhone 18 Pro Max'])assert.deepEqual(repairPriceOptions(model,model==='Pixel 10a'?'Battery replacement':'Screen replacement'),[]);
});
