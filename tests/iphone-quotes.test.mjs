import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseIPhonePrices, getIPhoneQuote, buildIPhoneMessage, explainIPhoneQuote } from '../src/iphoneQuotes.mjs';
const csv = fs.readFileSync(new URL('../src/iphone-prices.csv', import.meta.url), 'utf8');
const prices = parseIPhonePrices(csv);
const now = new Date('2026-10-10T12:00:00Z');
const fixture = { ...prices[0], cexCash:123, override:null, checkedAt:'2026-10-10', enabled:true };
const details = { ...fixture, mode: 'direct', faults: 'no', batteryStatus: 'no', battery: '88' };
const sample = [fixture];

test('all verified reference rows produce a cash-price plus £20 offer', () => {
  assert.ok(prices.length > 0);
  for (const row of prices) {
    const quote = getIPhoneQuote([{...row,enabled:true}], { ...row, faults: 'no', mode: 'direct' }, new Date(row.checkedAt+'T12:00:00Z'));
    assert.equal(quote.offer, row.override ?? row.cexCash + 20);
    assert.equal(quote.record.id, row.id);
  }
});
test('a mismatched storage, colour, network, condition or model never borrows a price', () => {
  for (const key of ['model', 'storage', 'colour', 'network', 'grade']) assert.equal(getIPhoneQuote(sample, { ...details, [key]: 'unlisted' }, now), null);
  for (const faults of ['', 'yes']) assert.equal(getIPhoneQuote(sample, { ...details, faults }, now), null);
  assert.equal(getIPhoneQuote(sample, { ...details, mode:'broker' }, now), null);
});
test('stale, future and disabled records produce a manual quote; overrides remain independent', () => {
  assert.equal(getIPhoneQuote(sample, details, new Date('2026-10-17T00:00:00Z')), null);
  assert.equal(getIPhoneQuote(sample, details, new Date('2026-10-09T12:00:00Z')), null);
  assert.equal(getIPhoneQuote([{...fixture,enabled:false}], details, now), null);
  const quote=getIPhoneQuote([{...fixture,override:155.50}],details,now);
  assert.equal(quote.offer,155.50); assert.equal(quote.usesReference,false);
});
test('invalid money, sources, dates and duplicate variants fail the import', () => {
  const header=csv.split('\n')[0];
  const serialize=row=>header+'\n'+header.split(',').map(key=>'"'+String(row[key]??'').replaceAll('"','""')+'"').join(',')+'\n';
  for (const row of [{...fixture,cexCash:-1},{...fixture,cexCash:NaN},{...fixture,checkedAt:'2026-02-30'},{...fixture,sourceUrl:fixture.sourceUrl.replace('uk.webuy.com','example.com')}]) assert.throws(()=>parseIPhonePrices(serialize(row)));
  assert.throws(()=>parseIPhonePrices(serialize(fixture)+serialize(fixture).split('\n')[1]+'\n'));
  assert.equal(parseIPhonePrices('\uFEFF'+csv.replaceAll('\n','\r\n')).length,prices.length);
});
test('preview includes the verified estimate and source, while broker/fault flows exclude it', () => {
  const message=buildIPhoneMessage(sample,details,now);
  assert.match(message,/Estimated iTop offer: £143.00/);
  assert.match(message,/CeX cash £123.00 \+ £20; checked 2026-10-10/);
  assert.match(message,/Battery health: 88%/);
  assert.match(buildIPhoneMessage(sample,{...details,faults:'yes'},now),/manual quote/);
  const broker=buildIPhoneMessage(sample,{...details,mode:'broker'},now);
  assert.match(broker,/fees and payout terms/); assert.doesNotMatch(broker,/£143|CeX cash|Estimated iTop offer/);
  const override=buildIPhoneMessage([{...fixture,override:155}],details,now);
  assert.match(override,/iTop set price/); assert.doesNotMatch(override,/CeX cash|\+ £20/);
  assert.throws(()=>buildIPhoneMessage(prices,{model:' '},now));
});
test('battery warnings, symptoms and uncertainty require inspection without inventing deductions', () => {
  for (const batteryStatus of ['', 'service', 'problem', 'unknown']) {
    const batteryDetails = { ...details, batteryStatus };
    assert.equal(getIPhoneQuote(sample, batteryDetails, now), null);
    assert.match(explainIPhoneQuote(sample, batteryDetails, now), /check the battery/);
    const message = buildIPhoneMessage(sample, batteryDetails, now);
    assert.match(message, /manual quote/);
    assert.doesNotMatch(message, /Estimated iTop offer|CeX cash/);
  }
  for (const battery of ['', '79', '88', '100']) {
    assert.equal(getIPhoneQuote(sample, {...details, battery}, now).offer, 143);
  }
  assert.match(buildIPhoneMessage(sample, {...details,batteryStatus:'service'},now), /Battery status: Service \/ replacement warning/);
  assert.match(buildIPhoneMessage(sample, {...details,faults:'unknown'},now), /Known faults: Not sure \/ unable to check/);
});
