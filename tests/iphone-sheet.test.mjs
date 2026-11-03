import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { iphoneModels, iphoneStorageOptions, canonicalIPhoneModel } from '../src/iphoneModels.mjs';
import { importIPhoneSheet, iphoneSheetHeaders } from '../src/iphoneSheet.mjs';
import { parseIPhonePrices, getIPhoneQuote, explainIPhoneQuote } from '../src/iphoneQuotes.mjs';
const prices=parseIPhonePrices(fs.readFileSync(new URL('../src/iphone-prices.csv',import.meta.url),'utf8'));
const now=new Date('2026-10-10T12:00:00Z');
const values=records=>[iphoneSheetHeaders,...records.map(row=>iphoneSheetHeaders.map(key=>row[key]??''))];

test('supported modern iPhones cover each released capacity, listed colour and working grade',()=>{
  const models=iphoneModels.filter(model=>Number(model.match(/^iPhone (\d+)/)?.[1])>=11 || model==='iPhone Air' || model==='iPhone SE (2nd Generation)' || model==='iPhone SE (3rd Generation)');
  assert.equal(models.length,33);
  for(const model of models){
    const colours=[...new Set(prices.filter(row=>row.model===model).map(row=>row.colour))];
    assert.ok(colours.length>=2,model);
    for(const storage of iphoneStorageOptions(model))for(const colour of colours)for(const grade of ['A','B','C']){
      const quote=getIPhoneQuote(prices,{mode:'direct',model,storage,colour,network:'Unlocked',grade,faults:'no'},now);
      assert.ok(quote,`${model} ${storage} ${colour} ${grade}`);
      assert.equal(quote.offer,quote.record.cexCash+20);
    }
  }
});

test('iPhone 18 Pro Max has a checked quote for every listed unlocked storage, colour and grade',()=>{
  for(const storage of ['256GB','512GB','1TB','2TB'])for(const colour of ['Black','Silver','Glacier','Burgundy'])for(const grade of ['A','B','C']){
    const details={mode:'direct',model:'iPhone 18 Pro Max',storage,colour,network:'Unlocked',grade,faults:'no'};
    const quote=getIPhoneQuote(prices,details,now);
    assert.ok(quote,`${storage} ${colour} ${grade}`);
    assert.equal(quote.offer,quote.record.cexCash+20);
    assert.equal(getIPhoneQuote(prices,{...details,faults:'yes'},now),null);
    assert.equal(getIPhoneQuote(prices,{...details,network:'Locked'},now),null);
  }
});

test('every agreed modern model has at least one checked exact variant',()=>{
  const priority=iphoneModels.filter(model=>Number(model.match(/^iPhone (\d+)/)?.[1])>=11 || model==='iPhone Air' || /SE \([23]rd Generation\)|SE \(2nd Generation\)/.test(model));
  for(const model of priority)assert.ok(prices.some(row=>row.model===model),model);
  for(const row of prices)assert.ok(iphoneStorageOptions(row.model).includes(row.storage),row.id);
  assert.ok(iphoneModels.includes('iPhone SE (1st Generation)'));
  assert.ok(iphoneModels.includes('iPhone (original)'));
  assert.ok(!iphoneModels.includes('iPhone Duo'));
  assert.equal(new Set(iphoneModels).size,iphoneModels.length);
});
test('storage choices distinguish mini, Pro and Pro Max generations',()=>{
  assert.deepEqual(iphoneStorageOptions('iPhone 11 Pro'),['64GB','256GB','512GB']);
  assert.deepEqual(iphoneStorageOptions('iPhone 12 mini'),['64GB','128GB','256GB']);
  assert.ok(!iphoneStorageOptions('iPhone 15 Pro Max').includes('128GB'));
  assert.ok(iphoneStorageOptions('iPhone 14 Pro Max').includes('128GB'));
  assert.deepEqual(iphoneStorageOptions('iPhone SE (2022)'),['64GB','128GB','256GB']);
  assert.equal(canonicalIPhoneModel('iPhone SE (2020)'),'iPhone SE (2nd Generation)');
  assert.deepEqual(iphoneStorageOptions('Another phone'),[]);
});
test('private-sheet snapshot preserves dates, overrides and exact records',()=>{
  const imported=importIPhoneSheet([...values(prices),Array(11).fill('')],now);
  assert.deepEqual(imported.prices,prices);
  const row={...prices[0],override:160.25,enabled:false};
  assert.deepEqual(importIPhoneSheet(values([row]),now).prices,[row]);
  assert.equal(getIPhoneQuote([row],{...row,faults:'no'},now),null);
});
test('import blocks unsafe references and unexpected sheet structure before writing',()=>{
  assert.throws(()=>importIPhoneSheet([['wrong'],[]],now));
  assert.throws(()=>importIPhoneSheet([iphoneSheetHeaders],now));
  for(const row of [{...prices[0],model:'iPhone 99'},{...prices[0],storage:'2TB'},{...prices[0],checkedAt:'2026-10-03'},{...prices[0],checkedAt:'2026-10-11'}])assert.throws(()=>importIPhoneSheet(values([row]),now));
  assert.throws(()=>importIPhoneSheet(values([prices[0],prices[0]]),now));
  const extra=values([prices[0]]);extra[1].push('unexpected');assert.throws(()=>importIPhoneSheet(extra,now));
  assert.equal(importIPhoneSheet(values([{...prices[0],checkedAt:'2026-10-01',enabled:false}]),now).prices[0].enabled,false);
});
test('manual-quote explanations distinguish faults, network, paused and stale prices',()=>{
  const row=prices.find(row=>row.model==='iPhone 13 mini'&&row.grade==='B');
  const details={...row,faults:'no',mode:'direct'};
  assert.equal(getIPhoneQuote([row],details,now).offer,row.cexCash+20);
  assert.equal(getIPhoneQuote([row],{...details,model:'iPhone 13 Pro'},now),null);
  assert.match(explainIPhoneQuote([row],{...details,faults:'yes'},now),/inspection/);
  assert.match(explainIPhoneQuote([row],{...details,network:'Not sure'},now),/network/);
  assert.match(explainIPhoneQuote([{...row,enabled:false}],details,now),/paused/);
  assert.match(explainIPhoneQuote([row],details,new Date('2026-10-17')),/fresh price check/);
  assert.match(explainIPhoneQuote([row],{...details,storage:'512GB'},now),/exact model/);
});
