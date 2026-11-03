import { filterWholesaleProducts } from './wholesaleCatalogue.mjs';
import { wholesaleProductName } from './wholesalePresentation.mjs';

/** @type {Record<string,string>} */
export const catalogueCategoryLabels = {
  Audio:'Earbuds, headphones & speakers', Power:'Chargers & power banks',
  Protection:'Screen protectors', Cases:'Phone cases', Photography:'Photography & lighting',
  Watches:'Smart watches', 'Car & stands':'Car accessories & stands',
  'Cables & adapters':'Cables & adapters', 'Repair parts':'Repair parts',
  'Other products':'Clippers, cameras & novelty lights', 'Computing & gaming':'Computing & gaming',
};

export function catalogueProductType(product) {
  return product.category==='Cases' && product.name.includes(' Case — ')
    ? product.name.split(' Case — ')[0]+' cases' : product.collection;
}

export function catalogueCaseModel(product) {
  const model=product.category==='Cases' ? product.name.split(' Case — ')[1] || '' : '';
  return model.replace(/\biPhone\s*/gi,'').split('/').map(part=>part.trim()
    .replace(/\bpro\b/gi,'Pro').replace(/\bmax\b/gi,'Max').replace(/\bplus\b/gi,'Plus')
    .replace(/\bultra\b/gi,'Ultra').replace(/\bair\b/gi,'Air')
    .replace(/\b([as]\d+)(s|u|fe)?\b/gi,(_,base,suffix)=>base.toUpperCase()+(suffix?.toUpperCase()||'')))
    .sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).join(' / ');
}

export function browseCatalogue({search='',category='All categories',type='',model='',sort='catalogue'}={}) {
  const products=filterWholesaleProducts(search,category).filter(product=>(!type||catalogueProductType(product)===type)&&(!model||catalogueCaseModel(product)===model));
  if(sort==='price-low')products.sort((a,b)=>a.cataloguePricePence-b.cataloguePricePence);
  else if(sort==='price-high')products.sort((a,b)=>b.cataloguePricePence-a.cataloguePricePence);
  else if(sort==='name')products.sort((a,b)=>wholesaleProductName(a).localeCompare(wholesaleProductName(b),undefined,{numeric:true}));
  return products;
}

