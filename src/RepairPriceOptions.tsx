import { useState } from 'react';
import { repairMoney, repairPriceOptions, repairDeposit } from './repairPrices.mjs';

export function RepairPriceOptions({model,issue}:{model:string;issue:string}) {
  const options=repairPriceOptions(model,issue);
  const [selected,setSelected]=useState(options[0]?.id ?? '');
  const option=options.find(item=>item.id===selected) ?? options[0];
  if(!option) return null;
  const payment=repairDeposit(option.pricePence);
  return <div className="repair-price-options">
    {options.length>1 ? <label>Choose your part option<select value={option.id} onChange={e=>setSelected(e.target.value)}>{options.map(item=><option key={item.id} value={item.id}>{item.label} — {repairMoney(item.pricePence)}</option>)}</select></label> : <span className="repair-part-label">{option.label}</span>}
    <p className="repair-listed-price" aria-live="polite">{repairMoney(option.pricePence)}<span>repair price</span></p>
    <dl className="repair-deposit-breakdown" aria-live="polite"><div><dt>Booking deposit</dt><dd>{repairMoney(payment.depositPence)}</dd></div><div><dt>Balance after deposit</dt><dd>{repairMoney(payment.balancePence)}</dd></div></dl>
    <a className="button button-dark" href="tel:+447760616466">Call to arrange this repair</a>
    {option.note && <p className="repair-price-scope">{option.note}</p>}
    <p className="repair-part-help">Online bookings and deposit payments are not available yet. Ask the team about the part options.</p>
  </div>;
}
