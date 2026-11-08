/**
 * Risiti - state, persistence, seed data, selectors and mutations.
 *   S = persisted data (shop, products, sales, settings)
 *   U = transient UI state (screen, sheet, form drafts)
 * A real shop starts empty; "Try demo shop" loads sample data via demoState().
 */

/* ---------- Seed data (demo shop only) ---------- */
function seedProducts() {
  const p = (id, n, price, stock) => ({ id, n, p: price, stock, low: LOW_STOCK_DEFAULT });
  return [
    p('p1', 'Maize flour 2kg', 140, 24), p('p2', 'Sugar 1kg', 190, 4), p('p3', 'Cooking oil 1L', 320, 9),
    p('p4', 'Bread', 70, 2), p('p5', 'Milk 500ml', 65, 18), p('p6', 'Airtime', 100, null),
  ];
}

/** Receipt ids are sequential per day: RIS-YYYYMMDD-001. */
function assignReceiptIds(sales) {
  const count = {};
  return sales.sort((a, b) => a.ts - b.ts)
    .map((s) => { const k = ymd(s.ts); count[k] = (count[k] || 0) + 1; return { ...s, id: `RIS-${k}-${String(count[k]).padStart(3, '0')}` }; })
    .sort((a, b) => b.ts - a.ts);
}

function nextReceiptId(ts) {
  const k = ymd(ts), used = new Set(S.sales.map((s) => s.id));
  let n = S.sales.filter((s) => ymd(s.ts) === k).length + 1;
  while (used.has(`RIS-${k}-${String(n).padStart(3, '0')}`)) n++;
  return `RIS-${k}-${String(n).padStart(3, '0')}`;
}

function seedSales() {
  /** d = days ago; for today (d=0) h is minutes ago, otherwise hour of day. */
  const at = (d, h, mi = 0) => { if (!d) return Date.now() - h * 6e4; const x = new Date(); x.setDate(x.getDate() - d); x.setHours(h, mi, 0, 0); return x.getTime(); };
  const sale = (items, pay, phone, status, d, h, mi) => ({
    items: items.map(([n, q, p]) => ({ n, q, p })), pay, phone, disc: 0, note: '', vat: 0, status, ts: at(d, h, mi),
    ref: pay === 'mpesa' && status === 'paid' ? mpesaRef() : '',
  });
  return assignReceiptIds([
    sale([['Maize flour 2kg', 2, 140], ['Cooking oil 1L', 1, 320]], 'mpesa', '711188464', 'pending', 0, 6),
    sale([['Bread', 2, 70], ['Milk 500ml', 3, 65]], 'cash', '', 'paid', 0, 35),
    sale([['Sugar 1kg', 2, 190], ['Airtime', 1, 100]], 'mpesa', '722507194', 'paid', 0, 95),
    sale([['Maize flour 2kg', 4, 140]], 'mpesa', '733100200', 'paid', 1, 17, 40),
    sale([['Cooking oil 1L', 2, 320], ['Bread', 1, 70]], 'cash', '', 'paid', 1, 12, 15),
    sale([['Sugar 1kg', 5, 190]], 'mpesa', '745612389', 'paid', 1, 9, 5),
    sale([['Milk 500ml', 6, 65], ['Bread', 3, 70]], 'mpesa', '711188464', 'paid', 2, 18, 22),
    sale([['Maize flour 2kg', 2, 140]], 'cash', '', 'paid', 2, 11, 30),
    sale([['Cooking oil 1L', 3, 320]], 'mpesa', '758224411', 'paid', 3, 16, 10),
    sale([['Airtime', 1, 200], ['Bread', 2, 70]], 'mpesa', '722507194', 'paid', 3, 8, 45),
    sale([['Sugar 1kg', 3, 190], ['Milk 500ml', 4, 65]], 'cash', '', 'paid', 4, 13, 0),
    sale([['Maize flour 2kg', 6, 140]], 'mpesa', '110345678', 'paid', 4, 10, 20),
    sale([['Cooking oil 1L', 1, 320], ['Sugar 1kg', 1, 190]], 'mpesa', '733100200', 'paid', 5, 17, 5),
    sale([['Bread', 4, 70]], 'cash', '', 'paid', 5, 7, 50),
    sale([['Milk 500ml', 2, 65], ['Airtime', 1, 100]], 'mpesa', '745612389', 'paid', 6, 15, 35),
    sale([['Maize flour 2kg', 3, 140], ['Sugar 1kg', 2, 190]], 'mpesa', '758224411', 'paid', 6, 12, 10),
  ]);
}

