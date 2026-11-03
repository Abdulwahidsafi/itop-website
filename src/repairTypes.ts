import { DeviceMobile, BatteryCharging, Plug, Drop, Camera, Question } from '@phosphor-icons/react';

export const repairs = [
  { title: 'Screen replacement', issue: 'Screen replacement', description: 'Cracked glass, lines on the display, a black screen or touch that no longer responds.', icon: DeviceMobile },
  { title: 'Battery replacement', issue: 'Battery replacement', description: 'Fast battery drain, unexpected shutdowns or a phone that struggles to hold its charge.', icon: BatteryCharging },
  { title: 'Charging faults', issue: 'Charging fault', description: 'A loose connection, unreliable charging or a device that will not charge. Tell us what you have tried.', icon: Plug },
  { title: 'Liquid damage & diagnostics', issue: 'Water damage / diagnostics', description: 'An inspection enquiry after liquid exposure or an unexplained fault. Recovery is not guaranteed.', icon: Drop },
  { title: 'Camera, speaker & microphone', issue: 'Camera / speaker / microphone', description: 'Blurry images, no sound or calls where you cannot be heard. We will discuss the symptoms first.', icon: Camera },
  { title: 'Not sure what is wrong?', issue: 'Not sure', description: 'Describe what happens and when it started. Ask about another fault or supported device.', icon: Question },
];
