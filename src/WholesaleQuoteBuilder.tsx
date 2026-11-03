import { useEffect, useRef, useState, type FormEvent } from 'react';
import { wholesaleCatalogueUrl, wholesaleWhatsAppNumber } from './wholesaleContact';
import { wholesaleDraftKey, encodeWholesaleDraft, decodeWholesaleDraft } from './wholesaleDraft.mjs';
import { MessageReview } from './MessageReview';
import { quoteErrors, wholesaleMessage } from './enquiryMessages.mjs';

export type QuoteProduct = { product: string; sku: string; variant: string; quantity: string; unit: string };
type Row = { id: number; product: string; sku: string; variant: string; quantity: string; unit: string };
const emptyRow = (id: number): Row => ({ id, product: '', sku: '', variant: '', quantity: '1', unit: 'Items' });

export function WholesaleQuoteBuilder({ initialItems = [] }: { initialItems?: QuoteProduct[] }) {
  const [rows, setRows] = useState<Row[]>(() => initialItems.length ? initialItems.slice(0,12).map((item,index)=>({...item,id:index+1})) : [emptyRow(1)]);
  const [details, setDetails] = useState<Record<string,string>>({ Name: '', Business: '', Fulfilment: 'Collection', Location: '', Needed: '', Notes: '' });
  const [review, setReview] = useState(false);
  const [error, setError] = useState('');
  const [savedList, setSavedList] = useState<ReturnType<typeof decodeWholesaleDraft>>(null);
  const [storageStatus, setStorageStatus] = useState('');
  const nextId = useRef(Math.max(2,Math.min(initialItems.length,12)+1));
  useEffect(() => {
    try {
      const raw = localStorage.getItem(wholesaleDraftKey);
      const saved = decodeWholesaleDraft(raw);
      setSavedList(saved);
      if (raw && !saved) { localStorage.removeItem(wholesaleDraftKey); setStorageStatus('An expired or unreadable saved list was removed.'); }
    } catch { setStorageStatus('Saving is unavailable in this browser. You can still prepare a quote.'); }
  }, []);
  function saveList() {
    try {
      const raw = encodeWholesaleDraft(rows);
      localStorage.setItem(wholesaleDraftKey, raw);
      setSavedList(decodeWholesaleDraft(raw)); setStorageStatus('Product list saved on this device. Save again after making changes.');
    } catch { setStorageStatus('Could not save here. Your current list is still available to review or copy.'); }
  }
  function loadList() {
    if (!savedList) return;
    setRows(savedList.rows); nextId.current = savedList.rows.length + 1;
    setError(''); setStorageStatus('Saved product list loaded.'); setReview(false);
    requestAnimationFrame(() => document.getElementById('quote-product-1')?.focus());
  }
  function clearSavedList() {
    try { localStorage.removeItem(wholesaleDraftKey); setSavedList(null); setStorageStatus('Saved list deleted from this device. Your current form is unchanged.'); }
    catch { setStorageStatus('Could not delete the saved list. Check your browser storage settings.'); }
  }
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [review]);
  const set = (key: string, value: string) => setDetails(previous => ({ ...previous, [key]: value }));
  const update = (id: number, key: Exclude<keyof Row, 'id'>, value: string) => setRows(previous => previous.map(row => row.id === id ? { ...row, [key]: value } : row));
  function add() {
    const id = nextId.current++;
    setRows(previous => [...previous, emptyRow(id)]);
    requestAnimationFrame(() => document.getElementById('quote-product-' + id)?.focus());
  }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = quoteErrors(rows);
    if (errors.length) { setError(errors.join(' ')); return; }
    setError(''); setReview(true);
  }
  return <div className="guided-flow">
    <h3 ref={heading} tabIndex={-1} className="flow-title">{review ? 'Review your product list.' : 'Build your quote request.'}</h3>
    {review ? <MessageReview whatsappNumber={wholesaleWhatsAppNumber} message={wholesaleMessage(rows, details)} onEdit={() => setReview(false)} editLabel="Edit product list" /> : <form onSubmit={prepare}>
      <p className="dialog-intro">Choose products from the <a className="catalogue-inline-link" href={wholesaleCatalogueUrl} target="_blank" rel="noopener noreferrer">WhatsApp wholesale catalogue</a>, then add variants and quantities below. iTop will confirm stock and your quote.</p>
      <div className="draft-tools"><div className="draft-actions"><button className="text-button" type="button" onClick={saveList}>Save product list</button>{savedList && <><button className="text-button" type="button" onClick={loadList}>Load saved list</button><button className="text-button" type="button" onClick={clearSavedList}>Delete saved list</button></>}</div><p>Optional: save products and quantities on this device for up to 30 days. Contact details and notes are not saved. Avoid saving on a shared device.</p><p role="status">{storageStatus}</p></div>
      <div className="quote-items">{rows.map((row, index) => <fieldset key={row.id} className="quote-item"><legend>Item {index + 1}</legend>
        <label>Product (required)<input id={'quote-product-' + row.id} value={row.product} onChange={e => update(row.id, 'product', e.target.value)} required pattern={'.*\\S.*'} title="Enter a product description" maxLength={100} placeholder="e.g. clear phone case" /></label>
        <div className="form-row"><label>Model, colour or variant<input value={row.variant} onChange={e => update(row.id, 'variant', e.target.value)} maxLength={100} placeholder="e.g. iPhone 14, clear" /></label><label>Product code (optional)<input value={row.sku} onChange={e => update(row.id, 'sku', e.target.value)} maxLength={40} placeholder="If you have a reference" /></label></div>
        <div className="form-row"><label>Quantity<input type="number" inputMode="numeric" min={1} max={10000} step={1} required value={row.quantity} onChange={e => update(row.id, 'quantity', e.target.value)} /></label><label>Quantity type<select value={row.unit} onChange={e => update(row.id, 'unit', e.target.value)}><option>Items</option><option>Packs</option></select></label></div>
        <button className="text-button" type="button" disabled={rows.length === 1} aria-label={'Remove item ' + (index + 1)} onClick={() => setRows(previous => previous.filter(item => item.id !== row.id))}>Remove item</button>
      </fieldset>)}</div>
      <button className="text-button add-product" type="button" onClick={add} disabled={rows.length >= 12}>Add another product</button>
      {rows.length >= 12 && <p className="secondary-copy">For a longer list, describe extra items in Notes.</p>}
      <div className="form-row"><label>Your name<input value={details.Name} onChange={e => set('Name', e.target.value)} autoComplete="given-name" maxLength={100} /></label><label>Business name<input value={details.Business} onChange={e => set('Business', e.target.value)} maxLength={100} /></label></div>
      <label>Collection or delivery<select value={details.Fulfilment} onChange={e => set('Fulfilment', e.target.value)}><option>Collection</option><option>Delivery enquiry</option><option>Please advise</option></select></label>
      {details.Fulfilment === 'Delivery enquiry' && <label>Delivery area or postcode<input value={details.Location} onChange={e => set('Location', e.target.value)} required pattern={'.*\\S.*'} maxLength={100} placeholder="Area or postcode, rather than a full address" /></label>}
      <label>When do you need it? (optional)<input value={details.Needed} onChange={e => set('Needed', e.target.value)} maxLength={100} placeholder="e.g. next week" /></label>
      <label>Notes (optional)<textarea value={details.Notes} onChange={e => set('Notes', e.target.value)} rows={3} maxLength={600} placeholder="Pack sizes, alternative products or other requirements" /></label>
      <p role="alert">{error}</p><button className="button button-dark form-submit" type="submit">Review quote request</button>
    </form>}
    <p className="privacy-note">No payment is taken and stock is not reserved. Pack sizes, prices, delivery charges and availability are confirmed by iTop. Drafts are kept in this page unless you choose to save the product list on this device.</p>
  </div>;
}