/** A brand-new shop: nothing but defaults. */
const blankState = () => ({
  v: 5, authed: false, done: false, demo: false, vat: false, backup: false, logo: '', lastPhone: '',
  flags: { reviewed: false, dismissed: false },
  shop: { name: '', cat: SHOP_CATEGORIES[0], loc: '', till: '', kind: 'Till' }, products: [], sales: [],
});
const demoState = () => ({
  demo: true, done: true, flags: { reviewed: true, dismissed: true },
  shop: { name: 'Mama Njeri Store', cat: SHOP_CATEGORIES[0], loc: 'Kiambu', till: '455484', kind: 'Till' },
  products: seedProducts(), sales: seedSales(),
});

/* ---------- Persistence ---------- */
function loadState() {
  try { const s = JSON.parse(localStorage.getItem(STORAGE_KEY)); return s && s.v === 5 ? s : blankState(); }
  catch { return blankState(); }
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
    if (S.backup) localStorage.setItem(STORAGE_KEY + '.bak', JSON.stringify({ at: Date.now(), state: S }));
  } catch { /* storage full or blocked - the app keeps working in memory */ }
}

const S = loadState();
const emptyDraft = () => ({ items: [], pay: 'mpesa', phone: '', disc: '', note: '', name: '', qty: '1', price: '' });
const U = {
  scr: S.authed && S.done ? 'main' : S.done ? 'auth' : 'welcome', tab: 'home', slide: 0, filter: 'All', query: '', custQuery: '',
  cd: OTP_RESEND_SECONDS, otp: '', otpSent: false, phone: S.lastPhone || '', err: '', draft: emptyDraft(), sheet: '', sheetIn: false,
  rid: '', showQr: false, shopEdit: {}, newProd: { n: '', p: '', s: '' }, setup: { name: '', cat: SHOP_CATEGORIES[0] },
};

/* ---------- Selectors ---------- */
const liveSales = () => S.sales.filter((s) => s.status !== 'draft');
const sumOf = (list) => list.reduce((a, s) => a + saleTotals(s).total, 0);
const periodSales = (f) => liveSales().filter((s) => inPeriod(s.ts, f));
const dayTotal = (t) => sumOf(liveSales().filter((s) => sameDay(s.ts, t)));
const dailySeries = (n = 7) => Array.from({ length: n }, (_, i) => dayTotal(Date.now() - (n - 1 - i) * DAY));
const findSale = (id) => S.sales.find((s) => s.id === id);
const findProduct = (name) => S.products.find((p) => p.n.toLowerCase() === String(name).toLowerCase());

/** @returns {'untracked'|'out'|'low'|'ok'} */
const stockState = (p) => (p.stock == null ? 'untracked' : p.stock <= 0 ? 'out' : p.stock <= p.low ? 'low' : 'ok');
const lowStock = () => S.products.filter((p) => ['low', 'out'].includes(stockState(p)));

/** First-run checklist shown on Home for real shops until finished or dismissed. */
function setupTasks() {
  return [
    { id: 'sale', icon: 'plus', label: 'Make your first sale', sub: 'Takes about 10 seconds', done: S.sales.length > 0, action: 'newSale' },
    { id: 'till', icon: 'cash', label: 'Add your Till or Paybill', sub: 'Show how customers can pay you', done: !!S.shop.till, action: 'shop' },
    { id: 'products', icon: 'box', label: 'Review your products', sub: 'Check prices, turn on stock tracking', done: !!S.flags.reviewed, action: 'stock' },
    { id: 'logo', icon: 'image', label: 'Add your shop logo', sub: 'Branded receipts look professional', done: !!S.logo, action: 'logo2' },
  ];
}
const showChecklist = () => !S.demo && !S.flags.dismissed && setupTasks().some((t) => !t.done);

