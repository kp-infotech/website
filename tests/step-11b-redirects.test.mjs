import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import * as migration from '../src/worker/migration-redirects.js';
const origin='https://kpinfo.tech';
const slugs=['business-process-improvement-methods','how-to-choose-erp-system','on-premise-vs-cloud-erp'];
const code=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*/g,'').replace('export default','globalThis.worker =');
const sandbox={...migration,Response,handle:()=>new Response('Not found',{status:404})};vm.runInNewContext(code,sandbox);
for(const slug of slugs)test(`Step 11B: ${slug} root and blogs go directly to the canonical Insight`,async()=>{
 const target=origin+'/insights/'+slug+'/';
 for(const prefix of ['/','/blogs/'])for(const slash of ['','/'])for(const query of ['', '?utm_source=legacy&x=a%2Fb&x=2'])for(const method of ['GET','HEAD']){
  const source=origin+prefix+slug+slash+query;
  const response=await sandbox.worker.fetch(new Request(source,{method}),{},{});
  assert.equal(response.status,301);assert.equal(response.headers.get('location'),target+query);
  assert.equal(response.headers.get('link'),null);assert.equal(await response.text(),'');
  assert.equal(migration.getMigrationRedirectLocation(target+query),null);
 }
});
const excluded={'/business-process-automation-tools/':'/services/business-automation/','/what-is-customised-software/':'/services/custom-software-development/','/data-visualization-best-practices/':'/services/custom-software-development/','/best-ecommerce-platform-for-small-business/':'/industries/retail-ecommerce/'};
for(const [source,target] of Object.entries(excluded))test(`Step 11B preserves excluded redirect ${source}`,async()=>{
 for(const path of [source,source.slice(0,-1),source+'?ref=legacy']){
  const response=await sandbox.worker.fetch(new Request(origin+path),{},{});
  assert.equal(response.status,301);assert.equal(response.headers.get('location'),origin+target+(path.includes('?')?'?ref=legacy':''));
 }
});
for(const source of ['/how-to-choose-the-right-digital-marketing-channels-for-your-business/','/graphics-design/','/how-to-create-brand-guidelines/','/b-2-b-lead-generation-strategies/'])test(`Step 11B leaves linked 404 ${source} to normal not-found handling`,async()=>{
 for(const path of [source,source.slice(0,-1),source+'?ref=legacy']){
  assert.equal(migration.getMigrationRedirectLocation(origin+path),null);
  const response=await sandbox.worker.fetch(new Request(origin+path),{},{});assert.equal(response.status,404);assert.equal(response.headers.get('location'),null);
 }
});
test('Step 11B fixture explicitly records all three approved root and blogs targets',()=>{
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/legacy-redirects.json',import.meta.url)));
 for(const slug of slugs)for(const source of ['/'+slug+'/', '/blogs/'+slug+'/'])assert.equal(fixture.worker.find(r=>r.source===source)?.target,'/insights/'+slug+'/');
});
