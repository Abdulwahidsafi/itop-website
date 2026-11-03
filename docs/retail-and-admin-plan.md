# Retail accessories and administration

Accessories are the owner's current priority. Retail prices are independent of wholesale prices and Deliveroo prices; do not derive one from another. No approved retail product/price list has been supplied yet. `src/retail-products.json` is intentionally empty, and the retail product section stays hidden until approved priced records are added. Existing accessory enquiries remain available.

## Product source

One record per purchasable variant: `id`, `name`, `category` (Protection/Power/Audio/Other), `status` (draft/published), `availability` (confirm/available/unavailable), `pricePence` (positive integer or null for drafts), `compatibility`, `description`, `image` (null or images/retail/file.jpg, jpeg, png, webp), and `checkedAt` (YYYY-MM-DD).

Use only confirmed retail selling prices, per item, and genuine supplied descriptions and photos. Do not invent product specifications, pack sizes, stock or VAT statements. Unknown price stays null in a private draft. The public snapshot must contain only approved published records: keep draft files outside `src` and `public`. Publication requires a checked date and positive price. Preserve IDs across edits. Mark unavailable or remove from the published snapshot to withdraw an item, keeping its private record for later editing.

Use `docs/retail-product-intake.csv` to collect owner-approved item details; its pound prices must be converted to integer pence when preparing the snapshot. Do not treat an empty price as zero. The intake is a header-only template, not a catalogue import.

Run `scripts/check-retail-products.mjs`, retail/enquiry tests and the Pages build, review changed products, and publish. The build rejects draft rows and missing referenced photos. This is a maintained snapshot, not an admin system or live stock feed. Supplied photos go in `public/images/retail`.

## Delivery now

Owner confirms iTop sells through Deliveroo. The existing store URL is https://deliveroo.co.uk/menu/london/catford/itop-phones-and-repair-center. Checked 10 October 2026; accessory categories are visible. Direct customers to Deliveroo for its own accessory prices, availability, address eligibility, delivery charges and checkout. Website retail prices do not imply Deliveroo price parity. No direct website payment, reservation or delivery promise is implemented.

## Secure admin next

Provision an owner-controlled database, image storage and staff authentication before exposing `/admin`. No backend is provisioned. Do not create a pretend staff login or use browser storage to protect product data.

Initial admin scope: products/variants, retail prices, photos, availability, draft/preview/publish/archive, and an audit record of who changed what. Check staff permission at the server/database for every write. Keep wholesale prices, iPhone buying references and retail product prices separate. A public website can read only approved published retail records; draft or staff-only data must not be shipped in its public bundle once a live backend is connected.

Later extend to enquiries and orders. Before direct checkout, agree delivery regions and charges, collection rules, payment provider, stock reservation, order confirmation, returns handling, refund workflow and customer-data retention. Do not accept payment without reliable fulfilment and stock handling. No provider or paid plan is selected by this implementation.

## Waiting on iTop

- Confirmed retail names, variants, prices, compatibility and photographs.
- Person responsible for maintaining stock and prices.
- Owner account for provisioning admin/database access.
- Delivery and returns arrangements for future direct orders.
