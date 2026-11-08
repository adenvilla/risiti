/* Shared UI components: keep existing APIs while improving hierarchy, spacing, and visual consistency. */
const sectionLabel=(label)=>html`<p class="section-label">${label}</p>`;
const errorBox=()=>U.err?html`<div class="error" role="alert">${icon('warn',15)} ${U.err}</div>`:'';
const emptyState=(title,action,sub)=>html`<div class="empty-state card"><p class="empty-title">${title}</p>${sub?html`<p class="empty-sub">${sub}</p>`:''}${action||''}</div>`;
const btn=(label,action,variant='primary',iconName='')=>html`<button class="btn ${variant==='primary'?'foil':variant}" data-a="${action}">${iconName?icon(iconName,17):''}<span>${label}</span></button>`;
const card=children=>html`<div class="card">${children}</div>`;
