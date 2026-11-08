/**
 * Risiti - user actions. Each handler is bound to a `data-a` attribute and
 * receives (element, event). Handlers mutate S/U, then call render().
 */

const SCREENS = { welcome: WelcomeScreen, tour: Tour, auth: AuthScreen, shop: SetupShop, main: MainScreen };

const go = (scr) => { U.scr = scr; U.sheet = ''; U.err = ''; render(); };
const openSheet = (name) => { U.sheet = name; U.sheetIn = true; U.err = ''; render(); };
const fail = (msg) => { toast(msg); };
const parseAdjust = (v) => { const [id, n] = v.split(':'); return [S.products.find((p) => p.id === id), +n]; };

/* ---------- Phone verification: SMS auto-read simulation ---------- */
let autofillTimer = null;
const stopAutofill = () => { clearInterval(autofillTimer); autofillTimer = null; };
const drawOtp = () => {
  const box = $('#otp-boxes'), status = $('#otp-status');
  if (box) box.innerHTML = otpBoxes().s;
  if (status) status.innerHTML = U.otp.length === OTP_LENGTH ? html`${icon('check', 15)} Verifying…`.s : html`<i class="spn sm"></i> Reading your SMS automatically…`.s;
};
/** Types the demo code digit by digit, then verifies - like Android's SMS auto-read. */
function startAutofill() {
  stopAutofill();
  setTimeout(() => {
    if (!(U.scr === 'auth' && U.otpSent)) return;
    let i = 0;
    autofillTimer = setInterval(() => {
      if (!(U.scr === 'auth' && U.otpSent) || U.otp.length !== i) { stopAutofill(); return; }
      U.otp += DEMO_OTP[i++]; drawOtp();
      const input = $('#otp-input'); if (input) input.value = U.otp;
      if (i === OTP_LENGTH) { stopAutofill(); setTimeout(Actions.verify, 450); }
    }, AUTOFILL_DIGIT_MS);
  }, AUTOFILL_START_MS);
}

function commitSale(status) {
  const d = U.draft;
  if (!d.items.length) return fail('Add at least one item');
  const phone = normalisePhone(d.phone);
  if (d.phone && !isValidPhone(phone)) return fail('Customer phone looks invalid');
  const sale = recordSale(d, status, phone);
  U.draft = emptyDraft();
  if (status === 'draft') { U.sheet = ''; toast('Draft saved'); render(); return; }
  Object.assign(U, { sheet: 'receipt', rid: sale.id, showQr: false, sheetIn: true });
  render();
  if (sale.status === 'pending' && sale.phone) { Actions.stkPush(); return; }
  const warn = sale.items.map((i) => findProduct(i.n)).filter((p) => p && ['low', 'out'].includes(stockState(p)));
  if (warn.length) toast(`Low stock: ${warn[0].n} (${warn[0].stock} left)`);
}

function downloadCsv() {
  const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
  const head = ['Receipt', 'Date', 'Time', 'Customer', 'Items', 'Subtotal', 'Discount', 'VAT', 'Total', 'Payment', 'Status', 'M-Pesa ref'];
  const rows = S.sales.map((s) => { const t = saleTotals(s);
    return [s.id, new Date(s.ts).toLocaleDateString('en-GB'), timeLabel(s.ts), formatPhone(s.phone), itemsLabel(s), t.sub, t.disc, t.vat, t.total, s.pay, s.status, s.ref || ''].map(q).join(','); });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([[head.map(q).join(',')].concat(rows).join('\n')], { type: 'text/csv' }));
  a.download = 'risiti-sales.csv'; a.click();
  toast('Sales exported');
}

let installPrompt = null;
const copyText = (text, message) => {
  const fallback = () => { const x = document.createElement('textarea'); x.value = text; document.body.appendChild(x); x.select();
    try { document.execCommand('copy'); toast(message); } catch { toast('Copy failed'); } x.remove(); };
  navigator.clipboard ? navigator.clipboard.writeText(text).then(() => toast(message), fallback) : fallback();
};
const receiptText = (s) => {
  const t = saleTotals(s);
  return `*${S.shop.name}*\nReceipt ${s.id}\n${new Date(s.ts).toLocaleString('en-GB')}\n\n` +
    s.items.map((i) => `${i.q} x ${i.n} — ${money(i.q * i.p)}`).join('\n') + '\n\n' +
    (t.disc ? `Discount: -${money(t.disc)}\n` : '') + (t.vat ? `VAT 16%: ${money(t.vat)}\n` : '') +
    `*Total: ${money(t.total)}*\nPaid via ${s.pay === 'cash' ? 'Cash' : 'M-Pesa'}` +
    (s.ref ? ` (Ref ${s.ref})` : S.shop.till && s.pay !== 'cash' ? ` (${S.shop.kind} ${S.shop.till})` : '') + '\n\nThank you for your business! Powered by Risiti';
};

