/** Google geocoding proxy. Configure GOOGLE_MAPS_API_KEY on the server. */
const limits=new Map();
module.exports=async function(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST'})}
  const origin=req.headers.origin,host=req.headers.host;
  if(origin){try{if(new URL(origin).host!==host)return res.status(403).json({error:'Request not allowed'})}catch{return res.status(403).json({error:'Request not allowed'})}}
  let body=req.body;
  try{if(typeof body==='string')body=JSON.parse(body)}catch{return res.status(400).json({error:'Invalid request'})}
  if(!body||typeof body!=='object')return res.status(400).json({error:'Invalid request'});
  const key=process.env.GOOGLE_MAPS_API_KEY;
  if(body.mode==='status')return res.status(200).json({available:!!key});
  if(!key)return res.status(503).json({error:'Automatic address lookup is not configured. Enter the address manually for now.'});
  const now=Date.now(),ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0],entry=limits.get(ip);
  if(limits.size>2000)for(const [k,v]of limits)if(now-v.at>60000)limits.delete(k);
  if(entry&&now-entry.at<60000){if(entry.n>=12)return res.status(429).json({error:'Too many lookups. Wait a minute or enter the address manually.'});entry.n++}else limits.set(ip,{at:now,n:1});
  const url=new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('key',key);url.searchParams.set('language','en');
  if(body.mode==='reverse'){
    const lat=body.latitude,lng=body.longitude;
    if(typeof lat!=='number'||typeof lng!=='number'||!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return res.status(400).json({error:'Invalid position'});
    url.searchParams.set('latlng',lat+','+lng);
  }else if(body.mode==='search'){
    const q=typeof body.query==='string'?body.query.trim():'';
    if(q.length<3||q.length>160)return res.status(400).json({error:'Enter an address or area between 3 and 160 characters.'});
    url.searchParams.set('address',q);url.searchParams.set('components','country:KE');
  }else return res.status(400).json({error:'Unknown lookup mode'});
  const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);
  try{
    const response=await fetch(url,{signal:abort.signal});
    if(!response.ok)return res.status(502).json({error:'Google address lookup is unavailable. Try manual entry.'});
    const data=await response.json();
    if(data.status==='ZERO_RESULTS')return res.status(200).json({results:[]});
    if(data.status!=='OK')return res.status(502).json({error:'Google address lookup could not complete. Check the API configuration or enter your address manually.'});
    const results=(data.results||[]).slice(0,5).map(r=>{const parts=r.address_components||[],part=t=>(parts.find(p=>(p.types||[]).includes(t))||{}).long_name||'';return {label:String(r.formatted_address||''),town:part('locality')||part('postal_town')||part('administrative_area_level_2'),street:part('route')||part('neighborhood')||part('sublocality'),landmark:''}});
    return res.status(200).json({results});
  }catch{return res.status(502).json({error:'Address lookup timed out or failed. You can still enter the address manually.'})}finally{clearTimeout(timer)}
};
