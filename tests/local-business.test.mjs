import test from 'node:test';
import assert from 'node:assert/strict';
import { localBusiness, localBusinessScript, siteUrl } from '../src/siteMeta.mjs';

test('business details for Google carry only confirmed facts',()=>{
  assert.equal(localBusiness['@type'],'MobilePhoneStore');
  assert.equal(localBusiness.name,'iTop Phones & Repair Center');
  assert.equal(localBusiness.telephone,'+447760616466');
  assert.equal(localBusiness.address.postalCode,'SE6 4HQ');
  assert.equal(localBusiness.url,siteUrl);
  for(const key of ['openingHoursSpecification','aggregateRating','review','priceRange']) assert.equal(localBusiness[key],undefined,key+' must not be published until the owner confirms it');
});
test('the details are added to the home and contact pages only, as valid JSON',()=>{
  assert.equal(localBusinessScript('repairs/'),'');
  for(const route of ['','contact/']){
    const html=localBusinessScript(route);
    assert.ok(html.startsWith('<script type="application/ld+json">')&&html.endsWith('</script>'));
    assert.deepEqual(JSON.parse(html.slice(35,-9)),localBusiness);
  }
});
