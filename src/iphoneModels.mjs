import { repairBrands, repairModelSeries } from './repairCatalogue.mjs';

export function canonicalIPhoneModel(model) {
  return ({ 'iPhone SE (2016)': 'iPhone SE (1st Generation)', 'iPhone SE (2020)': 'iPhone SE (2nd Generation)', 'iPhone SE (2022)': 'iPhone SE (3rd Generation)' })[model] ?? model;
}

// Identification coverage is independent of verified buying-price coverage.
// Duo is excluded until Apple identifies a released model with that name.
export const iphoneModels = repairBrands.find(brand => brand.id === 'iphone').models
  .map(model => model.name).filter(model => model !== 'iPhone Duo').map(canonicalIPhoneModel);
export const iphoneGroups = [...new Set(iphoneModels.map(model => repairModelSeries('iphone',model)))].map(label => ({
  label, models: iphoneModels.filter(model => repairModelSeries('iphone',model) === label),
}));

export function iphoneStorageOptions(model) {
  const name=canonicalIPhoneModel(model);
  const capacities = {
    'iPhone (original)':[4,8,16], 'iPhone 3G':[8,16], 'iPhone 3GS':[8,16,32],
    'iPhone 4':[8,16,32], 'iPhone 4s':[8,16,32,64], 'iPhone 5':[16,32,64],
    'iPhone 5c':[8,16,32], 'iPhone 5s':[16,32,64], 'iPhone 6':[16,32,64,128],
    'iPhone 6 Plus':[16,64,128], 'iPhone 6s':[16,32,64,128], 'iPhone 6s Plus':[16,32,64,128],
    'iPhone 7':[32,128,256], 'iPhone 7 Plus':[32,128,256],
    'iPhone 8':[64,128,256], 'iPhone 8 Plus':[64,128,256], 'iPhone X':[64,256],
    'iPhone XR':[64,128,256], 'iPhone XS':[64,256,512], 'iPhone XS Max':[64,256,512],
    'iPhone SE (1st Generation)':[16,32,64,128],
    'iPhone SE (2nd Generation)':[64,128,256], 'iPhone SE (3rd Generation)':[64,128,256],
  };
  let values=capacities[name];
  if (!values) {
    const generation=Number(name.match(/^iPhone (\d+)/)?.[1]);
    if(generation===11)values=name.includes('Pro')?[64,256,512]:[64,128,256];
    else if(generation===12)values=name.includes('Pro')?[128,256,512]:[64,128,256];
    else if(generation>=13 && generation<=16)values=name.includes('Pro')?(generation>=15 && name.includes('Max')?[256,512,1024]:[128,256,512,1024]):[128,256,512];
    else if(generation>=17)values=name.includes('Pro Max')?[256,512,1024,2048]:name.includes('Pro')?[256,512,1024]:[256,512];
    else if(name==='iPhone Air')values=[256,512,1024];
  }
  return (values??[]).map(value=>value>=1024?`${value/1024}TB`:`${value}GB`);
}
