import { parseIPhonePrices, REFERENCE_MAX_DAYS } from './iphoneQuotes.mjs';
import { iphoneModels, canonicalIPhoneModel, iphoneStorageOptions } from './iphoneModels.mjs';

export const iphoneSheetHeaders=['id','model','storage','colour','network','grade','cexCash','checkedAt','sourceUrl','override','enabled'];
export function importIPhoneSheet(values, now=new Date()) {
  if(!Array.isArray(values) || !Array.isArray(values[0]) || values[0].join(',')!==iphoneSheetHeaders.join(','))throw new Error('Read the Website export tab with its original headers.');
  const rows=values.slice(1).filter(row=>row.some(value=>String(value??'').trim()));
  if(rows.some(row=>row.length>iphoneSheetHeaders.length && row.slice(iphoneSheetHeaders.length).some(value=>String(value??'').trim())))throw new Error('Unexpected columns in the sheet export.');
  if(!rows.length)throw new Error('The master sheet has no price records.');
  const csv=iphoneSheetHeaders.join(',')+'\n'+rows.map(row=>iphoneSheetHeaders.map((_,i)=>row[i]??'').map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
  const prices=parseIPhonePrices(csv);
  for(const record of prices) {
    const model=canonicalIPhoneModel(record.model);
    if(!iphoneModels.includes(model) || !iphoneStorageOptions(model).includes(record.storage))throw new Error('Unknown model or storage: '+record.id);
    const age=(now.getTime()-Date.parse(record.checkedAt+'T00:00:00Z'))/86400000;
    if(record.enabled && (age<0 || age>=REFERENCE_MAX_DAYS))throw new Error('Recheck the enabled price before publishing: '+record.id);
  }
  return {csv,prices};
}
