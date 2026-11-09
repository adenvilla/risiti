/** Optional OSM-based reverse lookup for light prototype use. No Google key. */
const cache=new Map(),clients=new Map();let nextRequest=0;
module.exports=async function(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST'})}
  if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'Request not allowed'})}catch{return res.status(403).json({error:'Request not allowed'})}}
  let body=req.body;try{if(typeof body==='string')body=JSON.parse(body)}catch{return res.status(400).json({error:'Invalid request'})}
  if(!body||typeof body!=='object')return res.status(400).json({error:'Invalid request'});
  if(body.mode==='config'){const tileUrl=process.env.MAP_TILE_URL||'https://tile.openstreetmap.org/{z}/{x}/{y}.png';try{if(new URL(tileUrl).protocol!=='https:')throw new Error()}catch{return res.status(503).json({error:'Map configuration is invalid. Manual entry is still available.'})}return res.status(200).json({tileUrl,attribution:process.env.MAP_TILE_ATTRIBUTION||'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'})}
  if(body.mode!=='reverse')return res.status(400).json({error:'Unknown request'});
  if(process.env.REVERSE_GEOCODING_DISABLED==='true')return res.status(503).json({error:'Address lookup is temporarily disabled. Please enter your address manually.'});
  const lat=body.latitude,lon=body.longitude;
  if(typeof lat!=='number'||typeof lon!=='number'||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return res.status(400).json({error:'Invalid position'});
  const now=Date.now(),key=lat.toFixed(5)+','+lon.toFixed(5),hit=cache.get(key);
  if(hit&&hit.until>now)return res.status(200).json(hit.data);
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0],entry=clients.get(ip);
  if(entry&&now-entry.at<60000){if(entry.n>=4)return res.status(429).json({error:'Please wait a minute before another lookup. Manual entry still works.'});entry.n++}else clients.set(ip,{at:now,n:1});
  if(now<nextRequest)return res.status(429).json({error:'Address service is busy. Wait a few seconds and try again.'});
  nextRequest=now+1500;
  if(clients.size>1000)for(const [k,v]of clients)if(now-v.at>60000)clients.delete(k);
  let url;try{url=new URL('reverse', (process.env.PHOTON_BASE_URL||'https://photon.komoot.io/').replace(/\/?$/,'/'));if(url.protocol!=='https:')throw new Error()}catch{return res.status(503).json({error:'Address provider configuration is invalid.'})}
  url.searchParams.set('lat',String(lat));url.searchParams.set('lon',String(lon));url.searchParams.set('limit','3');url.searchParams.set('radius','0.5');url.searchParams.set('lang','en');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try{const upstream=await fetch(url,{signal:controller.signal,headers:{'Accept':'application/json','User-Agent':'RisitiShopSetup/1.0 (+https://github.com/adenvilla/risiti)'}});
    if(!upstream.ok)return res.status(upstream.status===429?429:502).json({error:'Address provider is busy or unavailable. Please try later or enter manually.'});
    const raw=await upstream.json();
    const suggestions=(Array.isArray(raw.features)?raw.features:[]).slice(0,3).map(f=>{const p=f.properties||{},text=v=>typeof v==='string'?v.slice(0,160):'',town=text(p.city||p.town||p.village||((p.osm_key==='place'&&['city','town','village'].includes(p.osm_value))?p.name:'')),street=text(p.street||p.district||((p.osm_key==='highway')?p.name:''));return {town,street,label:[text(p.name),street,town,text(p.state),text(p.country)].filter((v,i,a)=>v&&a.indexOf(v)===i).join(' · ')}}).filter(s=>s.town||s.street);
    const data={suggestions,provider:'Photon / OpenStreetMap',notice:'Nearby mapped address suggestion, not proof of an exact shop address.'};
    if(cache.size>=500)cache.delete(cache.keys().next().value);cache.set(key,{until:now+86400000,data});
    return res.status(200).json(data);
  }catch{return res.status(502).json({error:'Address lookup timed out or failed. Your existing address has not changed.'})}finally{clearTimeout(timer)}
};