const Actions = {
  noop() {},

  /* enrollment */
  start() { go('auth'); },
  tour() { U.slide = 0; go('tour'); },
  next() { U.slide < SLIDES.length - 1 ? (U.slide++, render()) : go('auth'); },
  goSlide(el) { U.slide = +el.dataset.v; render(); },
  back(el) { stopAutofill(); if (el.dataset.v === 'welcome') U.otpSent = false; go(el.dataset.v); },
  demo() {
    Object.assign(S, demoState(), { authed: true }); saveState();
    U.tab = 'home'; go('main'); toast('Demo shop loaded — explore freely');
  },
  sendOtp() {
    const p = normalisePhone(U.phone);
    if (!isValidPhone(p)) { U.err = 'Enter a valid Kenyan number, e.g. 712 345 678'; render(); return; }
    Object.assign(U, { phone: p, otp: '', otpSent: true, cd: OTP_RESEND_SECONDS, err: '' });
    render(); startAutofill();
  },
  editNumber() { stopAutofill(); Object.assign(U, { otpSent: false, otp: '' }); render(); },
  resend() { if (U.cd > 0) return; Object.assign(U, { cd: OTP_RESEND_SECONDS, otp: '' }); render(); startAutofill(); toast('New code sent'); },
  verify() {
    if (U.scr !== 'auth' || !U.otpSent) return;
    if (U.otp.length < OTP_LENGTH) { const o = $('#otp-boxes'); if (o) { o.style.animation = 'none'; void o.offsetWidth; o.style.animation = 'shake .4s'; } return fail('Enter the 6-digit code'); }
    stopAutofill(); S.authed = true; S.lastPhone = U.phone; saveState();
    if (S.done) { go('main'); toast('Welcome back!'); } else go('shop');
  },
  pickCategory(el) { U.setup.cat = el.dataset.v; render(); },
  shopFinish() {
    if (!U.setup.name.trim()) { U.err = 'Give your shop a name to continue'; render(); return; }
    createShop(U.setup.name, U.setup.cat); U.tab = 'home'; U.err = '';
    go('main'); toast(`Welcome, ${S.shop.name}! Let's make your first sale`);
  },
  dismissChecklist() { S.flags.dismissed = true; saveState(); render(); toast('You can finish setup anytime in Settings'); },

  /* products & stock */
  prodAdd() {
    const { n, p, s } = U.newProd, price = +p;
    if (!n.trim() || !(price > 0)) return fail('Enter a name and price');
    if (findProduct(n.trim())) return fail('That product already exists');
    S.products.push({ id: 'p' + Date.now().toString(36), n: n.trim(), p: price, stock: s === '' ? null : +s, low: LOW_STOCK_DEFAULT });
    U.newProd = { n: '', p: '', s: '' }; saveState(); render();
  },
  prodDel(el) { S.products = S.products.filter((p) => p.id !== el.dataset.v); saveState(); render(); },
  trackStock(el) {
    const p = S.products.find((x) => x.id === el.dataset.v); if (!p) return;
    p.stock = TRACK_STOCK_START; saveState(); render(); toast(`Tracking ${p.n} — adjust with + and −`);
  },
  stockAdj(el) {
    const [p, n] = parseAdjust(el.dataset.v); if (!p) return;
    p.stock = Math.max(0, (p.stock || 0) + n); saveState(); render();
    if (n > 0) toast(`${p.n}: ${p.stock} in stock`);
  },
  stock() { S.flags.reviewed = true; saveState(); openSheet('stock'); },

  /* navigation */
  tab(el) { U.tab = el.dataset.v; render(); },
  filter(el) { U.filter = el.dataset.v; render(); },
  showPending() { Object.assign(U, { filter: 'All', query: '', tab: 'hist' }); render(); },
  viewCustomer(el) { Object.assign(U, { query: formatPhone(el.dataset.v), filter: 'All', tab: 'hist' }); render(); },
  openSale(el) { Object.assign(U, { rid: el.dataset.v, sheet: 'receipt', showQr: false, sheetIn: true }); render(); },
  newSale() { openSheet('sale'); },
  summary() { openSheet('summary'); },
  close() { U.sheet = ''; U.err = ''; render(); },
  overlay(el, ev) { if (ev.target === el) Actions.close(); },

  /* sale cart */
  quickAdd(el) {
    const p = S.products.find((x) => x.id === el.dataset.v); if (!p) return;
    if (!canAdd(p.n)) return fail(`Only ${p.stock} ${p.n} in stock`);
    const line = U.draft.items.find((i) => i.n === p.n && i.p === p.p);
    line ? line.q++ : U.draft.items.push({ n: p.n, q: 1, p: p.p });
    render();
  },
  itemAdd() {
    const d = U.draft, n = d.name.trim(), q = Math.max(1, parseInt(d.qty, 10) || 1), p = +d.price;
    if (!n || !(p > 0)) return fail('Enter an item name and price');
    d.items.push({ n, q, p }); Object.assign(d, { name: '', qty: '1', price: '' }); render();
  },
  qty(el) {
    const [i, step] = el.dataset.v.split(':').map(Number), it = U.draft.items[i];
    if (step > 0 && !canAdd(it.n)) return fail(`Only ${findProduct(it.n).stock} ${it.n} in stock`);
    it.q += step; if (it.q < 1) U.draft.items.splice(i, 1); render();
  },
  pay(el) { U.draft.pay = el.dataset.v; render(); },
  saveDraft() { commitSale('draft'); },
  sendReceipt() { commitSale('sent'); },

  /* receipt */
  share(el) {
    const s = findSale(U.rid), v = el.dataset.v, text = receiptText(s);
    if (v === 'wa') window.open(`https://wa.me/${s.phone ? '254' + s.phone : ''}?text=${encodeURIComponent(text)}`, '_blank');
    else if (v === 'sms') location.href = `sms:${s.phone ? '+254' + s.phone : ''}?&body=${encodeURIComponent(text)}`;
    else if (v === 'copy') copyText(text, 'Receipt copied');
    else { U.showQr = !U.showQr; render(); }
  },
  stkPush() {
    const s = findSale(U.rid);
    if (!s || s.stk) return;
    if (!s.phone) return fail('Add the customer phone number to send an STK push');
    s.stk = true; saveState(); render(); toast('STK push sent to ' + formatPhone(s.phone));
    setTimeout(() => { s.stk = false; s.status = 'paid'; s.ref = mpesaRef(); saveState(); render(); toast('M-Pesa payment received ✓'); }, STK_DELAY_MS);
  },
  markPaid() { findSale(U.rid).status = 'paid'; saveState(); render(); toast('Marked as paid ✓'); },
  finalise() {
    const s = findSale(U.rid);
    s.status = s.pay === 'cash' ? 'paid' : 'pending'; applyStock(s, -1); saveState(); render(); toast('Receipt finalised');
  },

  /* summary */
  summaryShare() { window.open('https://wa.me/?text=' + encodeURIComponent(summaryText()), '_blank'); },
  summaryCopy() { copyText(summaryText(), 'Summary copied'); },

  /* shop & settings */
  shop() { U.shopEdit = { ...S.shop, focusTill: !S.shop.till }; openSheet('shop'); },
  shopSave() {
    const h = U.shopEdit;
    if (!h.name.trim()) { U.err = 'Shop name is required'; render(); return; }
    if (h.till && !/^\d{5,7}$/.test(h.till)) { U.err = 'Till or Paybill should be 5–7 digits'; render(); return; }
    const { focusTill, ...clean } = h;
    S.shop = { ...S.shop, ...clean, name: h.name.trim() }; saveState(); U.sheet = ''; U.err = ''; render(); toast('Shop details saved');
  },
  logo2() { const f = $('#logo-input'); f.removeAttribute('capture'); f.click(); },
  toggleVat() { S.vat = !S.vat; saveState(); render(); toast(S.vat ? 'VAT 16% will be added to new sales' : 'VAT turned off'); },
  toggleBackup() { S.backup = !S.backup; saveState(); render(); toast(S.backup ? 'Auto-backup on — saved to this device' : 'Auto-backup off'); },
  exportCsv() { downloadCsv(); },
  resetDemo() { if (confirm('Restore the sample sales and stock? Your current data will be replaced.')) { Object.assign(S, { sales: seedSales(), products: seedProducts() }); saveState(); render(); toast('Demo data restored'); } },
  install() { if (installPrompt) { installPrompt.prompt(); installPrompt.userChoice.then(() => { installPrompt = null; render(); }); } else toast('iPhone: tap Share, then Add to Home Screen'); },
  logout() { stopAutofill(); Object.assign(U, { otp: '', otpSent: false, tab: 'home' }); S.authed = false; saveState(); go('auth'); toast('Logged out'); },
};
