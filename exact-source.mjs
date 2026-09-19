const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const lines=s=>s.replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);
const buttonLabels=new Set(['ПРИСОЕДИНИТЬСЯ К CREATOR','ВЫБРАТЬ CREATOR','ВЫБРАТЬ CREATOR PRO','ВЫБРАТЬ CREATOR VIP','ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ','ВЫБРАТЬ ФОРМАТ УЧАСТИЯ']);
function renderLine(line,i){
  if(/^КНОПКА:?$/i.test(line)||/^Кнопка:?$/i.test(line)) return '';
  if(/^КНОПКА:\s*/i.test(line)) line=line.replace(/^КНОПКА:\s*/i,'');
  if(buttonLabels.has(line)) return `<a class="doc-button" href="#block-14">${esc(line)}</a>`;
  if(/^—/.test(line)) return `<p class="doc-bullet">${esc(line)}</p>`;
  if(/^(Стоимость|СТАРТ|Старт программы|Длительность программы|ДЛИТЕЛЬНОСТЬ|ФОРМАТ|КОЛИЧЕСТВО МЕСТ):/.test(line)) return `<p class="doc-meta">${esc(line)}</p>`;
  if(line==='CREATOR') return `<h1>${esc(line)}</h1>`;
  if(i===0) return `<h2>${esc(line)}</h2>`;
  if(line===line.toUpperCase()&&/[А-ЯЁ]/.test(line)) return `<h3>${esc(line)}</h3>`;
  if(i===0) return `<h2>${esc(line)}</h2>`;
  return `<p>${esc(line)}</p>`;
}
function renderSection(n,content){
  const source=n===13?content.split('Да, давай закроем хвост сайта')[0].trim():content;
  const ls=lines(source);
  if(n===1)return renderHero(ls);
  return `<section class="document-section block-${n}" id="block-${n}" data-block="${n}"><div class="block-mark">${String(n).padStart(2,'0')}</div><div class="document-copy">${layout(n,ls)}</div>${media(n)}</section>`;
}

function renderHero(ls){
return '<section class="document-section block-1 art-hero" id="block-1" data-block="1"><div class="hero-layout"><div class="document-copy hero-copy"><div class="hero-info">'+renderLine(ls[0],0)+renderLine(ls[1],1)+'</div><h1>'+esc(ls[2])+'</h1><h2 class="hero-subtitle">'+esc(ls[3])+'</h2><p class="hero-byline">'+esc(ls[4])+'</p><div class="hero-bottom"><p class="hero-description">'+esc(ls[5])+'</p>'+renderLine(ls[7],7)+'</div></div><div class="hero-art" aria-hidden="true"><div class="hero-orbit"></div><div class="hero-art-frame"><img class="art-backdrop" src="assets/hero-background-only.png" alt=""><img class="art-person art-lera" src="assets/lera-cutout.png" alt=""><img class="art-person art-tikhon" src="assets/tikhon-cutout.png" alt=""></div><span class="art-cross">✳</span></div></div><a class="hero-scroll" href="#block-2" aria-label="CREATOR — ЭТО БОЛЬШЕ, ЧЕМ ОБУЧАЮЩАЯ ПРОГРАММА"><span aria-hidden="true">↓</span></a></section>';
}
function header(){return '<header class="site-header"><a class="brand" href="#block-1">CREATOR</a><nav aria-label="Навигация"><a href="#block-7">Лера Рума × Тихон Беляев</a><a href="#block-9">Программа CREATOR</a><a href="#block-14">Форматы участия <span aria-hidden="true">↗</span></a></nav></header>'}
function layout(n,ls){
  if(n===2)return renderAbout(ls);
  if(n===7){const split=ls.indexOf('ТИХОН БЕЛЯЕВ');return [ls.slice(0,split),ls.slice(split)].map((part,i)=>'<article class="mentor"><div class="mentor-image"><img loading="lazy" src="assets/'+(i?'tikhon-belyaev-portrait.jpg':'lera-avatar.png')+'" alt=""></div><div>'+part.map(renderLine).join('')+'</div></article>').join('')}
  if(n===3){return ls.map((line,i)=>i>0&&line.startsWith('«')?'<blockquote>'+esc(line)+'</blockquote>':renderLine(line,i)).join('')}
  const pattern=n===4?/^ЗАДАЧА \d+/:([2,8,9,10].includes(n)?/^\d{2}\. /:null);
  if(!pattern)return ls.map(renderLine).join('');
  let out='',group=null;
  const flush=()=>{if(!group)return;out+=n===9?'<details class="module"><summary>'+esc(group[0])+'<span aria-hidden="true">+</span></summary><div class="module-body">'+group.slice(1).map(renderLine).join('')+'</div></details>':'<article class="editorial-card">'+group.map(renderLine).join('')+'</article>';group=null};
  for(let i=0;i<ls.length;i++){if(pattern.test(ls[i])){flush();group=[ls[i]]}else if(group)group.push(ls[i]);else out+=renderLine(ls[i],i)}flush();return out;
}

