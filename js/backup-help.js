/** Merchant-facing backup explanations; existing validator and restore writer remain unchanged. */
(function(){
'use strict';
const settings=TAB_VIEWS.set;
TAB_VIEWS.set=()=>{
 const view=settings().s;
 const old='<p class="eyebrow-d">Data recovery</p>';
 const start=view.indexOf(old),end=start<0?-1:view.indexOf('<p class="xs faint center-t">',start);
 const help=html`<p class="eyebrow-d">Back up &amp; restore your shop</p><div class="card mb20"><p class="small">Keep a copy of your shop so you can restore it if your browser data is cleared or you change phones. A backup includes your shop details, products, stock, receipts, and saved customer names.</p><button class="btn soft full mt14" data-a="downloadBackup">Save shop backup</button><p class="xs muted mt8">Download a backup file. Keep it somewhere safe and accessible outside this phone. It only includes information recorded up to the time you save it.</p><button class="btn ghost full mt14" data-a="chooseRestore">Restore from backup</button><p class="xs muted mt8">Choose a previously saved Risiti backup file to recover your shop.</p><p class="small muted mt14">This is not automatic cloud backup. Changes made after your last backup will not be recovered. CSV and PDF reports cannot restore your shop.</p><p class="xs muted mt10">Backups are not encrypted. Keep them private: they contain shop and customer information.</p></div>`;
 const updated=start>=0&&end>start?view.slice(0,start)+help.s+view.slice(end):view;
 return raw(updated.replace('Local recovery copy','Keep an extra copy in this browser').replace('Another copy in this browser; not cloud backup','This extra copy stays in the same browser. It will not protect your shop if you lose the phone or clear all browser data.'));
};
const download=Actions.downloadBackup;
Actions.downloadBackup=()=>{try{download();toast('Backup download started. Check that the file was saved, then keep a copy somewhere safe. It contains private shop and customer information.')}catch{toast('Could not start the backup download. Your current shop is unchanged.')}};
let previewDate='Not recorded in this backup';
const choose=Actions.chooseRestore;
Actions.chooseRestore=()=>{
 previewDate='Not recorded in this backup';
 const nativeCreate=document.createElement;
 document.createElement=function(name,options){
  const element=nativeCreate.call(document,name,options);
  if(String(name).toLowerCase()==='input'){
   const originalClick=element.click;
   element.click=function(){
    if(element.type==='file'&&element.accept==='.json,application/json'){
     const read=element.onchange;
     element.onchange=async function(event){
      previewDate='Not recorded in this backup';
      try{const file=element.files&&element.files[0];if(file&&file.size<=15000000){const parsed=JSON.parse(await file.text());if(typeof parsed.createdAt==='string'){const date=new Date(parsed.createdAt);if(Number.isFinite(date.getTime()))previewDate=date.toLocaleString()}}}catch{}
      if(read)return read.call(element,event);
     };
    }
    return originalClick.call(element);
   };
  }
  return element;
 };
 try{return choose()}finally{document.createElement=nativeCreate}
};
const restore=SHEETS.restore;
SHEETS.restore=()=>{
 const old=restore().s;
 if(!old.includes('data-a="applyRestore"'))return raw(old);
 const warning='Restoring will replace the shop currently saved on this device. It will not combine the two shops. Save a backup of your current shop before continuing. You will sign in again after restoring. This is not cloud recovery.';
 const date=html`<p class="small muted mt12">Backup created: ${previewDate}</p>`;
 return raw(old.replace('Restore shop backup','Restore from backup').replace('<p class="small mt12">',date.s+'<p class="small mt12">').replace('This replaces the current local shop, not merges it. Download a current backup first. You will sign in again after restoring. This is not cloud recovery.',warning).replace('Download current backup','Save current shop backup').replace('Replace current shop','Replace shop with this backup')+html`<button class="btn ghost full mt12" data-a="close">Cancel</button>`.s);
};
if(U.scr==='main'&&U.tab==='set')render();
})();
