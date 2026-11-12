// iTop Rewards on the website. Points live in the shop's own system (ShopOS); this page only asks it.
// A member signs in with their mobile number and the 6-digit PIN printed on their receipt,
// or by scanning the receipt's QR code (which carries their receipt code and PIN after the # of the address).
export const rewardsEndpoint = 'https://shop.itopgroup.co.uk/api/public/rewards';

export const pounds = cents => '£' + (Math.max(0, Number(cents) || 0) / 100).toFixed(2);
export const wholePounds = cents => '£' + Math.round(Math.max(0, Number(cents) || 0) / 100).toLocaleString('en-GB');
export function shortDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric', timeZone:'Europe/London'});
}
/** "#ABC234-123456" from a receipt QR code → {code, pin}; anything else → null. */
export function parseReceiptHash(hash) {
  const m = /^#?([A-Za-z0-9]{6})-(\d{6})$/.exec(String(hash ?? ''));
  return m ? {code:m[1].toUpperCase(), pin:m[2]} : null;
}
/** What is wrong with the sign-in form, in plain words; '' when it can be sent. */
export function signInProblem(phone, pin) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return 'Type the mobile number you gave in the shop.';
  if (!/^\d{6}$/.test(String(pin ?? ''))) return 'Type the 6-digit PIN from your receipt.';
  return '';
}
async function ask(body, fetcher) {
  try {
    // text/plain keeps this a "simple" request, so the browser needs no second permission round-trip.
    const response = await fetcher(rewardsEndpoint, {method:'POST', headers:{'Content-Type':'text/plain'}, body:JSON.stringify(body)});
    const data = await response.json().catch(() => ({}));
    if (response.ok && data && typeof data === 'object') return {ok:true, data};
    return {ok:false, message:typeof data?.error === 'string' && data.error ? data.error : 'We could not check that just now. Please try again.'};
  } catch {
    return {ok:false, message:'We could not reach the shop system. Check your internet and try again.'};
  }
}
/** The rules of the scheme (points per £1, levels, rewards). {ok, programme} */
export async function loadProgramme(fetcher = fetch) {
  const r = await ask({action:'info'}, fetcher);
  return r.ok && r.data.programme ? {ok:true, programme:r.data.programme} : {ok:false, message:r.message ?? ''};
}
/** Sign in with {phone, pin} or {code, pin}. {ok, member, programme} or {ok:false, message}. Never throws. */
export async function loadMember(login, fetcher = fetch) {
  if (!login?.code) { const problem = signInProblem(login?.phone, login?.pin); if (problem) return {ok:false, message:problem}; }
  const r = await ask(login.code ? {code:login.code, pin:login.pin} : {phone:String(login.phone).trim(), pin:login.pin}, fetcher);
  return r.ok && r.data.member ? {ok:true, member:r.data.member, programme:r.data.programme} : {ok:false, message:r.message ?? 'We could not check that just now. Please try again.'};
}
/** Rows for "how you earn", best first. */
export function earnRows(programme) {
  const names = {accessory:'Accessories under £100', repair:'Repairs', other:'Other items', phone:'Phones'};
  return Object.entries(names).map(([key, label]) => ({label, points:Number(programme?.rates?.[key]) || 0})).filter(r => r.points > 0).sort((a, b) => b.points - a.points);
}
/** How far along a bar is, 0–100. */
export const percent = (have, need) => need > 0 ? Math.max(0, Math.min(100, Math.round(have / need * 100))) : 100;
/** Text a member can send a friend. */
export const friendMessage = code => `Join iTop Rewards at iTop Phones & Repair Center, 160 Rushey Green, Catford. Give my friend code ${code} at the till and we both get bonus points.`;
