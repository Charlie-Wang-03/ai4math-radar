(function(){
  const root=document.documentElement;
  const key='ai4math-static-theme';
  function apply(mode){
    const resolved=mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;
    root.setAttribute('data-theme',resolved);
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.classList.toggle('active',b.dataset.themeChoice===mode));
  }
  let pref=localStorage.getItem(key)||'system';apply(pref);
  document.addEventListener('click',e=>{
    const theme=e.target.closest('[data-theme-choice]');
    if(theme){pref=theme.dataset.themeChoice;localStorage.setItem(key,pref);apply(pref);return;}
    const tab=e.target.closest('[data-category]');
    if(tab){
      const cat=tab.dataset.category||'all';
      document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===tab));
      filter(cat,(document.querySelector('[data-search]')||{}).value||'');
      return;
    }
    const star=e.target.closest('[data-star-id]');
    if(star){
      const k='ai4math-static-starred',id=star.dataset.starId;
      let ids=[];try{ids=JSON.parse(localStorage.getItem(k)||'[]')}catch{}
      ids=Array.isArray(ids)?ids:[];
      ids=ids.includes(id)?ids.filter(x=>x!==id):[id,...ids].slice(0,500);
      localStorage.setItem(k,JSON.stringify(ids));syncStars();return;
    }
  });
  function filter(cat,q){
    q=q.trim().toLowerCase();
    document.querySelectorAll('[data-feed-item]').forEach(el=>{
      const okCat=cat==='all'||el.dataset.category===cat;
      const hay=(el.dataset.search||'').toLowerCase();
      el.classList.toggle('hidden',!(okCat&&(!q||hay.includes(q))));
    });
    document.querySelectorAll('[data-day]').forEach(day=>{
      const any=[...day.querySelectorAll('[data-feed-item]')].some(el=>!el.classList.contains('hidden'));
      day.classList.toggle('hidden',!any);
    });
  }
  const input=document.querySelector('[data-search]');
  if(input){
    input.addEventListener('input',()=>filter(document.querySelector('[data-category].active')?.dataset.category||'all',input.value));
    addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement?.tagName||'')){e.preventDefault();input.focus();}});
  }
  function syncStars(){
    let ids=[];try{ids=JSON.parse(localStorage.getItem('ai4math-static-starred')||'[]')}catch{}
    ids=Array.isArray(ids)?ids:[];
    document.querySelectorAll('[data-star-id]').forEach(b=>{const on=ids.includes(b.dataset.starId);b.classList.toggle('on',on);b.textContent=on?'★':'☆';});
  }
  syncStars();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(pref==='system')apply(pref);});
})();