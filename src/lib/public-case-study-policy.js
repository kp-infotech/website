// Step 1C active project scope. Add a project only after authentic records and
// publication approval; historical redirect slugs are not publication evidence.
export const PUBLIC_CASE_STUDY_SLUGS = Object.freeze([
  'cloud-cost-optimization-industrial-sme',
  'collaboration-platform-distributed-teams',
  'digital-banking-platform',
  'omnichannel-ecommerce-platform',
  'virtual-tours-ai-listings',
]);

export const PUBLIC_CASE_STUDY_GROQ_FILTER = [
  '_type == "caseStudy"',
  '_id in path("*")', // Private dot-ID documents must not become public with a read token.
  '!(_id in path("drafts.**"))',
  '!(_id in path("versions.**"))',
  `slug.current in ${JSON.stringify(PUBLIC_CASE_STUDY_SLUGS)}`,
].join(' && ');
