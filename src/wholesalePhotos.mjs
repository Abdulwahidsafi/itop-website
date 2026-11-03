/** Owner-supplied shared style photos; model cut-outs and colours may vary. */
import { wholesaleOriginals } from './wholesaleOriginals.mjs';
const stylePhotos = {
  Frame: 'frame.jpeg',
  Fashion: 'fashion.jpeg',
  Colourful: 'colourful.jpeg',
  Shockproof: 'shockproof.jpeg',
  Bracket: 'bracket.jpeg',
  Blurred: 'blurred.jpeg',
  Shiny: 'shiny.jpeg',
  Thin: 'csv-235f757a373683a3.jpeg',
  'Packaged Magnetic': 'csv-f7565a23c0f833b9.jpeg',
};

const protectorPhotos = {
  'Privacy screen protectors': {file:'screen-protector-privacy.jpeg',alt:'Privacy screen protector style'},
  'Clear screen protectors': {file:'screen-protector-normal.jpeg',alt:'Normal clear screen protector style'},
  'Tablet screen protectors': {file:'screen-protector-tablet.jpeg',alt:'iPad and tablet screen protector style'},
};

/** @param {{id?:string,name:string,category?:string,collection?:string}} product */
export function wholesaleStylePhoto(product) {
  const protector=product.category==='Protection' && product.collection ? protectorPhotos[product.collection] : null;
  if(protector) return {path:'images/wholesale/'+protector.file,alt:protector.alt,style:'Protector',caption:'Illustrative photo · packaging and fit vary by model.'};
  const original = product.id ? wholesaleOriginals[product.id] : null;
  if (original?.photo) return {path:original.photo,alt:original.name+' catalogue photo',style:'Catalogue',caption:'Photo from the WhatsApp catalogue.'};
  const style = product.name.split(' Case — ')[0];
  const file = stylePhotos[style];
  return file ? {path: 'images/wholesale/' + file, alt: style + ' case style in assorted colours', style: style === 'Packaged Magnetic' ? 'Packaged' : style,caption:'Style photo · model cut-outs and colours may vary.'} : null;
}
