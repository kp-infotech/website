import test from 'node:test';
import assert from 'node:assert/strict';
import {parse,evaluate} from 'groq-js';
import {readFileSync} from 'node:fs';
import {proofErrors,assertProofRecords,publicProof,isVerifiedProof,overviewDescriptors,technicalClaimRisks} from '../src/lib/proof-governance.js';
import * as queries from '../src/lib/queries.ts';
const slug=Object.keys(overviewDescriptors)[0];
const overview={_id:'synthetic-case',_type:'caseStudy',slug:{current:slug},title:'Synthetic technical overview',featured:true,publicProofType:'technicalOverview',evidenceStatus:'pending',publicationPermission:'unknown'};
const verified={...overview,publicProofType:'verifiedCaseStudy',evidenceStatus:'verified',publicationPermission:'approved'};
const historical={client:'Synthetic named organization',year:'2091',results:[{metric:'37%',label:'Synthetic result'}],resultsSummary:'Synthetic result summary',testimonial:{_ref:'synthetic-quote'}};
const run=async(query,dataset,params={})=>(await evaluate(parse(query),{dataset,params})).get();

test('verified publication requires both approvals for every status combination',()=>{
 for(const evidenceStatus of ['pending','partiallyVerified','verified',undefined,'invented'])for(const publicationPermission of ['unknown','restricted','approved',undefined,'invented']){
  const record={...verified,evidenceStatus,publicationPermission};const allowed=evidenceStatus==='verified'&&publicationPermission==='approved';
  assert.equal(isVerifiedProof(record),allowed);assert.equal(proofErrors(record).length===0,allowed);
  if(!allowed)assert.throws(()=>assertProofRecords([record]),/Public proof validation failed/);
 }
});
test('missing state and legacy presentation toggle never authorize publication',()=>{
 assert.throws(()=>assertProofRecords([{presentationType:'caseStudy'}]),/proof type/);
 assert.equal(publicProof({...historical,presentationType:'caseStudy'}).verified,false);
});
test('technical overview tolerates but never exposes historical hidden proof',()=>{
 const record={...overview,...historical,projectDateReviewed:true,testimonialReviewed:true,resultsSummaryReviewed:true};
 assert.deepEqual(proofErrors(record),[]);const p=publicProof(record);
 assert.equal(p.client,overviewDescriptors[slug]);assert.equal(p.year,undefined);assert.deepEqual(p.results,[]);assert.equal(p.resultsSummary,undefined);assert.equal(p.testimonial,undefined);
});
test('verified results require an individual review and non-empty value/label',()=>{
 for(const result of [{metric:'37%',label:'Synthetic'}, {metric:' ',label:'Synthetic',reviewStatus:'approved'}, {metric:'37%',label:'',reviewStatus:'approved'}]){
  const record={...verified,results:[result]};assert.ok(proofErrors(record).length);assert.deepEqual(publicProof(record).results,[]);
 }
 const record={...verified,results:[{metric:'37%',label:'Synthetic fixture only',reviewStatus:'approved'}]};assert.deepEqual(proofErrors(record),[]);assert.equal(publicProof(record).results.length,1);
});
test('year, summary and testimonial require separate affirmative review',()=>{
 assert.equal(proofErrors({...verified,...historical,results:[]}).length,3);
 for(const marker of [false,'true',undefined]){const p=publicProof({...verified,...historical,projectDateReviewed:marker,testimonialReviewed:marker,resultsSummaryReviewed:marker});assert.equal(p.year,undefined);assert.equal(p.testimonial,undefined);assert.equal(p.resultsSummary,undefined);}
 const p=publicProof({...verified,...historical,projectDateReviewed:true,testimonialReviewed:true,resultsSummaryReviewed:true});assert.equal(p.year,'2091');assert.ok(p.testimonial);assert.ok(p.resultsSummary);
});
test('revoked permission suppresses all proof even when individual markers remain approved',()=>{
 const p=publicProof({...verified,...historical,publicationPermission:'restricted',projectDateReviewed:true,testimonialReviewed:true,resultsSummaryReviewed:true});assert.equal(p.verified,false);assert.deepEqual(p.results,[]);assert.equal(p.year,undefined);assert.equal(p.testimonial,undefined);assert.equal(p.client,overviewDescriptors[slug]);
});
test('work queries protect client identity and year on every card surface',async()=>{
 const record={...overview,...historical};const ref={_type:'reference',_ref:record._id};const dataset=[record,{...record,_id:'second',slug:{current:Object.keys(overviewDescriptors)[1]}},{_id:'s',_type:'service',slug:{current:'test'},relatedWork:[ref]},{_id:'i',_type:'industry',slug:{current:'test'},relatedWork:[ref]}];
 const items=[...(await run(queries.allCaseStudiesQuery,dataset)),...(await run(queries.featuredCaseStudiesQuery,dataset)),...(await run(queries.homepageDataQuery,dataset)).featuredWork,...(await run(queries.serviceBySlugQuery,dataset,{slug:'test'})).relatedWork,...(await run(queries.industryBySlugQuery,dataset,{slug:'test'})).relatedWork,(await run(queries.caseStudyBySlugQuery,dataset,{slug})).nextProject];
 for(const item of items){assert.notEqual(item.client,historical.client);assert.ok(Object.values(overviewDescriptors).includes(item.client));assert.ok(!item.year);}
});
test('detail GROQ removes historical proof and helper prevents a second leak',async()=>{
 const record={...overview,...historical};const d=await run(queries.caseStudyBySlugQuery,[record,{_id:'synthetic-quote',_type:'testimonial',quote:'Synthetic quote only'}],{slug});assert.deepEqual(d.results,[]);assert.equal(d.testimonial,null);assert.equal(d.year,null);assert.equal(d.resultsSummary,null);assert.equal(publicProof(d).verified,false);
});
test('valid synthetic verified detail projects only reviewed proof',async()=>{
 const record={...verified,...historical,results:[{metric:'37%',label:'Synthetic fixture only',reviewStatus:'approved'}],projectDateReviewed:true,testimonialReviewed:true,resultsSummaryReviewed:true};const d=await run(queries.caseStudyBySlugQuery,[record,{_id:'synthetic-quote',_type:'testimonial',quote:'Synthetic approved fixture'}],{slug});const p=publicProof(d);assert.equal(p.verified,true);assert.equal(p.client,historical.client);assert.equal(p.results.length,1);assert.equal(p.year,'2091');assert.equal(p.testimonial.quote,'Synthetic approved fixture');
});
test('sensitive assertions in technical copy are flagged without scanning educational documents',()=>{
 for(const text of ['We saved $9M','Conversion grew 37%','SOC 2 Type II certification','PCI DSS compliant','ISO 27001 certified','HIPAA ready','Official Odoo Partner','We are an AWS Partner','AWS Partner','We delivered the system','We raised 9 million','10,000 customers','Launch in 4 weeks','We won a design award','Series C funding','Proven results'])assert.ok(technicalClaimRisks({...overview,excerpt:text}).length,text);
 for(const text of ['3D tours','SOC 2 and PCI DSS requirements need scoped review.','Review authentication, access controls and integration requirements.'])assert.deepEqual(technicalClaimRisks({...overview,excerpt:text}),[]);
});
test('homepage queries expose neither stats nor testimonials even when CMS is populated',async()=>{
 const d=await run(queries.homepageDataQuery,[{_type:'siteSettings',stats:[{value:'77',label:'Synthetic'}]},{_type:'testimonial',featured:true,quote:'Synthetic quote'}]);assert.equal(d.siteSettings.stats,undefined);assert.equal(d.testimonials,undefined);
});
test('production build enforces both input review and emitted proof audit',()=>{
 const integration=readFileSync(new URL('../scripts/seo/proof-governance-integration.mjs',import.meta.url),'utf8');const config=readFileSync(new URL('../astro.config.mjs',import.meta.url),'utf8');assert.match(config,/proofGovernance\(/);assert.match(integration,/'astro:build:start'/);assert.match(integration,/assertProofRecords\(records\)/);assert.match(integration,/'astro:build:done'/);assert.match(integration,/if\(result.errors.length\) throw/);
});

test('governance output audit rejects a new delivery year and hidden state leakage',async()=>{
 const {governanceOutputErrors}=await import('../scripts/seo/audit-step9c.mjs');const path='/work/'+slug+'/';const html=`<h1>Synthetic</h1><p>Technical Overview</p><div class="case-hero__meta">${overviewDescriptors[slug]} 2091</div><script type="application/ld+json">{"@type":"CreativeWork","client":{"@type":"Organization","name":"Synthetic"},"evidenceStatus":"pending"}</script>`;const errors=governanceOutputErrors(html,path);assert.ok(errors.some(e=>e.includes('delivery year')));assert.ok(errors.some(e=>e.includes('properties leaked')));assert.ok(errors.some(e=>e.includes('attestation schema')));
});

test('Studio document validation enforces the same publication rule',async()=>{
 const {caseStudy}=await import('../sanity/schemas/caseStudy.ts');const validate=caseStudy.validation({custom:fn=>fn});assert.equal(validate(overview),true);assert.equal(validate(verified),true);assert.notEqual(validate({...verified,evidenceStatus:'pending'}),true);assert.notEqual(validate({...verified,publicationPermission:'unknown'}),true);assert.equal(caseStudy.fields.find(f=>f.name==='presentationType').hidden,true);assert.equal(caseStudy.fields.find(f=>f.name==='presentationType').readOnly,true);
});
test('Studio result validation allows hidden historical entries but blocks unreviewed public results',async()=>{
 const {resultMetric}=await import('../sanity/schemas/objects/resultMetric.ts');for(const field of resultMetric.fields){const validate=field.validation({custom:fn=>fn});assert.equal(validate(undefined,{document:overview}),true);assert.notEqual(validate(undefined,{document:verified}),true);}
});
