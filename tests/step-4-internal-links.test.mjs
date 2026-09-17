import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inspect} from '../scripts/seo/audit-step3.mjs';
const sm='dist/client/sitemap-0.xml';
const types={blogPost:'insights',service:'services',industry:'industries',caseStudy:'work'};
test('all rendered internal links use canonical indexable destinations and accessible anchors',()=>{
 assert.ok(fs.existsSync(sm),'Production build required');
 const urls=[...fs.readFileSync(sm,'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 const expected=[...fs.readFileSync('docs/seo-review/step-4-evidence/sitemap-before.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.deepEqual(urls.sort(),expected.sort());
 const pages=new Map(urls.map(url=>[url,inspect(fs.readFileSync('dist/client'+new URL(url).pathname+'index.html','utf8'),url)]));
 for(const [url,p]of pages){assert.deepEqual(p.canonicals,[url]);assert.equal(p.noindex,false);
  for(const l of p.links){assert(l.accessible,url+' unnamed anchor');if(!l.href)continue;const u=new URL(l.href,url);if(!['kpinfo.tech','www.kpinfo.tech'].includes(u.hostname))continue;
   assert.equal(u.origin,'https://kpinfo.tech');assert(pages.has(u.origin+u.pathname),url+' noncanonical/broken destination '+l.href);
  }
 }
 for(const slug of ['custom-software-development','erp-software','business-automation','ai-automation-agents','cloud-devops'])assert(pages.has('https://kpinfo.tech/services/'+slug+'/'));
 const docs=JSON.parse(fs.readFileSync('scripts/sanity/step-4-links-batch.json'));
 for(const row of JSON.parse(fs.readFileSync('docs/seo-review/step-4-evidence/new-relationships.json'))){const d=docs.find(d=>d.slug===row.source);const p=pages.get('https://kpinfo.tech/'+types[d.type]+'/'+row.source+'/');assert(p.links.some(l=>l.href==='/' +(row.relationship==='educational'?'insights':'services')+'/'+row.destination+'/'&&l.text===row.anchor),'Missing planned link '+row.source+' '+row.anchor);}
 const baseline=JSON.parse(fs.readFileSync('docs/seo-review/step-4-evidence/graph-before.json'));for(const l of baseline.links.filter(l=>l.location==='body'&&l.source.startsWith('/insights/')))assert(pages.get('https://kpinfo.tech'+l.source).links.some(a=>a.href===l.href&&a.text===l.anchor),'Existing editorial link lost');
});
test('Step 4 changes are field-specific and preserve article text, headings and metadata',()=>{
 for(const u of JSON.parse(fs.readFileSync('scripts/sanity/step-4-links-batch.json'))){for(const d of u.details){assert(/^(content\[\d+\]|services|relatedWork|relatedServices)$/.test(d.path));if(d.path.startsWith('content[')){assert.equal(d.before.children.map(c=>c.text||'').join(''),d.after.children.map(c=>c.text||'').join(''));assert.equal(d.before.style,d.after.style);assert.equal(d.before._key,d.after._key);}}if(u.append)assert.equal(u.type,'service');}
});
