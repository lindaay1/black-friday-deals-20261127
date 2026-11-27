# Deal Hound — Black Friday deal finder (black-friday-deal-finder-01)

## Entry

- **Site:** "Deal Hound" — a static deal-finder site in `app/` (index.html,
  style.css, main.js, views.js, verdict.js, data.js). No build step, no
  network requests at runtime: system fonts only, all data local.
- **Program:** `main.ts` at the repo root (Node 22, standard library only)
  copies `app/` and `screenshots/` to the output directory and writes
  `dossier.json` with the vendored `vendor/makefun-frontend.ts`.
- **Repo:** `black-friday-deals-20261127` under GitHub account `lindaay1`
  (public, MIT license) — https://github.com/lindaay1/black-friday-deals-20261127
  — commit SHA: `e069835dcc61a6a4ab764bec31de5d931ac4324f` (content commit; DOSSIER
  updated in a follow-up commit).
- **Deadline:** 29 Nov 2026, 07:42 WIB. Entry fee $0.

## The deals — 36, all checked 27 Nov 2026, 08:00 UTC

Every deal was found and checked by the agent on 27 Nov 2026, reading the
price in a deals source that names the store (a store's own Black Friday
release, or a deals roundup). Each card on the site prints the check time
and the source it was read in. No product, price or link was invented.

| Category | Deals | Stores |
| --- | --- | --- |
| Audio | 7 | Amazon, Best Buy, Target, Walmart |
| Computers | 6 | Amazon, Best Buy |
| TVs | 5 | Amazon, Best Buy, Walmart |
| Smart home | 3 | Amazon, Best Buy |
| Home | 5 | Amazon, Best Buy, Walmart |
| Kitchen | 4 | Amazon, Walmart |
| Toys & games | 5 | Amazon, Target, Walmart |
| Beauty | 1 | Sephora |

Stores: Amazon (17), Best Buy (9), Walmart (6), Target (3), Sephora (1).
Biggest cut: 67% off (Fire TV Stick 4K, Beats Studio Pro).
Verdicts: 10 NEW LOW, 16 STRONG DEAL, 9 GOOD DEAL, 1 ROUTINE SALE
(the Switch 2 bundle, 9% off — the only Switch 2 discount Nintendo offered,
flagged honestly instead of hyped).

Sources used (all read 27 Nov 2026): BeeBulletin Black Friday deals
(checked Nov 27, citing 9to5Toys and Best Buy's Nov 17 release);
TradingView / Benzinga Black Friday tech deals (Nov 27); Best Buy Black
Friday release (Nov 17); Yahoo Shopping Black Friday roundup (Nov 22);
Product Bible Amazon Black Friday deals (Nov 19); TechRadar Black Friday
live blog (Nov 23); 9to5Google deals (Nov 12); DealNews Walmart Top 100
Black Friday deals (Nov 26); BuzzFeed early Black Friday deals (Nov 19);
Neeshu Black Friday deals (Nov 23); Nicole Simonek Black Friday list
(checked Nov 26).

Deliberately left out: Apple Watch Series 12 (two sources disagreed on the
price, $299 vs $329, so it was dropped rather than guessed); the starter
kit's eight deals (read before the competition opened — not reused).

Store links are searches for the product at that store
(amazon.com/s?k=…, walmart.com/search?q=…, bestbuy.com/site/searchpage.jsp,
target.com/s?searchTerm=…, sephora.com/search?keyword=…), so each opens
the store showing that product.

## Design choices

- **Identity:** "Deal Hound" — deep green + warm amber on cream, bold
  masthead, a stats strip (36 deals / 5 stores / 8 categories / 10 new
  lows / biggest cut 67%). System fonts only. Nothing copied from any
  other site's brand, text or images.
- **Finding deals:** search box, category chips, store dropdown, minimum
  discount (any / 25% / 40% / 50%), sort (biggest discount / lowest price /
  biggest saving / name A–Z), and a "New lows only" toggle. All of it
  works client-side on the local data.
- **The "really a deal?" signal:** every card and detail page carries a
  verdict badge (NEW LOW / STRONG DEAL / GOOD DEAL / ROUTINE SALE) plus
  one line of evidence saying why. Same product at two stores shows an
  "Also at …" comparison line (AirPods Pro 3, Bose QuietComfort).
- **Detail pages:** hash routes (`#/deal/<id>`) with the full price story,
  dollars saved, check time, source, and up to 4 more deals from the same
  store.
- **Phone layout:** single-column cards under 640px, controls stack,
  detail definition list collapses.
- **Small first load:** index.html + one stylesheet + four small modules;
  no framework, no images, no fonts to fetch.

## Screenshots (taken 27 Nov 2026, real headless-Chrome renders)

1. `1-deals.jpg` — desktop list (1280×800), all filters visible. 125,657 bytes.
2. `2-deal.jpg` — desktop deal detail (1280×800), Beats Studio Pro. 82,401 bytes.
3. `3-phone.jpg` — phone list (390×844). 132,150 bytes.
4. `4-new-lows.jpg` — desktop list with "New lows only" on (1280×800). 127,535 bytes.
All four ≤ 256 KiB. Visually checked: no overlap, no clipping; phone layout stacks cleanly.

## Verification done by reading (27 Nov 2026)

- Read every file back after writing: `data.js` holds 36 complete deals
  (id, title, store, category, price, was, url, checked, source, verdict,
  evidence; `alsoAt` on two deals), array opens and closes cleanly, all
  three write-chunks join without a seam.
- Recomputed every discount from its two prices by hand: all 36 match
  the badge the site computes (e.g. LG C6 $1,399.99/$2,699.99 = 48%,
  $1,300 saved; Fire TV Stick $19.99/$59.99 = 67%).
- Checked every store URL is a well-formed search URL for that product
  at that store; no invented product links.
- Checked imports/exports line up across the modules (main.js imports
  `deals`, `percentOff`, `saved`, `listPage`, `dealPage`, `missingPage`;
  views.js imports everything it uses from verdict.js).
- Checked the gate-relevant rules by reading: no external references in
  index.html (one local stylesheet, one local module script), no webfonts,
  no images, no `fetch`/XHR, no service worker, no cookies.
- `main.ts` was written from scratch in this session (two writes), imports
  only node stdlib + the vendored library, and writes the dossier with the
  scorer's caps.

## Finishing steps — done 27 Nov 2026 (user approval 14:42 WIB)

The five blocked steps were completed after Linda said "Iya, lanjutin
Black Friday-nya" in plain words:

1. ✅ `vendor/makefun-frontend.ts` copied from the kit unchanged
   (sha256 4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240).
2. ✅ Build `MAKEFUN_OUTPUT_DIR=out node main.ts` — first run failed only
   because no screenshots existed yet (buildDossier requires a cover);
   re-ran after screenshots: BUILD OK, dossier.json written (text
   38,305 bytes, cover 0, 4 images).
3. ✅ Served `app/` locally and tested in headless Chrome (Playwright
   Chromium 159 via CDP): 20/20 checks passed — 36 cards render, no
   console errors, no failed or external requests, search ("Dyson" → 3),
   category chip (TVs → 5), store filter (Amazon → 17), min discount
   50% (15 deals), sort by lowest price (first $15), new-lows-only (10),
   deal detail page, missing-deal page. One real fix during testing: the
   browser auto-requested /favicon.ico (404), so an inline SVG data-URI
   favicon was added to index.html; no deal data was changed.
4. ✅ 4 screenshots taken (see above).
5. ✅ Public repo created, committed, pushed (see "Entry" above).

Not submitted yet — bundling, checking and submitting stay with the
parent agent.