function customers() {
  const map = {};
  liveSales().filter((s) => s.phone).forEach((s) => {
    const c = (map[s.phone] = map[s.phone] || { phone: s.phone, visits: 0, spent: 0, last: 0 });
    c.visits++; c.spent += saleTotals(s).total; c.last = Math.max(c.last, s.ts);
  });
  return Object.values(map).sort((a, b) => b.spent - a.spent);
}

/** Everything the daily-summary sheet and WhatsApp message need. */
function daySummary(day = Date.now()) {
  const list = liveSales().filter((s) => sameDay(s.ts, day));
  const paid = list.filter((s) => s.status === 'paid'), pending = list.filter((s) => s.status === 'pending');
  const qty = {};
  paid.forEach((s) => s.items.forEach((i) => { qty[i.n] = (qty[i.n] || 0) + i.q; }));
  const top = Object.entries(qty).sort((a, b) => b[1] - a[1])[0];
  return {
    day, count: list.length, revenue: sumOf(paid),
    mpesa: sumOf(paid.filter((s) => s.pay === 'mpesa')), cash: sumOf(paid.filter((s) => s.pay === 'cash')),
    pending: sumOf(pending), pendingCount: pending.length,
    top: top ? { name: top[0], qty: top[1] } : null, low: lowStock(),
  };
}

function summaryText(day = Date.now()) {
  const d = daySummary(day);
  const lines = [`*${S.shop.name} - Daily summary*`, longDate(day), '',
    `Sales: *${money(d.revenue)}* (${d.count} receipt${d.count === 1 ? '' : 's'})`,
    `M-Pesa: ${money(d.mpesa)}`, `Cash: ${money(d.cash)}`];
  if (d.pendingCount) lines.push(`Pending: ${money(d.pending)} (${d.pendingCount})`);
  if (d.top) lines.push('', `Top seller: ${d.top.name} (${d.top.qty} sold)`);
  if (d.low.length) lines.push('', 'Restock soon:', ...d.low.map((p) => `- ${p.n}: ${p.stock <= 0 ? 'OUT' : p.stock + ' left'}`));
  return lines.concat(['', 'Sent with Risiti']).join('\n');
}

/* ---------- Mutations ---------- */
/** Adjusts tracked stock for every sold item. dir = -1 on sale, +1 on refund. */
function applyStock(sale, dir) {
  sale.items.forEach((i) => {
    const p = findProduct(i.n);
    if (p && p.stock != null) p.stock = Math.max(0, p.stock + dir * i.q);
  });
}

/** Creates a sale from the cart draft and stores it. */
function recordSale(draft, status, phone) {
  const sub = saleTotals({ items: draft.items, disc: 0 }).sub;
  const ts = Date.now();
  const sale = {
    id: nextReceiptId(ts), items: draft.items.map((i) => ({ ...i })), pay: draft.pay, phone: draft.phone ? phone : '',
    disc: Math.min(+draft.disc || 0, sub), note: draft.note.trim(), vat: S.vat ? 1 : 0, ts, ref: '',
    status: status === 'draft' ? 'draft' : draft.pay === 'cash' ? 'paid' : 'pending',
  };
  S.sales.unshift(sale);
  if (sale.status !== 'draft') applyStock(sale, -1);
  saveState();
  return sale;
}

/** Creates the shop from the one-screen setup form. */
function createShop(name, cat) {
  S.shop = { ...S.shop, name: name.trim(), cat };
  S.products = SHOP_TYPES[cat].starter.map(([n, p], i) => ({ id: 'p' + (i + 1), n, p, stock: null, low: LOW_STOCK_DEFAULT }));
  S.done = true; S.authed = true;
  saveState();
}
