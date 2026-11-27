// Deal Hound — the HTML for the deal list and the deal pages, built from the
// deal data. Every value is escaped before it goes into the page.

import { usd, percentOff, saved, verdicts, checkedWhen, escape } from "./verdict.js";

// One deal, as a card on the list. The verdict badge and the evidence line are
// the "is it really a deal?" signal: the badge says it, the line says why.
export function card(d) {
  const v = verdicts[d.verdict];
  const also =
    d.alsoAt != null
      ? `<p class="also">Also at ${escape(d.alsoAt.store)} for ${usd(d.alsoAt.price)} — compare before you buy.</p>`
      : "";
  return `<article class="card">
  <p class="tags"><span class="cat">${escape(d.category)}</span> <span class="store">${escape(d.store)}</span></p>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="verdict ${escape(d.verdict)}"><strong>${v.label}</strong> — ${escape(d.evidence)}</p>
  <p class="checked">Checked ${checkedWhen(d.checked)} · Read in: ${escape(d.source)}</p>
  ${also}
  <p class="go"><a href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} ↗</a></p>
</article>`;
}

// The rows of the list, filtered by the caller's predicate. An empty result
// says so plainly instead of leaving a blank page.
export function cards(deals) {
  if (deals.length === 0) {
    return '<p class="empty">No deal matches those filters. Loosen one and try again — the deals are still here.</p>';
  }
  return deals.map(card).join("\n");
}

// The whole list page: a count line and the cards.
export function listPage(deals, total) {
  const savedTotal = deals.reduce((sum, d) => sum + saved(d), 0);
  return `<p class="count"><strong>${deals.length}</strong> of ${total} deals · you would save <strong>${usd(Math.round(savedTotal))}</strong> on everything shown</p>
<div class="grid">${cards(deals)}</div>`;
}

// One deal, on its own page: the full price story, the verdict with its
// evidence, the check time and source, and the store link.
export function dealPage(d, othersAtSameStore) {
  const v = verdicts[d.verdict];
  const also =
    d.alsoAt != null
      ? `<dt>Also at</dt><dd>${escape(d.alsoAt.store)} for ${usd(d.alsoAt.price)} — same product, different store.</dd>`
      : "";
  const more =
    othersAtSameStore.length > 0
      ? `<h2>More at ${escape(d.store)}</h2><ul class="more">${othersAtSameStore
          .map(
            (o) =>
              `<li><a href="#/deal/${encodeURIComponent(o.id)}">${escape(o.title)}</a> — ${usd(o.price)} (${percentOff(o)}% off)</li>`,
          )
          .join("")}</ul>`
      : "";
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <p class="tags"><span class="cat">${escape(d.category)}</span> <span class="store">${escape(d.store)}</span></p>
  <h1>${escape(d.title)}</h1>
  <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save-line">You save ${usd(saved(d))} off the usual price.</p>
  <dl>
    <dt>Is it really a deal?</dt>
    <dd><span class="verdict ${escape(d.verdict)}"><strong>${v.label}</strong> — ${v.note}</span><br>${escape(d.evidence)}</dd>
    <dt>Checked</dt><dd>${checkedWhen(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
    ${also}
  </dl>
  <p class="go"><a href="${escape(d.url)}" target="_blank" rel="noopener">View it at ${escape(d.store)} ↗</a></p>
  <p class="fine">Prices move fast on Black Friday — the store's page is the final word.</p>
</article>
${more}`;
}

// A hash route that names no deal.
export function missingPage() {
  return `<h1>That deal is not here</h1>
<p>There is no deal at this address. <a href="#/">See all 36 deals</a>.</p>`;
}
