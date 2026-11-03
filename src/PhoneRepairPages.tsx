import { useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { repairBrands, findRepairPage } from './repairCatalogue.mjs';
import { RepairVisitChecklist } from './RepairVisitChecklist';
import { repairs } from './repairTypes';
import { siteHref } from './sitePaths';
import type { RepairPhone } from './EnquiryDialog';

export function PhoneBrandChoices() {
  return <section className="repair-directory" aria-labelledby="brand-title"><div className="section-heading"><h2 id="brand-title">Start with your phone.</h2><p>Choose a brand, then find your model.</p></div><div className="phone-brand-grid">{repairBrands.map(brand => <a className="phone-brand" href={siteHref('repairs/' + brand.id + '/')} key={brand.id}><span className="eyebrow">{brand.name}</span><h3>{brand.label}</h3><span className="brand-link">Choose model <ArrowUpRight size={18} aria-hidden="true" /></span></a>)}</div><p className="directory-note">Another brand, tablet, laptop or an unknown model? Use the repair enquiry below.</p></section>;
}

function ModelList({ brandId, onOther }: { brandId:string; onOther:()=>void }) {
  const [query,setQuery]=useState('');
  const [series,setSeries]=useState('');
  const brand=repairBrands.find(item=>item.id===brandId)!;
  const seriesOptions=[...new Set(brand.models.map(model=>model.series))];
  const models=brand.models.filter(model=>(!series || model.series===series) && model.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="repair-directory" aria-labelledby="models-title"><div className="model-search-heading"><h2 id="models-title">Find your model.</h2><label>Search {brand.label} models<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={'e.g. '+brand.models[0].name} autoComplete="off" /></label></div><label className="model-series-filter">Filter by series<select value={series} onChange={e=>setSeries(e.target.value)}><option value="">All series</option>{seriesOptions.map(value=><option key={value}>{value}</option>)}</select></label><p className="directory-note">These pages help you prepare an enquiry. iTop confirms supported repairs and parts for your exact device.</p><p className="model-result-count" role="status">{models.length} {models.length === 1 ? 'model' : 'models'}</p><div className="phone-model-grid">{models.map(model=><a href={siteHref(model.route)} className="phone-model" key={model.slug}><span>{model.name}</span><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div>{!models.length && <p className="empty-models">No matching model in this list. You can still ask about your device.</p>}<div className="model-other"><p>Model not listed, or not sure which one you have?</p><button className="text-button" onClick={onOther}>Ask about another model</button></div></section>;
}

export function PhoneRepairPages({route,onEnquire}:{route:string;onEnquire:(issue?:string,phone?:RepairPhone)=>void}) {
  const {brand,model,valid}=findRepairPage(route);
  if (!valid || !brand) return <section className="repair-directory"><h1>Find your repair.</h1><p className="directory-note">This model page is not in our directory.</p><a className="button button-dark" href={siteHref('repairs/')}>Browse repairs</a></section>;
  const phone=model ? {brand:brand.name,model:model.name} : {brand:brand.name,model:''};
  return <><nav className="repair-breadcrumb" aria-label="Breadcrumb"><a href={siteHref('repairs/')}>Repairs</a><span aria-hidden="true">/</span>{model ? <><a href={siteHref('repairs/'+brand.id+'/')}>{brand.label}</a><span aria-hidden="true">/</span><span aria-current="page">{model.name}</span></> : <span aria-current="page">{brand.label}</span>}</nav>
    <section className="hero repairs-hero model-page-hero"><div><p className="eyebrow">ITOP / PHONE REPAIRS / CATFORD</p><h1>{model ? model.name : brand.label}<br />repairs<span>.</span></h1></div><div className="hero-copy"><p>{model ? 'Choose the fault below. Your model will be included in the enquiry, and we’ll confirm parts, price and timing.' : 'Choose your exact model to prepare a repair enquiry. You can also ask about a model that is not listed.'}</p><button className="button button-dark" onClick={()=>onEnquire(undefined,phone)}>{model ? 'Request a repair quote' : 'Not sure of the model?'}</button></div></section>
    {model ? <><section className="repair-services" aria-labelledby="model-services-title"><div className="section-heading"><h2 id="model-services-title">What needs fixing?</h2><p>Repair options for your {model.name} enquiry.</p></div><div className="repair-service-grid">{repairs.map(({title,issue,description,icon:Icon})=><article className="repair-service" key={issue}><Icon size={30} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{description}</p><button className="text-button" onClick={()=>onEnquire(issue,phone)}>Ask about {issue === 'Not sure' ? 'a fault' : 'this repair'}<ArrowUpRight size={18} aria-hidden="true" /></button></article>)}</div></section><RepairVisitChecklist /></> : <ModelList brandId={brand.id} onOther={()=>onEnquire(undefined,phone)} />}
  </>;
}
