// Deal Hound — small helpers shared by the views: money, discounts, verdicts,
// and the check time. Nothing here touches the network.

// Dollars with cents only when they matter ($149, not $149.00; $79.99 stays).
export function usd(n) {
  return `$${Number.isInteger(n) ? n.toLocaleString("en-US") : n.toFixed(2)}`;
}

// Whole-number percent off, from the two prices. A deal's badge always matches
// its prices, because both come from this one function.
export function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

// Dollars saved.
export function saved(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

// The verdict badge: what the label means, in plain words.
export const verdicts = {
  "new-low": { label: "NEW LOW", note: "Lowest price seen for this item." },
  strong: { label: "STRONG DEAL", note: "A deep cut, well under list." },
  good: { label: "GOOD DEAL", note: "A solid saving, not a record." },
  routine: { label: "ROUTINE SALE", note: "A small cut — check before you buy." },
};

// "Nov 27, 2026, 08:00 UTC" from the stored ISO time.
export function checkedWhen(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC"
  );
}

// Escape anything that comes from the data before it goes into the page.
export function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
