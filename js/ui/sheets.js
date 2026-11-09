/** Risiti - bottom sheets: new sale, receipt, stock, shop details, daily summary, export. */

const inCart = (name) => (U.draft.items.find((i) => i.n === name) || { q: 0 }).q;
/** True when the cart may take one more unit without exceeding tracked stock. */
const canAdd = (name) => { const p = findProduct(name); return !p || p.stock == null || inCart(name) < p.stock; };

function quickAddChips() {
  if (!S.products.length) return '';
  return html`${sectionLabel('Quick add')}<div class="row gap8 scroll-x">${S.products.map((p) => {
    const st = stockState(p), out = st === 'out';
    return html`<button class="chip product${out ? ' disabled' : ''}" ${out ? 'disabled' : ''} data-a="quickAdd" data-v="${p.id}">
      <span>${p.n}</span><small class="${st === 'low' || out ? 'low-t' : ''}">${money(p.p)}${p.stock == null ? '' : out ? ' · Out' : ` · ${p.stock} left`}</small></button>`;
  })}</div>`;
}

const cartRow = (it, i) => html`<div class="card row cart-row"><div class="grow"><b class="small ell block">${it.n}</b><span class="xs muted">${money(it.p)} each</span></div>
  <div class="stepper"><button aria-label="Remove one ${it.n}" data-a="qty" data-v="${i}:-1">−</button><b>${it.q}</b><button aria-label="Add one ${it.n}" data-a="qty" data-v="${i}:1">+</button></div>
  <b class="small right-min">${money(it.q * it.p)}</b></div>`;

function SaleSheet() {
  const d = U.draft;
  const totals = saleTotals({ items: d.items, disc: d.disc, vat: S.vat });
  return html`${sheetHeader('New sale')}${quickAddChips()}
  ${sectionLabel('Items' + (d.items.length ? ` (${d.items.length})` : ''))}${d.items.map(cartRow)}
  <div class="card pad12"><div class="row gap8">
    <div class="inp sm" style="flex:2.2"><input data-i="U.draft.name" placeholder="Item / service" value="${d.name}" aria-label="Item name"></div>
    <div class="inp sm" style="flex:.8"><input data-i="U.draft.qty" data-n="1" inputmode="numeric" placeholder="Qty" value="${d.qty}" aria-label="Quantity"></div>
    <div class="inp sm" style="flex:1.3"><input data-i="U.draft.price" data-n="1" inputmode="numeric" placeholder="Price" value="${d.price}" aria-label="Price"></div></div>
    <button class="btn soft sm full mt10" data-a="itemAdd">${icon('plus', 17)} Add item</button></div>
  ${sectionLabel('Payment method')}<div class="row gap10">${[['mpesa', 'M-Pesa', 'phone'], ['cash', 'Cash', 'cash']].map(([id, label, ic]) =>
    html`<button class="pay${d.pay === id ? ' on' : ''}" data-a="pay" data-v="${id}">${icon(ic, 18)} ${label}</button>`)}</div>
  ${d.pay === 'mpesa' ? html`<div class="card mt12">
    <p class="small bold">Customer pays to:</p>
    <p class="small">${S.shop.kind || 'Till'} ${S.shop.till || 'not added yet'}</p>
    <p class="small muted">Amount due: ${moneyH(totals.total)}</p>
    <p class="small muted">Ask the customer to send payment, then confirm once received.</p>
  </div>` : ''}
  ${d.pay === 'mpesa' && !S.shop.till ? html`<div class="note amber mt12 small">${icon('info', 18)}<span>Add your Till number so receipts show how to pay. <button class="link green bold" data-a="shop">Add now</button></span></div>` : ''}
  ${sectionLabel('Customer phone (optional)')}${phoneField('U.draft.phone', d.phone)}
  ${sectionLabel('Discount (KSh)')}<div class="inp"><input data-i="U.draft.disc" data-n="1" inputmode="numeric" placeholder="0" value="${d.disc}" aria-label="Discount"></div>
  ${sectionLabel('Notes')}<div class="inp area"><textarea data-i="U.draft.note" rows="2" placeholder="Optional notes…" aria-label="Notes">${d.note}</textarea></div>
  <div class="card mt16" id="sale-totals">${totalsBlock({ items: d.items, disc: d.disc, vat: S.vat })}</div>
  <div class="row gap10 mt16"><button class="btn ghost sm" style="flex:1" data-a="saveDraft">${icon('save', 16)} Save draft</button><button class="btn sm" style="flex:1.4" data-a="sendReceipt">${icon('send', 16)} Send receipt</button></div>`;
}

