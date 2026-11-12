import { useState, type FormEvent } from 'react';
import { CheckCircle, Phone, WhatsappLogo } from '@phosphor-icons/react';
import { siteHref } from './sitePaths';
import { pounds, shortDate, trackRepair, trackingFormProblem } from './repairTracking.mjs';

type Repair = {reference:string; device:string; fault:string; status:string; label:string; message:string; step:number; steps:string[]; bookedAt:string; updatedAt:string; estimatedTime:string; toPayCents:number};

export function TrackRepairPage() {
  const [job, setJob] = useState(() => new URLSearchParams(window.location.search).get('job')?.slice(0, 12) ?? '');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [repair, setRepair] = useState<Repair | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const problem = trackingFormProblem(job, phone);
    if (problem) { setError(problem); setRepair(null); return; }
    setBusy(true); setError('');
    const result = await trackRepair(job, phone);
    setBusy(false);
    if (result.ok) setRepair(result.repair as Repair); else { setRepair(null); setError(result.message ?? ''); }
  }
  const closed = repair?.status === 'Cancelled';
  const whatsapp = repair ? `https://wa.me/447760616466?text=${encodeURIComponent(`Hello iTop, I am asking about repair ${repair.reference}.`)}` : 'https://wa.me/447760616466';

  return <><section className="hero repairs-hero"><div><p className="eyebrow">ITOP / TRACK YOUR REPAIR</p><h1>Where is<br />my repair<span>?</span></h1></div><div className="hero-copy"><p>Type the job number from your repair ticket and the last 4 digits of your phone number to see how your repair is going.</p><a className="text-button" href={siteHref('contact/')}>Visit & Contact</a></div></section>
    <section className="content-section track-section">
      <form className="track-form" onSubmit={submit} noValidate>
        <label>Job number<small>On your ticket, starts with R</small><input name="job" value={job} onChange={e => setJob(e.target.value)} placeholder="R000123" autoCapitalize="characters" autoComplete="off" maxLength={12} inputMode="text" /></label>
        <label>Last 4 digits of your phone number<small>The number you gave us when you booked</small><input name="phone" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="1234" inputMode="numeric" autoComplete="off" maxLength={4} /></label>
        <button className="button button-dark" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Check my repair'}</button>
        {error && <p className="track-error" role="alert">{error}</p>}
      </form>
      <div aria-live="polite">{repair && <article className={`track-result ${closed ? 'is-closed' : ''}`}>
        <header><p className="track-ref">Repair {repair.reference}</p><h2>{repair.label}</h2><p>{repair.message}</p></header>
        {!closed && <ol className="track-steps">{repair.steps.map((name, index) => <li key={name} className={index < repair.step ? 'done' : index === repair.step ? 'now' : ''} aria-current={index === repair.step ? 'step' : undefined}><span>{index < repair.step ? <CheckCircle size={22} weight="fill" aria-hidden="true" /> : index + 1}</span>{index === 1 && repair.status === 'Awaiting parts' ? 'Waiting for a part' : name}</li>)}</ol>}
        <dl className="track-facts">
          <div><dt>Device</dt><dd>{repair.device}</dd></div>
          {repair.fault && <div><dt>Repair</dt><dd>{repair.fault}</dd></div>}
          {shortDate(repair.bookedAt) && <div><dt>Booked in</dt><dd>{shortDate(repair.bookedAt)}</dd></div>}
          {repair.estimatedTime && <div><dt>Expected</dt><dd>{repair.estimatedTime}</dd></div>}
          {!closed && repair.status !== 'Collected' && <div><dt>To pay on collection</dt><dd>{repair.toPayCents > 0 ? pounds(repair.toPayCents) : 'Nothing – paid'}</dd></div>}
        </dl>
        <div className="visit-actions"><a className="button button-dark" href="tel:+447760616466"><Phone size={20} aria-hidden="true" /> Call 07760 616 466</a><a className="button button-outline" href={whatsapp} target="_blank" rel="noreferrer"><WhatsappLogo size={20} aria-hidden="true" /> WhatsApp us</a></div>
        <p className="track-note">Times are a guide. We will contact you if anything changes.</p>
      </article>}</div>
      <p className="track-privacy">Your job number and the 4 digits are sent to iTop’s shop system only to find your repair. This page never shows your name or full phone number. <a href={siteHref('privacy/')}>Privacy & cookies</a></p>
    </section></>;
}
