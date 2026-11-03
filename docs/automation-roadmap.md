# Wholesale automation roadmap

The current React site prepares local enquiry drafts. Visitors review a product list and choose whether to send it in WhatsApp. Nothing is stored or sent by the website.

1. **Verified catalogue:** obtain owner-approved product names, SKU references, variants, pack sizes and minimum quantities. Keep catalogue data separate from presentation. Show only prices and availability backed by a maintained source.
2. **Request storage:** introduce a backend for validated quote requests and line items. Agree retention, access controls and customer-facing privacy wording before collecting requests.
3. **Staff quote review:** create draft quotes from approved trade prices. Staff confirm stock, substitutions, delivery charges and terms before sending a quote. Maintain request status and references.
4. **Inventory integration:** connect the actual stock system, with timestamps and a defined stock-reservation process. Handle unavailable variants explicitly.
5. **Repeat ordering:** support approved trade accounts, previous product lists and reorders. Notifications and replenishment prompts require customer preferences and reliable inventory data.

Repair requests can later use the same request system, with device, model, issue and symptoms stored separately. Scheduling needs actual technician capacity and confirmed service rules.

No provider, paid platform or scheduled automation has been selected. Build these stages after the owner supplies the catalogue and operational requirements; complete design and functionality before connecting a domain.
