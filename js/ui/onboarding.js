/**
 * Risiti - enrollment in three screens:
 *   1. Welcome  2. Phone + auto-verified code  3. Shop name + type.
 * Everything else (Till, logo, products) lives in the Home checklist.
 */

const WELCOME_POINTS = [
  ['wa', 'Receipts on WhatsApp', 'Send a professional receipt in seconds'],
  ['phone', 'Get paid with M-Pesa', 'STK push and payment confirmation'],
  ['box', 'Stock and daily sales', 'Know what to restock every evening'],
];

const WelcomeScreen = () => html`<div class="screen welcome">
  <span class="orb o0" style="background:#34d399"></span><span class="orb o1" style="background:#C9A24B"></span><div class="pattern-layer"></div><i class="frame-line"></i>
  <div class="w-top">${brandLogo(104)}<h1 class="w-brand">Risiti</h1><span class="w-sub">Smart receipts for every shop</span></div>
  <div class="w-mid">
    <h2 class="w-title">Receipts, M-Pesa and stock — <em>in one simple app</em></h2>
    <div class="w-list">${WELCOME_POINTS.map(([ic, title, sub], i) => html`<div class="w-item" style="animation-delay:${0.15 + i * 0.12}s"><span class="w-ico">${icon(ic, 20)}</span><div><b>${title}</b><span class="xs block">${sub}</span></div></div>`)}</div>
  </div>
  <div class="w-bottom">
    <span class="timer-chip">${icon('bolt', 14)} Set up in under 60 seconds</span>
    <button class="btn foil full mt14" data-a="start"><span>Get started</span> ${icon('arrow', 18)}</button>
    <div class="row center gap14 mt14 small"><button class="w-link" data-a="tour">See how it works</button><i class="sep"></i><button class="w-link" data-a="demo">Try demo shop</button></div>
  </div></div>`;

const otpBoxes = () => Array.from({ length: OTP_LENGTH }, (_, i) =>
  html`<div class="ob${U.otp[i] ? ' f' : ''}${U.otp.length === OTP_LENGTH ? ' ok' : ''}${i === U.otp.length ? ' c' : ''}">${U.otp[i] ? '•' : ''}</div>`);

function AuthScreen() {
  const sent = U.otpSent;
  return html`<div class="screen bg-soft">
    <div class="hero-top compact"><div class="pattern-layer"></div><button class="iconbtn abs-tl" aria-label="Back" data-a="back" data-v="welcome"><span class="flip">${icon('chev', 18)}</span></button>${brandLogo(72)}<h1 class="brand">Risiti</h1></div>
    <div class="scroll pt0"><div class="card pad24 rise">
      ${sent ? html`
        <h2 class="h-green">Enter the 6-digit code</h2>
        <p class="muted small mt6 lh">Sent to <b class="ink">+254 ${U.phone}</b> · <button class="link green bold" data-a="editNumber">Change</button></p>
        <label class="otp-wrap" for="otp-input"><div id="otp-boxes" class="row center gap8" aria-live="polite">${otpBoxes()}</div>
          <input id="otp-input" class="otp-input" data-i="U.otp" data-n="1" data-focus="1" inputmode="numeric" autocomplete="one-time-code" maxlength="${OTP_LENGTH}" value="${U.otp}" aria-label="One-time code"></label>
        <p class="otp-status small center-t" id="otp-status">${U.otp.length === OTP_LENGTH ? html`${icon('check', 15)} Verifying…` : html`<i class="spn sm"></i> Reading your SMS automatically…`}</p>
        <p class="small muted center-t mt14">Didn't get it? <button id="resend" class="link amber" data-a="resend">${U.cd > 0 ? 'Resend in 0:' + String(U.cd).padStart(2, '0') : 'Resend code'}</button></p>
        <p class="xs faint center-t mt6">Demo mode — the code fills in by itself.</p>`
      : html`
        <h2 class="h-green">What's your phone number?</h2>
        <p class="muted small mt6 lh">We'll text you a code. No password to remember.</p>
        ${sectionLabel('Phone number')}${phoneField('U.phone', U.phone, 'data-focus="1" data-enter="sendOtp"')}${errorBox()}
        <button class="btn full mt20" data-a="sendOtp">Continue ${icon('arrow', 18)}</button>
        <p class="xs faint center-t mt16">New here? We'll create your shop next. By continuing you agree to our <b>Terms</b> &amp; <b>Privacy Policy</b>.</p>`}
    </div></div></div>`;
}

function SetupShop() {
  const { name, cat } = U.setup, type = SHOP_TYPES[cat];
  return html`<div class="screen"><div class="scroll pb140">
    <p class="step-chip">${icon('check', 14)} Phone verified · last step</p>
    <h1 class="mt12">Name your shop</h1><p class="muted small mt4 lh">This appears at the top of every receipt.</p>
    <div class="preview"><div class="pattern-layer"></div>${brandLogo(46)}<div><b id="preview-name" class="block">${name.trim() || 'Your shop name'}</b><span class="xs op block">Official receipt · ${cat}</span></div></div>
    ${sectionLabel('Shop name')}<div class="inp">${icon('shop', 18, '#9CA3AF')}<input data-i="U.setup.name" data-focus="1" data-enter="shopFinish" data-live="preview-name" placeholder="e.g. Mama Njeri Store" value="${name}" aria-label="Shop name" maxlength="40"></div>${errorBox()}
    ${sectionLabel('What do you sell?')}<div class="cat-grid">${SHOP_CATEGORIES.map((c) => html`<button class="cat${cat === c ? ' on' : ''}" data-a="pickCategory" data-v="${c}"><span>${SHOP_TYPES[c].emoji}</span>${c}</button>`)}</div>
    <p class="xs muted mt14 lh">We'll add ${type.starter.length} popular items (${type.starter.slice(0, 3).map(([n]) => n).join(', ')}…) so you can sell right away. Change them anytime.</p>
  </div><div class="ft"><button class="btn foil full" data-a="shopFinish"><span>${icon('bolt', 18)} Start selling</span></button></div></div>`;
}
