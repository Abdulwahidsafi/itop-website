# iTop option 3 design QA

## Repairs extension — 8 October 2026

final result: passed

Scope: add the user-approved dedicated `/repairs` page without redesigning the homepage. The selected option-3 mock remains the homepage reference; the approved implemented homepage supplies the shared header, type, palette and button system for the new page. There is no separate exact Repairs mock, so its new service grid, FAQs and copy are intentional extensions, not a claimed pixel-perfect clone.

Evidence:

- Source visual: `docs/selected-option-3.png`, 1487 × 1058 pixels.
- Homepage regression capture: `/workspace/scratch/itop-home-repairs-regression.jpg`, 1348 × 926 pixels, same desktop browser view as the new page.
- New page: `docs/repairs-desktop.jpg`, 1348 × 926 pixels; lower-page FAQ state: `docs/repairs-lower.jpg`.
- Desktop CSS content width: 1333 pixels plus a 15px scrollbar; density 1. Source normalized uniformly to 1348px screenshot width, then cropped to 926px height for the visual board. This board includes the implementation scrollbar; its 15px contribution is excluded from drift judgment. No warped or stretched asset comparisons.
- Full-view homepage/reference regression: `docs/repairs-home-comparison.jpg`.
- Shared design comparison: `docs/repairs-style-comparison.jpg`, homepage and Repairs together at the same viewport, top scroll position, menu closed and no dialog.
- Focused shared header/type/button comparison: `docs/repairs-header-comparison.jpg`. Headline, real logo, nav, font weight and button edges remain legible at focused scale.
- Responsive evidence: `docs/repairs-responsive.jpg`, browser iframes 390 × 844 and 834 × 844; content widths 375 and 819 after scrollbars. Both scrollWidth values matched clientWidth. One-column mobile and two-column tablet services inspected.

Required surfaces:

- Fonts/type: Inter 400–800 retained; shared oversized 800 headline with tight tracking; readable service labels and FAQ hierarchy, no observed clipping.
- Spacing/layout: shared header and page gutter; square dark buttons; service rows divided by simple rules, not generic rounded cards. New page intentionally lacks the homepage product shelf and has more heading/context space. Desktop, tablet and mobile inspected.
- Colors: original white/charcoal/cyan tokens preserved, darker cyan links and visible focus styles. Active Repairs navigation uses the existing link color.
- Assets: real logo and existing AI product imagery unchanged. New icons are Phosphor light-weight library icons, not raster photo stand-ins or handcrafted art. No new shop/stock imagery invented.
- Copy: six enquiry categories match research scope; price, warranty and same-day wording remain conditional. No fixed prices, claimed review ratings, warranty periods or confirmed booking state.

Interactions tested:

- Homepage Repairs link opens the dedicated route; brand link returns home; Visit details returns to `/#visit`.
- All six category buttons selected their expected repair issue.
- Battery enquiry preview included model, issue and fault details and a correctly encoded WhatsApp draft. No WhatsApp message was sent.
- Edit details and a second Preview retained the entered model; direct input inspection was redacted by browser safeguards, so this was verified through the visible message preview.
- Required model validation rejects an empty form on mobile. Native dialog Escape closes and restores focus to the trigger after the render settles.
- Mobile menu opens/closes; primary mobile enquiry opens; expandable warranty FAQ shows its answer.
- No app-origin console warnings/errors found. Browser-extension metadata warnings were excluded.
- Build, TypeScript and 5 hosting tests passed, including a direct `/repairs` shell-fallback test.

Comparison history: first full and focused comparison found no actionable P0/P1/P2 drift, so no visual revision loop was required. The new page is an intentional design-system extension. Homepage mock-to-real asset differences and original logo substitution remain previously accepted. Additional route metadata and a hosting regression test were added during functional checks; neither altered the rendered design.

Remaining gaps: full screen-reader and real-device audits, 200% text enlargement, client-side metadata indexing, confirmed weekly business hours and owner-approved warranty policy. These are not represented as completed or verified. No remaining observed P0/P1/P2 issues.

Implementation checklist: page built; interactions and responsiveness checked; existing homepage preserved; publication follows successful checks. Subsequent changes must re-run appropriate checks.

---

## Original homepage QA history

final result: passed

## Evidence and state

- Source visual truth: `docs/selected-option-3.png` (original 1487 × 1058 pixels).
- Browser implementation: `docs/desktop-final.jpg` (1363 × 936 screenshot, 1348 CSS-pixel content area plus 15px scrollbar, device scale 1).
- Full comparison: `docs/comparison-final.jpg`; earlier comparison: `docs/comparison-first.jpg`.
- Focused typography and hero comparison: `docs/hero-comparison-final.jpg`.
- Responsive evidence: `docs/responsive.jpg`, real browser iframe viewports 390 × 844 and 834 × 844. Their content widths were 375 and 819 after browser scrollbars; scrollWidth matched clientWidth, with no horizontal overflow.
- State: homepage at scrollY 0, navigation closed, no dialog open. Source resized uniformly to 1348 × 959 and top 936 pixels compared to the browser's 1348 × 936 content crop. No warping or comparison against browser chrome.

## Comparison history

