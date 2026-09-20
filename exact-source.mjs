const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const lines=s=>s.replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);
const importancePattern=/(сильн(?:ая|ой|ую|ые|ых)?\s+команд\p{L}*|жив\p{L}*\s+практическ\p{L}*\s+программ\p{L}*|работ\p{L}*\s+над\s+(?:вашим|своим)\s+проект\p{L}*|личн\p{L}*\s+бренд\p{L}*|финанс\p{L}*|маркетинг\p{L}*|клиент\p{L}*|команд\p{L}*|управлен\p{L}*|систем\p{L}*|практическ\p{L}*|результат\p{L}*|стратег\p{L}*|план\p{L}*)/giu;
function emphasizeBodyCopy(html){
  return html.replace(/<(p|blockquote)([^>]*)>([^<]*)<\/\1>/g,(whole,tag,attrs,text)=>{
    if(/doc-meta|figma-byline|program-label|chat-counter/.test(attrs))return whole;
    let accents=0;
    const highlighted=text.replace(importancePattern,match=>accents++<2?'<strong>'+match+'</strong>':match);
    return '<'+tag+attrs+'>'+highlighted+'</'+tag+'>';
  });
}
const buttonLabels=new Set(['ПРИСОЕДИНИТЬСЯ К CREATOR','ВЫБРАТЬ CREATOR','ВЫБРАТЬ CREATOR PRO','ВЫБРАТЬ CREATOR VIP','ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ','ВЫБРАТЬ ФОРМАТ УЧАСТИЯ']);
function renderLine(line,i){
  if(/^КНОПКА:?$/i.test(line)||/^Кнопка:?$/i.test(line)) return '';
  if(/^КНОПКА:\s*/i.test(line)) line=line.replace(/^КНОПКА:\s*/i,'');
  if(buttonLabels.has(line)) return `<a class="doc-button" href="#block-14">${esc(line)}</a>`;
  if(/^—/.test(line)) return `<p class="doc-bullet"><span class="source-dash" aria-hidden="true">—</span>${esc(line.slice(1))}</p>`;
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
  const subtitleLead=ls[3].split(' ')[0];
  const subtitleTail=ls[3].slice(subtitleLead.length+1);
  const subtitleBreak=subtitleTail.indexOf('-')+1;
  const subtitle=[subtitleLead+' ',subtitleTail.slice(0,subtitleBreak),subtitleTail.slice(subtitleBreak)];
return '<section class="document-section block-1 figma-hero" id="block-1" data-block="1"><div class="figma-hero-bg" aria-hidden="true"><video class="hero-stage-video" autoplay muted loop playsinline preload="metadata" poster="assets/hero-stage-screen-audience.webp"><source src="assets/hero-stage-loop.mp4" type="video/mp4"></video></div><div class="figma-hero-people" aria-hidden="true"><img class="figma-person figma-lera" src="assets/lera-cutout.webp" alt="" width="1024" height="1536" fetchpriority="high" decoding="async"><img class="figma-person figma-tikhon" src="assets/tikhon-cutout.webp" alt="" width="1024" height="1536" fetchpriority="high" decoding="async"></div><div class="document-copy figma-hero-copy"><div class="figma-meta">'+renderLine(ls[0],0)+renderLine(ls[1],1)+'</div><h1>'+esc(ls[2])+'</h1><div class="figma-subtitle"><h2><span>'+subtitle.map(esc).join('</span><span>')+'</span></h2></div><p class="figma-byline">'+esc(ls[4])+'</p><p class="figma-description">'+esc(ls[5])+'</p>'+renderLine(ls[7],7)+'</div></section>';
}
function header(){return '<header class="site-header"><a class="brand" href="#block-1">CREATOR</a><button class="site-menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Открыть меню"><span></span><span></span><span></span></button><nav id="site-navigation" aria-label="Разделы сайта"><a href="#block-2">О программе</a><a href="#block-7">Менторы</a><a href="#block-8">Для кого</a><a href="#block-9">Программа</a><a href="#block-14">Форматы участия</a><a href="#block-16">Вопросы и ответы</a></nav><a class="header-cta" href="#block-14">Присоединиться <span aria-hidden="true">↗</span></a></header>'}
function layout(n,ls){
  if(n===2)return renderAbout(ls);
  if(n===16)return groupedPanels(ls,1,l=>l.endsWith('?'),'faq-item',true);
  if(n===11){
    const icons=['<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m10 9 5 3-5 3V9Z"/>','<circle cx="8" cy="10" r="3"/><circle cx="16" cy="10" r="3"/><path d="M3 20c.5-3 2.3-5 5-5s4.5 2 5 5M11 20c.4-2.4 2-4 5-4 2.6 0 4.3 1.5 5 4"/>','<path d="M4 18V7h16v11H4Z"/><path d="m8 12 2 2 5-5M8 4h8"/>','<path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h8M8 17h5"/>','<path d="M12 3a5 5 0 0 0-5 5v3l-2 3h14l-2-3V8a5 5 0 0 0-5-5Z"/><path d="M10 18h4"/>','<path d="M4 6h16v11H9l-5 4V6Z"/><path d="M8 10h8M8 13h5"/>','<path d="M5 3h14v18H5z"/><path d="M8 7h8M8 11h8M8 15h5"/>','<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 20V9"/>'];
    const accents=[
      ['ключевые темы бьюти-бизнеса','два предпринимательских опыта и два рынка'],
      ['Живые встречи с Лерой и Тихоном','работа с участниками'],
      ['реальными салонами, студиями, мастерами, экспертами','бьюти-проектами'],
      ['конкретная работа со своим проектом','не просто следующий урок'],
      ['Помощь по программе, заданиям и внедрению','не остаться один на один с материалами'],
      ['обмен опытом и поддержка участников','на протяжении всей программы'],
      ['Таблицы, чек-листы, шаблоны, скрипты, инструкции','по каждому блоку'],
      ['Все видеоподкасты, задания, материалы и записи живых встреч','в одном месте']
    ];
    const cards=[0,1,2,3,4,5,6,7].map((_,i)=>{let copy=esc(ls[3+i*2]);accents[i].forEach(part=>copy=copy.replace(part,'<strong>'+part+'</strong>'));return '<article class="resource-slide"><span class="resource-icon resource-icon-'+(i+1)+'" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+icons[i]+'</svg></span><h3>'+esc(ls[2+i*2])+'</h3><p>'+copy+'</p></article>'}).join('');
    return '<div class="resource-heading"><div>'+renderLine(ls[0],0)+renderLine(ls[1],1)+'</div><div class="resource-controls"><button class="resource-prev" type="button" aria-label="Предыдущий пункт">←</button><button class="resource-next" type="button" aria-label="Следующий пункт">→</button></div></div><div class="resource-slider" tabindex="0">'+cards+'</div><div class="resource-dots" aria-hidden="true">'+Array.from({length:8},(_,i)=>'<i class="'+(i===0?'is-active':'')+'"></i>').join('')+'</div>';
  }
  if(n===12){
    const cases=ls.slice(3,12).map((line,i)=>'<p class="case-chip" data-case="'+String(i+1).padStart(2,'0')+'"><span class="case-source-dash" aria-hidden="true">— </span>'+esc(line.replace(/^—\s*/,''))+'</p>').join('');
    const stepIcons=['<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/>','<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/><path d="M8.5 10.5h4"/>','<path d="M4 5h16v12H9l-5 4V5Z"/><path d="M10 9a2.2 2.2 0 1 1 3.2 2c-.8.4-1.2.8-1.2 1.7M12 15.5h.01"/>','<path d="M4 18 9 13l4 3 7-9"/><path d="M16 7h4v4"/>','<circle cx="12" cy="12" r="8"/><path d="m9 12 2 2 4-5M12 4V2M20 12h2"/>'];
    const steps=ls[13].split(' → ').map((step,i)=>'<span class="case-step"><span class="case-step-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+stepIcons[i]+'</svg></span>'+esc(step)+'</span>'+(i<4?' <i aria-hidden="true">→</i> ':'')).join('');
    return '<div class="case-visual"><figure aria-hidden="true"><img src="assets/speaker-finance-event.jpg" alt="" loading="lazy" decoding="async"></figure><div class="case-intro"><h2>'+esc(ls[0])+'</h2><p>'+esc(ls[1])+'</p><h3>'+esc(ls[2])+'</h3></div><div class="case-chip-grid">'+cases+'</div></div><div class="case-process"><h3>'+esc(ls[12])+'</h3><div class="case-steps">'+steps+'</div><p class="case-conclusion">'+esc(ls[14])+'</p></div>';
  }
  if(n===13){
    const icons=['<path d="M5 19V9M12 19V5M19 19v-7"/><path d="M3 19h18"/>','<path d="M4 18 9 12l4 3 7-9"/><path d="M16 6h4v4"/>','<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c.6-4 2.5-7 6-7s5.4 3 6 7M14 14c3 0 5 2 6 5"/>','<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 20c.5-4 2-7 5-7s4.5 3 5 7M11 20c.5-4 2-7 5-7s4.5 3 5 7"/>','<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/>','<path d="M12 3 15 9l6 .8-4.5 4.3 1.2 6L12 17l-5.7 3.1 1.2-6L3 9.8 9 9 12 3Z"/>','<path d="M5 19 19 5M10 5h9v9"/>'];
    const cards=[0,1,2,3,4,5,6].map((_,i)=>'<article class="outcome-card outcome-'+(i+1)+'"><span class="outcome-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+icons[i]+'</svg></span><div><h3>'+esc(ls[3+i*2])+'</h3><p>'+esc(ls[4+i*2])+'</p></div></article>').join('');
    const coreSteps=ls[18].split(' → ');
    const coreRoute=coreSteps.map((step,i)=>'<span class="outcome-route-step">'+esc(step)+'</span>'+(i<coreSteps.length-1?'<i class="outcome-route-arrow" aria-hidden="true"> → </i>':'')).join('');
    const core='<article class="outcome-core"><span aria-hidden="true">✦</span><h3>'+esc(ls[17])+'</h3><p class="outcome-route">'+coreRoute+'</p></article>';
    return '<div class="outcome-header"><h2>'+esc(ls[0])+'</h2><div><h3>'+esc(ls[1])+'</h3><p>'+esc(ls[2])+'</p></div></div><div class="outcome-map">'+cards+core+'</div>';
  }
  if(n===15){
    const starts=ls.map((line,i)=>/^\d{2}\. /.test(line)?i:-1).filter(i=>i>=0);
    const intro=ls.slice(0,starts[0]);
    const icons=[
      '<path d="M8 11V8a4 4 0 0 1 8 0v3"/><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M12 15v2"/>',
      '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c.5-4 2-7 5-7s4.5 3 5 7M11 20c.5-4 2-7 5-7s4.5 3 5 7"/>',
      '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9M12 3v2M21 12h-2M12 21v-2M3 12h2"/>',
      '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h7"/>',
      '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>'
    ];
    const cards=starts.map((start,i)=>{const part=ls.slice(start,starts[i+1]??ls.length);return '<article class="journey-item"><span class="journey-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+icons[i]+'</svg></span><h3>'+esc(part[0])+'</h3>'+part.slice(1).map((line,j)=>renderLine(line,j+1)).join('')+'</article>'}).join('');
    return intro.map(renderLine).join('')+'<div class="journey-item-grid">'+cards+'</div>';
  }
  if(n===14){
    const starts=ls.map((l,i)=>/^CREATOR(?: PRO| VIP)?$/.test(l)?i:-1).filter(i=>i>=0);
    const end=ls.indexOf('Не знаете, какой формат выбрать?');
    const tariffPhotos=['tariff-creator-v2.webp','tariff-pro-v2.webp','tariff-vip-v2.webp'];
    return ls.slice(0,starts[0]).map(renderLine).join('')+'<div class="participation-grid">'+starts.map((s,i)=>{const part=ls.slice(s,starts[i+1]??end);return '<article class="participation-card tariff-'+(i+1)+'"><figure class="tariff-photo"><img src="assets/'+tariffPhotos[i]+'" alt="" loading="lazy" decoding="async"><h3 class="participation-name">'+esc(part[0])+'</h3></figure><div class="participation-card-body"><details class="participation-details" open><summary>'+esc(part[1])+'</summary><div>'+part.slice(2).map((l,j)=>renderLine(l,j+2)).join('')+'</div></details></div></article>'}).join('')+'</div><div class="participation-help">'+ls.slice(end).map((l,i)=>renderLine(l,i+1)).join('')+'</div>';
  }
  if(n===7){
    const split=ls.indexOf('ТИХОН БЕЛЯЕВ');
    return [ls.slice(0,split),ls.slice(split)].map((part,i)=>{const firstBullet=part.findIndex(x=>x.startsWith('—'));const closing=part.at(-1);const intro=part.slice(2,firstBullet);const bullets=part.slice(firstBullet,-1);return '<article class="mentor-story mentor-'+(i?'tikhon':'lera')+'"><div class="mentor-stage" aria-hidden="true"><i></i><img loading="lazy" decoding="async" src="assets/'+(i?'tikhon-cutout.webp':'lera-cutout.webp')+'" alt=""></div><div class="mentor-content"><header><h2>'+esc(part[0])+'</h2><h3>'+esc(part[1])+'</h3></header><div class="mentor-intro">'+intro.map((line,j)=>'<p class="'+(j===intro.length-1?'mentor-list-label':'')+'">'+esc(line)+'</p>').join('')+'</div><div class="mentor-experience">'+bullets.map((line,j)=>renderLine(line,j)).join('')+'</div><p class="mentor-final">'+esc(closing)+'</p></div></article>'}).join('');
  }
  if(n===9){
    const starts=ls.map((line,i)=>/^0[1-8]\. /.test(line)?i:-1).filter(i=>i>=0);
    const intro=ls.slice(0,starts[0]);
    const modules=starts.map((start,i)=>ls.slice(start,starts[i+1]??ls.length));
    const mockupPhotos=['methodology-generated.webp','work-table.webp','lera-live-event.webp','beauty-studio.webp','personal-strategy-generated.webp','lera-stage-talk.webp','hero-duo-extended.jpg','two-markets-generated.webp'];
    const mockupLabels=['ДИАГНОСТИКА','ФИНАНСЫ','КОМАНДА','СЕРВИС','КЛИЕНТЫ','МАРКЕТИНГ','БРЕНД','РОСТ'];
    const moduleIcons={
      'РАЗБЕРЁМ:':'<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/><circle cx="10.5" cy="10.5" r="1.4"/>',
      'ПРАКТИЧЕСКОЕ ЗАДАНИЕ':'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h6M8 18h4"/>',
      'ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ':'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5M9 12h7M9 16h7"/>',
      'РЕЗУЛЬТАТ БЛОКА':'<path d="m12 3 2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5Z"/>'
    };
    const cards=modules.map((module,i)=>{
      let group='';
      const body=module.slice(1).map((line,j)=>{
        if(moduleIcons[line]){group=line;return '<h3 class="module-section-title"><span class="module-section-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+moduleIcons[line]+'</svg></span><span>'+esc(line)+'</span></h3>'}
        const rendered=renderLine(line,j+1);
        return group==='ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ'&&rendered.startsWith('<p>')?rendered.replace('<p>','<p class="doc-bullet module-material-item">'):rendered;
      }).join('');
      return '<details class="module module-product"><summary><span class="module-object object-'+(i+1)+'" data-index="'+String(i+1).padStart(2,'0')+'" data-label="'+mockupLabels[i]+'" aria-hidden="true"><i class="mockup-back"></i><i class="mockup-face"><img src="assets/'+mockupPhotos[i]+'" alt="" loading="lazy" decoding="async"><b></b></i><i class="mockup-edge"></i></span><span class="module-title">'+esc(module[0])+'</span><span class="module-plus" aria-hidden="true">+</span></summary><div class="module-body">'+body+'</div></details>';
    }).join('');
    const programStages=intro[4].split(' → ');
    const programFlow=programStages.map((stage,i)=>'<span class="program-stage">'+esc(stage)+'</span>'+(i<programStages.length-1?'<span class="program-arrow" aria-hidden="true"> → </span>':'')).join('');
    return '<div class="program-intro"><div class="program-title">'+intro.slice(0,2).map(renderLine).join('')+'</div><div class="program-lead"><p class="program-kicker">'+esc(intro[2])+'</p><p class="program-label">'+esc(intro[3])+'</p><div class="program-flow" aria-label="'+esc(intro[4])+'">'+programFlow+'</div><p class="program-materials">'+esc(intro[5])+'</p></div></div><div class="module-gallery">'+cards+'</div>';
  }
  if(n===10){
    const icons=['<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/>','<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h5M8 16h7"/>','<path d="M4 17v-4a8 8 0 0 1 16 0v4"/><path d="M4 15h3v5H4zM17 15h3v5h-3z"/>','<path d="M4 6h16v11H9l-5 4V6Z"/><path d="M8 10h8M8 13h5"/>','<path d="m5 13 4 4L19 7"/><circle cx="12" cy="12" r="9"/>'];
    const cards=[0,1,2,3,4].map((_,i)=>{
      const title=esc(ls[4+i*2]).replace(/^(0[1-5]\.\s*)/,'<span class="process-number">$1</span>');
      return '<article class="process-card" data-step="'+String(i+1).padStart(2,'0')+'"><span class="process-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+icons[i]+'</svg></span><h2>'+title+'</h2><p>'+esc(ls[5+i*2])+'</p></article>';
    }).join('');
    return '<div class="process-intro">'+ls.slice(0,4).map(renderLine).join('')+'</div><div class="process-grid">'+cards+'</div>';
  }
  if(n===3){
    const title='<h2 class="chat-title"><span>С КАКИМИ </span><span>ЗАПРОСАМИ </span><span>ПРИХОДЯТ В </span><strong>CREATOR</strong></h2>';
    const messages=ls.slice(1,-1).map(line=>'<blockquote class="chat-message">'+esc(line)+'</blockquote>').join('');
    const chatPhotos=['methodology-generated.webp','two-markets-generated.webp','live-work-generated.webp','personal-strategy-generated.webp','lera-stage-talk.webp','work-table.webp','speaker-finance-event.jpg','beauty-studio.webp','lera-event-audience.webp'].map((src,i)=>'<figure class="chat-photo chat-photo-'+(i+1)+'"><img src="assets/'+src+'" alt="" loading="lazy" decoding="async"></figure>').join('');
    return title+'<div class="chat-photos" aria-hidden="true">'+chatPhotos+'</div><div class="chat-cloud" tabindex="0">'+messages+'</div><div class="chat-controls"><button class="chat-prev" type="button" aria-label="Предыдущий запрос">←</button><span class="chat-counter" aria-live="polite">01 / '+String(ls.length-2).padStart(2,'0')+'</span><button class="chat-next" type="button" aria-label="Следующий запрос">→</button></div><p class="chat-finale">'+esc(ls.at(-1))+'</p>';
  }
  if(n===4){
    const taskPhotos=['speaker-finance-event.jpg','work-table.webp','beauty-studio.webp','lera-live-event.webp','hero-duo-extended.jpg','lera-event-audience.webp'];
    const groups=[];let group=[];
    ls.slice(1).forEach(line=>{if(/^ЗАДАЧА \d+/.test(line)){if(group.length)groups.push(group);group=[line]}else group.push(line)});if(group.length)groups.push(group);
    const slides=groups.map((task,i)=>'<article class="task-slide" data-slide="'+i+'"><figure class="task-photo"><img src="assets/'+taskPhotos[i]+'" alt="" loading="lazy" decoding="async"></figure><div class="task-copy"><h2>'+esc(task[0])+'</h2><h3>'+esc(task[1])+'</h3><div class="task-action"><p>'+esc(task[2])+'</p><p>'+esc(task[3])+'</p></div><div class="task-result"><p>'+esc(task[4])+'</p><p>'+esc(task[5])+'</p></div></div></article>').join('');
    return '<div class="task-heading"><h2>'+esc(ls[0])+'</h2><div class="task-controls"><button class="task-prev" type="button" aria-label="Предыдущая задача">←</button><button class="task-next" type="button" aria-label="Следующая задача">→</button></div></div><div class="task-slider" tabindex="0">'+slides+'</div><div class="task-dots" aria-hidden="true">'+groups.map((_,i)=>'<i class="'+(i===0?'is-active':'')+'"></i>').join('')+'</div>';
  }
  if(n===5){
    const stages=ls[4].split(' → ');
    const flow=stages.map((stage,i)=>'<span class="flow-stage">'+esc(stage)+'</span>'+(i<stages.length-1?'<span class="flow-separator"> → </span>':'')).join('');
    return ls.slice(0,4).map(renderLine).join('')+'<div class="living-flow" aria-label="'+esc(ls[4])+'">'+flow+'<i class="flow-glow" aria-hidden="true"></i></div>';
  }
  if(n===6){
    const tagline=esc(ls[1]).replace('ДВА ПРЕДПРИНИМАТЕЛЯ. ','<span>ДВА ПРЕДПРИНИМАТЕЛЯ.</span> ').replace('ДВА РЫНКА. ','<span>ДВА РЫНКА.</span> ').replace('ОДНА ИНДУСТРИЯ.','<strong>ОДНА ИНДУСТРИЯ.</strong>');
    return '<div class="collab-layout"><div class="collab-intro"><h2>'+esc(ls[0])+'</h2><h3>'+tagline+'</h3></div><div class="collab-stage" aria-hidden="true"><div class="collab-half collab-europe"><i></i><img src="assets/lera-cutout.webp" alt="" loading="lazy" decoding="async"></div><div class="collab-symbol"><span>×</span></div><div class="collab-half collab-ukraine"><i></i><img src="assets/tikhon-cutout.webp" alt="" loading="lazy" decoding="async"></div></div><div class="collab-story"><p>'+esc(ls[2])+'</p><p>'+esc(ls[3])+'</p></div><div class="collab-conclusion"><p class="collab-power">'+esc(ls[4])+'</p><p class="collab-final">'+esc(ls[5])+'</p></div></div>';
  }
  if(n===8){
    const photos=['beauty-studio.webp','work-table.webp','lera-stage-talk.webp','personal-strategy-generated.webp'];
    const accents=[
      ['развивает личный бренд','больше зарабатывать','привлекать клиентов системнее','построению собственного проекта'],
      ['усилить финансы, маркетинг, команду, клиентскую базу и управление бизнесом'],
      ['развивать личный бренд','упаковывать свою экспертность','создавать новые направления дохода'],
      ['команду, процессы, финансы, сервис, маркетинг и показатели проекта','управлять ими более системно']
    ];
    const cards=[0,1,2,3].map((_,i)=>{
      let copy=esc(ls[3+i*2]);
      const title=esc(ls[2+i*2]).replace(/^(0[1-4]\.\s*)/,'<span class="audience-number">$1</span>');
      accents[i].forEach(part=>copy=copy.replace(part,'<strong>'+part+'</strong>'));
      return '<article class="audience-card"><figure><img src="assets/'+photos[i]+'" alt="" loading="lazy" decoding="async"></figure><div><h2>'+title+'</h2><p>'+copy+'</p></div></article>';
    }).join('');
    const finale=esc(ls[10]).replace('каждый работает со своей текущей точкой и задачами бизнеса','<strong>каждый работает со своей текущей точкой и задачами бизнеса</strong>');
    return '<h2 class="audience-title">'+esc(ls[0])+'</h2><p class="audience-lead">'+esc(ls[1])+'</p><div class="audience-card-grid">'+cards+'</div><p class="audience-finale"><span>'+finale+'</span></p>';
  }
  const pattern=n===4?/^ЗАДАЧА \d+/:([2,8,9,10].includes(n)?/^\d{2}\. /:null);
  if(!pattern)return ls.map(renderLine).join('');
  let out='',group=null;
  const flush=()=>{if(!group)return;out+=n===9?'<details class="module"><summary>'+esc(group[0])+'<span aria-hidden="true">+</span></summary><div class="module-body">'+group.slice(1).map(renderLine).join('')+'</div></details>':'<article class="editorial-card">'+group.map(renderLine).join('')+'</article>';group=null};
  for(let i=0;i<ls.length;i++){if(pattern.test(ls[i])){flush();group=[ls[i]]}else if(group)group.push(ls[i]);else out+=renderLine(ls[i],i)}flush();return out;
}

function groupedPanels(ls,start,isHeading,cls,accordion=false){
  let out=ls.slice(0,start).map(renderLine).join('')+'<div class="'+cls+'-grid">',group=[];
  const flush=()=>{if(!group.length)return;out+=accordion?'<details class="'+cls+'"><summary>'+esc(group[0])+'</summary><div>'+group.slice(1).map((l,i)=>renderLine(l,i+1)).join('')+'</div></details>':'<article class="'+cls+'"><h3>'+esc(group[0])+'</h3>'+group.slice(1).map((l,i)=>renderLine(l,i+1)).join('')+'</article>';group=[]};
  ls.slice(start).forEach(l=>{if(isHeading(l))flush();group.push(l)});flush();return out+'</div>';
}

function renderAbout(ls){
  const first=ls.findIndex(l=>/^01\. /.test(l));
  const features=ls.slice(first,-1);let cards='';
  const featurePhotos=['methodology-generated.webp','two-markets-generated.webp','live-work-generated.webp','personal-strategy-generated.webp'];
  const featureHighlights=[['финансы, маркетинг, клиенты, команда, управление и рост'],['разные подходы к одним и тем же бизнес-задачам','Европы и Украины'],['Еженедельные онлайн-мастермайнды','практические разборы','реальными ситуациями участников'],['решения и план действий','текущую точку и задачи бизнеса']];
  for(let i=0;i<features.length;i+=2){let copy=esc(features[i+1]);for(const phrase of featureHighlights[i/2])copy=copy.replace(phrase,'<strong>'+phrase+'</strong>');cards+='<article class="about-feature"><figure class="about-feature-photo feature-photo-'+(i/2)+'"><img src="assets/'+featurePhotos[i/2]+'" alt="" loading="lazy" decoding="async" width="600" height="450"></figure><h3>'+esc(features[i])+'</h3><p>'+copy+'</p></article>'}
  const title=esc(ls[0]).replace('ОБУЧАЮЩАЯ ','ОБУЧАЮЩАЯ<span class="about-orbit" aria-hidden="true"><i></i><i></i><i></i><b></b></span><span class="about-word-gap"> </span>');
  const intro=esc(ls[1]).replace('методологии, практических инструментов и наставничества','<strong>методологии, практических инструментов и наставничества</strong>').replace('Леры Румы и Тихона Беляева','<strong class="about-names">Леры Румы и Тихона Беляева</strong>').replace('Европы и Украины','<strong>Европы и Украины</strong>');
  const focus=esc(ls[2]).replace('живой работе с участниками и их бизнесами','<strong>живой работе с участниками и их бизнесами</strong>');
  const iconPaths=[
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10l1.5 1.5L12 9M14 10h2M8 16l1.5 1.5L12 15M14 16h2"/>',
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M8 15h2M14 15h2M8 18h2"/>',
    '<path d="M21 11a8 8 0 0 1-8 8H7l-4 3v-7a8 8 0 0 1 8-12h2a8 8 0 0 1 8 8Z"/><path d="M8 10h8M8 14h5"/>',
    '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5c4 2 10 2 14 0M5 17.5c4-2 10-2 14 0"/>'
  ];
  const highlights=['персональной стратегией развития','конкретные задачи своего бизнеса','еженедельных онлайн-мастермайндах','практические разборы и обратную связь','внедрять инструменты','двух разных рынках — Украины и Европы'];
  const actions=ls.slice(4,first-1).map((l,i)=>'<article class="about-action"><span class="about-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+iconPaths[i]+'</svg></span><p>'+esc(l).replace(/^— /,'<span class="action-source-dash" aria-hidden="true">— </span>').replace(highlights[i],'<strong>'+highlights[i]+'</strong>')+'</p></article>').join('');
  const finaleAccent='РЕАЛЬНО ПОРАБОТАТЬ НАД СВОИМ БИЗНЕСОМ.';
  const finale=esc(ls.at(-1)).replace(finaleAccent,'<strong>'+finaleAccent+'</strong>');
  return '<div class="about-intro"><h2 class="about-title">'+title+'</h2><p>'+intro+'</p></div><div class="about-wine"><div class="about-practice"><h3>'+focus+'</h3><p class="about-caption">'+esc(ls[3])+'</p><div class="about-actions">'+actions+'</div></div><div class="about-method"><h3 class="about-method-title">'+esc(ls[first-1])+'</h3><div class="about-features">'+cards+'</div></div><div class="about-finale"><p>'+finale+'</p></div></div>';
}
function media(n){
  if(n===1)return `<div class="hero-media" aria-hidden="true"><img class="hero-bg" src="assets/hero-background-only.webp" alt=""><img class="hero-person hero-lera" src="assets/lera-cutout.webp" alt=""><img class="hero-person hero-tikhon" src="assets/tikhon-cutout.webp" alt=""></div>`;
  if(n===6)return '';
  if(n===7)return '';
  if(n===700)return `<div class="document-photo-grid" aria-hidden="true"><img src="assets/lera-avatar.png" alt=""><img src="assets/tikhon-belyaev-portrait.jpg" alt=""></div>`;
  if(n===9)return `<div class="document-photo photo-tall" aria-hidden="true"><img src="assets/speaker-finance-event.jpg" alt=""></div>`;
  if(n===12)return '';
  return '';
}
export function buildExactDocumentSite(sections){
  const ordered=header()+Array.from({length:17},(_,i)=>renderSection(i+1,sections[i+1]||'' )).join('');
  const emphasized=emphasizeBodyCopy(ordered);
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#360710"><title>CREATOR — Лера Рума × Тихон Беляев</title><meta name="description" content="Практическая программа для бьюти-предпринимателей"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%2352141f'/%3E%3Ctext x='32' y='47' text-anchor='middle' font-family='Georgia' font-size='47' fill='%23ecd9b5'%3EC%3C/text%3E%3C/svg%3E"><link rel="preload" href="assets/creator.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="assets/hero-stage-screen-audience.webp" as="image" type="image/webp" fetchpriority="high"><link rel="stylesheet" href="exact.css?v=20260920-102"><script src="exact.js?v=20260920-102" defer></script></head><body><div class="reading-progress" aria-hidden="true"></div><main>${emphasized}</main></body></html>`;
}
