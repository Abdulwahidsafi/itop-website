import { useState } from 'react';
import products from './retail-products.json';
import { publishedRetailProducts, filterRetailProducts, retailCategories, retailMoney } from './retailProducts.mjs';
import { siteHref } from './sitePaths';

type RetailProduct = {id:string;name:string;category:string;pricePence:number;description:string;compatibility:string;availability:string;image:string|null};
const published: RetailProduct[] = publishedRetailProducts(products);
export function RetailCatalogue({onEnquire}: {onEnquire:(selection:string)=>void}) {
  const [query,setQuery] = useState('');
  const [category,setCategory] = useState('All');
  if (!published.length) return null;
  const visible: RetailProduct[] = filterRetailProducts(published,query,category);
  return <section className="retail-catalogue" id="retail-catalogue" aria-labelledby="retail-catalogue-title">
    <p className="eyebrow">ACCESSORIES / RETAIL</p><h2 id="retail-catalogue-title">Find your everyday essentials.</h2>
    <p>Prices are per item. Ask us to confirm the right fit and current availability before visiting.</p>
    <div className="form-row"><label>Search accessories<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Product or device model" /></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option>{retailCategories.filter(value=>published.some(product=>product.category===value)).map(value=><option key={value}>{value}</option>)}</select></label></div>
    <p role="status">{visible.length} {visible.length===1?'product':'products'}{(query||category!=='All') && <> · <button className="text-button" onClick={()=>{setQuery('');setCategory('All');}}>Clear filters</button></>}</p>
    <div className="retail-product-grid">{visible.map(product=><article className="retail-product" key={product.id}>
      {product.image && <img src={siteHref(product.image)} alt={product.name} loading="lazy" decoding="async" />}
      <p className="eyebrow">{product.category}</p><h3>{product.name}</h3><p className="retail-price">{retailMoney(product.pricePence)}</p>
      {product.description && <p>{product.description}</p>}{product.compatibility && <p className="secondary-copy">Fits: {product.compatibility}</p>}
      <p className="secondary-copy">{product.availability==='unavailable'?'Currently unavailable':product.availability==='available'?'Listed as available · confirm current stock':'Ask about availability'}</p>
      <button className="button button-dark" onClick={()=>onEnquire('retail:'+product.id)}>{product.availability==='unavailable'?'Ask about alternatives':'Enquire about this item'}</button>
    </article>)}</div>
    {!visible.length && <p>No matching accessories. Try another search or clear the filters.</p>}
  </section>;
}
