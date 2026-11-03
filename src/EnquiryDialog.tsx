import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from '@phosphor-icons/react';
import { RepairEnquiryFlow } from './RepairEnquiryFlow';
import { WholesaleQuoteBuilder, type QuoteProduct } from './WholesaleQuoteBuilder';
import { siteHref } from './sitePaths';
import { MessageReview } from './MessageReview';
import { AccessoriesEnquiryForm } from './AccessoriesEnquiryForm';
import { BuySellEnquiryForm } from './BuySellEnquiryForm';

export type EnquiryKind = 'Repair' | 'Accessories' | 'Trade' | 'Buy / sell' | 'Support';
export type RepairPhone = { brand:string; model:string };
export type Enquiry = { kind: EnquiryKind | 'Choose'; category: string; issue?: string; phone?: RepairPhone; quoteItems?: QuoteProduct[] };
const choices: { kind: EnquiryKind; title: string; description: string }[] = [
  { kind: 'Repair', title: 'Repair a device', description: 'Phone, tablet, laptop or gadget faults.' },
  { kind: 'Accessories', title: 'Find an accessory', description: 'Compatibility, colours and availability.' },
  { kind: 'Trade', title: 'Wholesale supply', description: 'Build a product list with variants and quantities.' },
  { kind: 'Buy / sell', title: 'Buy or sell', description: 'Available devices or an in-store valuation.' },
  { kind: 'Support', title: 'Aftercare or setup', description: 'Warranty questions, network messages and device help.' },
];

