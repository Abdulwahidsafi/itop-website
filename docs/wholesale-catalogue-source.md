# First wholesale catalogue import

Source: user-supplied WhatsApp catalogue screenshots in this conversation. Uploaded iTops Wholesale Stock.zip could not be opened because the workspace was disconnected. Screenshots are readable in the conversation; original image bytes have not yet been accessible for product-photo assets.

Imported 205 fully visible listings, grouped into 11 categories (the initial 90 plus 115 additional cases). This is a partial snapshot, not a full stock export. Ignore clipped header/footer listings. Do not interpret 'See all' as containing only the three visible products.

The user explicitly requested category screenshots with photos and prices. Price values are transcribed from the visible current prices, with crossed-out promotional amounts omitted. Prices are stored in integer pence and labelled catalogue price, not used for checkout or calculated totals. VAT treatment and item/pack quantities are not established; final trade prices remain confirmed by staff.

Use consistent human-readable names; retain supplier labels on ambiguous device variants. Do not claim EW97 earbuds are genuine Apple AirPods, generic charging adapters are genuine Samsung products, or 17/18 shared case labels establish verified fit. Product reference fields contain only visible model/code information; import IDs wa-NN-N are internal keys, not invented supplier SKUs.

Product-level warranty text in screenshots has not been imported as a verified policy. No stock counts, units per pack, minimum quantity, connector specification beyond supplier labels or general 'high quality' claims inferred.

Known follow-up:
- Original product photos or accessible full category screenshots for photo matching.
- Additional listings behind See all; more screens may be required for each collection.
- Actual pack sizes, VAT treatment, current price maintenance and availability.
- Confirm model labels, connector variants and any product warranties with iTop.
- Real approved trade accounts remain a separate backend phase.

Quote flow: search/filter → choose up to 12 products → adjust item/pack quantities → existing quote builder → editable message review → visitor chooses whether to send on WhatsApp to +447417465401.

## Additional case screenshots — imported

On 8 October 2026 the owner confirmed the screenshot amounts are iTop selling prices. The VERON HUB LTD label does not change that explicit confirmation. The 115 additional readable listings are now in `src/wholesaleCatalogue.mjs`: 32 thin, 8 colourful, 18 additional blurred, 11 packaged and 46 shiny. Overlapping screenshots and three existing blurred products were excluded; total catalogue entries: 205.

Thin cases are £1.29, colourful £1.79, blurred £1.59, packaged £0.99. Shiny Galaxy listings are £1.19 except A35, A56, S23 Plus and S21 at £0.99; shiny iPhone listings are £0.99. Crossed-out previous amounts are not imported. The clipped 7P/8P row remains excluded.

The accompanying case import manifest retains original supplier labels and owner-confirmed prices. This confirmation resolves buying versus selling price status; VAT, item/pack basis, availability and compatibility still need confirmation with the quote.

Original photo files remain inaccessible while the workspace is disconnected. Two enlarged style photos are visible in the conversation, but no photo asset was imported. The shiny photo shows cards marked For iP 16 while the listing says S24, so treat shared photos as style illustrations rather than verified model-specific images.

## Remaining case batch

Imported 125 additional fully priced listings: 13 frame, 4 bracket, 24 thin, 24 colourful and 60 shockproof. Total: 330 products. Existing frame, bracket, fashion and shockproof listings from earlier screenshots were not reimported; overlapping screenshots were deduplicated.

Most shockproof cases are £1.29; A14 is £1.28. Most colourful cases are £1.79; 11 Pro Max is £1.99. Frame cases are £1.65, bracket £1.99, thin £1.29. Preserve A32 4G versus 5G as separate rows and the ambiguous supplier label A51 4G?5G? pending clarification. Clipped labels or prices are excluded.

The owner explicitly approved shared general style photos across model listings, as in the WhatsApp catalogue. Latest full photos map to frame (clear backs on wooden table), fashion/quality (four solid colour cases on grey background), colourful (two rows on wooden table), shockproof (clear case in packaging) and bracket (cases with fold-out stands on grey table). Prior full photos cover blurred and shiny. Thin currently has a shared screenshot thumbnail. Shared photos illustrate style; exact camera cut-outs and colours depend on the chosen model.

Photo bytes are unavailable while the workspace is disconnected. No image assets or fabricated image URLs were added in this batch. Install supplied originals by style when file access resumes; user approval for this reuse is already recorded.

## Shared style photos installed — 8 October 2026

Six supplied JPEG originals are now stored unchanged in public/images/wholesale: frame (16.17.00 (1)), fashion (16.17.00 (2)), colourful (16.17.00 (3)), shockproof (16.17.00 (4)), bracket (16.17.00 (5)) and blurred (16.17.01 (4)). All filenames originated as WhatsApp Image 2026-10-08 at [time].jpeg. Map by product style rather than collection because fashion collections include colourful listings. The shared photos illustrate style, not exact model fit or colour availability. The blurred screenshot uses a square display crop so its controls and embedded reference price are omitted; its original bytes remain intact. Other styles have no matching photo in this six-file batch. The catalogue data and owner-confirmed selling prices are unchanged.

## Original labels and complete photo coverage — 8 October 2026
All 90 first-import listings were rechecked in logged-in WhatsApp Web and retained in src/wholesaleOriginals.mjs. Every current selling price matched. Display exact original names, collection headings and existing short descriptions; no descriptions are invented. The remaining 240 case names derive from the supplied screenshot labels. All 330 current listings have photos. Thin and packaged cases use display crops of supplied category screenshots; 75 previously missing photos use captured WhatsApp thumbnails, without private chat content. These images are lower resolution than supplied originals. The original photo download mechanisms did not expose the blob-backed images, so use these faithful thumbnail captures until original images are available. Product-level warranty labels belong to their source listings and do not establish a shop-wide policy. The supplier has further products beyond the current imported snapshot; they are not inferred or silently added.


## Embedded CSV photos — 8 October 2026
The supplied whatsapp-catalogue-2026-10-08.csv contains 796 exported rows, 350 priced rows and 181 distinct embedded JPEGs, all at most 240 pixels on the longest edge. Replace the 75 captured product photos using 70 unique name/description/price matches and five manually verified image matches where the export omitted labels. Replace shared thin (56 listings) and packaged magnetic (11 listings) screenshot crops with embedded JPEGs. Reuse identical image bytes across matching products; preserve the seven larger supplied style photos. Display portrait photos in full within existing square cards. Names, descriptions, confirmed prices, product count (330) and design remain unchanged. Extra export rows are not imported. These are sharper source thumbnails, not full-resolution originals.

## Full-size screen protector photos — 9 October 2026
Owner supplied WhatsApp Image 2026-10-09 at 17.05.40 (1).jpeg for privacy glass, (2).jpeg for normal/clear glass, and the unsuffixed JPEG for iPad/tablet glass. Stored unchanged as screen-protector-privacy.jpeg, screen-protector-normal.jpeg and screen-protector-tablet.jpeg. Apply by Protection collection type, overriding older embedded thumbnails for all nine current listings (three per type) and future matching products. Preserve complete images with contain presentation and an illustrative-photo caption because the pictured package model may differ from the listed device. No products, descriptions, prices or compatibility claims were added.
