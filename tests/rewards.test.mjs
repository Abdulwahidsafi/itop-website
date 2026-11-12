import test from 'node:test';
import assert from 'node:assert/strict';
import { rewardsEndpoint, parseReceiptHash, signInProblem, loadMember, loadProgramme, earnRows, percent, pounds, wholePounds, friendMessage } from '../src/rewards.mjs';
import { sitePageMeta, mainPageRoutes } from '../src/siteMeta.mjs';

test('rewards: receipt QR codes and the sign-in form are checked before anything is sent', async () => {
  assert.deepEqual(parseReceiptHash('#abc234-123456'), {code:'ABC234', pin:'123456'}); assert.equal(parseReceiptHash('#ABC234-12345'), null); assert.equal(parseReceiptHash(''), null); assert.equal(parseReceiptHash('#<script>'), null);
  assert.match(signInProblem('123', '123456'), /mobile number/); assert.match(signInProblem('07700 900111', '12'), /6-digit PIN/); assert.equal(signInProblem('+44 7700 900111', '123456'), '');
  let called = 0; const r = await loadMember({phone:'1', pin:'123456'}, async () => { called++; }); assert.equal(r.ok, false); assert.equal(called, 0);
});

test('rewards: asks the shop system and reports answers and failures in plain words', async () => {
  const sent = [];
  const reply = body => async (url, options) => { sent.push([url, JSON.parse(options.body), options]); return body; };
  const good = await loadMember({phone:' 07700 900111 ', pin:'123456'}, reply({ok:true, json:async () => ({member:{points:250}, programme:{minRedeem:500}})}));
  assert.deepEqual(good, {ok:true, member:{points:250}, programme:{minRedeem:500}});
  assert.equal(sent[0][0], rewardsEndpoint); assert.deepEqual(sent[0][1], {phone:'07700 900111', pin:'123456'}); assert.equal(sent[0][2].headers['Content-Type'], 'text/plain'); assert.equal(sent[0][0].includes('123456'), false, 'the PIN is never put in the address');
  await loadMember({code:'ABC234', pin:'654321'}, reply({ok:true, json:async () => ({member:{points:1}})})); assert.deepEqual(sent[1][1], {code:'ABC234', pin:'654321'});
  const wrong = await loadMember({phone:'07700900111', pin:'000000'}, reply({ok:false, json:async () => ({error:'That phone number and PIN do not match.'})})); assert.equal(wrong.ok, false); assert.match(wrong.message, /do not match/);
  const offline = await loadMember({phone:'07700900111', pin:'000000'}, async () => { throw Error('offline'); }); assert.match(offline.message, /could not reach/);
  const info = await loadProgramme(reply({ok:true, json:async () => ({programme:{welcomePoints:100}})})); assert.deepEqual(info, {ok:true, programme:{welcomePoints:100}}); assert.deepEqual(sent.at(-1)[1], {action:'info'});
  assert.equal((await loadProgramme(async () => { throw Error('x'); })).ok, false);
});

test('rewards: helpers and the published page', () => {
  assert.deepEqual(earnRows({rates:{accessory:5, repair:3, phone:1, other:2}}).map(r => [r.label, r.points]), [['Accessories under £100', 5], ['Repairs', 3], ['Other items', 2], ['Phones', 1]]);
  assert.deepEqual(earnRows({rates:{accessory:0, repair:3}}).map(r => r.label), ['Repairs']);
  assert.equal(percent(250, 500), 50); assert.equal(percent(900, 500), 100); assert.equal(percent(5, 0), 100); assert.equal(pounds(250), '£2.50'); assert.equal(wholePounds(30000), '£300');
  assert.match(friendMessage('ABC234'), /friend code ABC234/);
  assert.ok(mainPageRoutes.includes('rewards/')); const meta = sitePageMeta('rewards/'); assert.equal(meta.indexable, true); assert.equal(meta.canonical, 'https://itopgroup.co.uk/rewards/');
});
