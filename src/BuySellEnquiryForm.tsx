import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageReview } from './MessageReview';
import { buildBuySellMessage } from './buySellMessage.mjs';

type Intent = '' | 'buy' | 'sell';
type Draft = { device: string; model: string; storage: string; budget: string; condition: string; unknown: boolean; description: string; notes: string };
const emptyDraft = (): Draft => ({ device: 'Phone', model: '', storage: 'Not sure', budget: '', condition: 'Not sure', unknown: false, description: '', notes: '' });

export function BuySellEnquiryForm({ intent, onIntentChange }: { intent: Intent; onIntentChange: (intent: Intent) => void }) {
  const [drafts, setDrafts] = useState({ buy: emptyDraft(), sell: emptyDraft() });
  const [message, setMessage] = useState('');
  const [review, setReview] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, [review, intent]);
  const draft = drafts[intent || 'buy'];
  const selling = intent === 'sell';
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    if (intent) setDrafts(current => ({ ...current, [intent]: { ...current[intent], [key]: value } }));
  }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selling) {
      const field = event.currentTarget.elements.namedItem(draft.unknown ? 'description' : 'model') as HTMLInputElement;
      if (!field.value.trim()) { field.setCustomValidity('Tell us the model or describe your device.'); field.reportValidity(); return; }
    }
    setMessage(buildBuySellMessage(intent, draft));
    setReview(true);
  }
  if (!intent) return <><h3 ref={headingRef} tabIndex={-1} className="flow-title">Which would you like to do?</h3><div className="enquiry-choices"><button onClick={() => onIntentChange('buy')}><strong>Buy a device</strong><span>Tell us your preferences and budget.</span></button><button onClick={() => onIntentChange('sell')}><strong>Sell my device</strong><span>Share your device and its condition.</span></button></div></>;
  return <><h3 ref={headingRef} tabIndex={-1} className="flow-title">{review ? 'Review your enquiry.' : selling ? 'Tell us about your device.' : 'What are you looking for?'}</h3>
    {review ? <MessageReview message={message} onEdit={() => setReview(false)} /> : <>
      <p className="dialog-intro">{selling ? 'Any offer follows an in-store inspection and ownership checks.' : 'Not sure which model? Tell us your budget and we’ll discuss current options.'}</p>
      <form onSubmit={prepare}>
        <label>Device type<select name="device" value={draft.device} onChange={event => update('device', event.target.value)}><option>Phone</option><option>Tablet</option><option>Laptop</option><option>Other gadget</option></select></label>
        {selling && <label className="device-unknown-choice"><input type="checkbox" checked={draft.unknown} onChange={event => update('unknown', event.target.checked)} />I’m not sure of my model</label>}
        {selling && draft.unknown ? <label>Describe your device (required)<input name="description" value={draft.description} onChange={event => { event.currentTarget.setCustomValidity(''); update('description', event.target.value); }} required maxLength={200} placeholder="e.g. Samsung phone, blue, three rear cameras" /></label> : <label>{selling ? 'Device model (required)' : 'Preferred model (optional)'}<input key={intent} name="model" value={draft.model} onChange={event => { event.currentTarget.setCustomValidity(''); update('model', event.target.value); }} required={selling} maxLength={150} placeholder={selling ? 'e.g. iPhone 14 or ThinkPad T14' : 'e.g. iPhone, Samsung Galaxy, or leave blank'} /></label>}
        {selling && <details className="device-model-help"><summary>Where can I find my model?</summary><p>On a phone or tablet, look in Settings → About. For a laptop, check its system information or the label underneath. If you’re still unsure, choose “I’m not sure of my model” and describe it.</p></details>}
        <div className="form-row"><label>{selling ? 'Storage (if known)' : 'Storage preference'}<select value={draft.storage} onChange={event => update('storage', event.target.value)}>{['Not sure', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'].map(storage => <option key={storage}>{storage}</option>)}</select></label>
          {selling ? <label>Device condition<select value={draft.condition} onChange={event => update('condition', event.target.value)}><option>Not sure</option><option>Working, good condition</option><option>Working, signs of use</option><option>Damaged or faulty</option></select></label> : <label>Maximum budget (£, optional)<input type="number" min={1} max={100000} step="0.01" value={draft.budget} onChange={event => update('budget', event.target.value)} placeholder="e.g. 250" /></label>}
        </div>
        <label>{selling ? 'Known faults or anything else (optional)' : 'Preferences or anything else (optional)'}<textarea value={draft.notes} onChange={event => update('notes', event.target.value)} maxLength={1500} rows={2} placeholder={selling ? 'Screen damage, battery issues, repairs, or anything we should check.' : 'Preferred colour, features or anything you’d like us to check.'} /></label>
        <button className="button button-dark form-submit" type="submit">Preview enquiry</button>
      </form>
      <button className="text-button device-switch-intent" type="button" onClick={() => onIntentChange(selling ? 'buy' : 'sell')}>{selling ? 'Looking to buy instead?' : 'Looking to sell instead?'}</button>
    </>}
    <p className="privacy-note">{selling ? 'An enquiry is not a final valuation or a commitment to sell.' : 'Availability, price, condition and any warranty are confirmed for the individual device.'} No payment is taken here. You choose whether to send through WhatsApp. Never share passwords or device passcodes.</p>
  </>;
}
