import { benchmarkRepairPrices } from './benchmarkRepairPrices.mjs';
import { repairBrands } from './repairCatalogue.mjs';

// Owner-supplied repair prices, 6 November 2026. Amounts are integer pence.
// Missing prices must remain unavailable; never borrow another model's price.
export const repairPriceRows = [
  ['iPhone XR',45,40],
  ['iPhone 11',50,45],
  ['iPhone 11 Pro',55,50],
  ['iPhone 11 Pro Max',60,55],
  ['iPhone 12',50,50,60],
  ['iPhone 12 Pro',60,55,70],
  ['iPhone 12 Pro Max',65,55,75],
  ['iPhone 13',60,55,70],
  ['iPhone 13 Pro',65,55,75],
  ['iPhone 13 Pro Max',70,60,80],
  ['iPhone 14',60,55,75],
  ['iPhone 14 Pro',70,60,80],
  ['iPhone 14 Pro Max',75,65,90],
  ['iPhone 15',65,55,80],
  ['iPhone 15 Pro',75,60,85],
  ['iPhone 15 Pro Max',85,65,110],
  ['iPhone 16',75,60,99],
  ['iPhone 16 Pro',80,65,100],
  ['iPhone 16 Pro Max',85,70,115],
  ['iPhone 17',80,70,110],
  ['iPhone 17 Pro',95,75,120],
  ['iPhone 17 Pro Max',99,80,130],
].map(([model,screen,battery,softOled])=>({model,screenPence:screen*100,batteryPence:battery*100,softOledPence:softOled===undefined ? null : softOled*100}));

// Back glass follows the owner's generation bands; iPhone 18 remains quote-only.
export const backGlassPrices = repairBrands.find(brand=>brand.id==='iphone').models.flatMap(({name})=>{
  const generation=Number(name.match(/^iPhone (1[1-7])(?: |e|$)/)?.[1]);
  const amount=generation>=11&&generation<=14 ? 6000 : generation===15||generation===16 ? 7500 : generation===17||name==='iPhone Air' ? 8500 : null;
  return amount===null ? [] : [{model:name,pricePence:amount}];
});

export function repairPriceOptions(model,issue) {
  if(issue==='Back glass replacement'){
    const back=backGlassPrices.find(row=>row.model===model);
    if(back)return [{id:'back-glass',label:'Back glass replacement',pricePence:back.pricePence,note:''}];
  }
  const benchmark=benchmarkRepairPrices.filter(row=>row.model===model&&row.issue===issue).map(({id,label,pricePence,note})=>({id,label,pricePence,note}));
  if(benchmark.length)return benchmark;

  const row=repairPriceRows.find(row=>row.model===model);
  if(!row) return [];
  if(issue==='Screen replacement') return [
    {id:'screen-standard',label:'Standard screen',pricePence:row.screenPence,note:''},
    ...(row.softOledPence===null ? [] : [{id:'screen-soft-oled',label:'Soft OLED',pricePence:row.softOledPence,note:''}]),
  ];
  if(issue==='Battery replacement') return [
    {id:'battery-standard',label:'Standard battery',pricePence:row.batteryPence,note:''},
    {id:'battery-upgraded',label:'Premium battery',pricePence:row.batteryPence+1000,note:''},
  ];
  return [];
}

/** @param {string} model */
export function hasRepairPrices(model) { return backGlassPrices.some(row=>row.model===model)||repairPriceRows.some(row=>row.model===model)||benchmarkRepairPrices.some(row=>row.model===model); }

export function repairMoney(pence) {
  if(!Number.isSafeInteger(pence)||pence<=0) throw new Error('Invalid repair price');
  return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',minimumFractionDigits:pence%100===0 ? 0 : 2}).format(pence/100);
}

export function repairDeposit(pence) {
  if(!Number.isSafeInteger(pence)||pence<=0) throw new Error('Invalid repair total');
  const depositPence=pence<6000 ? 1500 : pence<8000 ? 2000 : 2500;
  if(depositPence>pence) throw new Error('Deposit exceeds repair total');
  return {depositPence,balancePence:pence-depositPence,totalPence:pence};
}

export const appointmentSettings={timeZone:'Europe/London',slotMinutes:60,capacity:3,
  opening:{monday:['09:30','20:00'],tuesday:['09:30','20:00'],wednesday:['09:30','20:00'],thursday:['09:30','20:00'],friday:['09:30','20:00'],saturday:['09:30','20:00'],sunday:['10:30','16:30']},
  onlineBookingEnabled:false};
