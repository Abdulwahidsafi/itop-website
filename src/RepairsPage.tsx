import { ArrowUpRight } from '@phosphor-icons/react';
import { RepairVisitChecklist } from './RepairVisitChecklist';
import { PhoneBrandChoices } from './PhoneRepairPages';
import { repairs } from './repairTypes';
import { siteHref } from './sitePaths';



export function RepairsPage({ onEnquire }: { onEnquire: (issue?: string) => void }) {
  return <>
    <section className="hero repairs-hero" aria-labelledby="repairs-title">
      <div><p className="eyebrow">ITOP / REPAIRS / CATFORD</p><h1 id="repairs-title">Back to<br />working<span>.</span></h1></div>
      <div className="hero-copy"><p>Phone, laptop and gadget repair enquiries.<br className="desktop-break" /> Tell us the model and the fault.<br className="desktop-break" /> We’ll confirm the options before you visit.</p><button className="button button-dark" onClick={() => onEnquire()}>Start a repair enquiry</button><a className="repair-call" href="tel:+447760616466">Or call 07760 616 466</a></div>
    </section>
    <PhoneBrandChoices />
    <section className="repair-services" aria-labelledby="services-title">
      <div className="section-heading"><h2 id="services-title">What needs fixing?</h2><p>Choose a starting point. Parts and support depend on your model.</p></div>
      <div className="repair-service-grid">{repairs.map(({ title, issue, description, icon: Icon }) => <article className="repair-service" key={issue}>
        <Icon size={30} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{description}</p><button className="text-button" onClick={() => onEnquire(issue)}>Ask about {issue === 'Not sure' ? 'a fault' : title === 'Charging faults' ? 'charging' : title === 'Liquid damage & diagnostics' ? 'diagnostics' : title === 'Camera, speaker & microphone' ? 'this repair' : title.toLowerCase()}<ArrowUpRight size={17} aria-hidden="true" /></button>
      </article>)}</div>
    </section>
    <section className="content-section repair-faq" aria-labelledby="guide-title">
      <div><p className="eyebrow">A MORE USEFUL QUOTE</p><h2 id="guide-title">Describe the fault.<br />Know your options.</h2><p className="visit-note">A few details help the team decide what to check first.</p></div>
      <div className="faq-list">
        <details><summary>Screen: what should I tell you?</summary><p>Include the exact model and whether the glass is cracked, the display has lines, the screen is black or touch is not responding. Ask which replacement parts are available and how they differ in price and cover.</p><button className="text-button guide-enquiry" onClick={() => onEnquire('Screen replacement')}>Prepare a screen enquiry</button></details>
        <details><summary>Battery: what symptoms matter?</summary><p>Tell us about fast drain, shutdowns, battery-health messages and whether charging is also affected. A battery replacement may not resolve a separate cable, port or charging fault.</p><button className="text-button guide-enquiry" onClick={() => onEnquire('Battery replacement')}>Prepare a battery enquiry</button></details>
        <details><summary>Charging: is it always the port?</summary><p>Charging faults can involve the cable, charger, battery, port or other parts. Tell us whether the cable feels loose, charging is slow or it works only at an angle. Bring your usual cable and charger if possible.</p><button className="text-button guide-enquiry" onClick={() => onEnquire('Charging fault')}>Prepare a charging enquiry</button></details>
        <details><summary>Liquid exposure: what information helps?</summary><p>Tell us what happened, when it happened, what liquid was involved and what the device does now. Inspection comes before a repair decision. Repair, data recovery and full-device cover cannot be guaranteed.</p><button className="text-button guide-enquiry" onClick={() => onEnquire('Water damage / diagnostics')}>Prepare a diagnostic enquiry</button></details>
      </div>
    </section>
    <section className="repair-band repairs-process" aria-labelledby="process-title">
      <div className="repair-intro"><h2 id="process-title">Clear steps.<br />No surprises.</h2><p>An enquiry is the first step—not a booking or a payment.</p></div>
      <ol className="repair-steps"><li><span>01</span><h3>Tell us</h3><p>Your model<br />and the fault.</p></li><li><span>02</span><h3>Confirm</h3><p>Price, parts,<br />time and cover.</p></li><li><span>03</span><h3>Visit</h3><p>Agree the work<br />before it starts.</p></li></ol>
      <button className="button button-cyan" onClick={() => onEnquire()}>Start a repair enquiry</button>
    </section>
    <RepairVisitChecklist />

  </>;
}
