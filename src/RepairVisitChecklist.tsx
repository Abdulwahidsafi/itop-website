import { siteHref } from './sitePaths';

export function RepairVisitChecklist() {
  return <section className="content-section repair-visit-checklist" aria-labelledby="visit-checklist-title"><div><p className="eyebrow">BEFORE YOU VISIT</p><h2 id="visit-checklist-title">A little<br />preparation.</h2></div><div className="service-notes"><ul><li><strong>Back up your files</strong> if the device works and you can do so.</li><li><strong>Have the model details ready.</strong> For aftercare, bring your repair receipt or reference if available.</li><li><strong>Charging problem?</strong> Bring the cable and charger you normally use.</li></ul><div className="visit-actions"><a className="text-button" href={siteHref('support/')}>Warranty & aftercare</a><a className="text-button" href={siteHref('contact/')}>Hours & directions</a></div></div></section>;
}
