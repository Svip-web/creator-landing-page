const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const stageVideo=document.querySelector('.hero-stage-video');
if(reduced.matches)stageVideo?.pause();
const menuToggle=document.querySelector('.site-menu-toggle');
const siteNavigation=document.querySelector('#site-navigation');
function closeSiteMenu(){menuToggle?.setAttribute('aria-expanded','false');menuToggle?.setAttribute('aria-label','Открыть меню');siteNavigation?.classList.remove('is-open')}
menuToggle?.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');siteNavigation.classList.toggle('is-open',open)});
siteNavigation?.addEventListener('click',e=>{if(e.target.closest('a'))closeSiteMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuToggle?.getAttribute('aria-expanded')==='true'){closeSiteMenu();menuToggle.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeSiteMenu()});
matchMedia('(min-width:1001px)').addEventListener('change',closeSiteMenu);
if(!reduced.matches&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.04});document.querySelectorAll('.document-section').forEach((s,i)=>{if(i)s.classList.add('reveal');io.observe(s)})}
const siteHeader=document.querySelector('.site-header');
const firstScreen=document.querySelector('.block-1');
let queued=false;function update(){const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',max?Math.min(1,scrollY/max):0);const headerHeight=siteHeader?.offsetHeight||0;const firstScreenEnd=(firstScreen?.offsetTop||0)+(firstScreen?.offsetHeight||innerHeight)-headerHeight;siteHeader?.classList.toggle('is-scrolled',scrollY>=firstScreenEnd);if(!reduced.matches){document.querySelectorAll('.hero-person').forEach((e,i)=>e.style.setProperty('--shift',`${scrollY*(i?-.025:-.04)}px`))}queued=false}addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update();

const taskSlider=document.querySelector('.task-slider');
if(taskSlider){
  const taskSlides=[...taskSlider.querySelectorAll('.task-slide')];
  const taskDots=[...document.querySelectorAll('.task-dots i')];
  const taskPrev=document.querySelector('.task-prev');
  const taskNext=document.querySelector('.task-next');
  let taskIndex=0,taskFrame=0;
  const setTask=i=>{taskIndex=(i+taskSlides.length)%taskSlides.length;taskSlider.scrollTo({left:taskSlides[taskIndex].offsetLeft-taskSlider.offsetLeft,behavior:reduced.matches?'auto':'smooth'})};
  const paintTask=()=>{const center=taskSlider.scrollLeft+taskSlider.clientWidth/2;let closest=0,distance=Infinity;taskSlides.forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft+slide.offsetWidth/2-center);if(d<distance){distance=d;closest=i}});taskIndex=closest;taskSlides.forEach((slide,i)=>slide.classList.toggle('is-active',i===taskIndex));taskDots.forEach((dot,i)=>dot.classList.toggle('is-active',i===taskIndex));taskFrame=0};
  taskPrev?.addEventListener('click',()=>setTask(taskIndex-1));
  taskNext?.addEventListener('click',()=>setTask(taskIndex+1));
  taskSlider.addEventListener('scroll',()=>{if(!taskFrame)taskFrame=requestAnimationFrame(paintTask)},{passive:true});
  taskSlider.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();setTask(taskIndex+1)}if(e.key==='ArrowLeft'){e.preventDefault();setTask(taskIndex-1)}});
  paintTask();
}

const chatSlider=document.querySelector('.chat-cloud');
if(chatSlider){
  const chatSlides=[...chatSlider.querySelectorAll('.chat-message')];
  const chatCounter=document.querySelector('.chat-counter');
  let chatIndex=0,chatFrame=0;
  const setChat=i=>{chatIndex=(i+chatSlides.length)%chatSlides.length;chatSlider.scrollTo({left:chatSlides[chatIndex].offsetLeft-chatSlider.offsetLeft,behavior:reduced.matches?'auto':'smooth'})};
  const paintChat=()=>{const center=chatSlider.scrollLeft+chatSlider.clientWidth/2;let closest=0,distance=Infinity;chatSlides.forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft+slide.offsetWidth/2-center);if(d<distance){distance=d;closest=i}});chatIndex=closest;if(chatCounter)chatCounter.textContent=String(chatIndex+1).padStart(2,'0')+' / '+String(chatSlides.length).padStart(2,'0');chatFrame=0};
  document.querySelector('.chat-prev')?.addEventListener('click',()=>setChat(chatIndex-1));
  document.querySelector('.chat-next')?.addEventListener('click',()=>setChat(chatIndex+1));
  chatSlider.addEventListener('scroll',()=>{if(!chatFrame)chatFrame=requestAnimationFrame(paintChat)},{passive:true});
  chatSlider.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();setChat(chatIndex+1)}if(e.key==='ArrowLeft'){e.preventDefault();setChat(chatIndex-1)}});
  paintChat();
}

