import { useEffect, useRef, useState } from 'react';
import { List, ChatCircle, X, CheckCircle } from '@phosphor-icons/react';
import { BusinessPage, TradeApplicationPage } from './BusinessPages';
import { AnalyticsConsent } from './AnalyticsConsent';
import { PrivacyPage } from './PrivacyPage';
import { TrackRepairPage } from './TrackRepair';
import { RewardsPage } from './RewardsPage';
import { sitePageMeta } from './siteMeta.mjs';
import { PhoneRepairPages } from './PhoneRepairPages';
import { findRepairPage } from './repairCatalogue.mjs';
import { hasRepairPrices } from './repairPrices.mjs';
import { RepairsPage } from './RepairsPage';
import { ContactPage, SupportPage } from './CustomerPages';
import { HomePage } from './HomePage';
import { siteHref, siteRoute } from './sitePaths';
import { useScrollReveal } from './scrollReveal';
import { QuickContact } from './QuickContact';
import { EnquiryDialog, type EnquiryKind, type Enquiry } from './EnquiryDialog';
import { AccessoriesPage, WholesalePage, BuySellPage } from './ServicePages';
export function App() {
  const route = siteRoute(window.location.pathname);
  const isRepairsPage = route === 'repairs' || route.startsWith('repairs/');
  const meta = sitePageMeta(route);
  useScrollReveal(route);
  useEffect(() => {
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    const setTag = (selector:string, attributes:Record<string,string>) => {
      let tag = document.querySelector(selector);
      if (!tag) { tag=document.createElement(selector.startsWith('link') ? 'link' : 'meta'); document.head.append(tag); }
      for (const [key,value] of Object.entries(attributes)) tag.setAttribute(key,value);
    };
    setTag('meta[name="robots"]', {name:'robots',content:meta.indexable ? 'index,follow' : 'noindex,follow'});
    if (meta.canonical) setTag('link[rel="canonical"]', {rel:'canonical',href:meta.canonical});
    else document.querySelector('link[rel="canonical"]')?.remove();
    setTag('meta[property="og:title"]', {property:'og:title',content:meta.title});
    setTag('meta[property="og:description"]', {property:'og:description',content:meta.description});
    setTag('meta[property="og:url"]', {property:'og:url',content:meta.canonical ?? window.location.href});
  }, [route]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event:KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  function openEnquiry(kind: EnquiryKind | 'Choose' = 'Repair', category = '', issue?: string, phone?: Enquiry['phone'], quoteItems?: Enquiry['quoteItems']) { returnFocus.current = document.activeElement as HTMLElement; setMenuOpen(false); setEnquiry({ kind, category, issue, phone, quoteItems }); }
  function closeEnquiry() { setEnquiry(null); requestAnimationFrame(() => returnFocus.current?.focus()); }
  function navClick() { setMenuOpen(false); }
  return <><a className="skip-link" href="#main">Skip to content</a><div className="utility-bar"><span>iTop Phones &amp; Repair Center</span><a href={siteHref('contact/')}>160 Rushey Green, Catford</a><a href={siteHref('track-repair/')}>Track your repair</a><a href="tel:+447760616466">Call 07760 616 466</a></div><header className="header">
    <a className="brand" href={siteHref()} aria-label="iTop home"><img src={siteHref('assets/itop-logo.png')} alt="iTop Wholesale & Retail" /></a>
    <nav id="mobile-navigation" className={`navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">{[['repairs','Repairs'],['accessories','Accessories'],['buy-sell','Buy & Sell'],['wholesale','Wholesale'],['business','For Business'],['rewards','Rewards']].map(([path,label]) => <a key={path} href={siteHref(`${path}/`)} aria-current={route === path || (path === 'repairs' && isRepairsPage) || (path === 'wholesale' && route.startsWith('wholesale/')) ? 'page' : undefined} onClick={navClick}>{label}</a>)}<a href={siteHref('contact/')} aria-current={route === 'contact' ? 'page' : undefined} onClick={navClick}>Visit & Contact</a></nav>
    <button className="ask-button" aria-label="Find my repair" onClick={() => window.location.assign(siteHref('repairs/#find-repair'))}><ChatCircle size={24} weight="light" aria-hidden="true" /><span>Find my repair</span></button><button ref={menuButton} className="menu-button icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={26} /> : <List size={26} />}</button>
  </header><main id="main" tabIndex={-1}>
    {!meta.indexable && !route.startsWith('repairs/') ? <section className="hero repairs-hero"><div><p className="eyebrow">ITOP / PAGE NOT FOUND</p><h1>Let’s find<br />your way<span>.</span></h1></div><div className="hero-copy"><p>This link is unavailable. Choose a service or contact the shop for help.</p><div className="visit-actions"><a className="button button-dark" href={siteHref()}>Go to homepage</a><a className="text-button" href={siteHref('contact/')}>Visit & Contact</a></div></div></section> : route === 'business' ? <BusinessPage /> : route === 'wholesale/apply' ? <TradeApplicationPage /> : route.startsWith('repairs/') ? <PhoneRepairPages route={route} onEnquire={(issue,phone) => openEnquiry('Repair','',issue,phone)} /> : isRepairsPage ? <RepairsPage onEnquire={(issue,phone) => openEnquiry('Repair', '', issue,phone)} /> : route === 'accessories' ? <AccessoriesPage onEnquire={openEnquiry} /> : route === 'wholesale' ? <WholesalePage onEnquire={openEnquiry} /> : route === 'buy-sell' ? <BuySellPage onEnquire={openEnquiry} /> : route === 'contact' ? <ContactPage onEnquire={openEnquiry} /> : route === 'privacy' ? <PrivacyPage /> : route === 'track-repair' ? <TrackRepairPage /> : route === 'rewards' ? <RewardsPage /> : route === 'support' ? <SupportPage onEnquire={openEnquiry} /> : <HomePage onRepair={phone=>openEnquiry('Repair','',undefined,phone)}/>}</main><footer className={isRepairsPage ? 'repairs-footer' : undefined}><div className="footer-links"><a href={siteHref('track-repair/')}>Track your repair</a><a href={siteHref('rewards/')}>iTop Rewards</a><a href={siteHref('contact/')}>Visit & Contact</a><a href={siteHref('support/')}>Warranty & aftercare</a><a href={siteHref('business/')}>iTop for Business</a><a href={siteHref('privacy/')}>Privacy & cookies</a></div><span>© {new Date().getFullYear()} iTop Phones & Repair Center</span><span><CheckCircle size={17} />Price, parts and warranty confirmed before work starts.</span><AnalyticsConsent canonical={meta.canonical} title={meta.title} /></footer><QuickContact hidden={menuOpen || enquiry !== null} aboveBar={isRepairsPage} />{isRepairsPage && !menuOpen && !enquiry && <nav className="mobile-repair-actions" aria-label="Quick repair actions"><button className="button button-dark" onClick={() => { const page=findRepairPage(route); if(page.model && hasRepairPrices(page.model.name)){document.getElementById('model-services-title')?.scrollIntoView({behavior:'smooth'});return;} const finderPrices=document.getElementById('finder-price-title'); if(finderPrices){finderPrices.scrollIntoView({behavior:'smooth'});return;} openEnquiry('Repair','',undefined,page.valid && page.brand ? {brand:page.brand.name,model:page.model?.name ?? ''} : undefined); }}>Repair options</button><a className="button button-outline" href="tel:+447760616466">Call iTop</a></nav>}{enquiry && <EnquiryDialog {...enquiry} onClose={closeEnquiry} />}</>;
}
