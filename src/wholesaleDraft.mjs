export const wholesaleDraftKey = 'itop-wholesale-products-v1';
const maxAge = 30 * 24 * 60 * 60 * 1000;
/** Validate local storage as untrusted input; store product fields only.
 * @param {unknown} rows
 */
function validRows(rows) {
  return Array.isArray(rows) && rows.length >= 1 && rows.length <= 12 && rows.every(row =>
    row && typeof row === 'object' &&
    [['product',100],['variant',100],['sku',40],['quantity',6]].every(([key,max]) => typeof row[key] === 'string' && row[key].length <= max) &&
    ['Items','Packs'].includes(row.unit));
}
/** @param {{product:string, variant:string, sku:string, quantity:string, unit:string}[]} rows @param {number} [now] */
export function encodeWholesaleDraft(rows, now = Date.now()) {
  if (!validRows(rows)) throw new Error('Invalid product list.');
  return JSON.stringify({ version:1, savedAt:now, rows:rows.map(({product,variant,sku,quantity,unit}) => ({product,variant,sku,quantity,unit})) });
}
/** @param {string | null} raw @param {number} [now]
 * @returns {{savedAt:number, rows:{id:number,product:string,variant:string,sku:string,quantity:string,unit:string}[]} | null}
 */
export function decodeWholesaleDraft(raw, now = Date.now()) {
  if (!raw || raw.length > 20000) return null;
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Number.isFinite(data.savedAt) || data.savedAt > now || now - data.savedAt > maxAge || !validRows(data.rows)) return null;
    return { savedAt:data.savedAt, rows:data.rows.map((row, i) => ({id:i + 1, product:row.product, variant:row.variant, sku:row.sku, quantity:row.quantity, unit:row.unit})) };
  } catch { return null; }
}
