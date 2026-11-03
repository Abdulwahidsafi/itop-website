# iTop — Modern Product Counter

A responsive React/TypeScript website for iTop Wholesale & Retail, Catford. The approved third concept uses white, charcoal and cyan, a product shelf and a repair enquiry strip. This is separate from the older iTop and MH Connect websites.

## Preview

[Sites preview](https://itop-design-three.zaryabrawa.chatgpt.site) — owner-private, not a public customer website yet.

## Local development

Requires a current supported Node.js LTS release and npm.

```sh
npm ci
npm run dev
```

```sh
npx tsc --noEmit
npm run build
npm run test:sites
npm run test:enquiries
```

The build creates `dist/client`, `dist/server/index.js` and `dist/.openai/hosting.json`. Build before running the hosting tests.

## Features

- Responsive homepage and mobile navigation.
- Dedicated Repairs, Accessories, Wholesale, Buy/Sell, Contact and Warranty/Aftercare pages, with direct GitHub Pages addresses.
- Six repair categories, phone/tablet/laptop/gadget enquiries and expandable FAQs.
- Guided Device → Fault → Review repair enquiries, searchable model suggestions, model help and an unknown-model option.
- Mobile repair action bar, hidden while a menu or enquiry dialog is open.
- Wholesale quote builder with up to 12 products, variants, references and item/pack quantities.
- Explicit save/load/delete for wholesale product lists on the visitor’s device, expiring after 30 days. No contact details or notes are stored.
- Separate buy/sell intent and condition fields.
- A service chooser under Ask iTop and weekly opening hours supplied by the user.
- Repair, accessory, wholesale and buy/sell enquiry dialogs.
- Local draft preview, editable details and copy-message fallback before opening WhatsApp.
- Tap-to-call, email, directions and Google-profile links.
- Native dialog keyboard behaviour and reduced-motion support.
- Locally served fonts and original iTop logo.

There is no checkout, booking confirmation, database, stock feed or message sending from the app. Product-list saving uses local browser storage only and can be unavailable in restricted browsers. The visitor decides whether to send the prepared WhatsApp message. Never enter passwords or device passcodes.

## Editing and hosting

`src/App.tsx` holds content and interactions; `src/styles.css` holds the design; `public/assets` holds images. Read [LEARNING.md](LEARNING.md) for short explanations and exercises, and [business-info.md](docs/business-info.md) for research and confirmation gaps.

GitHub stores the source and change history. Sites hosts the preview. A GitHub commit does **not** automatically update Sites: publish the verified build separately. Do not change the hosting project identity when updating the existing preview. GitHub Pages publishes the compiled website automatically after pushes to `main` using `.github/workflows/pages.yml`. Its separate `npm run build:pages` command builds for the domain root and creates direct entries for every service page. Shared links and image paths adapt to each hosting target. The public website domain is https://itopgroup.co.uk/; configure it in GitHub Pages settings and point the IONOS website DNS records to GitHub Pages. Keep existing email records and nameservers. The Actions deployment does not need a CNAME file.

## Images and business claims

The product images are AI-generated illustrations, not evidence of iTop stock or premises. The user approved retaining them for now; the page labels them as illustrative. Do not import MH Connect imagery, invented customer reviews, ratings, prices, product specifications or unconfirmed warranty periods.

Contact details were carried over from the old iTop website. Google listing verification was blocked on 8 October 2026. Opening days, current hours and warranty terms still need owner confirmation.

## Next phase

Preserve the approved design and complete design/functionality improvements before connecting a domain, as requested. Confirm remaining business claims and policy wording, complete real-device and screen-reader checks, and replace illustrative photos when genuine ones are supplied.

Legacy content integration: Contact and Warranty/Aftercare structure, fault-specific quote guidance and business/setup enquiries were adapted from the older iTop site. Demo price tables, fixed warranty examples and old hours were excluded. The legacy site has not been changed or removed.

Future wholesale integration stages are described in [automation-roadmap.md](docs/automation-roadmap.md). The current quote builder requests prices; it does not calculate totals or place orders.

## Phone repair directory

Repairs now has iPhone, Samsung Galaxy and Google Pixel category pages and individual model pages. `src/repairCatalogue.mjs` is the single model directory for page links, search suggestions and direct GitHub Pages entries. Add a real model there once; the build creates its route automatically. Shared repair descriptions live in `src/repairTypes.ts`. Model pages prefill the brand/model in the existing enquiry flow. Directory entries are enquiries, not stock or repair-support guarantees. Unlisted devices remain available through the general enquiry.
