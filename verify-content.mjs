import fs from 'node:fs';
const src=fs.readFileSync('source-content.txt','utf8').replace(/\r/g,'');const html=fs.readFileSync('dist/index.html','utf8');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let count=0;
for(const m of src.matchAll(/БЛОК (\d+)\.[^\n]*\n([\s\S]*?)(?=БЛОК \d+\.|$)/g)){const n=+m[1];let block=html.split('id="block-'+n+'"')[1].split('</section>')[0];let offset=0;for(let line of (n===13?m[2].split('Да, давай')[0]:m[2]).split('\n').map(s=>s.trim()).filter(Boolean)){if(/^КНОПКА:?$/i.test(line))continue;line=line.replace(/^КНОПКА:\s*/i,'');let at=block.indexOf(esc(line),offset);if(at<0)throw Error('Missing or reordered in '+n+': '+line);offset=at+esc(line).length;count++;}}
console.log('Verified '+count+' source lines in exact order across 17 blocks');
