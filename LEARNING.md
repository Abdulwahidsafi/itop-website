# iTop redesign — learning guide

This is the separate option-3 portfolio prototype, built with React, TypeScript and Vite. The original hosted iTop website has not been changed.

## Start with these files

- `src/App.tsx`: page sections, reusable product tile, enquiry dialog, and TypeScript types.
- `src/RepairsPage.tsx`: the dedicated repair page, service data and native expandable FAQs.
- `src/styles.css`: colour tokens, desktop grid, responsive breakpoints, focus and hover states.
- `src/main.jsx`: React entry point and locally served Inter font imports.
- `public/assets/`: actual iTop logo plus generic generated concept-product photographs.
- `design-qa.md`: what was visually compared and tested.

## How the interface works

The `/repairs` path renders `RepairsPage`; `/` renders the approved homepage. A route is a website address for a particular page. The browser follows ordinary links, while the hosting worker serves the React app for a direct `/repairs` visit. This deliberately simple setup needs no new routing dependency yet.

Each service passes its issue name to the shared enquiry dialog. For example, the battery button starts the form with “Battery replacement” selected. One form implementation stays consistent across both pages.

1. The `products` array holds the category data. `.map()` renders one `ProductTile` per entry, so there is no repeated card markup to maintain.
2. The `Product` and `EnquiryKind` types catch inconsistent data while you code. Try changing a category field and run `npx tsc --noEmit`.
3. `App` owns the open-menu and enquiry state. Clicking a button updates state, and React renders the appropriate dialog.
4. The dialog uses the browser's native `<dialog>` element. It traps focus and supports Escape. Closing restores focus to the original button.
5. The form prepares a draft locally using `FormData`. `encodeURIComponent` makes it safe to include as WhatsApp URL text. The visitor must review it and choose to send; there is no payment or automatic message submission.
6. A saved `draft` keeps the fields when moving back from preview to editing. Nothing is stored permanently.
7. CSS Grid creates the three-column shelf. At smaller widths the layout switches to a single column and the navigation becomes a menu.

## Run it yourself

Requires a supported Node.js release and npm.

```sh
npm install
npm run dev
```

Use the local address printed by Vite. To check and build:

```sh
npx tsc --noEmit
npm run build
npm run test:sites
```

## Small exercises

- Change the cyan colour token and compare the result.
- Add a fourth accessory category by editing only the array.
- Split `ProductTile` and `EnquiryDialog` into separate component files.
- Add a required-field test without sending any WhatsApp message.
- Replace the illustrative product assets with genuine iTop photographs.

## Portfolio case study

Describe the problem (iTop resembled another project), reference and chosen design, component architecture, accessibility choices, responsive behaviour, and testing. Present this as a frontend prototype, not a completed ecommerce platform or booking backend.

Photos are generic AI concept imagery, not documentary shop photos or verified live inventory. Opening hours and service details need business-owner confirmation before public launch. There is no analytics, account system, online payment, persisted booking or live stock feed.
# Service pages and enquiries

`ServicePages.tsx` adds Accessories, Wholesale and Buy/Sell using the same design classes as the homepage. `EnquiryDialog.tsx` shares the draft-preview flow while showing fields appropriate to each service. A selling enquiry asks for a model and condition; a trade enquiry asks for a product list.

`sitePaths.ts` adapts internal URLs to GitHub's `/itop-website/` prefix or a root-hosted preview. The Pages build writes an HTML entry for each service so direct visits and refreshes work. `test:pages` checks that the deployment contains compiled JavaScript and valid asset files, rather than publishing React source.

Try changing an accessory description, then compare it on desktop and mobile. For a new service page, add both the app route and the Pages output route.


## Consolidating the older website

`CustomerPages.tsx` brings contact and aftercare journeys into the shared React layout. `StoreDetails.tsx` keeps address, phone, email and weekly hours in one component reused by home and Contact. Support topics and optional repair symptoms are included in the existing review-before-WhatsApp flow. The Pages build creates direct entries for Contact and Support as well as the service pages.
