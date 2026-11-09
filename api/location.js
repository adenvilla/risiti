/** Map configuration only: no geocoding, API key or location uploads. */
module.exports=async function(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST'})}
  let body=req.body;try{if(typeof body==='string')body=JSON.parse(body)}catch{return res.status(400).json({error:'Invalid request'})}
  if(!body||body.mode!=='config')return res.status(410).json({error:'Online address lookup has been removed. Reload the app to use the map pin and manual address fields.'});
  const tileUrl=process.env.MAP_TILE_URL||'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  try{if(new URL(tileUrl).protocol!=='https:')throw new Error()}catch{return res.status(503).json({error:'Map provider configuration is invalid. Manual address entry is still available.'})}
  const attribution=process.env.MAP_TILE_ATTRIBUTION||'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>';
  return res.status(200).json({tileUrl,attribution});
};
