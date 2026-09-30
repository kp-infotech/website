import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {articleFacts,quality,slugs} from '../scripts/seo/audit-step11c.mjs';
import {normalizeArticleBody} from '../src/lib/article-body.js';
const dir=new URL('../docs/seo-review/step-11c-evidence/',import.meta.url);
const before=JSON.parse(fs.readFileSync(new URL('cms-before.json',dir)));
const proposed=JSON.parse(fs.readFileSync(new URL('cms-proposed.json',dir)));
for(const slug of slugs){
 const html=()=>fs.readFileSync(new URL('../dist/client/insights/'+slug+'/index.html',import.meta.url),'utf8');
 test('Step 11C content-only patch preserves metadata, authors and dates: '+slug,()=>{const b=before.find(d=>d.slug.current===slug),a=proposed.find(d=>d._id===b._id);assert.deepEqual({...a,content:null},{...b,content:null});assert.notDeepEqual(a.content,b.content);});
 test('Step 11C practical frameworks and labelled examples render: '+slug,()=>quality(html(),slug));
 test('Step 11C tables have complete aligned rows: '+slug,()=>{const d=proposed.find(d=>d.slug.current===slug);const tables=normalizeArticleBody(d.content).filter(b=>b._type==='articleTable');assert.equal(tables.length,slug===slugs[0]?5:2);for(const t of tables)for(const r of t.rows){assert.equal(r.length,t.rows[0].length);assert(r.every(c=>c.trim()));}});
 test('Step 11C no unsupported price, outcome or credential claims: '+slug,()=>{const f=articleFacts(html());assert.doesNotMatch(f.text,/\b\d+(?:\.\d+)?\s*%|[$₹€£]\s*\d|\b(?:certified|Odoo Partner|top[- ]10|our research|our clients achieved)\b/i);});
}
test('Step 11C process checklist and measures are actionable',()=>{const f=articleFacts(fs.readFileSync(new URL('../dist/client/insights/'+slugs[0]+'/index.html',import.meta.url),'utf8'));assert(f.lists.some(s=>s.includes('source of truth')));assert(f.tables.some(s=>s.includes('denominator')));assert(f.text.includes('not measured findings or promised savings'));});
test('Step 11C ERP matrix requires evidence and implementation ownership',()=>{const f=articleFacts(fs.readFileSync(new URL('../dist/client/insights/'+slugs[1]+'/index.html',import.meta.url),'utf8'));assert(f.tables.some(s=>s.includes('Unverified')&&s.includes('Vendor evidence')));for(const s of ['UAT plan','trial migration','Customizations are identified','Integration ownership','not a tested vendor capability or ranking'])assert(f.text.includes(s));});
