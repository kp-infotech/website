import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {inspect} from '../scripts/seo/audit-step3.mjs';
const sitemap='dist/client/sitemap-0.xml';
test('built sitemap pages preserve structural SEO and article contracts',{skip:!fs.existsSync(sitemap)},()=>{
 const urls=[...fs.readFileSync(sitemap,'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.ok(urls.length>0);
 const known=new Set(['angular-vs-react','best-hr-software-for-startups','kp-infotech-new-website-custom-software-automation-ai']);let articles=0;
 for(const url of urls){const html=fs.readFileSync('dist/client'+new URL(url).pathname+'index.html','utf8');const p=inspect(html,url);
 assert.equal(p.h1.length,1,url);assert.ok(p.h1[0].text&&!p.h1[0].hidden,url);assert.equal(p.titles.length,1,url);assert.deepEqual(p.canonicals,[url]);assert.equal(p.noindex,false,url);assert.equal(p.schemaErrors.length,0,url);assert.deepEqual(p.duplicateIds,[],url);assert.equal(p.emptyButtons,0,url);assert.deepEqual(p.hierarchy,[],url);
 for(const img of p.images){assert.notEqual(img.alt,null,url);if(img.category==='A')assert.equal(img.alt,'',url+' decorative image');}
 if(new URL(url).pathname==='/insights/best-hr-software-for-startups/')assert.ok(p.tables > 0 && p.columnHeaders > 0, 'HR comparison renders a semantic table');
 if(p.bodyText){articles++;
 const article=p.schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='BlogPosting');assert.ok(article,url+' BlogPosting');
 if(article.author['@type']==='Person'){assert.ok(article.author.name?.trim(),url+' named author');assert.ok(html.includes(article.author.name),url+' visible author');}
 else assert.equal(article.author['@id'],'https://kpinfo.tech/#organization');
 assert.ok(!p.bodyText.includes('!(https://'),url+' malformed image token');assert.ok(!p.headings.some(h=>h.source==='CMS body'&&h.level===1));assert.ok(!/cleaned-up version of your article|SEO-ready version of your article|Here is the rewritten section/.test(p.bodyText),url);assert.deepEqual(p.emptyBodyElements,[],url);for(const l of p.links.filter(l=>l.body)){assert.ok(l.href&&l.href!=='#'&&!/^javascript:/i.test(l.href),url);const u=new URL(l.href,url);if(u.origin==='https://kpinfo.tech')assert.ok(fs.existsSync('dist/client'+u.pathname+'index.html'),u.href);}}
 known.delete(new URL(url).pathname.split('/')[2]);
 if(new URL(url).pathname==='/about/'){assert.ok(html.includes('Odoo ERP Services'));assert.ok(!/Official Odoo implementation|certified expertise|Odoo Partner/.test(html));}
 }
 assert.ok(articles>0);assert.equal(known.size,0);
});
