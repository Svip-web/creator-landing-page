const photo=(src,alt,cls='',depth=0)=>`<figure class="editorial-photo ${cls}" data-depth="${depth}"><img src="assets/${src}" alt="${alt}" loading="lazy" width="1024" height="1536"></figure>`;
export function composeEditorial(html){
html=html.replace('<link rel="stylesheet" href="visual.css">','<link rel="stylesheet" href="visual.css"><link rel="stylesheet" href="composition.css">');
html=html.replace('<div class="floating-note note-one"><b>6</b><span>недель<br>на новый уровень</span></div>',`<div class="hero-polaroid" data-depth="-12"><img src="assets/lera-stage-talk.png" alt="Лера Рума на сцене бизнес-конференции" width="331" height="213"><span>Из реального опыта — в ваш бизнес</span></div>`);
html=html.replace('<div class="concepts">',`<div class="about-spread"><div class="about-collage" data-photo-scene>${photo('beauty-studio.png','Атмосферная иллюстрация интерьера бьюти-студии','studio-tall',35)}${photo('lera-live-event.png','Лера на бизнес-конференции','live-inset',-40)}<span class="handwritten">Создавать.<br>Вдохновлять.<br>Расти.</span><span class="photo-caption">БИЗНЕС НАЧИНАЕТСЯ С ВАШЕГО ВИДЕНИЯ</span></div><div class="concepts">`);
html=html.replace('<details class="more">','</div><details class="more">');
html=html.replace('<div class="quotes">',`<div class="request-composition"><div class="request-photo" data-photo-scene>${photo('work-table.png','Атмосферная иллюстрация рабочего стола бьюти-предпринимателя','desk-photo',35)}<span class="request-handwritten">Всё на вас?<br>Пора иначе.</span>${photo('tikhon-belyaev-portrait.jpg','Тихон Беляев','request-inset',-25)}</div><div class="quotes">`);
html=html.replace('<p class="closing-line">CREATOR начинается','</div><p class="closing-line">CREATOR начинается');
html=html.replace('<div class="task-grid">',`<div class="task-editorial"><div class="task-cover" data-photo-scene>${photo('beauty-studio.png','Атмосферная иллюстрация бьюти-пространства','',25)}<span>Место, в котором<br><em>рождается ваш бренд.</em></span></div><div class="task-grid">`);
html=html.replace('<section class="section dark method">','</div><section class="section dark method">');
// Close task wrapper inside its section, retaining valid section nesting.
html=html.replace('</div></section>\n</div><section class="section dark method">','</div></div></section>\n<section class="section dark method">');
html=html.replace('<div class="photo-ribbon">','<div class="photo-ribbon" data-photo-scene>');
html=html.replace('ribbon-photo photo-a"','ribbon-photo photo-a" data-depth="45"');
html=html.replace('ribbon-photo photo-b"','ribbon-photo photo-b" data-depth="-25"');
html=html.replace('ribbon-photo photo-c"','ribbon-photo photo-c" data-depth="60"');
html=html.replace('<div class="experts">','<div class="mentor-annotation">Сильные проекты строят <em>люди.</em></div><div class="experts">');
html=html.replace('<div class="portrait"><img src="assets/lera-avatar.png"','<div class="portrait portrait-lera"><img src="assets/lera-avatar.png"');
html=html.replace('<h2><span class="huge">8</span> блоков.<br><em>Одна система.</em></h2>','<h2>От вашего запроса —<br><em>к работающей системе.</em></h2>');
html=html.replace('<b>8</b><p>точек опоры<br>для вашего бизнеса</p>','<p class="script-caption">Опыт,<br>который<br>работает.</p><small>8 ПРАКТИЧЕСКИХ БЛОКОВ</small>');
html=html.replace('<div class="steps">',`<div class="learning-story"><div class="learning-photos" data-photo-scene>${photo('lera-event-audience.png','Участники бизнес-конференции','learning-wide',35)}${photo('lera-stage-talk.png','Выступление Леры Румы','learning-tall',-35)}<span class="handwritten">Включайтесь<br>в живую работу.</span></div><div class="steps">`);
html=html.replace('<section class="section">'+ '<div class="section-label"><span>09</span>','</div><section class="section"><div class="section-label"><span>09</span>');
html=html.replace('</div></section>\n</div><section class="section"><div class="section-label"><span>09</span>','</div></div></section>\n<section class="section"><div class="section-label"><span>09</span>');
html=html.replace('<div class="included-grid">',`<div class="materials-composition"><div class="materials-photo" data-photo-scene>${photo('work-table.png','Атмосферная иллюстрация рабочего процесса','',30)}<span class="handwritten">Ваши идеи.<br>Ваши решения.</span></div><div class="included-grid">`);
html=html.replace('<section class="section case-section">','</div><section class="section case-section">');
html=html.replace('</div></section>\n</div><section class="section case-section">','</div></div></section>\n<section class="section case-section">');
html=html.replace('<div class="case-flow">',`<div class="case-photo-duo" data-photo-scene>${photo('hero-cinematic.png','Лера Рума и Тихон Беляев — менторы программы','',18)}</div><div class="case-flow">`);
html=html.replace('<span class="statement-arrow" aria-hidden="true">↗</span>',`${photo('beauty-studio.png','Атмосферная иллюстрация бьюти-студии','outcome-photo',20)}`);
html=html.replace('<section class="section final-cta">',`<section class="section final-cta"><div class="final-photo-layout" data-photo-scene>${photo('lera-live-event.png','Лера на бизнес-мероприятии','final-shot-a',35)}${photo('tikhon-belyaev-portrait.jpg','Тихон Беляев','final-shot-b',-30)}`);
html=html.replace('<p class="start">Дата старта уточняется</p></section>','<p class="start">Дата старта уточняется</p></div></section>');
return html;
}
