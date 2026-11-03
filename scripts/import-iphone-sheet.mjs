import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importIPhoneSheet } from '../src/iphoneSheet.mjs';
import { parseIPhonePrices } from '../src/iphoneQuotes.mjs';
import { iphoneSheetHeaders } from '../src/iphoneSheet.mjs';

const [input,...flags]=process.argv.slice(2);
if(!input || flags.some(flag=>flag!=='--write'))throw new Error('Usage: node scripts/import-iphone-sheet.mjs website-export.csv|exported-range.json [--write]');
const contents=await fs.readFile(input,'utf8');
const payload=input.toLowerCase().endsWith('.csv')?null:JSON.parse(contents);
const values=payload?(payload.values??payload.structuredContent?.values):[iphoneSheetHeaders,...parseIPhonePrices(contents).map(row=>iphoneSheetHeaders.map(key=>row[key]??''))];
const {csv,prices}=importIPhoneSheet(values);
const root=fileURLToPath(new URL('../',import.meta.url));
const target=path.join(root,'src/iphone-prices.csv');
const current=await fs.readFile(target,'utf8');
const previous=parseIPhonePrices(current);
const old=new Map(previous.map(row=>[row.id,row]));
const incoming=new Set(prices.map(row=>row.id));
const changes={added:prices.filter(row=>!old.has(row.id)).map(row=>row.id),changed:prices.filter(row=>old.has(row.id)&&JSON.stringify(old.get(row.id))!==JSON.stringify(row)).map(row=>row.id),removed:previous.filter(row=>!incoming.has(row.id)).map(row=>row.id),enabled:prices.filter(row=>row.enabled).length};
console.log(JSON.stringify(changes,null,2));
if(flags.includes('--write')){
  await fs.writeFile(target,csv);
  await fs.writeFile(path.join(root,'src/iphone-price-sync.json'),JSON.stringify({source:'iTop approved master sheet',syncedAt:new Date().toISOString(),records:prices.length,enabled:changes.enabled},null,2)+'\n');
  console.log('Imported reviewed sheet snapshot. Run checks and publish to update the website.');
}else console.log('Preview only. Review changes before importing with --write.');
