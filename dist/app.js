const menu=document.querySelector('.menu-toggle');
const mobile=document.querySelector('#mobile-nav');
function closeMenu(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');mobile.hidden=!open;});
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const dialog=document.querySelector('#enrollment');
document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#dialog-title').textContent=button.dataset.plan;dialog.showModal();}));
document.querySelectorAll('.dialog-close,.dialog-back').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
