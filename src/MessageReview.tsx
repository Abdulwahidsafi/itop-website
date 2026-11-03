import { useState } from 'react';
import { WhatsappLogo } from '@phosphor-icons/react';

export function MessageReview({ message, onEdit, editLabel = 'Edit details', whatsappNumber = '447760616466' }: { message: string; onEdit: () => void; editLabel?: string; whatsappNumber?: string }) {
  const [copyStatus, setCopyStatus] = useState('');
  const encoded = encodeURIComponent(message);
  const longMessage = encoded.length > 6000;
  async function copy() {
    try { await navigator.clipboard.writeText(message); setCopyStatus('Message copied.'); }
    catch { setCopyStatus('Copy is unavailable here. Select the message text and copy it manually.'); }
  }
  return <div className="message-preview"><p>{longMessage ? 'This list is long. Copy your message, open WhatsApp and paste it there.' : 'Review your draft. WhatsApp opens with the message; you choose whether to send it.'}</p><pre tabIndex={0} aria-label="Enquiry message">{message}</pre><div className="dialog-actions"><a className="button button-dark" href={'https://wa.me/' + whatsappNumber + (longMessage ? '' : '?text=' + encoded)} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={21} />Open WhatsApp</a><button className="text-button" type="button" onClick={copy}>Copy message</button><button className="text-button" type="button" onClick={onEdit}>{editLabel}</button></div><p className="copy-status" role="status">{copyStatus}</p></div>;
}
