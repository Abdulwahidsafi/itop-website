import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle, WhatsappLogo } from '@phosphor-icons/react';
import { siteHref } from './sitePaths';
import { earnRows, friendMessage, loadMember, loadProgramme, parseReceiptHash, percent, pounds, shortDate, signInProblem, wholePounds } from './rewards.mjs';

type Tier = {name:string; minCents:number; mult:number};
type Programme = {enabled:boolean; rates:Record<string, number>; tiers:Tier[]; goldPerk:string; minRedeem:number; maxRedeemPct:number; expiryMonths:number; welcomePoints:number; referralPoints:number; repairStampEvery:number; repairStampPoints:number; doubleDays:string[]};
type Member = {firstName:string; points:number; valueCents:number; usablePoints:number; tier:string; mult:number; nextTier:string; toNextCents:number; spendCents:number; toRewardPoints:number; stamps:number; stampEvery:number; stampPoints:number; friendCode:string; joined:string; expiresAt:string; history:{at:string; points:number; what:string}[]};
type Login = {phone?:string; code?:string; pin:string};
const KEY = 'itop.rewards.login';
const remembered = (): Login | null => { try { const v = JSON.parse(sessionStorage.getItem(KEY) || 'null'); return v && typeof v.pin === 'string' ? v : null; } catch { return null; } };

