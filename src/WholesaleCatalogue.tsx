import { useRef, useState, type FormEvent } from 'react';
import { wholesaleProducts, wholesaleCategories, filterWholesaleProducts, catalogueQuoteItems } from './wholesaleCatalogue.mjs';
import type { QuoteProduct } from './WholesaleQuoteBuilder';
import { wholesaleCatalogueUrl } from './wholesaleContact';

import { wholesaleStylePhoto } from './wholesalePhotos.mjs';
import { siteHref } from './sitePaths';
import { wholesaleProductName, wholesaleProductDetail } from './wholesalePresentation.mjs';
import { browseCatalogue, catalogueCategoryLabels, catalogueProductType, catalogueCaseModel } from './wholesaleBrowsing.mjs';

type Selection = {id:string; quantity:string; unit:string};
export function WholesaleCatalogue({onReview}:{onReview:(items:QuoteProduct[])=>void}) {
  const listRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  function viewList() { listRef.current?.focus({preventScroll:true}); listRef.current?.scrollIntoView({behavior:'auto',block:'start'}); }
  function keepBrowsing() { searchRef.current?.focus({preventScroll:true}); searchRef.current?.scrollIntoView({behavior:'auto',block:'center'}); }
  const [search,setSearch]=useState('');
  const [category,setCategory]=useState('All categories');
  const [type,setType]=useState('');
  const [model,setModel]=useState('');
  const [sort,setSort]=useState('catalogue');
  const [limit,setLimit]=useState(12);
  const [selection,setSelection]=useState<Selection[]>([]);
  const [status,setStatus]=useState('');
  const [error,setError]=useState('');
  const products=browseCatalogue({search,category,type,model,sort});
  const categoryProducts=filterWholesaleProducts('',category);
  const types=[...new Set(categoryProducts.map(catalogueProductType))].sort();
  const models=[...new Set(categoryProducts.filter(item=>!type||catalogueProductType(item)===type).map(catalogueCaseModel).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  function changeCategory(value:string) {setCategory(value);setType('');setModel('');setLimit(12);}
  function resetFilters() {setSearch('');changeCategory('All categories');setSort('catalogue');}
  function add(id:string) {
    const product=wholesaleProducts.find(item=>item.id===id);
    if (!product || selection.some(item=>item.id===id)) return;
    if (selection.length>=12) {setStatus('Your list has 12 products. Review it now, or describe extra items in the quote notes.');return;}
    setSelection(previous=>[...previous,{id,quantity:'1',unit:'Items'}]);setError('');setStatus(wholesaleProductName(product)+' added to your quote list.');
  }
  function update(id:string,key:'quantity'|'unit',value:string) {setSelection(previous=>previous.map(item=>item.id===id?{...item,[key]:value}:item));setError('');}
  function review(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { const items=catalogueQuoteItems(selection); setError('');onReview(items); }
    catch {setError('Choose products and check each whole quantity from 1 to 10,000.');}
  }
  return <section className="wholesale-catalogue" id="wholesale-catalogue" aria-labelledby="catalogue-heading">
    <div className="catalogue-heading"><div><p className="eyebrow">PRODUCT CATALOGUE</p><h2 id="catalogue-heading">Find it. List it.</h2></div><a className="text-button" href={wholesaleCatalogueUrl} target="_blank" rel="noopener noreferrer">View photos & prices on WhatsApp</a></div>
    <p className="catalogue-intro">Prices shown are iTop selling prices from the supplied WhatsApp catalogue, confirmed by the owner. iTop confirms current pricing, VAT treatment, pack quantities, compatibility and availability with your quote.</p>
    <nav className="catalogue-categories" aria-label="Product categories">{['All categories','Cases','Protection',...wholesaleCategories.filter(item=>!['Cases','Protection'].includes(item))].map(item=><button key={item} type="button" aria-pressed={category===item} onClick={()=>changeCategory(item)}>{item==='All categories'?'All products':catalogueCategoryLabels[item]} <span>{item==='All categories'?wholesaleProducts.length:wholesaleProducts.filter(product=>product.category===item).length}</span></button>)}</nav>
    <div className="catalogue-layout"><div className="catalogue-results"><div className="catalogue-filters"><label>Search products<input ref={searchRef} type="search" value={search} onChange={e=>{setSearch(e.target.value);setLimit(12);}} placeholder="Search a product, code or phone model" /></label><label>Sort by<select value={sort} onChange={e=>{setSort(e.target.value);setLimit(12);}}><option value="catalogue">Catalogue order</option><option value="name">Name: A–Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div>
    {category!=='All categories' && <div className="catalogue-filters"><label>{category==='Cases'?'Case style':'Product type'}<select value={type} onChange={e=>{setType(e.target.value);setModel('');setLimit(12);}}><option value="">{category==='Cases'?'All case styles':'All product types'}</option>{types.map(item=><option key={item}>{item}</option>)}</select></label>{category==='Cases' && <label>Phone model<select value={model} onChange={e=>{setModel(e.target.value);setLimit(12);}}><option value="">All phone models</option>{models.map(item=><option key={item}>{item}</option>)}</select></label>}</div>}
    <div className="catalogue-active"><p>{category==='All categories'?'All products':catalogueCategoryLabels[category]}{type?' / '+type:''}{model?' / '+model:''}</p>{(search||category!=='All categories'||sort!=='catalogue') && <button className="text-button" type="button" onClick={resetFilters}>Clear filters</button>}</div>
    <p className="catalogue-count" role="status">{products.length} products found{products.length>limit?' · showing '+limit:''}</p>
    <div className="catalogue-grid">{products.slice(0,limit).map(product=><article className="catalogue-product" key={product.id}><CataloguePhoto product={product} /><p className="eyebrow">{catalogueProductType(product)}</p><h3>{wholesaleProductName(product)}</h3>{catalogueCaseModel(product) && <p className="catalogue-model">Listed model: <strong>{catalogueCaseModel(product)}</strong></p>}<p className="catalogue-price">£{(product.cataloguePricePence/100).toFixed(2)} <span>iTop selling price</span></p>{product.code && <p className="catalogue-code">Product code: <strong>{product.code}</strong></p>}{wholesaleProductDetail(product) && <p className="catalogue-detail">{wholesaleProductDetail(product)}</p>}<button className="button button-outline" type="button" aria-disabled={selection.some(item=>item.id===product.id)||selection.length>=12} onClick={()=>add(product.id)} aria-label={(selection.some(item=>item.id===product.id)?'Added: ':'Add to quote: ')+wholesaleProductName(product)}>{selection.some(item=>item.id===product.id)?'Added to list':'Add to quote'}</button></article>)}</div>
    {!products.length && <div className="catalogue-empty"><h3>No matching products.</h3><p>Try a different code or model, or reset the filters. You can also describe an unlisted product in a quote request.</p><button className="text-button" type="button" onClick={resetFilters}>Reset filters</button></div>}
    {products.length>limit && <button className="button button-dark catalogue-more" type="button" onClick={()=>setLimit(previous=>previous+12)}>Show more products</button>}
    </div><aside className="catalogue-cart" id="catalogue-quote-list" ref={listRef} tabIndex={-1} aria-labelledby="quote-list-heading"><h3 id="quote-list-heading">Your quote list <span>({selection.length}/12)</span></h3><p className="catalogue-cart-note">Add products, adjust quantities, then review your request.</p><p className="catalogue-feedback" role="status">{status}</p><form onSubmit={review}>
    {selection.length ? <div className="catalogue-selection">{selection.map((row,index)=>{const product=wholesaleProducts.find(item=>item.id===row.id)!;return <fieldset key={row.id}><legend>{wholesaleProductName(product)}</legend><div className="form-row"><label>Quantity<input type="number" inputMode="numeric" min={1} max={10000} step={1} required value={row.quantity} onChange={e=>update(row.id,'quantity',e.target.value)} aria-label={'Quantity for '+wholesaleProductName(product)} /></label><label>Unit<select value={row.unit} onChange={e=>update(row.id,'unit',e.target.value)} aria-label={'Unit for '+wholesaleProductName(product)}><option>Items</option><option>Packs</option></select></label></div><button className="text-button" type="button" aria-label={'Remove '+wholesaleProductName(product)} onClick={()=>{setSelection(previous=>previous.filter(item=>item.id!==row.id));setStatus(wholesaleProductName(product)+' removed from your quote list.');setError('');requestAnimationFrame(()=>listRef.current?.focus({preventScroll:true}));}}>Remove item {index+1}</button></fieldset>;})}</div> : <p className="catalogue-empty-list">Your list is empty. Add a product to begin.</p>}
    {selection.length>=12 && <p className="catalogue-cart-note">List full. Include any extra products in the quote notes.</p>}<p role="alert">{error}</p><button className="button button-dark form-submit" type="submit" disabled={!selection.length}>Review quote list</button><button className="text-button catalogue-keep-browsing" type="button" onClick={keepBrowsing}>Continue browsing products</button><p className="privacy-note">This list stays on this page. It requests a quote; it does not place an order or reserve stock.</p></form></aside></div>
    {selection.length>0 && <nav className="catalogue-quick-list" aria-label="Your selected products"><button className="button button-dark" type="button" onClick={viewList}>View quote list ({selection.length})</button></nav>}
  </section>;
}

function CataloguePhoto({product}:{product:{name:string}}) {
  const photo = wholesaleStylePhoto(product);
  if (!photo) return null;
  return <figure className={'catalogue-photo catalogue-photo-'+photo.style.toLowerCase()}><div className="catalogue-photo-window"><img src={siteHref(photo.path)} alt={photo.alt} loading="lazy" width={1290} height={1290} /></div><figcaption>{photo.caption}</figcaption></figure>;
}

