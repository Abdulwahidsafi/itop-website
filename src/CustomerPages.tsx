import { StoreDetails, shopDirections } from './StoreDetails';
import { siteHref } from './sitePaths';
import type { EnquiryKind } from './EnquiryDialog';

type Props = { onEnquire: (kind: EnquiryKind | 'Choose', category?: string) => void };

export function ContactPage({ onEnquire }: Props) {
  return <><section className="hero repairs-hero contact-hero"><div><p className="eyebrow">ITOP / CONTACT / CATFORD</p><h1>Come by.<br />Say hello<span>.</span></h1></div><div className="hero-copy"><p>Find the shop, check opening hours or contact iTop about your device.</p><nav className="contact-actions" aria-label="Contact the shop"><a className="button button-dark" href="tel:+447760616466">Call iTop</a><a className="button button-outline" href="https://wa.me/447760616466" target="_blank" rel="noopener noreferrer">WhatsApp iTop</a><a className="text-button" href={shopDirections} target="_blank" rel="noopener noreferrer">Get directions</a><a className="text-button" href="#shop-hours">Opening hours</a></nav><p className="contact-phone">07760 616 466 · Retail, repairs & aftercare</p></div></section>
    <section className="visit-section content-section contact-visit" id="visit"><div><p className="eyebrow">160 RUSHEY GREEN / SE6 4HQ</p><h2>Find us<br />in Catford.</h2><p className="visit-note">Check parts and availability before travelling.</p><a className="text-button support-note" href={siteHref('support/')}>Warranty & aftercare</a></div><StoreDetails /></section>
    <section className="content-section contact-help" aria-labelledby="contact-help-title"><div><p className="eyebrow">SEND THE RIGHT DETAILS</p><h2 id="contact-help-title">How can<br />we help?</h2></div><div><p>For a repair or product enquiry, choose what you need and review your message before opening WhatsApp.</p><button className="button button-dark" onClick={() => onEnquire('Choose')}>Choose an enquiry</button><div className="contact-wholesale"><h3>Buying stock for resale?</h3><p>Use the wholesale catalogue and quote builder to send product names, models and quantities to the trade team.</p><a className="text-button" href={siteHref('wholesale/')}>Wholesale catalogue & quotes</a></div></div></section>
  </>;
}


export function SupportPage({ onEnquire }: Props) {
  return <><section className="hero repairs-hero"><div><p className="eyebrow">ITOP / WARRANTY & AFTERCARE</p><h1>Good questions.<br />Clear answers<span>.</span></h1></div><div className="hero-copy"><p>Understand the repair or product before you agree. Ask iTop to confirm the exact price, parts and cover for your device.</p><button className="button button-dark" onClick={() => onEnquire('Support', 'Warranty / aftercare')}>Ask about aftercare</button></div></section>
    <section className="content-section"><div><p className="eyebrow">BEFORE WORK STARTS</p><h2>Confirm the details.<br />Keep a record.</h2></div><div className="service-notes"><p>Warranty can differ by repair, replacement part and device condition. Ask for the terms that apply to your particular repair or purchase.</p><ul><li>The agreed price and work to be carried out.</li><li>The replacement part or product you are choosing.</li><li>Any warranty duration, what it covers and any exclusions.</li><li>The expected timing and any inspection charges.</li></ul><p>Keep your receipt or written confirmation for future questions.</p></div></section>
    <section className="content-section repair-faq"><div><p className="eyebrow">CUSTOMER QUESTIONS</p><h2>What would<br />you like to know?</h2></div><div className="faq-list">
      
      <details><summary>What if I have a problem after a repair?</summary><p>Contact iTop with your model, repair date or reference, and a description of the problem. Keep your receipt. The team can discuss an inspection and the terms agreed for your repair.</p></details>
      <details><summary>What about new damage or liquid exposure?</summary><p>Tell the team about any drops, cracks, liquid exposure or work carried out since the repair. Ask how these affect the agreed cover. Eligibility is assessed for the individual case.</p></details>
      <details><summary>Do refurbished devices and accessories have cover?</summary><p>Ask about the individual device or accessory before buying. Confirm its condition, included items, warranty and any return or exchange terms.</p></details>
      <details><summary>Can I get a same-day repair?</summary><p>Ask about current parts and workload before travelling. Timing depends on your model and fault; same-day completion is not guaranteed.</p></details>
      <details><summary>Will a repair keep my data?</summary><p>Back up important files if you can and discuss data-related risks before work starts. Repairs, resets and recovery cannot guarantee that every file will be retained.</p></details>
      
      
    </div></section>
    <section className="content-section repair-visit"><div><p className="eyebrow">SETUP & NETWORK ENQUIRIES</p><h2>Tell us what<br />the device says.</h2></div><div><p className="repair-visit-copy">Ask about SIM or network messages, device setup or recovery guidance. Ownership and eligibility are checked before a service is agreed.</p><div className="visit-actions"><button className="button button-dark" onClick={() => onEnquire('Support', 'Network / SIM')}>Ask about setup or network</button><a className="text-button" href={siteHref('contact/')}>Visit & Contact</a></div></div></section>
  </>;
}


