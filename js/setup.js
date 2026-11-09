/** Complete local-store onboarding. SMS remains simulated, not production authentication. */
(function(){
  const progress=n=>html`<p class="xs muted mb14">Store setup · Step ${n} of 5</p>`;
  const originalAuth=SCREENS.auth;
  SCREENS.auth=()=>raw(originalAuth().s.replace('<div class="card pad24 rise">','<div class="card pad24 rise"><p class="note amber small mb14">Prototype verification: no SMS is sent. The demo code is 123456. Store data is saved only in this browser.</p>'));
  drawOtp=function(){const box=$('#otp-boxes'),status=$('#otp-status');if(box)box.innerHTML=renderValue(otpBoxes());if(status)status.textContent=U.otp.length===OTP_LENGTH?'Checking demo code…':'Demo code fills automatically; no SMS is sent.'};
  SCREENS.shop=()=>html`<div class="screen"><div class="scroll">${progress(2)}<h1>Create your store</h1><p class="small muted mt6">These details appear on your receipts.</p>${sectionLabel('Store name')}<div class="inp"><input data-i="U.setup.name" maxlength="40" value="${U.setup.name}" placeholder="e.g. Mama Njeri Store" aria-label="Store name"></div>${sectionLabel('Business category')}<div class="cat-grid">${SHOP_CATEGORIES.map(c=>html`<button class="cat${U.setup.cat===c?' on':''}" data-a="pickCategory" data-v="${c}">${c}</button>`)}</div>${sectionLabel('Location (optional)')}<div class="inp"><input data-i="U.setup.loc" maxlength="50" value="${U.setup.loc||''}" placeholder="e.g. Kiambu" aria-label="Store location"></div>${errorBox()}<button class="btn full mt20" data-a="shopContinue">Continue to payments ${icon('arrow',18)}</button></div></div>`;
  SCREENS.products=()=>html`<div class="screen"><div class="scroll">${progress(4)}<h1>Add your products</h1><p class="small muted mt6 mb14">Add your own items and prices. Opening stock is optional. No sample sales or customers are added.</p>${productEditor()}<p class="xs muted mt14">You can add more products later in Products &amp; stock.</p><button class="btn full mt20" data-a="completeStore">${S.products.length?'Finish creating store':'Finish with no products'}</button><button class="btn ghost full mt12" data-a="setupPaymentBack">Back to payment details</button></div></div>`;
  SCREENS.ready=()=>html`<div class="screen"><div class="scroll">${progress(5)}<h1>Your store is ready</h1><div class="card mt16"><h2>${S.shop.name}</h2><p class="small muted mt6">${S.shop.cat}${S.shop.loc?' · '+S.shop.loc:''}</p><p class="small mt12">${S.products.length} products · ${S.shop.till?S.shop.kind+' '+S.shop.till:'Payment details can be added later'}</p></div><p class="small muted mt14">Your store is saved on this browser. No sample transactions have been added.</p><button class="btn full mt20" data-a="setupFirstSale">${icon('plus',18)} Make your first sale</button><button class="btn ghost full mt12" data-a="openDashboard">Go to my dashboard</button></div></div>`;
  Actions.start=function(){
    stopAutofill();
    if(S.demo){if(!confirm('Leave the sample shop and create your own store? This removes sample data from this browser.'))return;Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,blankState());saveState()}
    U.setup={name:S.shop.name||'',cat:S.shop.cat||SHOP_CATEGORIES[0],loc:S.shop.loc||''};
    Object.assign(U,{phone:S.lastPhone||'',otp:'',otpSent:false,err:'',draft:emptyDraft(),newProd:{n:'',p:'',s:''}});
    go('auth');
  };
  Actions.shopContinue=function(){
    const name=U.setup.name.trim();
    if(!name){U.err='Enter your store name';render();return}
    if(!SHOP_TYPES[U.setup.cat]){U.err='Choose a business category';render();return}
    S.shop={...S.shop,name,cat:U.setup.cat,loc:String(U.setup.loc||'').trim()};
    U.shopEdit={...S.shop,kind:S.shop.kind||'Till'};saveState();go('payment');
  };
  Actions.finishSetup=function(){
    const h=U.shopEdit||{},till=String(h.till||'').trim();
    if(till&&!/^\d{5,7}$/.test(till)){toast('Till or Paybill should be 5–7 digits');return}
    S.shop={...S.shop,kind:h.kind==='Paybill'?'Paybill':'Till',till};saveState();go('products');
  };
  Actions.skipPayment=function(){S.shop={...S.shop,till:''};saveState();go('products')};
  Actions.setupPaymentBack=function(){U.shopEdit={...S.shop};go('payment')};
  Actions.completeStore=function(){
    if(!S.authed){go('auth');return}
    if(!S.shop.name.trim()){go('shop');return}
    if(U.newProd.n.trim()||U.newProd.p!==''||U.newProd.s!==''){toast('Add the product with Add product, or clear its fields before finishing');return}
    S.done=true;S.demo=false;S.flags={...S.flags,reviewed:S.products.length>0};saveState();go('ready');
  };
  Actions.openDashboard=function(){if(!S.done){go('shop');return}U.tab='home';go('main')};
  Actions.setupFirstSale=function(){if(!S.done){go('shop');return}U.tab='home';go('main');Actions.newSale()};
})();
