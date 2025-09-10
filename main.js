
document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.getElementById('menu-toggle');const nav=document.getElementById('site-nav');
  if(toggle && nav){toggle.addEventListener('click',()=>{nav.hidden=!nav.hidden;});}
});
