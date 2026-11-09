/** Optional Google address suggestions. No background tracking or automatic saving. */
(function(){
  const originalShop=SCREENS.shop;
  U.autoLocation={query:'',busy:false,message:'',results:[],accuracy:null};
  let generation=0,controller=null;
  const state=()=>U.autoLocation;
  const redraw=()=>{if(U.scr==='shop')render()};
  const controls=()=>{const a=state();return html`<section class="card mt14" aria-label="Automatic address options"><p class="small bold">Find your shop address</p><p class="xs muted mt6">Use current location only while at your shop. After you choose an option, the coordinates or search text are sent to Google Maps to suggest an address. Review before applying. Google Maps lookup charges may apply to the app owner.</p><button class="btn soft full mt12" data-a="detectShopLocation" ${a.busy?'disabled':''}>${icon('pin',17)} Use my current location</button><label class="lb" for="location-search">Or search an address or area in Kenya</label><div class="inp"><input id="location-search" data-i="U.autoLocation.query" data-enter="searchShopLocation" maxlength="160" value="${a.query}" placeholder="e.g. Kiambu Market, Kiambu" autocomplete="off"></div><button class="btn soft full mt12" data-a="searchShopLocation" ${a.busy?'disabled':''}>${icon('search',17)} Search address</button>${a.busy?html`<button class="btn ghost full mt12" data-a="cancelLocationLookup">Cancel lookup</button>`:''}<p class="xs muted mt12" role="status" aria-live="polite">${a.message}</p>${a.accuracy!==null?html`<p class="xs muted mt6">Device-reported accuracy: about ${Math.round(a.accuracy)} metres. Check the suggested area carefully.</p>`:''}${a.results.length?html`<p class="small bold mt14">Review suggestions</p>${a.results.map((r,i)=>html`<div class="card mt12"><p class="small">${r.label}</p><a class="link green xs block mt6" href="${'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.label)}" target="_blank" rel="noopener noreferrer">View on Google Maps</a><button class="btn sm mt12" data-a="applyLocationSuggestion" data-v="${i}">Use this address</button></div>`)}<p class="xs muted mt12">Address suggestions from Google Maps. Edit the fields below and add your shop number or landmark.</p>`:''}<button class="link green small mt12" data-a="manualShopLocation">Enter manually instead</button></section>`};
  SCREENS.shop=()=>raw(originalShop().s.replace('<p class="xs muted mt6">Optional. Enter a place customers recognise. No device-location permission is needed.</p>',controls().s));
  async function request(body,signal){const response=await fetch('/api/location',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal,cache:'no-store'});let data;try{data=await response.json()}catch{throw new Error('Address service is unavailable. Enter the address manually.')}if(!response.ok)throw new Error(data.error||'Address lookup failed. Try manual entry.');return data}
  async function lookup(mode){
    const a=state();if(a.busy)return;
    if(mode==='search'&&a.query.trim().length<3){a.message='Enter at least 3 characters for an address or area.';redraw();return}
    const id=++generation;controller=new AbortController();const signal=controller.signal;
    Object.assign(a,{busy:true,message:'Checking address service…',results:[],accuracy:null});redraw();
    const stillHere=()=>id===generation&&U.scr==='shop';
    try{
      const status=await request({mode:'status'},signal);
      if(!stillHere())return;
      if(!status.available)throw new Error('Automatic address lookup needs GOOGLE_MAPS_API_KEY configured in Vercel. Please enter your address manually for now.');
      let body;
      if(mode==='reverse'){
        if(!window.isSecureContext||!navigator.geolocation)throw new Error('Device location is unavailable in this browser. Use address search or manual entry.');
        a.message='Finding your location…';redraw();
        const p=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:12000,maximumAge:0}));
        if(!stillHere())return;
        a.accuracy=p.coords.accuracy;body={mode,latitude:p.coords.latitude,longitude:p.coords.longitude};
      }else body={mode,query:a.query.trim()};
      a.message='Looking up address suggestions…';redraw();
      const data=await request(body,signal);if(!stillHere())return;
      a.results=Array.isArray(data.results)?data.results:[];a.message=a.results.length?'Select an address to review and edit. Nothing has been saved.':'No matching address found. Try a nearby street or area, or enter it manually.';
    }catch(e){if(id!==generation)return;a.message=e.code===1?'Location permission was denied. Use address search or manual entry.':e.code===2?'Your position could not be found. Try search or manual entry.':e.code===3?'Device location timed out. Try search or manual entry.':e.name==='AbortError'?'Lookup cancelled.':e.message||'Location lookup failed. Use manual entry.'}
    finally{if(id===generation){a.busy=false;controller=null;redraw()}}
  }
  Actions.detectShopLocation=()=>lookup('reverse');Actions.searchShopLocation=()=>lookup('search');
  Actions.cancelLocationLookup=()=>{generation++;if(controller)controller.abort();controller=null;Object.assign(state(),{busy:false,message:'Lookup cancelled. No address was changed.',results:[],accuracy:null});redraw()};
  Actions.manualShopLocation=()=>{Actions.cancelLocationLookup();if(U.address)U.address.enabled=true;redraw();const input=$('#detail-town');if(input)input.focus()};
  Actions.applyLocationSuggestion=el=>{const r=state().results[Number(el.dataset.v)];if(!r||!U.address)return;const a=U.address;if([a.town,a.street,a.landmark].some(v=>String(v||'').trim())&&!confirm('Replace your draft town and street with this suggestion? Your landmark and receipt visibility setting will be kept.'))return;a.town=r.town||'';a.street=r.street||'';a.enabled=true;U.detailsErrors={};state().results=[];state().accuracy=null;state().message='Address applied to the draft. Check the town and street below and add a landmark before continuing.';redraw();const input=$('#detail-town');if(input)input.focus()};
})();
