import test from 'node:test';
import assert from 'node:assert/strict';
import {readAnalyticsChoice,saveAnalyticsChoice,analyticsPage,createAnalytics,consentKey} from '../src/analytics.mjs';

test('analytics stays off without affirmative consent or a verified ID',()=>{
  const scripts=[], win={location:{hostname:'itopgroup.co.uk'}}, doc={head:{append:s=>scripts.push(s)},createElement:()=>({})};
  const tracker=createAnalytics(win,doc,'G-TEST123');
  for(const choice of [null,'rejected','unknown']) assert.equal(tracker.start(choice,{}),false);
  assert.equal(createAnalytics(win,doc,'').start('accepted',{}),false);
  assert.deepEqual(scripts,[]); assert.equal(win.dataLayer,undefined);
  const page=analyticsPage('https://itopgroup.co.uk/repairs/?email=private#message','Repairs','https://example.com/?phone=private');
  assert.equal(tracker.start('accepted',page),true); assert.equal(tracker.start('accepted',page),false);
  assert.equal(scripts.length,1);
  const calls=win.dataLayer.map(x=>Array.from(x));
  assert.equal(calls[0][2].ad_storage,'denied');
  assert.equal(calls[2][2].send_page_view,false);
  assert.equal(calls[3][2].page_location,'https://itopgroup.co.uk/repairs/');
  assert.equal(calls[3][2].page_referrer,'https://example.com/');
  assert(!JSON.stringify(calls).includes('private'));
});

test('withdrawing consent disables tracking, clears only GA cookies and reloads',()=>{
  const cleared=[]; let reloads=0;
  const win={location:{hostname:'itopgroup.co.uk',reload:()=>reloads++}};
  const doc={get cookie(){return '_ga=1; _ga_TEST=2; unrelated=3';},set cookie(v){cleared.push(v)},head:{append(){}},createElement:()=>({})};
  const tracker=createAnalytics(win,doc,'G-TEST123'); tracker.start('accepted',{}); tracker.stop();
  assert.equal(win['ga-disable-G-TEST123'],true); assert.equal(reloads,1);
  assert.equal(cleared.length,6); assert(!cleared.some(x=>x.includes('unrelated')));
});

test('expired, future, malformed and unavailable consent storage fall back to no consent',()=>{
  let raw=null; const storage={getItem:()=>raw,setItem:(key,value)=>{assert.equal(key,consentKey);raw=value;}};
  assert.equal(readAnalyticsChoice(storage,1000),null);
  saveAnalyticsChoice(storage,'accepted',1000); assert.equal(readAnalyticsChoice(storage,2000),'accepted');
  assert.equal(readAnalyticsChoice(storage,0),null);
  assert.equal(readAnalyticsChoice(storage,1000+180*86400000),null);
  raw='{bad'; assert.equal(readAnalyticsChoice(storage),null);
  assert.equal(saveAnalyticsChoice({setItem(){throw Error()}},'accepted'),false);
  assert.equal(saveAnalyticsChoice(storage,'unknown'),false);
});
