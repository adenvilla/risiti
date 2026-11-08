/** Risiti enrollment: welcome, demo phone verification, guided shop setup, payment setup, and first sale. */
const WELCOME_POINTS = [
  ['wa', 'Receipts worth sharing', 'Send receipts on WhatsApp or SMS'],
  ['phone', 'Payments kept clear', 'Track paid and pending sales'],
  ['box', 'Stock at a glance', 'Know what needs restocking'],
];
const SETUP_STEPS=['Phone','Shop details','Ready to sell'];
const setupProgress=step=>html`<div class="setup-progress" aria-label="Setup progress">${SETUP_STEPS.map((label,i)=>html`<div class="setup-step${i<step?' done':i===step?' on':''}"><span>${i<step?icon('check',12):i+1}</span><small>${label}</small></div>`)}</div>`;
const WelcomeScreen = () => html`<div class="screen welcome rw-welcome">
  <style>
  .rw-welcome{padding:24px 24px calc(24px + var(--safe-b));background:linear-gradient(155deg,#245443 0%,#17382D 50%,#0b2119 100%);color:#FFFCF6;overflow-y:auto;gap:22px}
  .rw-welcome .rw-header{display:flex;align-items:center;gap:11px;flex:none}.rw-welcome .rw-brand{font-family:var(--serif);font-size:25px;font-weight:600}.rw-welcome .rw-tagline{display:block;font-size:10px;letter-spacing:1.4px;color:#d6e0d6;margin-top:2px;text-transform:uppercase}
  .rw-welcome .rw-body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:22px;min-height:min-content}.rw-welcome .rw-eyebrow{font-size:10px;font-weight:700;letter-spacing:2px;color:#E6C877}.rw-welcome .rw-title{font-size:43px;line-height:1.08;letter-spacing:-1px;margin:12px 0 14px;font-weight:600}.rw-welcome .rw-title em{color:#E6C877;font-weight:500}.rw-welcome .rw-description{font-size:14px;line-height:1.65;color:#dae5dc;max-width:310px}
  .rw-welcome .rw-preview{border:1px solid #E6C87738;border-radius:22px;background:#ffffff08;padding:12px}.rw-welcome .rw-preview-label{display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#d6e0d6;padding:1px 3px 11px}.rw-welcome .rw-receipt{background:#FFFCF6;border-radius:13px;padding:17px;color:#17382D}.rw-welcome .rw-shop{font-family:var(--serif);font-size:17px}.rw-welcome .rw-caption{font-size:10px;color:#68766c;margin-top:3px}.rw-welcome .rw-line{display:flex;justify-content:space-between;gap:12px;font-size:12px;line-height:1.5;margin-top:9px}.rw-welcome .rw-rule{border-top:1px dashed #d9d1bf;margin:12px 0}.rw-welcome .rw-total{display:flex;align-items:center;justify-content:space-between;font-size:12px}.rw-welcome .rw-total b{font-family:var(--serif);font-size:24px}.rw-welcome .rw-share{display:flex;align-items:center;gap:7px;font-size:11px;color:#dae5dc;padding:11px 3px 1px}
  .rw-welcome .rw-benefits{display:flex;flex-direction:column;gap:11px}.rw-welcome .rw-benefit{display:flex;align-items:center;gap:11px}.rw-welcome .rw-benefit-icon{width:30px;height:30px;border:1px solid #E6C87735;background:#ffffff08;border-radius:9px;display:grid;place-items:center;flex:none;color:#E6C877}.rw-welcome .rw-benefit b{display:block;font-size:12px;font-weight:600}.rw-welcome .rw-benefit small{display:block;font-size:11px;color:#c6d5c9;line-height:1.5;margin-top:1px}
  .rw-welcome .rw-footer{flex:none}.rw-welcome .rw-start{width:100%;min-height:52px;padding:12px 18px;border-radius:15px;background:#E6C877;color:#17382D;font-weight:700;font-size:15px;display:flex;justify-content:center;align-items:center;gap:10px}.rw-welcome .rw-links{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px}.rw-welcome .rw-links button{min-height:44px;color:#E8EEE2;font-size:12px;text-decoration:underline;text-underline-offset:4px;text-decoration-color:#ffffff50}.rw-welcome .rw-note{text-align:center;font-size:10px;color:#bdcfc2;margin-top:3px;line-height:1.5}
  @media(max-height:740px){.rw-welcome{padding-top:18px;gap:15px}.rw-welcome .rw-body{gap:16px}.rw-welcome .rw-title{font-size:35px;margin:8px 0 10px}.rw-welcome .rw-description{font-size:13px}.rw-welcome .rw-receipt{padding:13px}.rw-welcome .rw-benefits{gap:8px}}
  </style>
  <header class="rw-header">${brandLogo(46)}<div><b class="rw-brand">Risiti</b><span class="rw-tagline">Smart receipts</span></div></header>
  <div class="rw-body"><div><span class="rw-eyebrow">FOR YOUR EVERYDAY BIASHARA</span><h1 class="rw-title">Every sale.<br><em>Recorded.</em></h1><p class="rw-description">Professional receipts. Clear payments. Stock you can keep track of — all in one simple app.</p></div>
    <div class="rw-preview"><div class="rw-preview-label"><span>A little clarity for every sale</span><span>Example</span></div><div class="rw-receipt"><b class="rw-shop">Mama Njeri Store</b><p class="rw-caption">Digital receipt · Example</p><div class="rw-rule"></div><div class="rw-line"><span>Maize flour × 2</span><b>${money(280)}</b></div><div class="rw-line"><span>Cooking oil 1L</span><b>${money(320)}</b></div><div class="rw-rule"></div><div class="rw-total"><span>Total</span><b>${money(600)}</b></div></div><div class="rw-share">${icon('wa',15)} Ready to share on WhatsApp</div></div>
    <div class="rw-benefits">${WELCOME_POINTS.map(([ic,title,sub])=>html`<div class="rw-benefit"><span class="rw-benefit-icon">${icon(ic,16)}</span><div><b>${title}</b><small>${sub}</small></div></div>`)}</div>
  </div>
  <div class="rw-footer"><button class="rw-start" data-a="start">Get started ${icon('arrow',18)}</button><div class="rw-links"><button data-a="tour">See how it works</button><button data-a="demo">Try demo shop</button></div><p class="rw-note">Demo shop uses sample data. You can start your real shop later.</p></div>
</div>`;

