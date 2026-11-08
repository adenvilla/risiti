/** Risiti - small reusable view fragments. Every function returns Raw HTML via html``. */

const brandLogo = (size = 56) => html`<img class="logo" src="assets/logo.png" width="${size}" height="${size}" alt="Risiti" style="border-radius:${Math.round(size * 0.24)}px">`;
const shopLogo = (size = 56, radius = Math.round(size * 0.28)) => S.logo
  ? html`<img class="logo" src="${S.logo}" width="${size}" height="${size}" alt="Shop logo" style="border-radius:${radius}px;object-fit:cover">`
  : brandLogo(size);

const iconTile = (name, size = 20) => html`<span class="ico">${icon(name, size)}</span>`;
const emptyState = (msg, cta) => html`<div class="empty"><span class="empty-ico">${icon('rec', 30)}</span><p class="small">${msg}</p>${cta || ''}</div>`;
const sheetHeader = (title) => html`<div class="grab"></div><div class="sheet-head"><button class="iconbtn" aria-label="Close" data-a="close">${icon('x', 18)}</button><h2>${title}</h2><span class="spacer"></span></div>`;
const sectionLabel = (text) => html`<div class="lb">${text}</div>`;
const errorBox = () => (U.err ? html`<div class="err" role="alert">${icon('info', 15)} ${U.err}</div>` : '');
const segmented = (action, current) => html`<div class="seg" role="tablist">${['Till', 'Paybill'].map((k) => html`<button role="tab" aria-selected="${current === k}" class="${current === k ? 'on' : ''}" data-a="${action}" data-v="${k}">${k}</button>`)}</div>`;
const phoneField = (path, value, extra = '') => html`<div class="row"><div class="inp prefix">🇰🇪 +254</div>
  <div class="inp suffix grow"><input data-i="${path}" ${raw(extra)} data-n="1" inputmode="numeric" maxlength="10" placeholder="712 345 678" value="${value}" aria-label="Phone number"></div></div>`;

const STATUS = { paid: ['Paid', '#1F7A4D'], pending: ['Pending', '#A9741A'], draft: ['Draft', '#8B95A1'] };

const saleRow = (s) => {
  const [label, color] = STATUS[s.status];
  return html`<button class="card row item" data-a="openSale" data-v="${s.id}">
    ${iconTile(s.pay === 'cash' ? 'cash' : 'phone')}
    <span class="grow"><b class="ell block title">${itemsLabel(s)}</b><span class="xs faint ell block">${timeLabel(s.ts)} · ${formatPhone(s.phone)}</span></span>
    <span class="right"><b class="block amt">${money(saleTotals(s).total)}</b><span class="tag" style="color:${color};background:${color}14">${label}</span></span>
  </button>`;
};

const totalsBlock = (sale) => {
  const t = saleTotals(sale);
  return html`<div class="row between small muted"><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc ? html`<div class="row between small muted mt6"><span>Discount</span><span>- ${money(t.disc)}</span></div>` : ''}
    ${sale.vat ? html`<div class="row between small muted mt6"><span>VAT 16%</span><span>${money(t.vat)}</span></div>` : ''}
    <div class="row between grand"><b>Total</b><b>${moneyH(t.total)}</b></div>`;
};

/* ---------- Products & stock ---------- */
const STOCK_LABEL = { ok: 'In stock', low: 'Low stock', out: 'Out of stock', untracked: 'Stock not tracked' };

const stockBar = (p) => {
  const st = stockState(p);
  const pct = p.stock == null ? 0 : Math.min(100, Math.round((p.stock / (p.low * 4)) * 100));
  return html`<div class="sbar ${st}"><i style="width:${pct}%"></i></div>
    <span class="xs stock-${st}">${STOCK_LABEL[st]}${p.stock != null && st !== 'out' ? ` · ${p.stock} left` : ''}</span>`;
};

const productRow = (p) => html`<div class="card prod">
  <div class="grow"><b class="small ell block">${p.n}</b><span class="xs muted">${money(p.p)}</span>${stockBar(p)}</div>
  ${p.stock == null
    ? html`<button class="chip tiny" data-a="trackStock" data-v="${p.id}">Track stock</button>`
    : html`<div class="col gap6"><div class="stepper"><button aria-label="Decrease stock of ${p.n}" data-a="stockAdj" data-v="${p.id}:-1">−</button><b>${p.stock}</b><button aria-label="Increase stock of ${p.n}" data-a="stockAdj" data-v="${p.id}:1">+</button></div>
      <button class="chip tiny" data-a="stockAdj" data-v="${p.id}:10">+10</button></div>`}
  <button class="iconbtn" aria-label="Remove ${p.n}" data-a="prodDel" data-v="${p.id}">${icon('trash', 17)}</button>
</div>`;

const addProductForm = () => html`<div class="row gap8 mt6">
    <div class="inp" style="flex:2"><input data-i="U.newProd.n" placeholder="Product name" value="${U.newProd.n}" aria-label="Product name"></div>
    <div class="inp" style="flex:1.1"><input data-i="U.newProd.p" data-n="1" inputmode="numeric" placeholder="Price" value="${U.newProd.p}" aria-label="Price"></div>
    <div class="inp" style="flex:1"><input data-i="U.newProd.s" data-n="1" inputmode="numeric" placeholder="Stock" value="${U.newProd.s}" aria-label="Opening stock"></div>
  </div>
  <button class="btn soft sm full mt10" data-a="prodAdd">${icon('plus', 18)} Add product</button>
  <p class="xs faint mt6">Leave stock empty for items you don't count, like services or airtime.</p>`;

const productEditor = () => html`${S.products.map(productRow)}
  ${S.products.length < MAX_PRODUCTS ? addProductForm() : html`<p class="xs muted">Maximum of ${MAX_PRODUCTS} products reached</p>`}`;
