import { businessPageMeta } from './businessPageMeta.mjs';
import { findRepairPage, repairPageMeta, repairPageRoutes } from './repairCatalogue.mjs';

export const siteUrl = 'https://itopgroup.co.uk/';
const descriptions = {
  privacy: ['Privacy & Cookies | iTop Catford', 'How iTop website enquiries, saved quote lists and optional analytics cookies work. Manage your visitor analytics choice and contact iTop about privacy.'],
  '': ['iTop Phones & Repair Center | Catford', 'Phone, laptop and gadget repair enquiries, accessories, buy and sell, and wholesale supply at iTop, 160 Rushey Green, Catford, London SE6 4HQ.'],
  repairs: ['Device Repair Enquiries | iTop Catford', 'Choose your phone model or describe a tablet, laptop or gadget fault. Ask iTop in Catford to confirm repair options, parts, price and timing.'],
  accessories: ['Phone & Gadget Accessories | iTop Catford', 'Explore cases, screen protectors, cables, chargers, power banks and audio accessories. Ask iTop in Catford about fit, current stock and retail prices.'],
  wholesale: ['Wholesale Product Catalogue | iTop Catford', 'Browse iTop wholesale products by category, model and style. Choose products and quantities, then request confirmation of pricing and availability.'],
  'buy-sell': ['Sell Your iPhone & Buy Device Enquiries | iTop Catford', 'Get an estimated offer for selected iPhones or request a manual quote. Ask about buying a device or selling through iTop in Catford.'],
  contact: ['Visit & Contact | iTop Catford', 'Find iTop at 160 Rushey Green, London SE6 4HQ. Check shop opening hours, get directions, call or contact the team through WhatsApp.'],
  support: ['Warranty & Aftercare | iTop Catford', 'Questions about a repair or purchase? Review aftercare guidance and ask iTop about the terms agreed for your individual device or accessory.'],
};
export const mainPageRoutes = ['', 'repairs/', 'accessories/', 'wholesale/', 'buy-sell/', 'contact/', 'support/', 'business/', 'wholesale/apply/', 'privacy/'];
export const publishedRoutes = [...mainPageRoutes, ...repairPageRoutes];

export function sitePageMeta(route) {
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  let meta;
  if (Object.hasOwn(descriptions, clean)) {
    const [title, description] = descriptions[clean]; meta = {title, description};
  } else if (businessPageMeta[clean]) meta = businessPageMeta[clean];
  else if (clean.startsWith('repairs/') && findRepairPage(clean).valid) meta = repairPageMeta(clean);
  if (!meta) return {title:'Page not found | iTop Catford', description:'This page is unavailable. Browse iTop services or contact the shop for help.', indexable:false, canonical:null};
  return {...meta, indexable:true, canonical:siteUrl + (clean ? clean + '/' : '')};
}