const otpBoxes = () => Array.from({ length: OTP_LENGTH }, (_, i) =>
  html`<div class="ob${U.otp[i] ? ' f' : ''}${U.otp.length === OTP_LENGTH ? ' ok' : ''}${i === U.otp.length ? ' c' : ''}">${U.otp[i] ? '•' : ''}</div>`);

function AuthScreen() {
  const sent = U.otpSent;
  return html`<div class="screen bg-soft">
    <div class="hero-top compact"><div class="pattern-layer"></div><button class="iconbtn abs-tl" aria-label="Back" data-a="back" data-v="welcome"><span class="flip">${icon('chev', 18)}</span></button>${brandLogo(72)}<h1 class="brand">Risiti</h1></div>
    <div class="scroll pt0"><div class="card pad24 rise">${setupProgress(sent?1:0)}
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
  const { name, cat, loc } = U.setup, type = SHOP_TYPES[cat];
  return html`<div class="screen"><div class="scroll pb140">
    ${setupProgress(1)}
    <h1 class="mt12">Name your shop</h1><p class="muted small mt4 lh">This appears at the top of every receipt.</p>
    <div class="preview"><div class="pattern-layer"></div>${brandLogo(46)}<div><b id="preview-name" class="block">${name.trim() || 'Your shop name'}</b><span class="xs op block">Official receipt · ${cat}${loc?` · ${loc}`:''}</span></div></div>
    ${sectionLabel('Shop name')}<div class="inp">${icon('shop', 18, '#9CA3AF')}<input data-i="U.setup.name" data-focus="1" data-live="preview-name" placeholder="e.g. Mama Njeri Store" value="${name}" aria-label="Shop name" maxlength="40"></div>${errorBox()}
    ${sectionLabel('What do you sell?')}<div class="cat-grid">${SHOP_CATEGORIES.map((c) => html`<button class="cat${cat === c ? ' on' : ''}" data-a="pickCategory" data-v="${c}"><span>${SHOP_TYPES[c].emoji}</span>${c}</button>`)}</div>
    ${sectionLabel('Shop location')}<div class="inp">${icon('pin', 18, '#9CA3AF')}<input data-i="U.setup.loc" placeholder="Optional — e.g. Kiambu" value="${loc||''}" aria-label="Shop location" maxlength="50"></div>
    <p class="xs muted mt14 lh">We'll add ${type.starter.length} popular items (${type.starter.slice(0, 3).map(([n]) => n).join(', ')}…) so you can sell right away. Change them anytime.</p>
  </div><div class="ft"><button class="btn foil full" data-a="shopContinue"><span>${icon('bolt', 18)} Continue</span></button></div></div>`;
}

function PaymentSetup(){
  const h=U.shopEdit||{};
  return html`<div class="screen"><div class="scroll pb140">${setupProgress(2)}
  <h1 class="mt12">How can customers pay you?</h1><p class="muted small mt4 lh">Add your Till or Paybill now, or skip and add it later in Settings.</p>
  ${sectionLabel('Payment type')}<div class="cat-grid">${['Till','Paybill'].map(kind=>html`<button class="cat${h.kind===kind?' on':''}" data-a="shopKind" data-v="${kind}"><span>${kind==='Till'?'🏪':'🏦'}</span>${kind}</button>`)}</div>
  ${sectionLabel(h.kind==='Paybill'?'Paybill number':'Till number')}<div class="inp">${icon('cash',18,'#9CA3AF')}<input data-i="U.shopEdit.till" data-n="1" inputmode="numeric" placeholder="e.g. 455484" value="${h.till||''}" aria-label="Till or Paybill number" maxlength="7"></div>
  <p class="xs muted mt14">This helps customers pay you easily. You can change it anytime in Settings.</p>
  </div><div class="ft"><div class="row gap10"><button class="btn ghost full" data-a="skipPayment">Skip for now</button><button class="btn foil full" data-a="finishSetup"><span>${icon('check',18)} Finish setup</span></button></div></div></div>`;
}

function FirstSaleGuide(){
  return html`<div class="screen"><div class="scroll pb140">${setupProgress(3)}
  <h1 class="mt12">You're ready to sell</h1><p class="muted small mt4 lh">Your shop is set up. Make your first receipt in under a minute.</p>
  <div class="card pad20"><b class="block">Make your first sale</b><p class="small muted mt6 lh">Choose an item, add the customer phone number if you want, then send or save the receipt.</p></div>
  <div class="card pad20 mt14"><b class="block">Using demo data?</b><p class="small muted mt6 lh">You can explore sample sales first. When you are ready, reset to a real, empty shop.</p><button class="btn sm mt12" data-a="resetDemo">Start with an empty shop</button></div>
  </div><div class="ft"><button class="btn foil full" data-a="newSale"><span>${icon('plus',18)} Make your first sale</span></button></div></div>`;
}
