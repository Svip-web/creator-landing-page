const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const lines=s=>s.replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);
const buttonLabels=new Set(['ПРИСОЕДИНИТЬСЯ К CREATOR','ВЫБРАТЬ CREATOR','ВЫБРАТЬ CREATOR PRO','ВЫБРАТЬ CREATOR VIP','ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ','ВЫБРАТЬ ФОРМАТ УЧАСТИЯ']);
function renderLine(line,i){
  if(/^КНОПКА:?$/i.test(line)||/^Кнопка:?$/i.test(line)) return '';
  if(/^КНОПКА:\s*/i.test(line)) line=line.replace(/^КНОПКА:\s*/i,'');
  if(buttonLabels.has(line)) return `<a class="doc-button" href="#block-14">${esc(line)}</a>`;
  if(/^—/.test(line)) return `<p class="doc-bullet">${esc(line)}</p>`;
  if(/^(Стоимость|СТАРТ|Старт программы|Длительность программы|ДЛИТЕЛЬНОСТЬ|ФОРМАТ|КОЛИЧЕСТВО МЕСТ):/.test(line)) return `<p class="doc-meta">${esc(line)}</p>`;
  if(line===line.toUpperCase()&&/[А-ЯЁ]/.test(line)) return `<h3>${esc(line)}</h3>`;
  if(i===0) return `<h2>${esc(line)}</h2>`;
  return `<p>${esc(line)}</p>`;
}
function renderSection(n,content){
  const source=n===13?content.split('Да, давай закроем хвост сайта')[0].trim():content;
  const ls=lines(source);
  return `<section class="document-section block-${n}" id="block-${n}" data-block="${n}"><div class="block-mark">${String(n).padStart(2,'0')}</div><div class="document-copy">${ls.map(renderLine).join('')}</div>${media(n)}</section>`;
}
function media(n){
  if(n===1)return `<div class="hero-media" aria-hidden="true"><img class="hero-bg" src="assets/hero-background-only.png" alt=""><img class="hero-person hero-lera" src="assets/lera-cutout.png" alt=""><img class="hero-person hero-tikhon" src="assets/tikhon-cutout.png" alt=""></div>`;
  if(n===6)return `<div class="document-photo photo-wide" aria-hidden="true"><img src="assets/hero-duo-extended.jpg" alt=""></div>`;
  if(n===7)return `<div class="document-photo-grid" aria-hidden="true"><img src="assets/lera-avatar.png" alt=""><img src="assets/tikhon-belyaev-portrait.jpg" alt=""></div>`;
  if(n===9)return `<div class="document-photo photo-tall" aria-hidden="true"><img src="assets/speaker-finance-event.jpg" alt=""></div>`;
  if(n===12)return `<div class="document-photo photo-wide" aria-hidden="true"><img src="assets/lera-event-audience.png" alt=""></div>`;
  return '';
}
export function buildExactDocumentSite(sections){
  const ordered=Array.from({length:17},(_,i)=>renderSection(i+1,sections[i+1]||'' )).join('');
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#360710"><title>CREATOR — Лера Рума × Тихон Беляев</title><meta name="description" content="Практическая программа для бьюти-предпринимателей"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%2352141f'/%3E%3Ctext x='32' y='47' text-anchor='middle' font-family='Georgia' font-size='47' fill='%23ecd9b5'%3EC%3C/text%3E%3C/svg%3E"><link rel="preload" href="assets/creator.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="assets/hero-background-only.png" as="image"><link rel="stylesheet" href="exact.css"><script src="exact.js" defer></script></head><body><div class="reading-progress" aria-hidden="true"></div><main>${ordered}</main></body></html>`;
}
