import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const dist=join(root,'dist');
const source=readFileSync(join(dist,'index.html'),'utf8');
const translations=JSON.parse(readFileSync(join(root,'scripts','locales-data.json'),'utf8'));
const langs=translations.languages;
const names=translations.labels;
const host='https://bra.pomerol.trade';
const titles=[
 'POMEROL | Thermal Intimates Manufacturer',
 'POMEROL | 保暖内衣制造与批发',
 'POMEROL | 保暖內衣製造與批發',
 'POMEROL | 保温インナーウェアの製造・卸売',
 'POMEROL | Производитель термобелья',
 'POMEROL | Fabricación de ropa interior térmica',
 'POMEROL | Fabricante de roupa íntima térmica'
];
const descs=[
 'Thermal intimates, integrated-cup camisoles and wholesale product presentation from Pomerol Intimates.',
 'Pomerol Intimates 保暖内衣与内置胸垫背心，面向国际市场的制造与批发目录。',
 'Pomerol Intimates 保暖內衣與內置胸墊背心，面向國際市場的製造與批發目錄。',
 'Pomerol Intimatesの保温インナー、カップ付きキャミソールと海外卸売カタログ。',
 'Термобельё и майки со встроенными чашечками Pomerol Intimates для оптовых покупателей.',
 'Ropa interior térmica y camisetas con copas integradas para compradores mayoristas.',
 'Roupa íntima térmica e camisolas com bojo integrado para compradores de atacado.'
];
const extraStyles='<style>.bra-language{margin-left:10px;min-width:120px}.bra-language select{max-width:154px;width:100%;padding:9px 10px;border:1px solid #d6c9c0;border-radius:2px;background:#fff;color:#3b322e;font:600 12px Arial,sans-serif}.bra-language select:focus-visible{outline:2px solid #976d5c}@media(max-width:740px){.bra-language{margin-left:auto;margin-right:12px;min-width:108px}.bra-language select{max-width:118px;font-size:11px;padding:7px 5px}}</style>';
const codePaths=langs.map(x=>'/'+x+'/');

