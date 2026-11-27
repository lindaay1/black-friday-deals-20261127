// Deal Hound — the deal finder itself: hash routes, search, filters and sort.
// The deals live in data.js, so the page needs no network to show them.
//
//   #/            the list, with search and filters
//   #/deal/<id>   one deal, with its full price story
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./data.js";
import { percentOff, saved } from "./verdict.js";
import { listPage, dealPage, missingPage } from "./views.js";

const app = document.getElementById("app");

// Every filter the list page offers, in one place.
const filters = {
  q: "",
  category: "All",
  store: "All",
  minOff: 0,
  sort: "discount",
  newLowsOnly: false,
};

function bySort(a, b) {
  if (filters.sort === "discount") return percentOff(b) - percentOff(a);
  if (filters.sort === "price") return a.price - b.price;
  if (filters.sort === "saving") return saved(b) - saved(a);
  return a.title.localeCompare(b.title);
}

function visibleDeals() {
  const q = filters.q.trim().toLowerCase();
  return deals
    .filter((d) => {
      if (q !== "" && `${d.title} ${d.store} ${d.category}`.toLowerCase().indexOf(q) === -1) return false;
      if (filters.category !== "All" && d.category !== filters.category) return false;
      if (filters.store !== "All" && d.store !== filters.store) return false;
      if (percentOff(d) < filters.minOff) return false;
      if (filters.newLowsOnly && d.verdict !== "new-low") return false;
      return true;
    })
    .sort(bySort);
}

// Category chips, built from the deals so they always match what is on the
// board. "All" first, then each category in the order it first appears.
function categoryChips() {
  const seen = [];
  for (const d of deals) if (seen.indexOf(d.category) === -1) seen.push(d.category);
  return ["All", ...seen]
    .map(
      (c) =>
        `<button type="button" class="chip${filters.category === c ? " on" : ""}" data-cat="${c}">${c}</button>`,
    )
    .join("");
}

function storeOptions() {
  const seen = [];
  for (const d of deals) if (seen.indexOf(d.store) === -1) seen.push(d.store);
  return ["All", ...seen]
    .map((s) => `<option${filters.store === s ? " selected" : ""}>${s}</option>`)
    .join("");
}

function renderList() {
  document.title = "Deal Hound — Black Friday deals, checked";
  app.innerHTML = `<section class="controls" aria-label="Find a deal">
  <label class="search">Search <input id="q" type="search" placeholder="Try “Dyson”, “TV”, “LEGO”… " value=""></label>
  <div class="chips" role="group" aria-label="Category">${categoryChips()}</div>
  <div class="row">
    <label>Store <select id="store">${storeOptions()}</select></label>
    <label>At least <select id="minoff">
      <option value="0">any discount</option>
      <option value="25">25% off</option>
      <option value="40">40% off</option>
      <option value="50">50% off</option>
    </select></label>
    <label>Sort by <select id="sort">
      <option value="discount">biggest discount</option>
      <option value="price">lowest price</option>
      <option value="saving">biggest saving</option>
      <option value="az">name A–Z</option>
    </select></label>
    <label class="check"><input id="newlows" type="checkbox"> New lows only</label>
  </div>
</section>
<div id="results"></div>`;
  const results = app.querySelector("#results");
  const refresh = () => {
    results.innerHTML = listPage(visibleDeals(), deals.length);
  };
  const q = app.querySelector("#q");
  q.value = filters.q;
  q.addEventListener("input", () => {
    filters.q = q.value;
    refresh();
  });
  app.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      filters.category = chip.dataset.cat;
      renderList();
      const next = app.querySelector("#q");
      next.value = filters.q;
      next.focus();
    });
  });
  const store = app.querySelector("#store");
  store.addEventListener("change", () => {
    filters.store = store.value;
    refresh();
  });
  const minoff = app.querySelector("#minoff");
  minoff.value = String(filters.minOff);
  minoff.addEventListener("change", () => {
    filters.minOff = Number(minoff.value);
    refresh();
  });
  const sort = app.querySelector("#sort");
  sort.value = filters.sort;
  sort.addEventListener("change", () => {
    filters.sort = sort.value;
    refresh();
  });
  const newlows = app.querySelector("#newlows");
  newlows.checked = filters.newLowsOnly;
  newlows.addEventListener("change", () => {
    filters.newLowsOnly = newlows.checked;
    refresh();
  });
  refresh();
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    if (found) {
      document.title = `${found.title} | Deal Hound`;
      const others = deals
        .filter((d) => d.store === found.store && d.id !== found.id)
        .sort((a, b) => percentOff(b) - percentOff(a))
        .slice(0, 4);
      app.innerHTML = dealPage(found, others);
    } else {
      document.title = "Not found | Deal Hound";
      app.innerHTML = missingPage();
    }
  } else {
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
