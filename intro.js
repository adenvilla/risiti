/** Risiti - optional "How it works" tour (story-style progress bars). */

const demoRows = (rows) => rows.map(([name, amount], i) =>
  html`<div class="r-line" style="animation-delay:${0.25 + i * 0.18}s"><span>${name}</span><b>${money(amount)}</b></div>`);

const SLIDES = [
  {
    bg: 'linear-gradient(160deg,#245443 0%,#0b1f17 75%)', orbs: ['#34d399', '#C9A24B'], tag: 'Instant receipts',
    title: html`Send <em>pro receipts</em> in seconds`, text: 'Build a sale in a few taps and share it on WhatsApp, SMS or QR.',
    visual: () => html`<div class="stage">
      <div class="paper float">
        <div class="paper-head">${brandLogo(34)}<div><b>Mama Njeri Store</b><span class="xs muted block">Official receipt</span></div></div>
        ${demoRows([['Maize flour × 2', 280], ['Cooking oil 1L', 320], ['Sugar × 2', 380], ['Bread', 70]])}
        <div class="r-total"><span>Total</span><b>KSh 1,050</b></div>
      </div>
      <span class="float-chip c1" style="background:#25D366">${icon('wa', 18, '#fff')} Sent on WhatsApp</span>
      <span class="float-chip c2" style="background:#3B82F6">${icon('sms', 18, '#fff')} SMS</span>
    </div>`,
  },
  {
    bg: 'linear-gradient(160deg,#0e3a57 0%,#071e2e 72%)', orbs: ['#38bdf8', '#34d399'], tag: 'M-Pesa payments',
    title: html`Get paid the <em>M-Pesa way</em>`, text: 'Send an STK push to the customer and watch the sale turn Paid, with the M-Pesa reference.',
    visual: () => html`<div class="stage">
      <div class="ring r1"></div><div class="ring r2"></div>
      <div class="notif float"><div class="row gap8"><span class="mp">M-PESA</span><span class="xs">now</span></div>
        <b class="block mt6">SK3L9QX2MA Confirmed</b>
        <span class="xs block mt6">KSh 2,000.00 received from JOHN KAMAU 0711 188 464 for Till 455484.</span></div>
      <div class="qrcard float-slow">${qrSvg('Pay KSh 2,000 to Till 455484 - Mama Njeri Store')}<span class="xs">Scan to pay</span></div>
    </div>`,
  },
  {
    bg: 'linear-gradient(160deg,#5b3a0a 0%,#25190a 72%)', orbs: ['#f59e0b', '#fb7185'], tag: 'Smart stock',
    title: html`Never <em>run out</em> of what sells`, text: 'Stock drops with every sale. Low-stock alerts tell you what to buy before customers ask.',
    visual: () => html`<div class="stage">
      <div class="glass float">
        ${[['Maize flour 2kg', 24, 100, 'ok'], ['Milk 500ml', 18, 78, 'ok'], ['Sugar 1kg', 4, 20, 'low'], ['Bread', 2, 10, 'low']].map(([n, left, pct, st], i) =>
          html`<div class="s-row" style="animation-delay:${0.2 + i * 0.15}s"><div class="row between small"><span>${n}</span><b class="${st === 'low' ? 'low-t' : ''}">${left} left</b></div>
          <div class="sbar dark ${st}"><i style="width:${pct}%"></i></div></div>`)}
        <div class="alert-pill">${icon('warn', 16)} 2 items need restocking</div>
      </div>
    </div>`,
  },
  {
    bg: 'linear-gradient(160deg,#3b1f5e 0%,#160a2a 72%)', orbs: ['#a78bfa', '#C9A24B'], tag: 'Daily insights',
    title: html`Know your <em>numbers</em> every evening`, text: 'See sales, M-Pesa vs cash and your top seller, then send the summary to WhatsApp in one tap.',
    visual: () => html`<div class="stage">
      <div class="glass float">
        <span class="small op">Today's sales</span><b class="bigger block">${moneyH(4830)}</b>
        <div class="bars">${[35, 55, 40, 80, 60, 95, 70].map((h, i) => html`<i style="height:${h}%;animation-delay:${i * 0.08}s;background:${i === 5 ? '#E6C877' : '#ffffff55'}"></i>`)}</div>
      </div>
      <div class="bubble float-slow"><b>Daily summary</b><span class="xs block mt6">Sales KSh 4,830 · M-Pesa KSh 3,610 · Cash KSh 1,220</span><span class="xs block">Top seller: Bread</span></div>
    </div>`,
  },
];

const orb = (color, i) => html`<span class="orb o${i}" style="background:${color}"></span>`;

function Tour() {
  const s = SLIDES[U.slide], last = U.slide === SLIDES.length - 1;
  return html`<div class="screen intro" style="background:${s.bg}">
    ${s.orbs.map(orb)}<div class="pattern-layer"></div>
    <div class="stories" aria-hidden="true">${SLIDES.map((_, i) => html`<i class="${i < U.slide ? 'done' : i === U.slide ? 'on' : ''}"></i>`)}</div>
    <div class="row between intro-top"><div class="row gap10">${brandLogo(38)}<b class="wordmark">Risiti</b></div><button class="chip ghost-w" data-a="back" data-v="welcome">Close</button></div>
    <div class="visual">${s.visual()}</div>
    <div class="copy">
      <span class="eyebrow">${s.tag}</span>
      <h1 class="hero-h">${s.title}</h1>
      <p class="lead">${s.text}</p>
      <div class="row between mt18">
        <div class="row gap6">${SLIDES.map((_, i) => html`<button class="dot${i === U.slide ? ' on' : ''}" aria-label="Go to slide ${i + 1}" data-a="goSlide" data-v="${i}"></button>`)}</div>
        <button class="btn light" data-a="next">${last ? 'Get started' : 'Next'} ${icon(last ? 'check' : 'arrow', 18)}</button>
      </div>
    </div>
  </div>`;
}