const SEAL_TEXT = { paid: 'Payment received', pending: 'Awaiting payment', draft: 'Draft receipt', voided: 'Receipt cancelled' };

const correctionButton = (action, label, iconName) => html`<button class="btn quiet-danger sm" style="height:36px;padding:0 12px;border-radius:11px;font-size:12.5px;background:transparent;color:var(--red);box-shadow:inset 0 0 0 1.5px rgba(200,55,45,.24);" data-a="${action}">${icon(iconName, 14)} ${label}</button>`;

function ReceiptSheet() {
  const s = findSale(U.rid);
  if (!s) return html`${sheetHeader('Receipt')}${emptyState('Receipt not found')}`;
  const t = saleTotals(s);
  const pendingBlock = s.pay === 'mpesa'
    ? html`<div class="note amber mt18"><i class="spn"></i><div><b>Awaiting customer payment</b><div class="xs mt4">Customer should pay to ${S.shop.kind || 'Till'} ${S.shop.till || ''}. Confirm only after you receive the money.</div></div></div>
      <button class="btn full mt18" data-a="markPaid">${icon('check', 18)} Confirm payment received</button>`
    : '';
  return html`${sheetHeader('Receipt')}
  <div class="rh"><div class="pattern-layer"></div><i class="weave"></i>${shopLogo(54, 16)}<h2 class="mt10 white-t">${S.shop.name || 'My shop'}</h2><span class="xs op mt2">Official receipt${S.shop.loc ? ' · ' + S.shop.loc : ''}</span></div>
  <div class="seal ${s.status}">${icon(s.status === 'paid' ? 'check' : s.status === 'pending' ? 'hist' : 'doc', 22)}</div>
  <div class="receipt-body"><p class="seal-label ${s.status}" style="${s.status === 'voided' ? 'color:var(--red);' : ''}">${SEAL_TEXT[s.status]}</p>
    <div class="row between rule"><div><div class="xs faint">Receipt #</div><b class="small">${s.id}</b></div><div class="right"><div class="xs faint">Date</div><b class="small">${dayLabel(s.ts)}, ${timeLabel(s.ts)}</b></div></div>
    ${s.items.map((i) => html`<div class="row between mb10"><div><b>${i.n}</b><div class="xs faint">${i.q} × ${money(i.p)}</div></div><b class="serif">${money(i.q * i.p)}</b></div>`)}
    ${totalsBlock(s)}
    <div class="row wrap gap8 mt14"><span class="chip sm static">${icon(s.pay === 'cash' ? 'cash' : 'phone', 14)} Paid via: ${s.pay === 'cash' ? 'Cash' : 'M-Pesa'}</span>
      ${s.phone ? html`<span class="chip sm static">${formatPhone(s.phone)}</span>` : ''}${s.ref ? html`<span class="chip sm static ok-chip">M-Pesa ref ${s.ref}</span>` : ''}</div>
    ${s.note ? html`<p class="small muted mt12">Note: ${s.note}</p>` : ''}
    ${s.status === 'voided' ? html`<div class="stamp" style="border-color:var(--red);color:var(--red);">VOIDED</div>${s.voidReason ? html`<p class="small muted mt12">Reason: ${s.voidReason}</p>` : ''}` : s.status === 'paid' ? html`<div class="stamp">PAID</div>` : ''}
    <p class="small bold center-t mt16 serif">Thank you for your business</p><p class="xs faint center-t">Powered by Risitip</p></div>
  ${U.showQr ? html`<div class="card center-t mt12"><div class="qr-box">${qrSvg(`RISITI ${s.id} | ${S.shop.name} | ${money(t.total)}${S.shop.till ? ` | ${S.shop.kind} ${S.shop.till}` : ''}`)}</div><p class="xs faint mt8">Scan to view receipt details</p></div>` : ''}
  <p class="bold my12 mt18 serif lg">Share receipt</p>
  <div class="share">${[['wa', 'WhatsApp', '#DCF8C6', '#25D366'], ['sms', 'SMS', '#E8F4FD', '#3B82F6'], ['copy', 'Copy', '#EEE9DB', '#6B7280'], ['qr', 'QR code', '#F3E8FF', '#7C3AED']].map(([id, name, bg, fg]) =>
    html`<button data-a="share" data-v="${id}"><span style="background:${bg}">${icon(id, 22, fg)}</span>${name}</button>`)}</div>
  ${s.status === 'pending' ? html`${pendingBlock}<div class="row between mt14"><span class="xs muted">Made a mistake?</span>${correctionButton('cancelReceipt', 'Cancel receipt', 'x')}</div>` : ''}
  ${s.status === 'draft' ? html`<button class="btn full mt18" data-a="finalise">${icon('send', 18)} Finalise &amp; send</button><div class="row between mt12"><span class="xs muted">Made a mistake?</span>${correctionButton('cancelReceipt', 'Cancel receipt', 'x')}</div>` : ''}
  ${s.status === 'paid' ? html`<div class="row between mt18"><span class="xs muted">Need to correct this receipt?</span>${correctionButton('voidReceipt', 'Void &amp; correct', 'trash')}</div>` : ''}
  <button class="btn ghost full mt12" data-a="close">Done</button>`;
}

