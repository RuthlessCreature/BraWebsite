import {readFileSync,existsSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=new URL('../dist/',import.meta.url).pathname;
const locales=['en','zh-cn','zh-tw','ja','ru','es','pt'];
const temp=mkdtempSync(join(tmpdir(),'pomerol-locales-'));
try{
 for(const lang of locales){
  const file=join(root,lang,'index.html');
  assert.ok(existsSync(file),'Missing locale '+lang);
  const text=readFileSync(file,'utf8');
  assert.ok(text.includes('<html lang="'+lang+'"'),'Wrong lang '+lang);
  assert.ok(text.includes('BRA_LOCALE="'+lang+'"'),'Runtime missing '+lang);
  assert.ok(text.includes('translateSite();'),'Translation hook missing '+lang);
  assert.ok(!text.includes('fonts.googleapis.com'),'Blocked Google Fonts reference '+lang);
  assert.ok(text.includes('rel="canonical" href="https://bra.pomerol.trade/'+lang+'/"'));
  assert.equal((text.match(/hreflang=/g)||[]).length,8,'Missing hreflang '+lang);
  assert.ok(text.includes('factory-exterior.webp') && text.includes('p01.webp'));
  const scripts=[...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length>0,'No scripts '+lang);
  for(let i=0;i<scripts.length;i++){
   const name=join(temp,lang+'-'+i+'.mjs');
   writeFileSync(name,scripts[i][1]);
   execFileSync(process.execPath,['--check',name],{stdio:'pipe'});
  }
 }
 const map=readFileSync(join(root,'sitemap.xml'),'utf8');
 locales.forEach(lang=>assert.ok(map.includes('/'+lang+'/'),'Missing sitemap '+lang));
 console.log('PASS seven locales, 7 JS parses, canonical, hreflang, local resources');
}finally{rmSync(temp,{recursive:true,force:true})}
