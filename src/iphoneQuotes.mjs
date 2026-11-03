export const IPHONE_BONUS = 20;
export const REFERENCE_MAX_DAYS = 7;
const columns = ['id', 'model', 'storage', 'colour', 'network', 'grade', 'cexCash', 'checkedAt', 'sourceUrl', 'override', 'enabled'];
export const conditionLabels = { A: 'Like new, boxed with original accessories', B: 'Good, fully working with essential accessories', C: 'Worn, fully working with essential accessories', faulty: 'Damaged or faulty', unknown: 'Not sure' };
export const batteryStatusLabels = { no: 'No battery warning or problems noticed', service: 'Service / replacement warning', problem: 'Charging, overheating or unexpected shutdown problems', unknown: 'Not sure / unable to check' };
const batteryNeedsInspection = details => details.batteryStatus !== undefined && details.batteryStatus !== 'no';

// Quoted CSV cells allow spreadsheet exports without changing names or URLs.
export function parseIPhonePrices(csv) {
  const rows = []; let row = [], cell = '', quoted = false;
  const input = csv.replace(/^\uFEFF/, '');
  for (let i = 0; i <= input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
      else if (!quoted && cell !== '') throw new Error('Invalid CSV quote.');
      else quoted = !quoted;
    } else if (!quoted && (char === ',' || char === '\n' || char === undefined)) {
      row.push(cell.replace(/\r$/, '')); cell = '';
      if (char !== ',') { if (row.some(value => value.trim())) rows.push(row); row = []; }
    } else cell += char;
  }
  if (quoted) throw new Error('Unclosed CSV quote.');
  if (rows.shift()?.join(',') !== columns.join(',')) throw new Error('Invalid iPhone price columns.');
  const ids = new Set(), variants = new Set();
  return rows.map(values => {
    if (values.length !== columns.length) throw new Error('Invalid iPhone price row.');
    const data = Object.fromEntries(columns.map((key, i) => [key, values[i].trim()]));
    const cexCash = Number(data.cexCash), override = data.override === '' ? null : Number(data.override);
    const date = new Date(data.checkedAt + 'T00:00:00Z');
    const url = new URL(data.sourceUrl);
    const variant = [data.model, data.storage, data.colour, data.network, data.grade].join('|');
    if (!data.id || !/^iPhone /.test(data.model) || !/^\d+(GB|TB)$/.test(data.storage) || !data.colour || !data.network ||
      !['A', 'B', 'C'].includes(data.grade) || !data.cexCash || !Number.isFinite(cexCash) || cexCash <= 0 ||
      (override !== null && (!Number.isFinite(override) || override <= 0)) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.checkedAt) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data.checkedAt ||
      url.protocol !== 'https:' || url.hostname !== 'uk.webuy.com' || !url.pathname.startsWith('/product-detail') || url.searchParams.get('id') !== data.id ||
      !['true', 'false'].includes(data.enabled) || ids.has(data.id) || variants.has(variant)) throw new Error('Invalid or duplicate iPhone price: ' + data.id);
    ids.add(data.id); variants.add(variant);
    return { id: data.id, model: data.model, storage: data.storage, colour: data.colour, network: data.network, grade: data.grade, checkedAt: data.checkedAt, sourceUrl: data.sourceUrl, cexCash, override, enabled: data.enabled === 'true' };
  });
}

export function getIPhoneQuote(prices, details, now = new Date()) {
  if (details.mode === 'broker' || details.faults !== 'no' || batteryNeedsInspection(details) || !['A', 'B', 'C'].includes(details.grade)) return null;
  const record = prices.find(row => row.enabled && ['model', 'storage', 'colour', 'network', 'grade'].every(key => row[key] === details[key]));
  if (!record) return null;
  const days = (now.getTime() - new Date(record.checkedAt + 'T00:00:00Z').getTime()) / 86400000;
  if (!Number.isFinite(days) || days < 0 || days >= REFERENCE_MAX_DAYS) return null;
  return { record, offer: Math.round((record.override ?? record.cexCash + IPHONE_BONUS) * 100) / 100, usesReference: record.override === null };
}

export function explainIPhoneQuote(prices, details, now = new Date()) {
  if (getIPhoneQuote(prices, details, now)) return '';
  if (batteryNeedsInspection(details)) return 'We need to check the battery before estimating an offer. Send the warning or symptoms with your inspection request.';
  if (details.faults !== 'no' || details.grade === 'faulty') return 'Damage, battery problems or uncertain faults need an inspection before we can estimate a fair offer.';
  if (details.grade === 'unknown') return 'We’ll help assess the condition before quoting.';
  if (details.network !== 'Unlocked') return 'We need to confirm the network status before quoting this device.';
  const match = prices.find(row => ['model', 'storage', 'colour', 'network', 'grade'].every(key => row[key] === details[key]));
  if (match && !match.enabled) return 'This price is currently paused or awaiting review.';
  if (match) return 'This reference is due for a fresh price check.';
  return 'We don’t yet have a checked price for this exact model, storage, colour and condition.';
}

export function buildIPhoneMessage(prices, details, now = new Date()) {
  const clean = value => String(value ?? '').trim();
  if (!clean(details.model)) throw new Error('Choose or describe your iPhone.');
  const quote = getIPhoneQuote(prices, details, now);
  const broker = details.mode === 'broker';
  const lines = [broker ? 'Hi iTop, I’d like to discuss selling my iPhone through you.' : 'Hi iTop, I’d like an inspection and offer for my iPhone.'];
  for (const [label, value] of [['Model', details.model], ['Storage', details.storage], ['Colour', details.colour], ['Network', details.network], ['Condition', conditionLabels[details.grade]], ['Known faults', details.faults === 'no' ? 'None reported' : details.faults === 'unknown' ? 'Not sure / unable to check' : 'Yes / unsure'], ['Battery status', batteryStatusLabels[details.batteryStatus]], ['Battery health', clean(details.battery) ? clean(details.battery) + '%' : 'Not supplied'], ['Details', details.notes]]) if (clean(value)) lines.push(label + ': ' + clean(value));
  if (broker) lines.push('Please discuss an agreed selling price, fees and payout terms. One month is a target, not a guaranteed sale.');
  else if (quote) {
    lines.push('Estimated iTop offer: £' + quote.offer.toFixed(2));
    if (quote.usesReference) lines.push('Reference: CeX cash £' + quote.record.cexCash.toFixed(2) + ' + £20; checked ' + quote.record.checkedAt, 'Reference listing: ' + quote.record.sourceUrl);
    else lines.push('iTop set price; checked ' + quote.record.checkedAt);
    lines.push('Estimate only; final offer follows condition, ownership and in-store inspection checks.');
  } else lines.push('Please provide a manual quote; no instant estimate is available for these details.');
  return lines.join('\n');
}
