import { useEffect, useRef, useState, type FormEvent } from 'react';
import { accessoryCategories, accessoryCategory } from './accessoryChoices';
import { MessageReview } from './MessageReview';
import retailProducts from './retail-products.json';
import { publishedRetailProducts, retailMoney } from './retailProducts.mjs';

export function AccessoriesEnquiryForm({ selection }: { selection: string }) {
  const selectedProduct = publishedRetailProducts(retailProducts).find(product=>selection==='retail:'+product.id);
  const initialCategory = accessoryCategories.find(category => category.title === selection);
  const [item, setItem] = useState(selectedProduct?.name ?? (accessoryCategory(selection) ? selection : ''));
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [review, setReview] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const activeProduct = selectedProduct && item===selectedProduct.name ? selectedProduct : undefined;
  const category = activeProduct?.category || accessoryCategory(item) || (item ? '' : initialCategory?.title);
  useEffect(() => { headingRef.current?.focus(); }, [review]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const details = event.currentTarget.elements.namedItem('Details') as HTMLTextAreaElement;
    if (item === 'Other accessory' && !String(values.get('Details') ?? '').trim()) {
      details.setCustomValidity('Tell us which accessory you need.');
      details.reportValidity();
      return;
    }
    setDraft(Object.fromEntries([...values.entries()].map(([key, value]) => [key, String(value)])));
    const lines = ['Hi iTop, I’d like to ask about an accessory.'];
    if (category) lines.push('Category: ' + category);
    if (activeProduct) lines.push('Retail product reference: '+activeProduct.id,'Listed retail price per item: '+retailMoney(activeProduct.pricePence),'Please confirm current availability and the right fit.');
    for (const [label, value] of values.entries()) if (String(value).trim()) lines.push(label + ': ' + String(value).trim());
    setMessage(lines.join('\n'));
    setReview(true);
  }

  return <><h3 ref={headingRef} tabIndex={-1} className="flow-title">{review ? 'Review your enquiry.' : 'Choose the right fit.'}</h3>
    {review ? <MessageReview message={message} onEdit={() => setReview(false)} /> : <>
      <p className="dialog-intro">{category && <strong>{category} · </strong>}We’ll confirm the fit, current stock and price with you.</p>
      <form onSubmit={prepare}>
        <label>Accessory (required)<select name="Accessory" value={item} required onChange={event => { setItem(event.target.value); detailsRef.current?.setCustomValidity(''); }}>
          <option value="" disabled>Choose an accessory</option>
          {selectedProduct && <option>{selectedProduct.name}</option>}
          {accessoryCategories.map(group => <optgroup label={group.title} key={group.title}>{group.items.map(option => <option key={option}>{option}</option>)}</optgroup>)}
          <option>Other accessory</option>
        </select></label>
        <label>Device model or connector (optional)<input name="Device / connector" defaultValue={draft['Device / connector'] ?? ''} placeholder="e.g. iPhone 14, Samsung A54 or USB-C" maxLength={150} aria-describedby="accessory-model-help" /></label>
        <p id="accessory-model-help" className="accessory-form-help">Not sure? Leave it blank and we’ll help identify the right fit.</p>
        <div className="form-row accessory-form-row"><label>Colour (optional)<input name="Colour" defaultValue={draft.Colour ?? ''} placeholder="Any colour" maxLength={100} /></label><label>Quantity (required)<input name="Quantity" type="number" min={1} max={9999} step={1} required defaultValue={draft.Quantity ?? '1'} /></label></div>
        <label>{item === 'Other accessory' ? 'Which accessory do you need? (required)' : 'Anything else? (optional)'}<textarea ref={detailsRef} name="Details" defaultValue={draft.Details ?? ''} placeholder="Preferred style, wired or wireless, or anything we should check." required={item === 'Other accessory'} onInput={event => event.currentTarget.setCustomValidity('')} rows={2} maxLength={1500} /></label>
        <button className="button button-dark form-submit" type="submit">Preview enquiry</button>
      </form>
    </>}
    <p className="privacy-note">No payment is taken here. Review your message before opening WhatsApp; you choose whether to send it. Never include passwords or device passcodes.</p>
  </>;
}
