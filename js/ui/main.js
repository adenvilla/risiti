/** Risiti - main tabs: Home, History, Customers, Settings (+ bottom navigation). */

function sparkline(values) {
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i * 100) / (values.length - 1)},${34 - (v / max) * 28}`);
  return raw(`<svg class="spark" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6C877" stop-opacity=".32"/><stop offset="1" stop-color="#E6C877" stop-opacity="0"/></linearGradient></defs>
    <polygon points="0,36 ${pts.join(' ')} 100,36" fill="url(#sg)"/>
    <polyline points="${pts.join(' ')}" fill="none" stroke="#E6C877" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`);
}

const deltaPill = () => {
  const today = dayTotal(Date.now()), y = dayTotal(Date.now() - DAY);
  if (!y) return '';
  const pct = Math.round(((today - y) / y) * 100);
  return html`<span class="delta ${pct >= 0 ? 'up' : 'down'}">${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct)}% vs yesterday</span>`;
};

const statTile = (label, period) => {
  const list = periodSales(period);
  return html`<div class="stat"><span class="eyebrow-d tight">${label}</span><b class="block count" data-to="${sumOf(list)}">${moneyH(sumOf(list))}</b><span class="xs faint">${list.length} sale${list.length === 1 ? '' : 's'}</span></div>`;
};
const actionTile = (name, label, action) => html`<button class="tile" data-a="${action}"><span class="ico">${icon(name, 22)}</span>${label}</button>`;
const sectionHead = (title, link) => html`<div class="row between sec"><h2>${title}</h2>${link || ''}</div>`;

/** Progress ring + the remaining first-run tasks. The first open task is highlighted. */
function Checklist() {
  const tasks = setupTasks(), done = tasks.filter((t) => t.done).length, next = tasks.find((t) => !t.done);
  const circ = 2 * Math.PI * 18, offset = circ * (1 - done / tasks.length);
  return html`<section class="card checklist" aria-label="Finish setting up">
    <div class="row gap12"><div class="ring-wrap"><svg viewBox="0 0 44 44" width="52" height="52"><circle cx="22" cy="22" r="18" class="ring-bg"/><circle cx="22" cy="22" r="18" class="ring-fg" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/></svg><b>${done}/${tasks.length}</b></div>
      <div class="grow"><h2>Get your shop ready</h2><span class="xs muted">${done === 0 ? 'Start with your first sale — it takes seconds' : `${tasks.length - done} quick step${tasks.length - done > 1 ? 's' : ''} left`}</span></div>
      <button class="iconbtn sm" aria-label="Hide checklist" data-a="dismissChecklist">${icon('x', 15)}</button></div>
    <div class="tasks">${tasks.map((t) => html`<button class="task${t.done ? ' done' : ''}${next && next.id === t.id ? ' next' : ''}" data-a="${t.done ? 'noop' : t.action}">
      <span class="task-ico">${t.done ? icon('check', 16) : icon(t.icon, 16)}</span><span class="grow"><b class="small block">${t.label}</b><span class="xs">${t.sub}</span></span>${t.done ? '' : icon('chev', 15)}</button>`)}</div>
  </section>`;
}

function HomeTab() {
  const hour = new Date().getHours(), pending = liveSales().filter((s) => s.status === 'pending'), low = lowStock();
  const today = periodSales('Today'), todayTotal = sumOf(today);
  return html`<div class="scroll home">
    <div class="home-head"><div class="pattern-layer"></div><i class="weave"></i>
      <header class="topbar"><div class="row gap12">${shopLogo(46, 14)}<div><p class="xs on-dark">${hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'}</p><h1 class="shop-h">${S.shop.name || 'My shop'}</h1></div></div>
        <span class="date-chip">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></header>
      <div class="row between mt18"><span class="eyebrow-g">Today's sales</span>${deltaPill()}</div>
      <b class="bigger gold-t block mt4 count" data-to="${todayTotal}">${moneyH(todayTotal)}</b>
      <span class="xs on-dark">${today.length} transaction${today.length === 1 ? '' : 's'}</span>${sparkline(dailySeries(7))}
    </div>
    <div class="row gap10 float-stats">${statTile('This week', 'This week')}${statTile('This month', 'This month')}</div>
    ${showChecklist() ? Checklist() : ''}
    <div class="tiles">${actionTile('plus', 'New sale', 'newSale')}${actionTile('chart', 'Summary', 'summary')}${actionTile('box', 'Stock', 'stock')}${actionTile('doc', 'Export', 'exportCsv')}</div>
    ${navigator.onLine ? '' : html`<div class="note mint small bold mb14">Working offline — every sale is saved on this device</div>`}
    ${low.length ? html`<button class="card row item alert-card" data-a="stock"><span class="ico red">${icon('warn', 20)}</span><span class="grow"><b class="small block">${low.length} item${low.length > 1 ? 's' : ''} low on stock</b><span class="xs muted">${low.slice(0, 3).map((p) => p.n).join(', ')}${low.length > 3 ? '…' : ''}</span></span>${icon('chev', 16, '#9CA3AF')}</button>` : ''}
    ${pending.length ? html`<button class="card row item pending-card" data-a="showPending"><span class="ico amber">${icon('hist', 20)}</span><span class="grow"><b class="small block">${pending.length} pending M-Pesa payment${pending.length > 1 ? 's' : ''}</b><span class="xs muted">${money(sumOf(pending))} awaiting confirmation</span></span>${icon('chev', 16, '#9CA3AF')}</button>` : ''}
    ${sectionHead('Recent transactions', S.sales.length ? html`<button class="link green small bold" data-a="tab" data-v="hist">See all</button>` : '')}
    ${S.sales.length ? [...S.sales].sort((a, b) => b.ts - a.ts).slice(0, 5).map(saleRow)
      : emptyState('Your sales will show up here', html`<button class="btn sm mt14" data-a="newSale">${icon('plus', 16)} Make your first sale</button>`)}
  </div>`;
}

function filteredSales() {
  const q = U.query.trim().toLowerCase();
  return S.sales.filter((s) => inPeriod(s.ts, U.filter) && (!q || (s.id + itemsLabel(s) + s.phone + formatPhone(s.phone)).toLowerCase().includes(q))).sort((a, b) => b.ts - a.ts);
}
function HistoryList() {
  const list = filteredSales();
  if (!list.length) return emptyState('No receipts found');
  const groups = {};
  list.forEach((s) => (groups[dayLabel(s.ts)] = groups[dayLabel(s.ts)] || []).push(s));
  return Object.entries(groups).map(([day, rows]) => html`<div class="group">${day} · ${rows.length} receipt${rows.length > 1 ? 's' : ''}</div>${rows.map(saleRow)}`);
}
const HistoryTab = () => html`<div class="scroll"><h1 class="page-h">Receipts</h1>
  <div class="inp">${icon('search', 18, '#9CA3AF')}<input data-i="U.query" placeholder="Search item, receipt # or phone" value="${U.query}" aria-label="Search receipts"></div>
  <div class="row gap8 scroll-x my14">${PERIODS.map((f) => html`<button class="chip${U.filter === f ? ' on' : ''}" data-a="filter" data-v="${f}">${f}</button>`)}</div>
  <div id="history-list">${HistoryList()}</div></div>`;

function CustomerList() {
  const q = U.custQuery.replace(/\s/g, ''), list = customers().filter((c) => !q || ('0' + c.phone).includes(q));
  return list.length ? list.map((c) => html`<button class="card row item" data-a="viewCustomer" data-v="${c.phone}">
    <span class="ico round bold">${c.phone.slice(-2)}</span>
    <span class="grow"><b class="block title">${formatPhone(c.phone)}</b><span class="xs faint">${c.visits} visit${c.visits > 1 ? 's' : ''} · ${dayLabel(c.last)}</span></span>
    <span class="right"><b class="block amt">${money(c.spent)}</b><span class="xs faint">Total spent</span></span></button>`)
    : emptyState('Add a customer phone number to a sale and they appear here');
}
function CustomersTab() {
  const all = customers();
  return html`<div class="scroll"><h1 class="page-h">Customers</h1>
    <div class="inp">${icon('search', 18, '#9CA3AF')}<input data-i="U.custQuery" data-n="1" inputmode="numeric" placeholder="Search by phone number" value="${U.custQuery}" aria-label="Search customers"></div>
    <div class="row between small muted my14"><span>${all.length} customer${all.length === 1 ? '' : 's'}</span><span>${money(all.reduce((a, c) => a + c.spent, 0))} revenue</span></div>
    <div id="customer-list">${CustomerList()}</div></div>`;
}

const switchRow = (iconName, label, sub, action, on) => html`<button class="srow" role="switch" aria-checked="${!!on}" data-a="${action}">${iconTile(iconName, 18)}<span class="grow"><b>${label}</b><small>${sub}</small></span><span class="sw${on ? ' on' : ''}"></span></button>`;
const linkRow = (iconName, label, sub, action, danger) => html`<button class="srow${danger ? ' danger' : ''}" data-a="${action}">${iconTile(iconName, 18)}<span class="grow"><b>${label}</b>${sub ? html`<small>${sub}</small>` : ''}</span>${danger ? '' : icon('chev', 16, '#9CA3AF')}</button>`;
const tillLabel = () => (S.shop.till ? `${S.shop.kind}: ${S.shop.till}` : 'Not added yet');

function SettingsTab() {
  const low = lowStock().length;
  const groups = [
    ['Shop profile', [linkRow('image', 'Change logo', 'Upload a photo', 'logo2'), linkRow('cash', 'Payment details', tillLabel(), 'shop'),
      linkRow('box', 'Products & stock', low ? `${S.products.length} items · ${low} low` : `${S.products.length} items`, 'stock')]],
    ['Reports', [linkRow('chart', 'Daily summary', 'Review and share on WhatsApp', 'summary'), linkRow('doc', 'Export data', 'Download sales as CSV', 'exportCsv')]],
    ['Tax', [switchRow('pct', 'Enable VAT (16%)', 'Added to every new sale', 'toggleVat', S.vat)]],
    ['Preferences', [(window.matchMedia && matchMedia('(display-mode: standalone)').matches) ? '' : linkRow('plus', 'Install Risiti', 'Add to your home screen', 'install'),
      switchRow('save', 'Auto-backup', 'Save a copy on this device', 'toggleBackup', S.backup)]],
    ['Account', [S.demo ? linkRow('reset', 'Reset demo data', 'Restore sample sales and stock', 'resetDemo') : '', linkRow('out', 'Log out', '', 'logout', true)]],
  ];
  return html`<div class="scroll"><h1 class="page-h">Settings</h1>
    <button class="card row item profile" data-a="shop"><i class="weave"></i>${shopLogo(56, 16)}<span class="grow"><b class="block title lg">${S.shop.name || 'My shop'}</b><span class="small muted">${S.shop.loc || S.shop.cat}</span><b class="small block green">${tillLabel()}</b></span>${icon('chev', 16, '#9CA3AF')}</button>
    ${groups.map(([title, rows]) => html`<p class="eyebrow-d">${title}</p><div class="card flush mb20">${rows}</div>`)}
    <p class="xs faint center-t">Risiti v5 · Made in Kenya 🇰🇪</p></div>`;
}

const TAB_VIEWS = { home: HomeTab, hist: HistoryTab, cust: CustomersTab, set: SettingsTab };
const navTab = ([id, label, ic]) => html`<button class="${U.tab === id ? 'on' : ''}" aria-current="${U.tab === id ? 'page' : 'false'}" data-a="tab" data-v="${id}"><span class="nav-ico">${icon(ic, 22)}</span><span>${label}</span></button>`;
const MainScreen = () => html`<div class="screen">${TAB_VIEWS[U.tab]()}<nav aria-label="Main">
  ${navTab(['home', 'Home', 'home'])}${navTab(['hist', 'Receipts', 'hist'])}
  <button class="nav-add foil" aria-label="New sale" data-a="newSale"><span>${icon('plus', 26)}</span></button>
  ${navTab(['cust', 'Customers', 'users'])}${navTab(['set', 'Settings', 'cog'])}</nav></div>`;
