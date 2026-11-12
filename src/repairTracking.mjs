// "Track my repair": asks the shop's own system (ShopOS) for one repair's status.
// The customer types the job number from the ticket and the last 4 digits of their phone number.
// ShopOS answers with a short summary only (device, status, amount to pay): never a name or phone number.
export const trackingEndpoint = 'https://shop.itopgroup.co.uk/api/public/repair-status';

/** "r12", "12" and "R000012" are the same job. Returns '' when it cannot be a job number. */
export function cleanJobNumber(value) {
  const text = String(value ?? '').trim();
  if (!/^r?\d{1,9}$/i.test(text)) return '';
  return 'R' + text.replace(/^r/i, '').padStart(6, '0');
}
export const lastFourDigits = value => { const d = String(value ?? '').replace(/\D/g, ''); return d.length === 4 ? d : ''; };

/** What is wrong with the form, in plain words; '' when it can be sent. */
export function trackingFormProblem(job, phone) {
  if (!cleanJobNumber(job)) return 'Type the job number from your ticket, for example R000123.';
  if (!lastFourDigits(phone)) return 'Type the last 4 digits of the phone number you gave us.';
  return '';
}
export const pounds = cents => '£' + (Math.max(0, Number(cents) || 0) / 100).toFixed(2);
export function shortDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric', timeZone:'Europe/London'});
}

/** Ask ShopOS. Resolves to {ok:true, repair} or {ok:false, message}. Never throws. */
export async function trackRepair(job, phone, fetcher = fetch) {
  const problem = trackingFormProblem(job, phone);
  if (problem) return {ok:false, message:problem};
  try {
    // text/plain keeps this a "simple" request, so the browser does not need a second permission round-trip.
    const response = await fetcher(trackingEndpoint, {method:'POST', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({reference:cleanJobNumber(job), phone:lastFourDigits(phone)})});
    const data = await response.json().catch(() => ({}));
    if (response.ok && data && typeof data.reference === 'string') return {ok:true, repair:data};
    return {ok:false, message:typeof data?.error === 'string' && data.error ? data.error : 'We could not check that just now. Please try again, or call the shop.'};
  } catch {
    return {ok:false, message:'We could not reach the shop system. Check your internet and try again, or call the shop.'};
  }
}
