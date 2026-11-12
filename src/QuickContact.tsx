import { WhatsappLogo, Phone } from '@phosphor-icons/react';

// Always-visible contact buttons (owner request, 12 November 2026).
// WhatsApp shows on every page; Call shows on phones, except where the
// Repairs action bar already has a Call button.
export function QuickContact({ hidden, aboveBar }: { hidden: boolean; aboveBar: boolean }) {
  if (hidden) return null;
  return <div className={`quick-contact${aboveBar ? ' quick-contact-above-bar' : ''}`}>
    {!aboveBar && <a className="quick-contact-call" href="tel:+447760616466"><Phone size={22} weight="fill" aria-hidden="true" /><span>Call</span></a>}
    <a className="quick-contact-whatsapp" href="https://wa.me/447760616466" target="_blank" rel="noreferrer"><WhatsappLogo size={24} weight="fill" aria-hidden="true" /><span>WhatsApp</span></a>
  </div>;
}
