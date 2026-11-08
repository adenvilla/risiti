/**
 * Risiti - pure helpers: safe HTML templating, formatting, dates, phones, totals.
 * Nothing here touches app state.
 */

/* ---------- Safe HTML templating ---------- */
/** Marks a string as already-safe HTML. */
class Raw { constructor(s) { this.s = s; } }
const raw = (s) => new Raw(s);
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const renderValue = (v) => (v instanceof Raw ? v.s : Array.isArray(v) ? v.map(renderValue).join('') : (v == null || v === false) ? '' : esc(v));

/**
 * Tagged template that escapes every interpolated value unless it is Raw
 * (another html`` result or an icon). This makes XSS safe-by-default.
 */
const html = (strings, ...values) => raw(strings.reduce((out, s, i) => out + s + (i < values.length ? renderValue(values[i]) : ''), ''));

const $ = (sel) => document.querySelector(sel);

/* ---------- Formatting ---------- */
const money = (n) => 'KSh ' + Math.round(n).toLocaleString('en-US');
/** Display version: small "KSh" prefix, large figure. */
const moneyH = (n) => html`<span class="cur">KSh</span>${Math.round(n).toLocaleString('en-US')}`;

/* ---------- Dates ---------- */
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const ymd = (t) => { const d = new Date(t); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`; };
const dayLabel = (t) => sameDay(t, Date.now()) ? 'Today' : sameDay(t, Date.now() - DAY) ? 'Yesterday'
  : new Date(t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const timeLabel = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const longDate = (t) => new Date(t).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

function inPeriod(t, period) {
  if (period === 'All') return true;
  if (period === 'Today') return sameDay(t, Date.now());
  if (period === 'This week') return Date.now() - t < 7 * DAY;
  const a = new Date(t), b = new Date();
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

/* ---------- Phones (Kenya) ---------- */
const normalisePhone = (p) => String(p).replace(/\D/g, '').replace(/^254/, '').replace(/^0/, '');
const isValidPhone = (p) => /^[17]\d{8}$/.test(p);
const formatPhone = (p) => (p ? `0${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6)}` : 'Walk-in');

/* ---------- Sales maths ---------- */
/** Subtotal, capped discount, optional 16% VAT (applied after discount) and total. */
function saleTotals(sale) {
  const sub = sale.items.reduce((a, i) => a + i.q * i.p, 0);
  const disc = Math.min(Math.max(+sale.disc || 0, 0), sub);
  const vat = sale.vat ? Math.round((sub - disc) * VAT_RATE) : 0;
  return { sub, disc, vat, total: sub - disc + vat };
}
const itemsLabel = (sale) => sale.items.map((i) => i.n).join(', ');

/** Fake M-Pesa confirmation code, e.g. SK3L9QX2MA. */
function mpesaRef() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  return 'S' + Array.from({ length: 9 }, () => c[(Math.random() * c.length) | 0]).join('');
}

/** @returns {Raw} QR code as inline SVG (needs the qrcode-generator CDN script). */
function qrSvg(text) {
  try { const q = qrcode(0, 'M'); q.addData(text); q.make(); return raw(q.createSvgTag(5, 0)); }
  catch { return html`<p class="xs muted">QR code needs an internet connection</p>`; }
}