function runtime(index){
 const dict=Object.fromEntries(translations.rows.map(r=>[r[0],r[index]||r[0]]));
 const options=langs.map((code,i)=>({code,label:names[i]}));
 return [
 'const BRA_LOCALE='+JSON.stringify(langs[index])+';',
 'const BRA_LOCALES='+JSON.stringify(options)+';',
 'const BRA_DICT='+JSON.stringify(dict)+';',
 'function tr(s){',
 " const value=String(s??'');",
 ' if(Object.prototype.hasOwnProperty.call(BRA_DICT,value))return BRA_DICT[value];',
 " if(/^[0-9]+ COLORS$/.test(value))return value.replace('COLORS',tr('COLORS'));",
 " if(/^STYLE NO[.] [0-9]+#$/.test(value))return value.replace('STYLE NO.',tr('STYLE NO.'));",
 " if(value.includes(' / ')){const a=value.split(' / ');if(/^[0-9]+$/.test(a[0]))return a[0]+' / '+tr(a.slice(1).join(' / '));}",
 " if(value.endsWith('All rights reserved.'))return value.replace('All rights reserved.',tr('All rights reserved.'));",
 " if(value.includes(' · '))return value.split(' · ').map(p=>BRA_DICT[p]||p).join(' · ');",
 ' return value;',
 '}',
 'function translateSite(){',
 ' document.documentElement.lang=BRA_LOCALE;',
 ' const walker=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);',
 ' let node;',
 " while((node=walker.nextNode())){const s=node.nodeValue;const key=s.trim();if(!key)continue;const text=tr(key);if(text!==key)node.nodeValue=s.replace(key,text);}",
 " app.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{el.placeholder=tr(el.placeholder)});",
 " app.querySelectorAll('img[alt]').forEach(el=>{el.alt=tr(el.alt)});",
 " const header=app.querySelector('header');",
 ' if(!header)return;',
 " const wrap=document.createElement('label');wrap.className='bra-language';wrap.setAttribute('aria-label','Language / 语言');",
 " const input=document.createElement('select');input.id='bra-language';input.setAttribute('aria-label','Select language');",
 " for(const x of BRA_LOCALES){const option=document.createElement('option');option.value=x.code;option.textContent=x.label;option.selected=x.code===BRA_LOCALE;input.appendChild(option);}",
 " wrap.appendChild(input);header.insertBefore(wrap,header.querySelector('#mobileMenu')||null);",
 " input.addEventListener('change',e=>{const next=e.target.value;try{localStorage.setItem('pomerol_bra_locale',next)}catch(err){}location.assign('/'+next+'/'+location.hash)});",
 '}',
 'function localizedMailTo(style){',
 ' const original=buildMailTo(style);const at=original.indexOf("?");if(at<0)return original;',
 ' const mail=original.slice(0,at);const params=new URLSearchParams(original.slice(at+1));',
 " const sourceSubject=params.get('subject')||'';params.set('subject',tr('Wholesale Inquiry')+' - '+sourceSubject.replace(/^Wholesale Inquiry - /,''));",
 " const body=params.get('body')||'';",
 " const fields=[['Name','Name'],['Company / Brand','Company / Brand'],['Email','Email'],['Country / Region','Country / Region'],['Interested Style','Interested Style'],['Estimated Quantity','Estimated Quantity']];",
 " let translated=body;for(const item of fields){translated=translated.replace(item[0]+':',tr(item[1])+':');}",
 " translated=translated.replace('Message:',tr('Message:'));params.set('body',translated);",
 " return mail+'?'+params.toString();",
 '}'
 ].join('\n');
}
function build(index){
 const lang=langs[index];
 let html=source.replace(/<html lang="[^"]+"/,'<html lang="'+lang+'"');
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+titles[index]+'</title>');
 html=html.replace(/<meta name="description" content="[^"]*"\s*\/>/,'<meta name="description" content="'+descs[index]+'"/>');
 // Do not make visitors in mainland China wait on fonts.googleapis.com.
 html=html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*<link href="https:\/\/fonts\.googleapis\.com[^>]+>/,'');
 html=html.replaceAll("'Playfair Display'","Georgia").replaceAll("'DM Sans'","Arial");
 const links=['<link rel="canonical" href="'+host+'/'+lang+'/">']
  .concat(langs.map(c=>'<link rel="alternate" hreflang="'+(c==='zh-cn'?'zh-CN':c==='zh-tw'?'zh-TW':c)+'" href="'+host+'/'+c+'/">'))
  .concat(['<link rel="alternate" hreflang="x-default" href="'+host+'/en/">']).join('\n');
 html=html.replace('</head>',extraStyles+'\n'+links+'\n</head>');
 const hook=/(function render\(\)\s*\{[\s\S]*?app\.innerHTML\s*=\s*[^;]+;\s*)(bind\(\);)/;
 if(!hook.test(html))throw Error('Render hook not found');
 html=html.replace(hook,'$1translateSite();\n  $2');
 html=html.replaceAll('window.location.href = buildMailTo(', 'window.location.href = localizedMailTo(');
 const start=/\nrender\(\);\s*(<\/script>)/;
 if(!start.test(html))throw Error('Startup render not found');
 html=html.replace(start,'\n'+runtime(index)+'\nrender();\n$1');
 if(lang==='en'){
  const init=[
   "if(location.pathname==='/' || location.pathname==='/index.html'){",
   " let next='en';try{next=localStorage.getItem('pomerol_bra_locale')||'en'}catch(err){}",
   " if(next==='en'){const n=(navigator.language||'').toLowerCase();next=n.startsWith('zh-tw')||n.startsWith('zh-hk')?'zh-tw':n.startsWith('zh')?'zh-cn':n.startsWith('ja')?'ja':n.startsWith('ru')?'ru':n.startsWith('es')?'es':n.startsWith('pt')?'pt':'en';}",
   " if(!BRA_LOCALES.some(x=>x.code===next))next='en';",
   " location.replace('/'+next+'/'+location.hash);",
   "}else render();"
  ].join('\n');
  html=html.replace(/\nrender\(\);\n<\/script>/,'\n'+init+'\n</script>');
 }
 return html;
}
for(let i=0;i<langs.length;i++){
 const name=join(dist,langs[i],'index.html');
 mkdirSync(dirname(name),{recursive:true});
 writeFileSync(name,build(i),'utf8');
}
writeFileSync(join(dist,'index.html'),build(0),'utf8');
const urls=langs.map(c=>'  <url><loc>'+host+'/'+c+'/</loc></url>').join('\n');
writeFileSync(join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'\n</urlset>\n');
console.log('PASS: generated '+langs.length+' locales: '+langs.join(', '));
