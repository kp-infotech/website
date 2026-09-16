import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {parse,evaluate} from 'groq-js';
import * as queries from '../src/lib/queries.ts';
import {PUBLIC_CASE_STUDY_SLUGS} from '../src/lib/public-case-study-policy.js';
const decisions=JSON.parse(readFileSync(new URL('./fixtures/step-1c-case-study-decisions.json',import.meta.url)));
const active=PUBLIC_CASE_STUDY_SLUGS.map((slug,i)=>({_id:`project-${i}`,_type:'caseStudy',title:slug,slug:{current:slug},featured:true,order:i}));
const unsupported=decisions.removedCaseStudySlugs.map((slug,i)=>({_id:`unknown-${i}`,_type:'caseStudy',title:slug,slug:{current:slug},featured:true,order:-1}));
const drafts=active.flatMap(d=>[{...d,_id:`drafts.${d._id}`},{...d,_id:`versions.release.${d._id}`},{...d,_id:`private.${d._id}`}]);
const refs=[...active,...unsupported,...drafts].map(d=>({_type:'reference',_ref:d._id}));
const dataset=[...active,...unsupported,...drafts,{_id:'service',_type:'service',slug:{current:'test'},relatedWork:refs},{_id:'industry',_type:'industry',slug:{current:'test'},relatedWork:refs}];
const run=async(query,params={})=>(await evaluate(parse(query),{dataset,params})).get();
const isActive=d=>active.some(a=>a._id===d._id);

test('the active policy exactly matches the five reviewed published projects',()=>{
 assert.deepEqual(PUBLIC_CASE_STUDY_SLUGS,decisions.activePublishedSlugs);
});
test('all work routes exclude unknown, draft, release and private documents even with raw CMS access',async()=>{
 const result=await run(queries.allCaseStudiesQuery);
 assert.deepEqual(result.map(d=>d._id),active.map(d=>d._id));
 for(const slug of decisions.removedCaseStudySlugs)assert.equal(await run(queries.caseStudyBySlugQuery,{slug}),null,slug);
});
test('homepage, featured work and next project use only reviewed published projects',async()=>{
 const homepage=await run(queries.homepageDataQuery);
 assert.equal(homepage.featuredWork.length,4);
 assert.ok(homepage.featuredWork.every(isActive));
 const featured=await run(queries.featuredCaseStudiesQuery);
 assert.equal(featured.length,4);assert.ok(featured.every(isActive));
 for(const project of active){
  const result=await run(queries.caseStudyBySlugQuery,{slug:project.slug.current});
  assert.equal(result._id,project._id);assert.ok(isActive(result.nextProject));assert.notEqual(result.nextProject._id,project._id);
 }
});
test('service and industry related work cannot expose unknown or unpublished projects',async()=>{
 for(const query of [queries.serviceBySlugQuery,queries.industryBySlugQuery]){
  const result=await run(query,{slug:'test'});
  assert.deepEqual(result.relatedWork.map(d=>d._id),active.map(d=>d._id));
 }
});
