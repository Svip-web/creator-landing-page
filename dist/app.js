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
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const motion=document.querySelector('.motion-toggle');
motion.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Включить анимацию':'Пауза анимации';});
if('IntersectionObserver' in window&&!reduced.matches){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.06,rootMargin:'0px 0px 35px 0px'});
  document.querySelectorAll('.section:not(.final-cta)>h2,.split-heading,.concepts article,.task,.expert,.audience-grid article,.steps article,.included-grid article,.outcomes>*,.plan,.onboarding article').forEach((el,i)=>{if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('reveal-pending');el.style.setProperty('--reveal-delay',`${i%3*65}ms`);observer.observe(el);}});
  reduced.addEventListener('change',event=>{if(event.matches){document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.add('in-view'));observer.disconnect();}});
}
let scrollQueued=false;
function updateReadingProgress(){const height=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',height>0?String(Math.min(1,scrollY/height)):'0');scrollQueued=false;}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateReadingProgress);}},{passive:true});
addEventListener('resize',updateReadingProgress);updateReadingProgress();
// Scroll-linked photo movement; no scroll hijacking or continuous RAF loop.
const photoScenes=[...document.querySelectorAll('[data-photo-scene]')];
const activeScenes=new Set();
if('IntersectionObserver' in window){const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)activeScenes.add(entry.target);else activeScenes.delete(entry.target);}),{rootMargin:'120px'});photoScenes.forEach(scene=>sceneObserver.observe(scene));}
function animatePhotoScenes(){
  if(reduced.matches||document.body.classList.contains('motion-paused'))return;
  activeScenes.forEach(scene=>{const rect=scene.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(innerHeight/2-rect.top-rect.height/2)/(innerHeight/2+rect.height/2)));scene.style.setProperty('--scene-turn',`${progress*5}deg`);scene.querySelectorAll('[data-depth]').forEach(photo=>{photo.style.setProperty('--photo-y',`${progress*Number(photo.dataset.depth)*(innerWidth<700?.55:1)}px`);});});
}
let photoFrame=false;
function queuePhotoMotion(){if(!photoFrame){photoFrame=true;requestAnimationFrame(()=>{animatePhotoScenes();photoFrame=false;});}}
addEventListener('scroll',queuePhotoMotion,{passive:true});addEventListener('resize',queuePhotoMotion);motion.addEventListener('click',queuePhotoMotion);queuePhotoMotion();
