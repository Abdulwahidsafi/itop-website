import { repairFaultDetail } from './repairQuestions.mjs';

/** @param {Record<string, string>} data */
export function repairMessage(data) {
  const fields = [['Device', data.Device], ['Brand', data.Brand], ['Model', data.UnknownModel === 'yes' ? 'Not sure — please help identify' : data.Model], ['Issue', data.Issue], ['Fault detail', repairFaultDetail(data.Issue,data.Fault)], ['Symptoms', data.Symptoms], ['When', data.Issue === 'Water damage / diagnostics' ? data.When : ''], ['Name', data.Name], ['Details', data.Details]];
  return ['Hi iTop, I’d like a repair quote.', ...fields.filter(([, value]) => value?.trim()).map(([key, value]) => key + ': ' + value.trim())].join('\n');
}

/** @param {{product:string, sku:string, variant:string, quantity:string, unit:string}[]} rows */
export function quoteErrors(rows) {
  if (!rows.length || rows.length > 12) return ['Add between 1 and 12 product lines.'];
  return rows.flatMap((row, i) => {
    const errors = [];
    if (!row.product.trim()) errors.push('Item ' + (i + 1) + ': enter a product.');
    const quantity = Number(row.quantity);
    if (!row.quantity.trim() || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000) errors.push('Item ' + (i + 1) + ': enter a whole quantity from 1 to 10,000.');
    if (!['Items', 'Packs'].includes(row.unit)) errors.push('Item ' + (i + 1) + ': choose items or packs.');
    return errors;
  });
}

/** @param {{product:string, sku:string, variant:string, quantity:string, unit:string}[]} rows @param {Record<string,string>} details */
export function wholesaleMessage(rows, details) {
  const errors = quoteErrors(rows);
  if (errors.length) throw new Error(errors.join(' '));
  const lines = ['Hi iTop, I’d like a wholesale quote.'];
  for (const key of ['Name', 'Business', 'Fulfilment', 'Location', 'Needed']) if ((key !== 'Location' || details.Fulfilment === 'Delivery enquiry') && details[key]?.trim()) lines.push(key + ': ' + details[key].trim());
  lines.push('', 'Requested products:');
  rows.forEach((row, i) => {
    lines.push((i + 1) + '. ' + row.product.trim() + ' — ' + Number(row.quantity) + ' ' + row.unit.toLowerCase());
    if (row.sku.trim()) lines.push('   Reference: ' + row.sku.trim());
    if (row.variant.trim()) lines.push('   Model / variant: ' + row.variant.trim());
  });
  if (details.Notes?.trim()) lines.push('', 'Notes: ' + details.Notes.trim());
  lines.push('', 'Please confirm availability, pack sizes, pricing and collection or delivery details.');
  return lines.join('\n');
}