export function RewardsPage() {
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function signIn(login: Login) {
    setBusy(true); setError('');
    const result = await loadMember(login);
    setBusy(false);
    if (result.ok) { setMember(result.member as Member); if (result.programme) setProgramme(result.programme as Programme); try { sessionStorage.setItem(KEY, JSON.stringify(login)); } catch { /* private browsing */ } }
    else { setMember(null); setError(result.message ?? ''); try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } }
  }
  useEffect(() => {
    // A receipt QR code carries the receipt code and PIN after the #. Use them, then take them out of the address bar.
    const fromReceipt = parseReceiptHash(window.location.hash);
    if (fromReceipt) window.history.replaceState(null, '', window.location.pathname);
    const login = fromReceipt ?? remembered();
    if (login) void signIn(login);
    else void loadProgramme().then(r => { if (r.ok) setProgramme(r.programme as Programme); });
    // Scanning a receipt while this page is already open only changes the part after the #.
    const onHash = () => { const scanned = parseReceiptHash(window.location.hash); if (scanned) { window.history.replaceState(null, '', window.location.pathname); void signIn(scanned); } };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  function submit(event: FormEvent) {
    event.preventDefault();
    const problem = signInProblem(phone, pin);
    if (problem) { setError(problem); return; }
    void signIn({phone, pin});
  }
  function signOut() { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } setMember(null); setPin(''); }

  const p = programme;
  const nextTier = member && p ? p.tiers.find(t => t.name === member.nextTier) : undefined;
  return <><section className="hero repairs-hero"><div><p className="eyebrow">ITOP / REWARDS</p><h1>Points every<br />time you visit<span>.</span></h1></div><div className="hero-copy"><p>Collect points when you buy or repair at iTop. 100 points is £1 off. Joining is free and takes a few seconds at the till.</p><a className="text-button" href={siteHref('contact/')}>Visit the shop</a></div></section>
    <section className="content-section rewards-section">
      {member ? <article className="rewards-card" aria-live="polite">
        <header><div><p className="rewards-hello">{member.firstName ? `Hello ${member.firstName}` : 'Your iTop Rewards'}</p><p className="rewards-points">{member.points.toLocaleString('en-GB')}<small> points</small></p><p className="rewards-worth">Worth {pounds(member.valueCents)} off</p></div><span className={`rewards-tier tier-${member.tier.toLowerCase()}`}>{member.tier}</span></header>
        {p && <div className="rewards-bar"><div><b>{member.toRewardPoints > 0 ? `${member.toRewardPoints} more points until your first reward` : `You can use ${member.usablePoints.toLocaleString('en-GB')} points (${pounds(member.usablePoints)}) today`}</b><span>{member.toRewardPoints > 0 ? `Rewards start at ${p.minRedeem} points` : 'Tell us at the till'}</span></div><i><u style={{width: percent(member.points, p.minRedeem) + '%'}} /></i></div>}
        {nextTier ? <div className="rewards-bar"><div><b>{wholePounds(member.toNextCents)} more spend to reach {member.nextTier}</b><span>{member.nextTier} earns {nextTier.mult}× points</span></div><i><u style={{width: percent(member.spendCents, nextTier.minCents) + '%'}} /></i></div>
          : p && <p className="rewards-top"><CheckCircle size={20} weight="fill" aria-hidden="true" /> You are on our top level{p.goldPerk ? `: ${p.goldPerk}.` : '.'}</p>}
        {member.stampEvery > 1 && member.stampPoints > 0 && <div className="rewards-stamps"><b>Repair card</b><ol aria-label={`${member.stamps} of ${member.stampEvery} repairs`}>{Array.from({length: member.stampEvery}, (_, i) => <li key={i} className={i < member.stamps ? 'on' : ''}>{i < member.stamps ? '✓' : i + 1}</li>)}</ol><span>Repair number {member.stampEvery} earns {member.stampPoints.toLocaleString('en-GB')} bonus points ({pounds(member.stampPoints)}).</span></div>}
        {p && p.referralPoints > 0 && <div className="rewards-friend"><div><b>Bring a friend</b><span>Your friend code: <strong>{member.friendCode}</strong>. You both get {p.referralPoints} points after their first purchase.</span></div><a className="button button-outline" href={`https://wa.me/?text=${encodeURIComponent(friendMessage(member.friendCode))}`} target="_blank" rel="noreferrer"><WhatsappLogo size={20} aria-hidden="true" /> Share</a></div>}
        {member.history.length > 0 && <div className="rewards-history"><b>Recent points</b><ul>{member.history.map((h, i) => <li key={i}><span>{shortDate(h.at)}</span><span>{h.what}</span><strong className={h.points < 0 ? 'minus' : ''}>{h.points > 0 ? '+' : ''}{h.points.toLocaleString('en-GB')}</strong></li>)}</ul></div>}
        <footer>{member.expiresAt && <span>Visit before {shortDate(member.expiresAt)} to keep your points.</span>}<button type="button" className="text-button" onClick={signOut}>Sign out</button></footer>
      </article>
      : <form className="track-form rewards-form" onSubmit={submit} noValidate>
        <h2>See your points</h2>
        <label>Mobile number<small>The number you gave us when you joined</small><input name="phone" value={phone} onChange={e => setPhone(e.target.value.replace(/[^\d+ ]/g, '').slice(0, 18))} placeholder="07…" inputMode="tel" autoComplete="tel" /></label>
        <label>PIN<small>6 digits, printed on your last receipt under “iTop Rewards”</small><input name="pin" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" inputMode="numeric" autoComplete="off" maxLength={6} /></label>
        <button className="button button-dark" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Show my points'}</button>
        {error && <p className="track-error" role="alert">{error}</p>}
        <p className="rewards-hint">Tip: scan the QR code on your receipt and you do not need to type anything. No PIN? Ask at the till.</p>
      </form>}
      {p && p.enabled && <div className="rewards-how"><h2>How iTop Rewards works</h2><div className="rewards-grid">
        <div><h3>Earn</h3><ul>{earnRows(p).map(r => <li key={r.label}><span>{r.label}</span><b>{r.points} points per £1</b></li>)}</ul>{p.welcomePoints > 0 && <p>{p.welcomePoints} welcome points when you join.</p>}{p.doubleDays.length > 0 && <p>Double points every {p.doubleDays.join(' and ')}.</p>}</div>
        <div><h3>Spend</h3><p>100 points = £1 off.</p><p>Use them from {p.minRedeem} points ({pounds(p.minRedeem)}), for up to {p.maxRedeemPct}% of what you buy.</p><p>Points stay for {p.expiryMonths} months after your last visit.</p></div>
        <div><h3>Levels</h3><ul>{p.tiers.map(t => <li key={t.name}><span>{t.name}{t.minCents > 0 ? ` – spend ${wholePounds(t.minCents)} in a year` : ' – everyone starts here'}</span><b>{t.mult}× points</b></li>)}</ul>{p.goldPerk && <p>{p.tiers[p.tiers.length - 1].name} members also get: {p.goldPerk}.</p>}</div>
        <div><h3>Extras</h3>{p.referralPoints > 0 && <p>Bring a friend: you both get {p.referralPoints} points.</p>}{p.repairStampPoints > 0 && <p>Every {p.repairStampEvery}th repair earns {p.repairStampPoints.toLocaleString('en-GB')} bonus points.</p>}<p>Join free at the till with your mobile number.</p></div>
      </div></div>}
      <p className="track-privacy">Your number and PIN are sent to iTop’s shop system only to find your points. This page never shows your phone number or what you bought. <a href={siteHref('privacy/')}>Privacy & cookies</a></p>
    </section></>;
}