1. First comparison: [P2] Hero and accessories had excess vertical spacing. Product shelf began about 30px below the normalized source; repair strip about 50px lower. This reduced above-the-fold repair visibility. Evidence: `comparison-first.jpg`.
2. Fix: header 80→74px; hero top 25→20px and bottom 38→19px; accessories bottom 27→16px, product-copy top 17→15px, availability top 27→20px. Supporting hero text reduced 20→18px to match source optical scale.
3. Revised capture: `desktop-final.jpg`, compared jointly with source in `comparison-final.jpg` and focused hero comparison. Main regions now align closely: left headline, three square-edged product pictures, accessory labels and dark repair strip. No actionable P0/P1/P2 layout mismatch remains.
4. Interaction QA found returning from preview lost form fields. Added in-memory draft retention. Retested: device model and selected battery-replacement issue retained when choosing Edit details.
5. Mobile check: increased icon-only controls to 44px and gave Ask iTop an explicit accessible label. Mobile menu opens and closes, Repairs link reaches the correct section, Start enquiry opens the form.

## Required fidelity surfaces

- Fonts and typography: locally served Inter weights 400–800 closely match the mock's grotesk sans. Headline uses 800, tight spacing and two-line wrapping; headings and product labels are readable and match hierarchy. No clipping or overlapping text in observed desktop, tablet or mobile views. Minor raster-mock vs real-font differences are P3.
- Spacing/layout rhythm: slim header, asymmetrical hero, three-column image shelf, square corners and dark repair band match the selected composition. Tablet adapts band to two columns; mobile intentionally stacks products and sections. No inappropriate generic cards or gradients.
- Colours/tokens: white, charcoal #1b2023 and cyan #00b2ff. Small cyan text darkened to #007eb1 for readability. Focus outlines provided. No unverified full accessibility compliance claim.
- Image quality: all three photographs are standalone generated raster assets matching the reference subjects and art direction. Actual supplied iTop logo retained rather than generated wordmark. Product shapes/angles differ slightly from the mock as expected for regenerated concept photography; crisp, consistent and not presented as documentary shop photos or verified inventory.
- Copy/content: visible reference headline, category names, descriptions, repair-strip steps and CTA labels retained. Added a clear illustrative-stock notice and below-fold trade/contact details. No fabricated rating, price, warranty duration or repair guarantee.
- Icons: Phosphor light-outline search icon matches the mock. Menu, close, location and telephone icons are library components, not hand-drawn assets.

## Primary interaction checks

- Repair quote opens accessible native dialog. Model and repair fields prepare correct draft.
- Draft WhatsApp URL points to +44 7760 616466, encodes line breaks/model/fault, and opens as a user-controlled draft. No external message was sent during testing.
- Edit details retains model and issue. Close returns focus to invoking control.
- Protection image opens accessory enquiry; preview includes Category: Protection and entered details.
- Wholesale button opens trade form; preview includes business and requested products/quantities.
- Mobile menu and section navigation tested in 390px browser frame. Mobile repair form opens.
- Dialog uses native focus trapping, Escape support, labels and required fields. Reduced-motion preference handled.
- Browser console inspected: no app-origin warnings/errors. Browser-extension metadata errors were observed but did not originate from the app.
- `npx tsc --noEmit`, production build and four Sites runtime tests passed.

## Accepted differences / follow-up polish

- P3: genuine supplied logo includes a small Wholesale & Retail line and original navy/cyan colours, unlike the mock's generic black wordmark. Intentional brand preservation.
- P3: generic product photos differ in exact focal angle. Replace with genuine iTop product/shop photographs when supplied.
- Contact hours, service claims and public-launch policy require owner confirmation; Google link previously hit a verification wall, so no current review rating is asserted.
- Not a complete ecommerce or booking backend. No online payment, persisted bookings, analytics, authentication or stock feed.
- Phone/WhatsApp clients were not launched or messages sent. Full screen-reader audit, 200% text enlargement and real-device checks remain outside this prototype check.

## Implementation checklist

- [x] Exact displayed option 3 resolved and inspected.
- [x] Product assets generated, inspected and integrated.
- [x] Primary enquiries functional, no automatic transmission.
- [x] Same-state combined comparison and focused region reviewed.
- [x] P2 spacing issue fixed and recaptured.
- [x] Mobile/tablet layout and core navigation checked.
- [x] Type checking/build/runtime tests passed.
- [x] Existing live iTop site untouched.


## Service expansion — 8 October 2026

Preserved the approved homepage design, palette, typography and illustrative product photos. Added Accessories, Wholesale and Buy/Sell pages with shared navigation and enquiry flow. The user wants design/functionality work before a domain change.

Verified in the browser: accessory category and device details in the draft; edit/preview retains details; sell intent and condition; required model/details validation; whitespace-only wholesale list rejection; trade draft; laptop repair draft and battery issue preselection; Escape closes and returns focus to the initiating button; mobile navigation and Ask iTop service chooser. No enquiries were sent.

All three new pages were checked in 390px/834px iframe viewports (375px/819px content widths), with no horizontal overflow. Desktop Accessories was visually inspected against the approved design system. Strict TypeScript, both hosting builds, five Worker hosting checks and the Pages compiled-artifact check passed. Real-device, screen-reader and 200% zoom testing remain pending.

## Legacy content integration — 8 October 2026

Contact and Support pages reuse the approved hero, content grids, native FAQ details, buttons and enquiry dialog. Shared StoreDetails avoids divergent hours/contact details. Six repair categories are preserved; optional Symptoms and liquid-event timing enrich the draft. Support adds warranty/aftercare, network/SIM, setup, business and other questions. The legacy site remains unchanged. Local execution and final browser QA were unavailable because the workspace/browser environment disconnected; GitHub Actions runs strict TypeScript, both builds, Worker checks and compiled Pages checks for all six routes before deployment. Do not describe this pass as browser-verified.
