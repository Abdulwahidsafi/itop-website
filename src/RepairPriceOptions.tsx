import { useId, useState } from 'react';
import { repairMoney, repairPriceOptions, repairDeposit, lowestRepairPrice } from './repairPrices.mjs';

export function RepairPriceOptions({model,issue}:{model:string;issue:string}) {
  const options=repairPriceOptions(model,issue);
  const group=useId();
  const [selected,setSelected]=useState(options[0]?.id ?? '');
  const option=options.find(item=>item.id===selected) ?? options[0];
  if(!option) return null;
  const payment=repairDeposit(option.pricePence);
  const several=options.length>1;
  return <div className="repair-price-options">
    {several ? <>
      <p className="repair-listed-price repair-from-price"><span className="repair-from-word">From</span>{repairMoney(lowestRepairPrice(options))}</p>
      <fieldset className="repair-quality-list"><legend>Choose your part quality</legend>
        {options.map(item=><label className="repair-quality" key={item.id} data-selected={item.id===option.id ? 'true' : undefined}>
          <input type="radio" name={group} value={item.id} checked={item.id===option.id} onChange={()=>setSelected(item.id)} />
          <span className="repair-quality-name">{item.label}</span>
          <span className="repair-quality-price">{repairMoney(item.pricePence)}</span>
        </label>)}
      </fieldset>
      <p className="repair-selected-total" aria-live="polite">{option.label}: <strong>{repairMoney(option.pricePence)}</strong></p>
    </> : <>
      <span className="repair-part-label">{option.label}</span>
      <p className="repair-listed-price" aria-live="polite">{repairMoney(option.pricePence)}<span>repair price</span></p>
    </>}
    <dl className="repair-deposit-breakdown" aria-live="polite"><div><dt>Booking deposit</dt><dd>{repairMoney(payment.depositPence)}</dd></div><div><dt>Balance after deposit</dt><dd>{repairMoney(payment.balancePence)}</dd></div></dl>
    <a className="button button-dark" href="tel:+447760616466">Call to arrange this repair</a>
    {option.note && <p className="repair-price-scope">{option.note}</p>}
    <p className="repair-part-help">Online bookings and deposit payments are not available yet. Ask the team about the part options.</p>
  </div>;
}