const programmeModules=[...document.querySelectorAll('.module-product')];
programmeModules.forEach(module=>module.addEventListener('toggle',()=>{if(module.open)programmeModules.forEach(other=>{if(other!==module)other.open=false})}));

const flowSection=document.querySelector('.block-5');
const flowStages=[...document.querySelectorAll('.block-5 .flow-stage')];
const flowArrows=[...document.querySelectorAll('.block-5 .flow-arrow')];
let flowFrame=0;
function paintFlow(){
  flowFrame=0;
  if(!flowSection||!flowStages.length||innerWidth<=900||reduced.matches)return;
  const headerHeight=document.querySelector('.site-header')?.offsetHeight||74;
  const start=flowSection.offsetTop-headerHeight;
  const distance=Math.max(1,flowSection.offsetHeight-innerHeight+headerHeight);
  const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
  const current=Math.round(progress*(flowStages.length-1));
  flowSection.style.setProperty('--flow-progress',String(progress));
  flowStages.forEach((stage,index)=>{
    stage.classList.toggle('is-current',index===current);
    stage.classList.toggle('is-complete',index<current);
  });
  flowArrows.forEach((arrow,index)=>arrow.classList.toggle('is-complete',index<current));
}
function queueFlow(){if(!flowFrame)flowFrame=requestAnimationFrame(paintFlow)}
addEventListener('scroll',queueFlow,{passive:true});
addEventListener('resize',queueFlow,{passive:true});
paintFlow();

/* Keep every visible piece of interface copy readable across the site. */
function enforceMinimumTextSize(){
  document.querySelectorAll('main *').forEach(element=>{
    if(element.getAttribute('aria-hidden')==='true'||getComputedStyle(element).display==='none')return;
    if(element.closest('.figma-meta'))return;
    const hasOwnText=[...element.childNodes].some(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim());
    if(hasOwnText&&parseFloat(getComputedStyle(element).fontSize)<16)element.style.setProperty('font-size','16px','important');
  });
}
enforceMinimumTextSize();
document.fonts?.ready.then(enforceMinimumTextSize);

const resourceSlider=document.querySelector('.resource-slider');
if(resourceSlider){
  const resourceSlides=[...resourceSlider.querySelectorAll('.resource-slide')];
  const resourceDots=[...document.querySelectorAll('.resource-dots i')];
  let resourceIndex=0,resourceFrame=0;
  const setResource=i=>{resourceIndex=(i+resourceSlides.length)%resourceSlides.length;resourceSlider.scrollTo({left:resourceSlides[resourceIndex].offsetLeft-resourceSlider.offsetLeft,behavior:reduced.matches?'auto':'smooth'})};
  const paintResource=()=>{const left=resourceSlider.scrollLeft;let closest=0,distance=Infinity;resourceSlides.forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft-resourceSlider.offsetLeft-left);if(d<distance){distance=d;closest=i}});resourceIndex=closest;resourceDots.forEach((dot,i)=>dot.classList.toggle('is-active',i===resourceIndex));resourceFrame=0};
  document.querySelector('.resource-prev')?.addEventListener('click',()=>setResource(resourceIndex-1));
  document.querySelector('.resource-next')?.addEventListener('click',()=>setResource(resourceIndex+1));
  resourceSlider.addEventListener('scroll',()=>{if(!resourceFrame)resourceFrame=requestAnimationFrame(paintResource)},{passive:true});
  resourceSlider.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();setResource(resourceIndex+1)}if(e.key==='ArrowLeft'){e.preventDefault();setResource(resourceIndex-1)}});
  paintResource();
}