export function EnquiryDialog({ kind: initialKind, category, issue, phone, quoteItems, onClose }: Enquiry & { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [kind, setKind] = useState(initialKind);
  const [deviceIntent, setDeviceIntent] = useState<'' | 'buy' | 'sell'>(category === 'Sell a device' ? 'sell' : category === 'Buy a device' ? 'buy' : '');
  useEffect(() => { const dialog = dialogRef.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  useEffect(() => { if (kind === 'Choose') headingRef.current?.focus(); }, [kind]);
  return <dialog ref={dialogRef} className="enquiry-dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div className="dialog-inner">
    <div className="dialog-top"><span className="eyebrow">LET’S TALK TECH</span><button className="icon-button" aria-label="Close enquiry" onClick={onClose}><X size={24} /></button></div>
    <h2 id="dialog-title" ref={headingRef} tabIndex={-1}>{kind === 'Choose' ? 'How can we help?' : (kind === 'Trade' ? 'Wholesale' : kind === 'Buy / sell' ? (deviceIntent === 'sell' ? 'Selling' : deviceIntent === 'buy' ? 'Buying' : 'Buy or sell') : kind) + ' enquiry.'}</h2>
    {kind === 'Choose' ? <div className="enquiry-choices">{choices.map(choice => <button key={choice.kind} onClick={() => setKind(choice.kind)}><strong>{choice.title}</strong><span>{choice.description}</span></button>)}<a className="business-choice" href={siteHref('business/')}><strong>iTop for Business</strong><span>Repairs, devices and accessories for your team.</span></a></div> : kind === 'Repair' ? <RepairEnquiryFlow issue={issue} phone={phone} /> : kind === 'Trade' ? <WholesaleQuoteBuilder initialItems={quoteItems} /> : kind === 'Accessories' ? <AccessoriesEnquiryForm selection={category} /> : kind === 'Buy / sell' ? <BuySellEnquiryForm intent={deviceIntent} onIntentChange={setDeviceIntent} /> : <BasicEnquiryForm kind={kind} category={category} />}
  </div></dialog>;
}

function BasicEnquiryForm({ kind, category }: { kind: Exclude<EnquiryKind, 'Repair' | 'Trade'>; category: string }) {
  const [draft, setDraft] = useState<Record<string,string>>({});
  const [intent, setIntent] = useState(category === 'Sell a device' ? 'Sell a device' : 'Buy a device');
  const [message, setMessage] = useState('');
  const [review, setReview] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, [review]);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const field = event.currentTarget.elements.namedItem('Details') as HTMLTextAreaElement;
    if (!String(values.get('Details') ?? '').trim()) { field.setCustomValidity('Tell us a little about what you need.'); field.reportValidity(); return; }
    setDraft(Object.fromEntries([...values.entries()].map(([key,value]) => [key,String(value)])));
    const lines = ['Hi iTop, I’d like to make an enquiry about ' + kind.toLowerCase() + '.'];
    if (category && kind === 'Accessories') lines.push('Category: ' + category);
    for (const [label,value] of values.entries()) if (String(value).trim()) lines.push(label + ': ' + String(value).trim());
    setMessage(lines.join('\n')); setReview(true);
  }
  return <><h3 ref={headingRef} tabIndex={-1} className="flow-title">{review ? 'Review your enquiry.' : 'Tell us what you need.'}</h3>{review ? <MessageReview message={message} onEdit={() => setReview(false)} /> : <>
    <p className="dialog-intro">{kind === 'Support' ? 'For aftercare, include the repair date or reference if you have it.' : kind === 'Buy / sell' ? 'Availability and valuations are confirmed directly.' : 'We’ll check compatibility and current stock.'}</p>
    <form onSubmit={prepare}>
      <div className="form-row"><label>Your name<input name="Name" defaultValue={draft.Name ?? ''} autoComplete="given-name" maxLength={100} /></label>{kind === 'Buy / sell' ? <label>I want to<select name="Intent" value={intent} onChange={e => setIntent(e.target.value)}><option>Buy a device</option><option>Sell a device</option></select></label> : <label>Device type<select name="Device" defaultValue={draft.Device ?? 'Phone'}><option>Phone</option><option>Tablet</option><option>Laptop</option><option>Other gadget</option>{kind === 'Accessories' && <option>Not device-specific</option>}</select></label>}</div>
      <div className="form-row"><label>Brand<input name="Brand" defaultValue={draft.Brand ?? ''} placeholder="e.g. Apple, Samsung, Dell" maxLength={100} /></label><label>Device model{kind === 'Buy / sell' && intent === 'Sell a device' && ' (required)'}<input name="Model" defaultValue={draft.Model ?? ''} placeholder="e.g. iPhone 14 or ThinkPad T14" required={kind === 'Buy / sell' && intent === 'Sell a device'} pattern={'.*\\S.*'} title="Enter a device model" maxLength={100} /></label></div>
      {kind === 'Support' && <label>Question about<select name="Topic" defaultValue={draft.Topic ?? (category || 'Warranty / aftercare')}><option>Warranty / aftercare</option><option>Network / SIM</option><option>Device setup</option><option>Business device support</option><option>Other question</option></select></label>}
      {kind === 'Buy / sell' && intent === 'Sell a device' && <label>Device condition<select name="Condition" defaultValue={draft.Condition ?? 'Not sure'}><option>Not sure</option><option>Working, good condition</option><option>Working, signs of use</option><option>Damaged or faulty</option></select></label>}
      <label>{kind === 'Support' ? 'Your question (required)' : kind === 'Buy / sell' ? (intent === 'Sell a device' ? 'Storage, condition and faults (required)' : 'What are you looking for? (required)') : 'Accessory, colour and quantity (required)'}<textarea name="Details" defaultValue={draft.Details ?? ''} placeholder={kind === 'Support' ? 'Repair reference, date, problem or message shown.' : kind === 'Buy / sell' ? 'Budget and preferred device, or storage, condition and faults.' : category ? 'Model, colour or quantity for ' + category.toLowerCase() : 'Describe what you need'} onInput={e => e.currentTarget.setCustomValidity('')} required maxLength={1500} rows={4} /></label>
      <button className="button button-dark form-submit" type="submit">Preview enquiry</button>
    </form></>}<p className="privacy-note">No payment or booking is taken here. Your draft stays in this page until you open WhatsApp. Never include passwords or device passcodes.</p></>;
}
