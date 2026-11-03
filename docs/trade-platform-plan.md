# Trade catalogue and accounts: implementation handoff

## Shipped first phase
- /business/: company requirements for repairs, replacement-device enquiries and bulk accessories, with editable WhatsApp message review.
- /wholesale/apply/: trade-supply introduction to the existing wholesale number, with editable review.
- Wholesale catalogue link and existing product-list quote builder remain available.
- No account is created, no application stored, and no message sent automatically.

## Required for a real account launch
The current public deployment is a static GitHub Pages build. It cannot safely authenticate customers, approve applications, protect trade prices or store orders by itself. Preserve React and add a provisioned API/database with a maintained authentication service. No provider or paid service has been provisioned in this session.

Use one customer identity with independent business/trade permissions. New trade users start pending; staff approve trade eligibility. Every API must check permissions server-side. Never put wholesale price access controls only in React or include private prices in a public JSON bundle. Prefer verified-email sign-in, revocable sessions, rate-limited requests, server validation and audit records for staff approvals.

Deliver:
1. Sign-in, email verification/recovery and sign-out.
2. Application statuses pending / approved / declined, with staff review.
3. Public catalogue and server-gated trade prices.
4. Account dashboard for saved quote requests and staff-confirmed quotes.
5. Staff product import/edit tools and clear last-updated information.
6. Reordering of previous product lines, revalidated against current products/prices.
7. Stock/fulfilment integrations only after the actual operating system and terms are supplied.

## Catalogue source
Owner-confirmed WhatsApp catalogue: https://wa.me/c/447417465401.
Web research could not retrieve its product data. Do not invent products or import competitor stock.

Obtain an owner export/spreadsheet or approved product photos and details:
product reference, name, category, description, compatible models, variants, image, item/pack unit, units per pack, minimum quantity, approved price and pricing treatment, availability source and updated time.
Separate product identity and variants from prices/stock. Import first; review with staff before publication. Missing data must remain unknown, never interpreted as available stock or a zero price.

## Business offering
Owner must confirm services before any guarantees: supported device types, multi-device capacity, replacement stock, collection/delivery coverage, turnaround, warranty and payment terms.
Current copy invites enquiries and makes no service-level, delivery or discount promise.

## Next decisions/data
- Provision the backend/authentication service using the owner's account.
- Receive catalogue data and who maintains it.
- Confirm staff approving trade applications and customer-facing terms/privacy wording.
No custom domain or legacy-site removal is part of this phase.
