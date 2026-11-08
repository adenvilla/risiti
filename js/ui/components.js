/* Complete shared UI components restored to preserve app rendering and existing APIs. */
const sectionLabel=(label)=>html`<p class="section-label">${label}</p>`;
const errorBox=()=>U.err?html`<div class="error" role="alert">${icon('warn',15)} ${U.err}</div>`:'';
const emptyState=(title,action,sub)=>html`<div class="empty-state card"><p class="empty-title">${title}</p>${sub?html`<p class="empty-sub">${sub}</p>`:''}${action||''}</div>`;
const btn=(label,action,variant='primary',iconName='')=>html`<button class="btn ${variant==='primary'?'foil':variant}" data-a="${action}">${iconName?icon(iconName,17):''}<span>${label}</span></button>`;
const card=children=>html`<div class="card">${children}</div>`;
const brandLogo=(size=46)=>html`<img class="logo" src="${S.logo||'logo.png'}" width="${size}" height="${size}" alt="">`;
const phoneField=(path,value,extra='')=>html`<div class="inp"><span class="prefix">+254</span><input data-i="${path}" data-n="1" inputmode="numeric" autocomplete="tel-national" placeholder="712 345 678" value="${value}" ${extra}></div>`;
const shopLogo=(size=46,stroke=14)=>brandLogo(size);
const iconTile=(name,size=18)=>html`<span class="ico">${icon(name,size)}</span>`;
