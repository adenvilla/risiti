/* Sheets: consistent headers, spacing, and receipt presentation. Preserve existing sheet behavior and actions. */
const sheetHeader=(title,sub='')=>html`<div class="sheet-header"><div class="row between"><h2>${title}</h2><button class="iconbtn" aria-label="Close" data-a="close">${icon('x',18)}</button></div>${sub?html`<p class="xs muted mt4">${sub}</p>`:''}</div>`;