function renderAbout(ls){
  const first=ls.findIndex(l=>/^01\. /.test(l));
  const features=ls.slice(first,-1);let cards='';
  for(let i=0;i<features.length;i+=2){cards+='<article class="about-feature"><div class="feature-symbol symbol-'+(i/2)+'" aria-hidden="true"><i></i><i></i><i></i></div><h3>'+esc(features[i])+'</h3><p>'+esc(features[i+1])+'</p></article>'}
  return '<h2 class="about-title">'+esc(ls[0])+'</h2><div class="about-story"><div class="about-text">'+ls.slice(1,first).map((l,i)=>renderLine(l,i+1)).join('')+'</div><div class="about-collage" aria-hidden="true"><div class="collage-line"></div><figure class="collage-audience"><img loading="lazy" src="assets/lera-event-audience.png" alt=""></figure><figure class="collage-speaker"><img loading="lazy" src="assets/lera-stage-talk.png" alt=""></figure><span class="collage-star">✳</span></div></div><div class="about-features">'+cards+'</div><div class="about-finale"><span aria-hidden="true">↗</span><p>'+esc(ls.at(-1))+'</p></div>';
}
function media(n){
  if(n===1)return `<div class="hero-media" aria-hidden="true"><img class="hero-bg" src="assets/hero-background-only.png" alt=""><img class="hero-person hero-lera" src="assets/lera-cutout.png" alt=""><img class="hero-person hero-tikhon" src="assets/tikhon-cutout.png" alt=""></div>`;
  if(n===6)return `<div class="document-photo photo-wide" aria-hidden="true"><img src="assets/hero-duo-extended.jpg" alt=""></div>`;
  if(n===7)return '';
  if(n===700)return `<div class="document-photo-grid" aria-hidden="true"><img src="assets/lera-avatar.png" alt=""><img src="assets/tikhon-belyaev-portrait.jpg" alt=""></div>`;
  if(n===9)return `<div class="document-photo photo-tall" aria-hidden="true"><img src="assets/speaker-finance-event.jpg" alt=""></div>`;
  if(n===12)return `<div class="document-photo photo-wide" aria-hidden="true"><img src="assets/lera-event-audience.png" alt=""></div>`;
  return '';
}
export function buildExactDocumentSite(sections){
  const ordered=Array.from({length:17},(_,i)=>renderSection(i+1,sections[i+1]||'' )).join('');
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#360710"><title>CREATOR — Лера Рума × Тихон Беляев</title><meta name="description" content="Практическая программа для бьюти-предпринимателей"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%2352141f'/%3E%3Ctext x='32' y='47' text-anchor='middle' font-family='Georgia' font-size='47' fill='%23ecd9b5'%3EC%3C/text%3E%3C/svg%3E"><link rel="preload" href="assets/creator.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="assets/hero-background-only.png" as="image"><link rel="stylesheet" href="exact.css"><script src="exact.js" defer></script></head><body><div class="reading-progress" aria-hidden="true"></div>${header()}<main>${ordered}</main></body></html>`;
}

