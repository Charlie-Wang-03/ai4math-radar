(function(){
  const root=document.documentElement,key='ai4math-static-theme',starKey='ai4math-static-starred';
  function starIds(){try{const x=JSON.parse(localStorage.getItem(starKey)||'[]');return Array.isArray(x)?x:[]}catch{return []}}
  function applyTheme(mode){const resolved=mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;root.setAttribute('data-theme',resolved);document.querySelectorAll('[data-theme-choice]').forEach(b=>b.classList.toggle('active',b.dataset.themeChoice===mode));}
  let pref=localStorage.getItem(key)||'system';applyTheme(pref);
  function currentCategory(){return document.querySelector('[data-category].active')?.dataset.category||'all'}
  function filter(cat,q){
    q=(q||'').trim().toLowerCase();const starred=document.body.dataset.view==='starred',stars=new Set(starIds());
    document.querySelectorAll('[data-feed-item]').forEach(el=>{
      const okCat=cat==='all'||el.dataset.category===cat,hay=(el.dataset.search||'').toLowerCase(),id=el.querySelector('[data-star-id]')?.dataset.starId;
      const okStar=!starred||(id&&stars.has(id));
      el.classList.toggle('hidden',!(okCat&&okStar&&(!q||hay.includes(q))));
    });
    document.querySelectorAll('[data-day]').forEach(day=>{const any=[...day.querySelectorAll('[data-feed-item]')].some(el=>!el.classList.contains('hidden'));day.classList.toggle('hidden',!any);});
  }
  function syncStars(){const ids=new Set(starIds());document.querySelectorAll('[data-star-id]').forEach(b=>{const on=ids.has(b.dataset.starId);b.classList.toggle('on',on);b.textContent=on?'★':'☆';});filter(currentCategory(),document.querySelector('[data-search]')?.value||'');}
  document.addEventListener('click',e=>{
    const theme=e.target.closest('[data-theme-choice]');if(theme){pref=theme.dataset.themeChoice;localStorage.setItem(key,pref);applyTheme(pref);return;}
    const tab=e.target.closest('[data-category]');if(tab){document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===tab));const u=new URL(location.href);if(tab.dataset.category==='all')u.searchParams.delete('category');else u.searchParams.set('category',tab.dataset.category);history.replaceState(null,'',u);filter(tab.dataset.category||'all',document.querySelector('[data-search]')?.value||'');return;}
    const star=e.target.closest('[data-star-id]');if(star){const id=star.dataset.starId,ids=starIds(),next=ids.includes(id)?ids.filter(x=>x!==id):[id,...ids].slice(0,500);localStorage.setItem(starKey,JSON.stringify(next));syncStars();}
  });
  const input=document.querySelector('[data-search]');
  if(input){input.addEventListener('input',()=>filter(currentCategory(),input.value));addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement?.tagName||'')){e.preventDefault();input.focus();}});}
  const fromUrl=new URL(location.href).searchParams.get('category');if(fromUrl){const tab=document.querySelector('[data-category="'+CSS.escape(fromUrl)+'"]');if(tab){document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===tab));}}
  syncStars();filter(currentCategory(),input?.value||'');
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(pref==='system')applyTheme(pref);});
})();