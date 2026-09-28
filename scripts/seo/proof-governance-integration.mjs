import {createClient} from '@sanity/client';
import {assertProofRecords} from '../../src/lib/proof-governance.js';
export const proofReviewQuery = `*[_type == "caseStudy" && !(_id in path("drafts.**"))]{
 publicProofType, evidenceStatus, publicationPermission, projectDateReviewed,
 resultsSummaryReviewed, testimonialReviewed, title, excerpt, seoTitle, seoDescription,
 challenge, approach, content, results, resultsSummary, year, testimonial
}`;
export default function proofGovernance({projectId, dataset, token}) {
 return {name:'kp-public-proof-governance',hooks:{
  'astro:build:start': async () => {
   let records;
   try {records = await createClient({projectId,dataset,token,apiVersion:'2024-01-01',useCdn:false,perspective:'published'}).fetch(proofReviewQuery);}
   catch {throw new Error('Public proof review could not read CMS statuses. Build stopped; no content or credentials logged.');}
   assertProofRecords(records);
  },
  'astro:build:done': async () => {
   const {audit} = await import('./audit-step9b.mjs');
   const result = await audit();
   if(result.errors.length) throw new Error('Public proof output check failed:\n'+result.errors.join('\n'));
   const {auditGovernance} = await import('./audit-step9c.mjs');
   const governance = await auditGovernance();
   if(governance.errors.length) throw new Error('Proof governance output check failed:\n'+governance.errors.join('\n'));
   console.log(`[proof-governance] ${result.pages.length} pages passed output checks.`);
  }
 }};
}
