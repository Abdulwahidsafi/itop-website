import { useEffect, useRef, useState, type FormEvent } from 'react';
import { DeviceMobile, DeviceTablet, Laptop, ArrowRight } from '@phosphor-icons/react';
import { RepairPriceOptions } from './RepairPriceOptions';
import { repairPriceOptions } from './repairPrices.mjs';
import { modelRepairServices } from './repairTypes';
import { repairModels } from './repairModels';
import { repairBrands } from './repairCatalogue.mjs';
import { PhoneModelPhoto, ModelPhotoCredit } from './PhoneModelPhoto';
import { siteHref } from './sitePaths';
import type { RepairPhone } from './EnquiryDialog';

export function RepairFinder({ onSelect }: { onSelect: (phone: RepairPhone) => void }) {
  const [device, setDevice] = useState('Phone');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const options = repairModels(device, brand);
  const [priceModel, setPriceModel] = useState('');
  const priceHeading = useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(priceModel){priceHeading.current?.focus();priceHeading.current?.scrollIntoView({block:'start',behavior:'smooth'});}},[priceModel]);
  const selectedModel = device === 'Phone' ? repairBrands.find(item => item.name === brand)?.models.find(item => item.name.toLowerCase() === model.trim().toLowerCase()) : undefined;
  function submit(event: FormEvent) { event.preventDefault(); const match=device==='Phone' ? repairBrands.find(item=>item.name===brand)?.models.find(item=>item.name.toLowerCase()===model.trim().toLowerCase()) : undefined; if(match){window.location.assign(siteHref(match.route));return;} const otherModel=device!=='Phone' ? options.find(name=>name.toLowerCase()===model.trim().toLowerCase()) : undefined; if(otherModel){setPriceModel(otherModel);return;} onSelect({ device, brand, model: model.trim() }); }
  return <section className="repair-finder" id="find-repair" aria-labelledby="finder-title">
    <div className="finder-heading"><span className="section-kicker">LET’S GET STARTED</span><h2 id="finder-title">What needs repairing?</h2><p>Choose your device. We’ll help with the next step.</p></div>
    <div className="finder-tabs" role="group" aria-label="Device type">{[{name:'Phone',Icon:DeviceMobile},{name:'Tablet',Icon:DeviceTablet},{name:'Laptop',Icon:Laptop}].map(({name,Icon})=><button type="button" key={name} aria-pressed={device===name} onClick={()=>{setDevice(name);setBrand('');setModel('');setPriceModel('');}}><Icon size={23} aria-hidden="true" />{name}</button>)}</div>
    <form className="finder-form" onSubmit={submit}>
      <label>1. Choose your brand<select value={brand} onChange={e=>{setBrand(e.target.value);setModel('');setPriceModel('');}} required><option value="">Select brand</option>{(device==='Laptop' ? ['Apple','Dell','HP','Lenovo','Other / not sure'] : ['Apple','Samsung','Google','Other / not sure']).map(name=><option key={name}>{name}</option>)}</select></label>
      <label>2. Your model<input value={model} onChange={e=>{const value=e.target.value;setModel(value);if(value!==model)setPriceModel('');}} list={options.length ? 'finder-models' : undefined} placeholder={brand ? 'Type or choose a model' : 'Choose a brand first'} autoComplete="off" maxLength={100} disabled={!brand} /><datalist id="finder-models">{options.map(name=><option key={name} value={name}/>)}</datalist></label>
      <button className="button button-dark" type="submit">See repair options <ArrowRight size={19} aria-hidden="true" /></button>
    </form>{priceModel && <section className="finder-price-results" aria-labelledby="finder-price-title"><h3 id="finder-price-title" tabIndex={-1} ref={priceHeading}>{priceModel} repair prices</h3><p>Choose the repair and part option. Confirm your exact model, parts and availability with the shop before visiting.</p><div className="repair-service-grid">{modelRepairServices(priceModel).filter(service=>repairPriceOptions(priceModel,service.issue).length>0).map(service=><article className="repair-service" key={service.issue}><h4>{service.title}</h4><RepairPriceOptions model={priceModel} issue={service.issue}/></article>)}</div></section>}{selectedModel && <figure className="finder-model-preview" key={brand + selectedModel.slug}><PhoneModelPhoto brand={brand} model={selectedModel.name} priority/><figcaption><span className="section-kicker">YOUR SELECTED MODEL</span><h3>{selectedModel.name}</h3><p>Check this matches your phone.</p><ModelPhotoCredit brand={brand} model={selectedModel.name}/></figcaption></figure>}<p className="finder-note">Not sure of your model? Leave it blank and we’ll help. Parts, price and timing are confirmed before work starts.</p>
  </section>;
}
