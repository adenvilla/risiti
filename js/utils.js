/** Safe templates and decimal-preserving formatting. VAT policy remains whole-shilling. */
class Raw{constructor(s){this.s=s}}
const raw=s=>new Raw(s),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const renderValue=v=>v instanceof Raw?v.s:Array.isArray(v)?v.map(renderValue).join(''):v==null||v===false?'':esc(v);
const html=(strings,...values)=>raw(strings.reduce((o,s,i)=>o+s+(i<values.length?renderValue(values[i]):''),''));
const currencyNumber=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const $=s=>document.querySelector(s),money=n=>'KSh '+currencyNumber(n),moneyH=n=>html`<span class="cur">KSh</span>${currencyNumber(n)}`;
const sameDay=(a,b)=>new Date(a).toDateString()===new Date(b).toDateString();
const ymd=t=>{const d=new Date(t);return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`};
const dayLabel=t=>sameDay(t,Date.now())?'Today':sameDay(t,Date.now()-DAY)?'Yesterday':new Date(t).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const timeLabel=t=>new Date(t).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),longDate=t=>new Date(t).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
function inPeriod(t,p){if(p==='All')return true;if(p==='Today')return sameDay(t,Date.now());if(p==='This week')return Date.now()-t<7*DAY;const a=new Date(t),b=new Date();return a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear()}
const normalisePhone=p=>String(p).replace(/\D/g,'').replace(/^254/,'').replace(/^0/,''),isValidPhone=p=>/^[17]\d{8}$/.test(p),formatPhone=p=>p?`0${p.slice(0,3)} ${p.slice(3,6)} ${p.slice(6)}`:'Walk-in';
function saleTotals(s){const sub=s.items.reduce((a,i)=>a+i.q*i.p,0),disc=Math.min(Math.max(+s.disc||0,0),sub),vat=s.vat?Math.round((sub-disc)*VAT_RATE):0;return{sub,disc,vat,total:sub-disc+vat}}
const itemsLabel=s=>s.items.map(i=>i.n).join(', ');
function mpesaRef(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';return 'S'+Array.from({length:9},()=>c[(Math.random()*c.length)|0]).join('')}
function qrSvg(text){try{const q=qrcode(0,'M');q.addData(text);q.make();return raw(q.createSvgTag(5,0))}catch{return html`<p class="xs muted">QR generation needs the optional QR library. Share or copy the receipt instead.</p>`}}
