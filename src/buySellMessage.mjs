export function buildBuySellMessage(intent, draft) {
  if (!['buy', 'sell'].includes(intent)) throw new Error('Choose buying or selling.');
  const clean = value => String(value ?? '').trim();
  if (intent === 'sell' && !clean(draft.unknown ? draft.description : draft.model)) throw new Error('Describe or identify your device.');
  if (intent === 'buy' && clean(draft.budget) && (!Number.isFinite(Number(draft.budget)) || Number(draft.budget) < 1)) throw new Error('Enter a valid budget.');
  const lines = [`Hi iTop, I’d like to ${intent === 'buy' ? 'ask about buying' : 'enquire about selling'} a device.`];
  const add = (label, value) => { if (clean(value)) lines.push(label + ': ' + clean(value)); };
  add('Device type', draft.device);
  if (intent === 'sell' && draft.unknown) { add('Model', 'Not sure — please help identify it'); add('Device description', draft.description); }
  else add(intent === 'buy' ? 'Preferred model' : 'Model', draft.model);
  add(intent === 'buy' ? 'Preferred storage' : 'Storage', draft.storage);
  if (intent === 'buy') { if (clean(draft.budget)) add('Maximum budget', '£' + clean(draft.budget)); add('Preferences', draft.notes); }
  else { add('Condition', draft.condition); add('Known faults / details', draft.notes); }
  return lines.join('\n');
}
