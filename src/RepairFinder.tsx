import { useState, type FormEvent } from 'react';
import { DeviceMobile, DeviceTablet, Laptop, ArrowRight } from '@phosphor-icons/react';
import { repairModels } from './repairModels';
import { repairBrands } from './repairCatalogue.mjs';
import { siteHref } from './sitePaths';
import type { RepairPhone } from './EnquiryDialog';

export function RepairFinder({ onSelect }: { onSelect: (phone: RepairPhone) => void }) {
  const [device, setDevice] = useState('Phone');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const options = repairModels(device, brand);
  function submit(event: FormEvent) { event.preventDefault(); const match=device==='Phone' ? repairBrands.find(item=>item.name===brand)?.models.find(item=>item.name.toLowerCase()===model.trim().toLowerCase()) : undefined; if(match){window.location.assign(siteHref(match.route));return;} onSelect({ device, brand, model: model.trim() }); }
  return <section className="repair-finder" id="find-repair" aria-labelledby="finder-title">
    <div className="finder-heading"><span className="section-kicker">LET’S GET STARTED</span><h2 id="finder-title">What needs repairing?</h2><p>Choose your device. We’ll help with the next step.</p></div>
    <div className="finder-tabs" role="group" aria-label="Device type">{[{name:'Phone',Icon:DeviceMobile},{name:'Tablet',Icon:DeviceTablet},{name:'Laptop',Icon:Laptop}].map(({name,Icon})=><button type="button" key={name} aria-pressed={device===name} onClick={()=>{setDevice(name);setBrand('');setModel('');}}><Icon size={23} aria-hidden="true" />{name}</button>)}</div>
    <form className="finder-form" onSubmit={submit}>
      <label>1. Choose your brand<select value={brand} onChange={e=>{setBrand(e.target.value);setModel('');}} required><option value="">Select brand</option>{(device==='Laptop' ? ['Apple','Dell','HP','Lenovo','Other / not sure'] : ['Apple','Samsung','Google','Other / not sure']).map(name=><option key={name}>{name}</option>)}</select></label>
      <label>2. Your model<input value={model} onChange={e=>setModel(e.target.value)} list={options.length ? 'finder-models' : undefined} placeholder={brand ? 'Type or choose a model' : 'Choose a brand first'} autoComplete="off" maxLength={100} disabled={!brand} /><datalist id="finder-models">{options.map(name=><option key={name} value={name}/>)}</datalist></label>
      <button className="button button-dark" type="submit">See repair options <ArrowRight size={19} aria-hidden="true" /></button>
    </form><p className="finder-note">Not sure of your model? Leave it blank and we’ll help. Parts, price and timing are confirmed before work starts.</p>
  </section>;
}