function StockSheet() {
  const low = lowStock().length;
  return html`${sheetHeader('Products & stock')}
  <div class="note ${low ? 'red' : 'mint'} mb14 small">${icon(low ? 'warn' : 'check', 18)}<span>${low ? `${low} item${low > 1 ? 's need' : ' needs'} restocking` : 'Tap "Track stock" on any item to get low-stock alerts'}</span></div>
  ${productEditor()}<button class="btn full mt16" data-a="close">Done</button>`;
}

function ShopSheet() {
  const h = U.shopEdit;
  return html`${sheetHeader('Shop details')}
  <div class="row gap14 mb6"><button data-a="logo2" aria-label="Change logo">${shopLogo(64, 18)}</button><button class="btn soft sm" data-a="logo2">${icon('image', 16)} Change logo</button></div>
  ${sectionLabel('Shop name')}<div class="inp"><input data-i="U.shopEdit.name" value="${h.name}" placeholder="Shop name" aria-label="Shop name"></div>
  ${sectionLabel('Location (optional)')}<div class="inp"><input data-i="U.shopEdit.loc" value="${h.loc}" placeholder="e.g. Kiambu" aria-label="Location"></div>
  ${sectionLabel('M-Pesa type')}${segmented('shopKind', h.kind)}
  ${sectionLabel(`M-Pesa ${h.kind} number`)}<div class="inp"><input data-i="U.shopEdit.till" data-n="1" data-focus="${h.focusTill ? 1 : ''}" inputmode="numeric" maxlength="7" value="${h.till}" placeholder="e.g. 543210" aria-label="M-Pesa number"></div>
  ${errorBox()}<button class="btn full mt20" data-a="shopSave">${icon('check', 18)} Save changes</button>`;
}

function SummarySheet() {
  const d = daySummary();
  const cell = (label, value) => html`<div class="stat"><span class="eyebrow-d tight">${label}</span><b class="block">${moneyH(value)}</b></div>`;
  return html`${sheetHeader('Daily summary')}
  <div class="hero-card sum"><div class="pattern-layer"></div><i class="weave"></i><span class="eyebrow-g">${longDate(d.day)}</span><b class="bigger gold-t block mt6">${moneyH(d.revenue)}</b><span class="xs on-dark">${d.count} receipt${d.count === 1 ? '' : 's'} · paid sales</span></div>
  <div class="row gap10 mt12">${cell('M-Pesa', d.mpesa)}${cell('Cash', d.cash)}</div>
  ${d.pendingCount ? html`<div class="note amber mt12 small">${icon('hist', 18)}<span>${money(d.pending)} still pending (${d.pendingCount} payment${d.pendingCount > 1 ? 's' : ''})</span></div>` : ''}
  <div class="card mt12 row gap12">${iconTile('chart')}<div class="grow"><span class="eyebrow-d tight">Top seller today</span><b class="block">${d.top ? `${d.top.name} · ${d.top.qty} sold` : 'No sales yet'}</b></div></div>
  ${d.low.length ? html`<div class="card"><b class="small block mb8">Restock soon</b>${d.low.map((p) => html`<div class="row between small"><span>${p.n}</span><b class="low-t">${p.stock <= 0 ? 'Out' : p.stock + ' left'}</b></div>`)}</div>` : ''}
  <button class="btn wa full mt18" data-a="summaryShare">${icon('wa', 18, '#fff')} Share on WhatsApp</button>
  <button class="btn ghost full mt10" data-a="summaryCopy">${icon('copy', 18)} Copy summary</button>`;
}

