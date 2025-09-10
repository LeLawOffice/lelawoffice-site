(function(){
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', (e) => {
    if(e.target.tagName === 'A'){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    }
  });
})();