import { useEffect, useRef, useState, type FormEvent } from 'react';
import { DeviceMobile, Headphones, ArrowsLeftRight } from '@phosphor-icons/react';
import { MessageReview } from './MessageReview';
import { businessMessage, tradeApplicationMessage } from './businessMessages.mjs';
import { siteHref } from './sitePaths';
import { wholesaleWhatsAppNumber } from './wholesaleContact';
import { BusinessEnquiryForm } from './BusinessEnquiryForm';

const services = [
  { name: 'Device repairs', icon: DeviceMobile, description: 'Help with phones, tablets or laptops used by your team. Include the models, faults and number of devices.' },
  { name: 'Replacement devices', icon: ArrowsLeftRight, description: 'Ask about devices for your team. Tell us the quantity, preferred models, storage and budget.' },
  { name: 'Bulk accessories', icon: Headphones, description: 'Cases, protection, charging or audio for staff devices. Include model compatibility and quantities.' },
];
export function BusinessPage() {
  const [service, setService] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  function choose(value: string) { setService(value); formRef.current?.focus({ preventScroll: true }); formRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' }); }
  return <><section className="hero repairs-hero business-hero"><div><p className="eyebrow">ITOP / FOR BUSINESS</p><h1>Your team.<br />Their tech<span>.</span></h1></div><div className="hero-copy"><p>One place to discuss repairs, replacement devices and accessories for your business.</p><a className="button button-dark" href="#business-request" onClick={event => { event.preventDefault(); choose(service); }}>Request a business quote</a><p className="secondary-copy">Buying stock for resale? <a href={siteHref('wholesale/')}>Visit Wholesale</a>.</p></div></section>
    <nav className="business-shortcuts" aria-label="Choose a business service">{services.map(item => <button key={item.name} onClick={() => choose(item.name)}>{item.name}</button>)}</nav>
    <section className="business-services" aria-label="Business enquiry options">{services.map(({ icon: Icon, ...item },index) => <article key={item.name}><div className="business-card-top"><Icon size={30} weight="light" aria-hidden="true" /><span className="eyebrow">0{index + 1}</span></div><h2>{item.name}</h2><p>{item.description}</p><button className="text-button" onClick={() => choose(item.name)}>Discuss {item.name.toLowerCase()}</button></article>)}</section>
    <section className="content-section business-enquiry business-quote-section" id="business-enquiry" aria-labelledby="business-enquiry-title"><BusinessEnquiryForm service={service} onServiceChange={setService} formRef={formRef} /><div className="business-brief"><p className="eyebrow">START WITH YOUR REQUIREMENTS</p><h2 id="business-enquiry-title">A clear brief.<br />A useful reply.</h2><p className="visit-note">Share the devices, quantities and help you need. iTop will discuss availability, pricing and timing before anything is agreed.</p><div className="business-next"><strong>What happens next?</strong><ol><li>Review your enquiry.</li><li>Choose whether to send it through WhatsApp.</li><li>Discuss a quote and the next steps with iTop.</li></ol></div></div></section>
  </>;
}
export function TradeApplicationPage() {
  const formRef = useRef<HTMLDivElement>(null);
  return <><nav className="repair-breadcrumb" aria-label="Breadcrumb"><a href={siteHref('wholesale/')}>Wholesale</a><span aria-hidden="true">/</span><span>Trade application</span></nav><section className="hero repairs-hero"><div><p className="eyebrow">ITOP / TRADE</p><h1>Let’s talk<br />trade<span>.</span></h1></div><div className="hero-copy"><p>Tell us about your shop or business and the products you buy. iTop will discuss trade supply and your requirements directly.</p><a className="button button-dark" href="#trade-request" onClick={event => { event.preventDefault(); formRef.current?.focus({preventScroll:true}); formRef.current?.scrollIntoView({behavior:'auto',block:'start'}); }}>Start a trade application</a></div></section>
    <section className="content-section business-enquiry business-quote-section" id="trade-application" aria-labelledby="trade-application-title"><div className="business-form trade-form-container" id="trade-request" ref={formRef} tabIndex={-1} aria-label="Trade application form"><ContactRequestForm kind="trade" /></div><div className="business-brief"><p className="eyebrow">YOUR BUSINESS DETAILS</p><h2 id="trade-application-title">Introduce<br />your business.</h2><p className="visit-note">This sends a request to the wholesale team. It does not create an online login or approve trade prices or terms.</p><div className="business-next"><strong>Already know what you need?</strong><p><a className="text-button" href={siteHref('wholesale/')}>Browse the catalogue and request a quote</a></p></div></div></section>
  </>;
}
function ContactRequestForm({ kind, service = 'Device repairs', onServiceChange, serviceRef }: { kind: 'business' | 'trade'; service?: string; onServiceChange?: (value:string) => void; serviceRef?: React.RefObject<HTMLSelectElement | null> }) {
  const [draft, setDraft] = useState<Record<string,string>>({});
  const [message, setMessage] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousReview = useRef(false);
  useEffect(() => { setMessage(''); }, [service]);
  useEffect(() => { if (message || previousReview.current) headingRef.current?.focus(); previousReview.current = !!message; }, [message]);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries([...new FormData(form).entries()].map(([key,value]) => [key,String(value).trim()]));
    for (const key of ['Business','Name','Details']) {
      if (!data[key]) { const field = form.elements.namedItem(key) as HTMLInputElement; field.setCustomValidity('Please enter a little information.'); field.reportValidity(); return; }
    }
    setDraft(data); setMessage(kind === 'trade' ? tradeApplicationMessage(data) : businessMessage(data));
  }
  const trade = kind === 'trade';
  return <div className="business-form"><h3 ref={headingRef} tabIndex={-1} className="flow-title">{message ? 'Review your request.' : trade ? 'Trade application' : 'Your business enquiry'}</h3>{message ? <MessageReview message={message} whatsappNumber={trade ? wholesaleWhatsAppNumber : '447760616466'} onEdit={() => setMessage('')} /> : <form onSubmit={prepare} onInput={e => { const target = e.target as HTMLInputElement; target.setCustomValidity?.(''); }}>
    {!trade && <label>What do you need?<select name="Service" ref={serviceRef} value={service} onChange={e => onServiceChange?.(e.target.value)}>{services.map(item => <option key={item.name}>{item.name}</option>)}<option>More than one service</option></select></label>}
    <label>Business name (required)<input name="Business" required maxLength={120} defaultValue={draft.Business ?? ''} autoComplete="organization" /></label>
    <div className="form-row"><label>Contact name (required)<input name="Name" required maxLength={100} defaultValue={draft.Name ?? ''} autoComplete="name" /></label><label>Email{trade ? ' (required)' : ' (optional)'}<input name="Email" type="email" required={trade} maxLength={160} defaultValue={draft.Email ?? ''} autoComplete="email" /></label></div>
    {trade ? <><div className="form-row"><label>Business type<select name="Type" defaultValue={draft.Type ?? 'Retail shop'}><option>Retail shop</option><option>Repair business</option><option>Online reseller</option><option>Other business</option></select></label><label>Area or postcode (required)<input name="Area" required pattern={'.*\\S.*'} maxLength={100} defaultValue={draft.Area ?? ''} autoComplete="postal-code" /></label></div><label>How often do you buy?<select name="Frequency" defaultValue={draft.Frequency ?? 'Please advise'}><option>Please advise</option><option>One-off purchase</option><option>Weekly</option><option>Monthly</option><option>As needed</option></select></label></> : <div className="form-row"><label>Number of devices or items (optional)<input name="Quantity" type="number" min={1} max={10000} step={1} defaultValue={draft.Quantity ?? ''} inputMode="numeric" /></label><label>When do you need help? (optional)<input name="Needed" maxLength={100} defaultValue={draft.Needed ?? ''} placeholder="e.g. next week" /></label></div>}
    <label>{trade ? 'Products and quantities you usually need (required)' : 'Models and requirements (required)'}<textarea name="Details" required maxLength={1500} rows={5} defaultValue={draft.Details ?? ''} placeholder={trade ? 'Product categories, models, pack quantities and any supply requirements' : 'Device models, faults or specifications, quantities and other requirements'} /></label>
    <button className="button button-dark form-submit" type="submit">{trade ? 'Review trade application' : 'Review business enquiry'}</button>
  </form>}<p className="privacy-note">Your details stay in this page until you open WhatsApp. No payment is taken. Never include passwords or device passcodes.</p></div>;
}

