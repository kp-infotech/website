import {readFileSync,writeFileSync} from 'node:fs';
import {inspect as metadata} from './audit-step2.mjs';
import {inspect} from './audit-step3.mjs';
const dir='docs/seo-review/step-7c-evidence';
const before=JSON.parse(readFileSync(dir+'/cloud-before.json'));
const plain=blocks=>(blocks||[]).map(b=>({style:b.style,text:(b.children||[]).map(c=>c.text||'').join(''),links:b.markDefs||[]}));
export function serviceInventory(d){
 const pieces=[d.title,d.excerpt,d.contentHeading,...plain(d.content).map(b=>b.text),d.processHeading,...d.process.flatMap(p=>[p.title,p.description,...p.deliverables]),d.techHeading,...d.technologies,d.faqHeading,...d.faqs.flatMap(f=>[f.question,f.answer]),d.workHeading];
 return{id:d._id,revision:d._rev,h1:d.title,hero:d.excerpt,contentHeading:d.contentHeading,body:plain(d.content),process:d.process,technologies:d.technologies,faqs:d.faqs,relatedWork:d.relatedWork,workHeading:d.workHeading,serviceArea:d.serviceArea??null,wordCount:pieces.filter(Boolean).join(' ').trim().split(/\s+/).length,wordCountScope:'Service title, excerpt, content and section headings, process titles/descriptions/deliverables, technologies and FAQs. Excludes navigation/footer, CTA, process durations and related-case content.'};
}
const live=JSON.parse(readFileSync('/private/tmp/kp-step7c-live-before.json')).find(p=>p.url==='https://kpinfo.tech/services/cloud-devops/');
const m=metadata(live.html),p=inspect(live.html,live.url);
writeFileSync(dir+'/inventory-before.json',JSON.stringify({...serviceInventory(before),httpStatus:live.status,metadata:m,internalLinks:p.links.filter(l=>l.href?.startsWith('/')),cta:{hero:['Discuss Your Project','/contact/'],secondary:['All Services','/services/'],closing:['Start a Conversation','/contact/']}},null,2)+'\n');
console.log({status:live.status,h1:m.h1,wordCount:serviceInventory(before).wordCount,faqs:before.faqs.length,serviceArea:before.serviceArea??'unset',schemas:m.schemas.flatMap(s=>s['@graph']||[s]).map(s=>s['@type'])});
