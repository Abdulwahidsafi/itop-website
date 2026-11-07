import test from 'node:test';
import assert from 'node:assert/strict';
import { repairPriceRows, repairPriceOptions, repairMoney, repairDeposit, appointmentSettings } from '../src/repairPrices.mjs';
import { repairBrands } from '../src/repairCatalogue.mjs';

test('owner price list maps to exact existing models and integer amounts',()=>{
  assert.equal(repairPriceRows.length,22);
  assert.equal(new Set(repairPriceRows.map(row=>row.model)).size,22);
  const names=new Set(repairBrands.find(brand=>brand.id==='iphone').models.map(model=>model.name));
  for(const row of repairPriceRows){
    assert.ok(names.has(row.model),row.model);
    for(const price of [row.screenPence,row.batteryPence]) assert.ok(Number.isSafeInteger(price)&&price>0);
  }
  assert.equal(repairPriceOptions('iPhone XR','Screen replacement')[0].pricePence,4500);
  assert.equal(repairPriceOptions('iPhone 11 Pro Max','Screen replacement')[0].pricePence,6000);
  assert.equal(repairPriceOptions('iPhone 17 Pro Max','Screen replacement')[0].pricePence,9900);
});
test('every second battery option adds exactly ten pounds',()=>{
  for(const row of repairPriceRows){const options=repairPriceOptions(row.model,'Battery replacement');assert.equal(options.length,2);assert.equal(options[1].pricePence-options[0].pricePence,1000);}
  assert.equal(repairPriceOptions('iPhone 13','Battery replacement')[0].pricePence,5500);
  assert.equal(repairPriceOptions('iPhone 17 Pro Max','Battery replacement')[1].pricePence,9000);
});
test('soft OLED uses the confirmed exact prices',()=>{
  assert.equal(repairPriceOptions('iPhone 12 Pro Max','Screen replacement')[1].pricePence,7500);
  assert.equal(repairPriceOptions('iPhone 16','Screen replacement')[1].pricePence,9900);
  assert.equal(repairPriceOptions('iPhone 17 Pro Max','Screen replacement')[1].pricePence,13000);
  for(const name of ['iPhone XR','iPhone 11']) assert.equal(repairPriceOptions(name,'Screen replacement').length,1);
  assert.equal(repairPriceOptions('iPhone 12','Screen replacement')[1].pricePence,6000);
  assert.equal(repairPriceOptions('iPhone 12 Pro','Screen replacement')[1].pricePence,7000);
  assert.equal(repairPriceOptions('iPhone 13','Screen replacement')[1].pricePence,7000);
});

test('deposits respect strict boundaries and balance reconciles to total',()=>{
  for(const [total,deposit] of [[4500,1500],[5999,1500],[6000,2000],[7999,2000],[8000,2500],[13000,2500]]){
    const result=repairDeposit(total);assert.equal(result.depositPence,deposit);assert.equal(result.balancePence+result.depositPence,total);
  }
  for(const row of repairPriceRows)for(const issue of ['Screen replacement','Battery replacement'])for(const option of repairPriceOptions(row.model,issue)) assert.ok(repairDeposit(option.pricePence).balancePence>0);
  assert.throws(()=>repairDeposit(0));assert.throws(()=>repairDeposit(99.5));assert.throws(()=>repairDeposit(100));
  assert.equal(appointmentSettings.slotMinutes,60);assert.equal(appointmentSettings.capacity,3);assert.deepEqual(appointmentSettings.opening.sunday,['10:30','16:30']);assert.equal(appointmentSettings.onlineBookingEnabled,false);
});
test('unknown models, iPhone 18 and unpriced repairs never get a fallback price',()=>{
  for(const model of ['iPhone 18 Pro','iPhone 18 Pro Max','iPhone 13 mini','iPhone 15 Plus','iPhone 17e']) for(const issue of ['Screen replacement','Battery replacement']) assert.deepEqual(repairPriceOptions(model,issue),[]);
  assert.deepEqual(repairPriceOptions('iPhone 15','Charging fault'),[]);
  assert.deepEqual(repairPriceOptions('iPhone 1','Screen replacement'),[]);
  assert.equal(repairMoney(9900),'£99');assert.throws(()=>repairMoney(0));assert.throws(()=>repairMoney(99.5));
});
