/** Original WhatsApp case names retained during the screenshot import. */
import { wholesaleOriginals } from './wholesaleOriginals.mjs';
/** @param {{id?:string,category?:string,name:string,detail?:string}} product */
export function wholesaleProductName(product) {
  if (product.id && wholesaleOriginals[product.id]) return wholesaleOriginals[product.id].name;
  return product.category === 'Cases' && product.detail?.startsWith('Supplier label: ')
    ? product.detail.slice('Supplier label: '.length).split(' · ')[0]
    : product.name;
}

/** @param {{id?:string,category?:string,name:string,detail?:string}} product */
export function wholesaleProductDetail(product) {
  if (product.id && wholesaleOriginals[product.id]) return wholesaleOriginals[product.id].detail;
  if (wholesaleProductName(product) !== product.name) {
    return product.detail?.split(' · ')[1]?.replace(/ \(supplier label\)$/, '') || '';
  }
  return product.detail || '';
}

/** @param {{id?:string,name:string,collection:string}} product */
export function wholesaleProductCollection(product) {
  if (product.id && wholesaleOriginals[product.id]) return wholesaleOriginals[product.id].collection;
  const style=product.name.split(' Case — ')[0];
  return ({Frame:'Quality Magsafe Cases',Fashion:'New Fashion Magsafe Cases',Colourful:'New Fashion Magsafe Cases',Shockproof:'Shockproof Cases',Bracket:'New design Cases',Thin:'New design Cases',Blurred:'Magsafe iStyle cases',Shiny:'Magsafe iStyle cases','Packaged Magnetic':'Magsafe iStyle cases'})[style] || product.collection;
}
