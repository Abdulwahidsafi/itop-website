import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRetailProducts, publishedRetailProducts, filterRetailProducts, retailMoney } from '../src/retailProducts.mjs';
const draft = {id:'test-case',name:'Test fixture case',category:'Protection',status:'draft',availability:'confirm',pricePence:null,compatibility:'Test phone',description:'',image:null,checkedAt:''};
const live = {...draft,status:'published',pricePence:1299,checkedAt:'2026-10-10'};
test('unpriced and draft products cannot become customer listings',()=>{
  assert.deepEqual(publishedRetailProducts([draft]),[]);
  assert.throws(()=>publishedRetailProducts([{...live,pricePence:null}]));
  assert.deepEqual(publishedRetailProducts([live,{...draft,id:'other'}]),[live]);
});
test('invalid prices, duplicate identities and unsafe images stop publication',()=>{
  for(const pricePence of [0,-1,12.99,'1299',NaN]) assert.throws(()=>validateRetailProducts([{...live,pricePence}]));
  assert.throws(()=>validateRetailProducts([live,live]));
  for(const image of ['https://example.com/photo.jpg','images/retail/../private.jpg','images/retail/photo.svg']) assert.throws(()=>validateRetailProducts([{...live,image}]));
  assert.throws(()=>validateRetailProducts([{...live,checkedAt:'2026-02-30'}]));
});
test('retail browsing and currency keep approved item prices intact',()=>{
  assert.equal(retailMoney(1299),'£12.99');
  assert.deepEqual(filterRetailProducts([live],'TEST PHONE','Protection'),[live]);
  assert.deepEqual(filterRetailProducts([live],'','Audio'),[]);
  assert.equal(live.pricePence,1299);
});
