import { useEffect, useRef, useState } from 'react';
import { analyticsMeasurementId } from './analyticsConfig.mjs';
import { analyticsPage, createAnalytics, readAnalyticsChoice, saveAnalyticsChoice } from './analytics.mjs';
import { siteHref } from './sitePaths';

export function AnalyticsConsent({canonical,title}:{canonical:string|null;title:string}) {
  const enabled = /^G-[A-Z0-9]+$/.test(analyticsMeasurementId) && window.location.hostname === 'itopgroup.co.uk';
  const [choice,setChoice] = useState<string|null>(()=> { try { return readAnalyticsChoice(window.localStorage); } catch { return null; } });
  const [editing,setEditing] = useState(false);
  const [saved,setSaved] = useState(true);
  const controller = useRef<ReturnType<typeof createAnalytics>|null>(null);
  useEffect(()=>{
    if (!enabled) return;
    controller.current ??= createAnalytics(window,document,analyticsMeasurementId);
    if (canonical) controller.current.start(choice,analyticsPage(canonical,title,document.referrer));
  },[choice,canonical,title,enabled]);
  if (!enabled) return null;
  function choose(next:string) {
    let stored = false;
    try { stored = saveAnalyticsChoice(window.localStorage,next); } catch { /* Apply for this page. */ }
    setSaved(stored); setChoice(next); setEditing(false);
    if (next === 'rejected') controller.current?.stop();
  }
  return <><button type="button" className="text-button analytics-settings" onClick={()=>setEditing(!editing)} aria-expanded={editing || !choice}>Cookie settings</button>{(!choice || editing) && <section className="analytics-consent" role="region" aria-labelledby="analytics-consent-title"><div><h2 id="analytics-consent-title">Help us improve the website?</h2><p>Optional Google Analytics cookies help us understand which pages visitors use. Choose whether to allow them. You can change your choice in Cookie settings.</p><a className="text-button" href={siteHref('privacy/')}>Privacy & cookies</a></div><div className="analytics-consent-actions"><button type="button" className="button button-outline" onClick={()=>choose('rejected')}>Reject analytics</button><button type="button" className="button button-outline" onClick={()=>choose('accepted')}>Accept analytics</button></div></section>}{!saved && <p className="analytics-storage-note" role="status">Your browser could not save this preference. Your choice applies to this page.</p>}</>;
}
