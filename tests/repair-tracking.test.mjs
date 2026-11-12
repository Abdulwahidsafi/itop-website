import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanJobNumber, lastFourDigits, trackingFormProblem, trackRepair, trackingEndpoint, pounds, shortDate } from '../src/repairTracking.mjs';
import { sitePageMeta, mainPageRoutes } from '../src/siteMeta.mjs';

test('repair tracking: job number and phone digits are checked before anything is sent', async () => {
  assert.equal(cleanJobNumber(' r12 '), 'R000012'); assert.equal(cleanJobNumber('R000123'), 'R000123'); assert.equal(cleanJobNumber('abc'), ''); assert.equal(cleanJobNumber('12 3'), '');
  assert.equal(lastFourDigits('12 34'), '1234'); assert.equal(lastFourDigits('123'), ''); assert.equal(lastFourDigits('07000123456'), '');
  assert.match(trackingFormProblem('', '1234'), /job number/); assert.match(trackingFormProblem('R1', '12'), /last 4 digits/); assert.equal(trackingFormProblem('R1', '1234'), '');
  let called = 0; const r = await trackRepair('nope', '1234', async () => { called++; }); assert.equal(r.ok, false); assert.equal(called, 0);
});

test('repair tracking: asks the shop system and reports answers and failures in plain words', async () => {
  const sent = [];
  const good = await trackRepair('r2', '3456', async (url, options) => { sent.push([url, options]); return {ok:true, json:async () => ({reference:'R000002', label:'Being repaired'})}; });
  assert.deepEqual(good, {ok:true, repair:{reference:'R000002', label:'Being repaired'}});
  assert.equal(sent[0][0], trackingEndpoint); assert.ok(trackingEndpoint.startsWith('https://shop.itopgroup.co.uk/'));
  assert.equal(sent[0][1].method, 'POST'); assert.equal(sent[0][1].headers['Content-Type'], 'text/plain'); assert.deepEqual(JSON.parse(sent[0][1].body), {reference:'R000002', phone:'3456'});
  assert.equal(sent[0][0].includes('3456'), false, 'the phone digits are never put in the address');
  const missing = await trackRepair('2', '0000', async () => ({ok:false, json:async () => ({error:'We could not find a repair with that job number and phone number.'})})); assert.equal(missing.ok, false); assert.match(missing.message, /could not find/);
  const broken = await trackRepair('2', '0000', async () => ({ok:false, json:async () => { throw Error('not json'); }})); assert.match(broken.message, /try again/i);
  const offline = await trackRepair('2', '0000', async () => { throw Error('offline'); }); assert.match(offline.message, /could not reach/);
  assert.equal(pounds(14500), '£145.00'); assert.equal(pounds(-5), '£0.00'); assert.equal(shortDate('2026-11-12T12:00:00.000Z'), '12 Nov 2026'); assert.equal(shortDate('x'), '');
});

test('repair tracking: the page is published with its own title', () => {
  assert.ok(mainPageRoutes.includes('track-repair/')); const meta = sitePageMeta('track-repair/'); assert.equal(meta.indexable, true); assert.equal(meta.canonical, 'https://itopgroup.co.uk/track-repair/'); assert.match(meta.title, /Track Your Repair/);
});