function exportRangeList() {
  const e = U.export || { range: 'This month', from: '', to: '' };
  let list = [...S.sales];
  if (e.range === 'Custom') {
    const from = e.from ? new Date(e.from + 'T00:00:00').getTime() : 0;
    const to = e.to ? new Date(e.to + 'T23:59:59').getTime() : Infinity;
    list = list.filter((s) => s.ts >= from && s.ts <= to);
  } else list = list.filter((s) => inPeriod(s.ts, e.range));
  return list.sort((a, b) => a.ts - b.ts);
}

function ExportSheet() {
  const e = U.export || { type: 'sales', range: 'This month', from: '', to: '' };
  const list = exportRangeList(), active = list.filter((s) => s.status !== 'voided');
  const total = active.reduce((a, s) => a + saleTotals(s).total, 0);
  const types = [
    ['sales', 'Sales report', 'Every receipt, item by item'],
    ['summary', 'Daily summary', 'Revenue by day'],
    ['stock', 'Products & stock', 'Sales and current stock'],
    ['customers', 'Customers', 'Spending by phone number'],
    ['backup', 'Full backup', 'All shop data as JSON'],
  ];
  const ranges = ['Today', 'This week', 'This month', 'Custom'];
  const preview = e.type === 'stock'
    ? `${S.products.length} product${S.products.length === 1 ? '' : 's'}`
    : e.type === 'customers'
      ? `${new Set(active.filter((s) => s.phone).map((s) => s.phone)).size} customer${new Set(active.filter((s) => s.phone).map((s) => s.phone)).size === 1 ? '' : 's'}`
      : e.type === 'backup'
        ? `${S.sales.length} receipt${S.sales.length === 1 ? '' : 's'} · ${S.products.length} product${S.products.length === 1 ? '' : 's'}`
        : `${active.length} receipt${active.length === 1 ? '' : 's'} · ${moneyH(total)}`;
  return html`${sheetHeader('Export data')}
  ${sectionLabel('What to export')}<div class="row wrap gap8">${types.map(([id, label, sub]) =>
    html`<button class="chip${e.type === id ? ' on' : ''}" data-a="exportType" data-v="${id}">${label}</button>`)}</div>
  <p class="xs muted mt6">${(types.find((t) => t[0] === e.type) || types[0])[2]}</p>
  ${sectionLabel('Period')}<div class="row gap8 scroll-x">${ranges.map((r) =>
    html`<button class="chip${e.range === r ? ' on' : ''}" data-a="exportRange" data-v="${r}">${r}</button>`)}</div>
  ${e.range === 'Custom' ? html`<div class="row gap8 mt10">
    <div class="inp sm" style="flex:1"><input type="date" data-i="U.export.from" value="${e.from}" aria-label="Start date"></div>
    <div class="inp sm" style="flex:1"><input type="date" data-i="U.export.to" value="${e.to}" aria-label="End date"></div></div>` : ''}
  <div class="card mt14 row between"><div><span class="eyebrow-d tight">Ready to export</span><b class="block">${preview}</b></div>
    <span class="chip sm static mint">Works offline</span></div>
  <button class="btn full mt16" data-a="exportRun">${icon('download', 18)} Export ${e.type === 'backup' ? 'backup' : 'CSV'}</button>
  <p class="xs faint center-t mt10">Your file saves to this device. No data is uploaded.</p>`;
}

const SHEETS = { sale: SaleSheet, receipt: ReceiptSheet, stock: StockSheet, shop: ShopSheet, summary: SummarySheet, export: ExportSheet };
const Sheet = () => html`<div class="ov" data-a="overlay"><div class="sheet${U.sheetIn ? ' up' : ''}" role="dialog" aria-modal="true">${SHEETS[U.sheet]()}</div></div>`;
