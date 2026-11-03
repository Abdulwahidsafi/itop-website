/** @type {Record<string,{label:string,options:string[]}>} */
export const repairQuestions = {
  'Screen replacement': {label:'What is happening with the screen?',options:['Cracked glass','Touch not responding','Lines or flickering','Black screen / no image','More than one symptom','Not sure']},
  'Battery replacement': {label:'What is the main battery problem?',options:['Fast battery drain','Unexpected shutdowns','Battery health warning','More than one symptom','Not sure']},
  'Charging fault': {label:'What happens when you connect the charger?',options:['Does not charge','Charges only at an angle','Slow or intermittent charging','More than one symptom','Not sure']},
  'Camera / speaker / microphone': {label:'Which part needs help?',options:['Camera','Speaker / earpiece','Microphone','More than one part','Not sure']},
  'Water damage / diagnostics': {label:'What was the device exposed to?',options:['Water','A drink','Cleaning liquid','Other liquid','No liquid — unexplained fault','Not sure']},
};
/** @param {string} issue @param {string | undefined} answer */
export function repairFaultDetail(issue,answer) {
  return answer && repairQuestions[issue]?.options.includes(answer) ? answer : '';
}
