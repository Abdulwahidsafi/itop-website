import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { MessageReview } from './MessageReview';
import { businessMessage } from './businessMessages.mjs';

const serviceNames = ['Device repairs', 'Replacement devices', 'Bulk accessories', 'More than one service'];
const prompts: Record<string, { model: string; example: string; details: string; placeholder: string }> = {
  'Device repairs': { model: 'Device models (required)', example: 'e.g. three iPhone 14 phones and two Samsung tablets', details: 'Faults or symptoms (required)', placeholder: 'Tell us which devices have each fault. If unsure, describe what happens.' },
  'Replacement devices': { model: 'Preferred models (optional)', example: 'e.g. iPhone or Samsung Galaxy, or leave blank', details: 'Features and requirements (required)', placeholder: 'How will your team use the devices? Include any essential features.' },
  'Bulk accessories': { model: 'Device models or connectors (optional)', example: 'e.g. iPhone 14 or USB-C; leave blank if unsure', details: 'Colours, styles and requirements (required)', placeholder: 'List the accessories, preferences and quantities for each item.' },
  'More than one service': { model: 'Devices or accessories (required)', example: 'List the models or item types; describe them if unsure', details: 'What help do you need? (required)', placeholder: 'List each service, its devices/items, quantities and requirements.' },
};

export function BusinessEnquiryForm({ service, onServiceChange, formRef }: { service: string; onServiceChange: (value: string) => void; formRef: RefObject<HTMLDivElement | null> }) {
  const [common, setCommon] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [message, setMessage] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasReview = useRef(false);
  const draft = drafts[service] ?? {};
  const prompt = prompts[service];
  useEffect(() => { setMessage(''); }, [service]);
  useEffect(() => { if (message || wasReview.current) headingRef.current?.focus(); wasReview.current = !!message; }, [message]);
  function update(key: string, value: string) { setDrafts(current => ({ ...current, [service]: { ...current[service], [key]: value } })); }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    for (const key of ['Business', 'Name', 'Details', ...(['Device repairs', 'More than one service'].includes(service) ? ['Models'] : [])]) {
      const field = event.currentTarget.elements.namedItem(key) as HTMLInputElement;
      if (!field.value.trim()) { field.setCustomValidity('Please enter a little information.'); field.reportValidity(); return; }
    }
    setMessage(businessMessage({ ...common, ...draft, Service: service }));
  }
  const serviceChoice = <label>What do you need? (required)<select name="Service" value={service} required onChange={event => onServiceChange(event.target.value)}><option value="" disabled>Choose a service</option>{serviceNames.map(name => <option key={name}>{name}</option>)}</select></label>;
  return <div className="business-form" id="business-request" ref={formRef} tabIndex={-1} aria-labelledby="business-form-title"><h3 id="business-form-title" ref={headingRef} tabIndex={-1} className="flow-title">{message ? 'Review your request.' : 'Your business enquiry'}</h3>
    {message ? <>{serviceChoice}<MessageReview message={message} onEdit={() => setMessage('')} /></> : <form onSubmit={prepare} onInput={event => (event.target as HTMLInputElement).setCustomValidity?.('')}>
      {serviceChoice}
      <label>Business name (required)<input name="Business" required maxLength={120} value={common.Business ?? ''} onChange={event => setCommon(current => ({ ...current, Business: event.target.value }))} autoComplete="organization" /></label>
      <div className="form-row"><label>Contact name (required)<input name="Name" required maxLength={100} value={common.Name ?? ''} onChange={event => setCommon(current => ({ ...current, Name: event.target.value }))} autoComplete="name" /></label><label>Email (optional)<input name="Email" type="email" maxLength={160} value={common.Email ?? ''} onChange={event => setCommon(current => ({ ...current, Email: event.target.value }))} autoComplete="email" /></label></div>
      <div className="form-row"><label>Number of devices or items (optional)<input name="Quantity" type="number" min={1} max={10000} step={1} value={common.Quantity ?? ''} onChange={event => setCommon(current => ({ ...current, Quantity: event.target.value }))} /></label><label>When do you need help? (optional)<input name="Needed" maxLength={100} value={common.Needed ?? ''} onChange={event => setCommon(current => ({ ...current, Needed: event.target.value }))} placeholder="e.g. next week" /></label></div>
      {prompt && <fieldset className="business-requirements" key={service}><legend>{service}</legend>
        {service === 'Bulk accessories' && <label>Accessory type<select name="Accessory" value={draft.Accessory ?? 'Please advise'} onChange={event => update('Accessory', event.target.value)}>{['Please advise', 'Cases', 'Screen protectors', 'Cables', 'Chargers', 'Power banks', 'Audio', 'More than one type', 'Other accessory'].map(name => <option key={name}>{name}</option>)}</select></label>}
        <label>{prompt.model}<input name="Models" required={service === 'Device repairs' || service === 'More than one service'} maxLength={300} value={draft.Models ?? ''} onChange={event => update('Models', event.target.value)} placeholder={prompt.example} /></label>
        {service === 'Device repairs' && <p className="business-field-help">Not sure of the model? Describe the device and we’ll help identify it.</p>}
        {service === 'Replacement devices' && <div className="form-row"><label>Storage preference<select name="Storage" value={draft.Storage ?? 'Please advise'} onChange={event => update('Storage', event.target.value)}>{['Please advise', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'].map(storage => <option key={storage}>{storage}</option>)}</select></label><label>Budget per device (£, optional)<input name="Budget" type="number" min={1} max={100000} step="0.01" value={draft.Budget ?? ''} onChange={event => update('Budget', event.target.value)} placeholder="e.g. 250" /></label></div>}
        <label>{prompt.details}<textarea name="Details" required maxLength={1500} rows={3} value={draft.Details ?? ''} onChange={event => update('Details', event.target.value)} placeholder={prompt.placeholder} /></label>
      </fieldset>}
      <button className="button button-dark form-submit" type="submit">Review business enquiry</button>
    </form>}
    <p className="privacy-note">Your details stay in this page until you open WhatsApp. No payment is taken. Never include passwords or device passcodes.</p>
  </div>;
}
