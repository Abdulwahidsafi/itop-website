import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeWholesaleDraft, decodeWholesaleDraft } from '../src/wholesaleDraft.mjs';
const now = 1791468000000;
const row = {id:99,product:'USB-C cable',variant:'2 m',sku:'C2',quantity:'3',unit:'Packs'};
test('saved lists retain product fields, reassign IDs and exclude personal details', () => {
  const raw=encodeWholesaleDraft([{...row,Name:'Private name',Location:'Private address',Notes:'Private notes'}],now);
  assert.doesNotMatch(raw,/Private|Name|Location|Notes/);
  assert.deepEqual(decodeWholesaleDraft(raw,now),{savedAt:now,rows:[{...row,id:1}]});
});
test('incomplete product drafts can be saved without becoming valid orders', () => {
  const draft={...row,product:'',quantity:''};
  assert.equal(decodeWholesaleDraft(encodeWholesaleDraft([draft],now),now).rows[0].quantity,'');
});
test('expired, future, malformed and oversized drafts cannot be restored', () => {
  const raw=encodeWholesaleDraft([row],now);
  for (const value of [null,'{','x'.repeat(20001),JSON.stringify({version:2,savedAt:now,rows:[row]}),JSON.stringify({version:1,savedAt:now,rows:[{...row,quantity:3}]}),JSON.stringify({version:1,savedAt:now,rows:Array(13).fill(row)}),JSON.stringify({version:1,savedAt:now,rows:[{...row,unit:'Boxes'}]})]) assert.equal(decodeWholesaleDraft(value,now),null);
  assert.equal(decodeWholesaleDraft(raw,now + 31*24*60*60*1000),null);
  assert.equal(decodeWholesaleDraft(raw,now - 1),null);
  assert.throws(()=>encodeWholesaleDraft([{...row,product:'x'.repeat(101)}],now));
});
