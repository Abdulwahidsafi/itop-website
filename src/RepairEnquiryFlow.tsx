import { useEffect, useRef, useState, type FormEvent } from 'react';
import { repairQuestions } from './repairQuestions.mjs';
import { repairModels } from './repairModels';
import type { RepairPhone } from './EnquiryDialog';
import { MessageReview } from './MessageReview';
import { repairMessage } from './enquiryMessages.mjs';

const issues = ['Screen replacement', 'Battery replacement', 'Charging fault', 'Camera / speaker / microphone', 'Water damage / diagnostics', 'Not sure'];
const hints: Record<string, string> = { 'Screen replacement': 'Cracked glass, lines, no image or touch problems', 'Battery replacement': 'Fast drain, shutdowns or charging problems', 'Charging fault': 'Loose cable, slow charging or charging only at an angle', 'Camera / speaker / microphone': 'What happens with the camera, sound or calls?', 'Water damage / diagnostics': 'What liquid was involved, and what does the device do now?', 'Not sure': 'What happens, and when did it start?' };

export function RepairEnquiryFlow({ issue, phone }: { issue?: string; phone?: RepairPhone }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Record<string,string>>({ Device: 'Phone', Brand: phone?.brand ?? '', Model: phone?.model ?? '', UnknownModel: '', Issue: issue ?? 'Not sure', Symptoms: '', When: '', Name: '', Details: '' });
  const [faultAnswers,setFaultAnswers] = useState<Record<string,string>>({});
  const question = repairQuestions[data.Issue];
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { titleRef.current?.focus(); }, [step]);
  const set = (key: string, value: string) => setData(previous => ({ ...previous, [key]: value }));
  const models = repairModels(data.Device, data.Brand);
  const changeDevice = (key: 'Device' | 'Brand', value: string) => setData(previous => ({ ...previous, [key]: value, Model: '', UnknownModel: '' }));
  function next(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (step === 2 && data.Issue === 'Not sure' && !data.Symptoms.trim()) { const field = event.currentTarget.querySelector('textarea'); field?.setCustomValidity('Describe what happens to your device.'); field?.reportValidity(); return; } setStep(step + 1); }
  return <div className="guided-flow">
    <ol className="flow-steps" aria-label="Repair enquiry steps">{['Device', 'Fault', 'Review'].map((label, i) => <li key={label} aria-current={step === i + 1 ? 'step' : undefined}><span>{i + 1}</span>{label}</li>)}</ol>
    <h3 ref={titleRef} tabIndex={-1} className="flow-title">{step === 1 ? 'Which device needs help?' : step === 2 ? 'What needs fixing?' : 'Review your repair enquiry.'}</h3>
    {step === 1 ? <form onSubmit={next}>
      <div className="form-row"><label>Device type<select value={data.Device} onChange={e => changeDevice('Device', e.target.value)}><option>Phone</option><option>Tablet</option><option>Laptop</option><option>Other gadget</option></select></label><label>Brand<select value={data.Brand} onChange={e => changeDevice('Brand', e.target.value)} required><option value="">Choose a brand</option><option>Apple</option><option>Samsung</option><option>Google</option><option>Dell</option><option>HP</option><option>Lenovo</option><option>Other / not sure</option></select></label></div>
      <label>Device model<input list={models.length ? 'repair-model-options' : undefined} aria-describedby="model-hint" autoComplete="off" value={data.Model} onChange={e => set('Model', e.target.value)} placeholder={data.Device === 'Laptop' ? 'e.g. ThinkPad T14' : 'e.g. iPhone 14 or Galaxy A54'} disabled={data.UnknownModel === 'yes'} required={data.UnknownModel !== 'yes'} pattern={'.*\\S.*'} title="Enter a model, or choose not sure below" maxLength={100} /></label>
      <datalist id="repair-model-options">{models.map(model => <option key={model} value={model} />)}</datalist>
      <p id="model-hint" className="model-hint">{models.length ? 'Start typing to find a suggestion, or enter another model.' : 'Enter the model name, or choose “not sure” below.'} Support and parts are confirmed by iTop.</p>
      <details className="model-help"><summary>Help me find my model</summary><ul><li><strong>iPhone / iPad:</strong> open Settings → General → About.</li><li><strong>Samsung phone:</strong> open Settings → About phone.</li><li><strong>Other devices:</strong> check the model label, original box or receipt.</li></ul><p>If the device will not turn on, choose “I’m not sure of the model”. You do not need to share a serial number or IMEI.</p></details>
      <label className="checkbox-label"><input type="checkbox" checked={data.UnknownModel === 'yes'} onChange={e => set('UnknownModel', e.target.checked ? 'yes' : '')} />I’m not sure of the model</label>
      <button className="button button-dark form-submit" type="submit">Next: describe the fault</button>
    </form> : step === 2 ? <form onSubmit={next}>
      <p className="flow-summary">{data.Device} · {data.Brand} · {data.UnknownModel === 'yes' ? 'Model not known' : data.Model}</p>
      <label>Repair needed<select value={data.Issue} onChange={e => { set('Issue', e.target.value); e.currentTarget.form?.querySelector('textarea')?.setCustomValidity(''); }}>{issues.map(item => <option key={item}>{item}</option>)}</select></label>
      {question && <label>{question.label}<select value={faultAnswers[data.Issue] ?? ''} onChange={e=>setFaultAnswers(previous=>({...previous,[data.Issue]:e.target.value}))} required><option value="">Choose a symptom or “not sure”</option>{question.options.map(option=><option key={option}>{option}</option>)}</select></label>}
      <label>Describe the fault{data.Issue === 'Not sure' && ' (required)'}<textarea value={data.Symptoms} onChange={e => set('Symptoms', e.target.value)} onInput={e => e.currentTarget.setCustomValidity('')} required={data.Issue === 'Not sure'} rows={3} maxLength={600} placeholder={hints[data.Issue]} /></label>
      {data.Issue === 'Water damage / diagnostics' && <label>When did it happen?<input value={data.When} onChange={e => set('When', e.target.value)} placeholder="e.g. this morning or two days ago" maxLength={100} /></label>}
      <label>Your name (optional)<input value={data.Name} onChange={e => set('Name', e.target.value)} autoComplete="given-name" maxLength={100} /></label>
      <div className="flow-actions"><button className="text-button" type="button" onClick={() => setStep(1)}>Back to device</button><button className="button button-dark" type="submit">Review enquiry</button></div>
    </form> : <MessageReview message={repairMessage({...data,Fault:faultAnswers[data.Issue] ?? ''})} onEdit={() => setStep(1)} editLabel="Edit device or fault" />}
    <p className="privacy-note">iTop confirms support, parts, price and timing. This is an enquiry, not a booking or payment. Never include passwords or passcodes.</p>
  </div>;
}
