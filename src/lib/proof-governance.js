// Status-only public-proof policy, shared by Studio, builds, queries and renderers.
// Evidence and completed review forms belong in approved private storage, never here.
export const proofTypes = ['technicalOverview', 'verifiedCaseStudy'];
export const evidenceStatuses = ['pending', 'partiallyVerified', 'verified'];
export const permissionStatuses = ['unknown', 'approved', 'restricted'];
export const overviewDescriptors = Object.freeze({
  'cloud-cost-optimization-industrial-sme': 'European Industrial Machinery Manufacturer',
  'collaboration-platform-distributed-teams': 'SaaS Collaboration Platform',
  'digital-banking-platform': 'Regional Credit Union',
  'omnichannel-ecommerce-platform': 'Multi-Store Fashion Retailer',
  'virtual-tours-ai-listings': 'Real Estate Network',
});
export const VERIFIED_PROOF_GROQ = 'publicProofType == "verifiedCaseStudy" && evidenceStatus == "verified" && publicationPermission == "approved"';
// An editor cannot turn a technical overview descriptor into an arbitrary legal identity.
// Adding another approved anonymous context requires deliberate policy review.
export const PUBLIC_CLIENT_GROQ = `"client": select(${VERIFIED_PROOF_GROQ} => client, ${Object.entries(overviewDescriptors).map(([slug, label]) => `slug.current == ${JSON.stringify(slug)} => ${JSON.stringify(label)}`).join(', ')}, null)`;
export const PUBLIC_YEAR_GROQ = `"year": select(${VERIFIED_PROOF_GROQ} && projectDateReviewed == true => year, null)`;
export const PUBLIC_RESULTS_GROQ = `"results": select(${VERIFIED_PROOF_GROQ} => results[reviewStatus == "approved" && defined(metric) && defined(label)]{metric, label, reviewStatus}, [])`;
export const PUBLIC_SUMMARY_GROQ = `"resultsSummary": select(${VERIFIED_PROOF_GROQ} && resultsSummaryReviewed == true => resultsSummary, null)`;
export const PUBLIC_TESTIMONIAL_GROQ = `"testimonial": select(${VERIFIED_PROOF_GROQ} && testimonialReviewed == true => testimonial->{_id, quote, authorName, authorRole, company, companyLogo, authorPhoto}, null)`;

export function isVerifiedProof(record) {
  return record?.publicProofType === 'verifiedCaseStudy' && record.evidenceStatus === 'verified' && record.publicationPermission === 'approved';
}
export function publicProof(record) {
  const verified = isVerifiedProof(record);
  return {
    verified,
    client: verified ? record.client : overviewDescriptors[record?.slug?.current],
    year: verified && record.projectDateReviewed === true ? record.year : undefined,
    results: verified ? (record.results || []).filter(r => r?.reviewStatus === 'approved' && r.metric?.trim() && r.label?.trim()) : [],
    resultsSummary: verified && record.resultsSummaryReviewed === true ? record.resultsSummary : undefined,
    testimonial: verified && record.testimonialReviewed === true ? record.testimonial : undefined,
  };
}
function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.entries(value).filter(([k]) => !k.startsWith('_') && !['asset','marks','markDefs'].includes(k)).flatMap(([,v]) => strings(v));
  return [];
}
// Only projected work copy is scanned. Historic hidden results, years and quotes,
// and educational articles elsewhere on the site, are not inputs to this scanner.
export function technicalClaimRisks(record) {
  const copy = ['title','excerpt','seoTitle','seoDescription','challenge','approach','content'].flatMap(k => strings(record[k])).join(' ');
  const rules = [
    ['numeric financial/outcome claim', /(?:[$€£]\s*\d|\b\d[\d,.]*\s*%|\b\d[\d,.]*\s*(?:K|M|million|billion)?\s+(?:users|teams|customers|leads|accounts|orders|sales)\b)/i],
    ['fixed performance or delivery claim', /\b(?:\d[\d,.]*\s*(?:ms|milliseconds|seconds)\s+(?:latency|response|load)|(?:launch|deliver(?:ed|y)?)\s+(?:in|within)\s+\d+(?:[–-]\d+)?\s+(?:days|weeks)|guaranteed\s+(?:uptime|performance|results))\b/i],
    ['certification/partner assurance', /\b(?:(?:SOC\s*2|PCI\s*DSS|ISO(?:\s*\d+)?|HIPAA)\s*(?:Type\s*(?:II|2)\s*)?(?:Level\s*\d+\s*)?(?:certified|certification|compliant|ready|audited|attested)|(?:achieved|passed|earned|holds?)\s+(?:SOC\s*2|PCI\s*DSS|ISO|HIPAA)|(?:certified|official)\s+(?:Odoo|AWS|Azure|Google Cloud)\s+Partner|(?:Odoo|AWS|Azure|Google Cloud)\s+Partner(?:ship)?\s+(?:status|certification))\b/i],
    ['declared partner relationship', /\b(?:(?:we are|is|became)\s+(?:an?\s+)?(?:Odoo|AWS|Azure|Google Cloud)\s+Partner|(?:Odoo|AWS|Azure|Google Cloud)\s+Partner(?!\s+(?:requirements|program|eligibility|criteria|discussion))\s*$)/i],
    ['delivered engagement assertion', /\b(?:we|KP Infotech)\s+(?:built|delivered|achieved|launched)\b/i],
    ['numeric financial assertion', /\b(?:raised|secured|generated|saved)\s+(?:(?:USD|EUR|GBP)\s*)?\d/i],
    ['award/funding assertion', /\b(?:won\s+(?:an?\s+)?(?:\w+\s+){0,5}award|raised\s+(?:funding|capital)|secured\s+(?:funding|a\s+Series\s+[A-Z])|Series\s+[A-Z]\s+funding)\b/i],
    ['proof-backed marketing label', /\b(?:verified case study|client case study|customer success story|success story|proven results|measured results|client results)\b/i],
  ];
  return rules.filter(([,pattern]) => pattern.test(copy)).map(([name]) => name);
}
export function proofErrors(record) {
  const errors = [];
  if (!proofTypes.includes(record?.publicProofType)) errors.push('Select a public proof type; legacy presentationType does not authorize publication.');
  if (!evidenceStatuses.includes(record?.evidenceStatus)) errors.push('Select an evidence status. Status only; keep evidence private.');
  if (!permissionStatuses.includes(record?.publicationPermission)) errors.push('Select a publication permission status.');
  if (record?.publicProofType === 'verifiedCaseStudy') {
    if (!isVerifiedProof(record)) errors.push('Verified Case Study requires verified evidence AND approved publication permission.');
    for (const [i, result] of (record.results || []).entries()) if (!result?.metric?.trim() || !result?.label?.trim() || result.reviewStatus !== 'approved') errors.push(`Result ${i + 1} requires a non-empty metric, label and approved private review marker.`);
    if (record.resultsSummary?.trim() && record.resultsSummaryReviewed !== true) errors.push('Results summary requires separate private review.');
    if (record.year && record.projectDateReviewed !== true) errors.push('Delivery year requires separate private review; CMS timestamps are not evidence.');
    if (record.testimonial && record.testimonialReviewed !== true) errors.push('Testimonial requires source, identity, wording and image-permission review.');
  } else if (record?.publicProofType === 'technicalOverview') {
    errors.push(...technicalClaimRisks(record).map(r => `Technical Overview contains a sensitive claim requiring review: ${r}.`));
  }
  return errors;
}
export function assertProofRecords(records) {
  const errors = records.flatMap((r, i) => proofErrors(r).map(e => `Work record ${i + 1}: ${e}`));
  if (errors.length) throw new Error('Public proof validation failed:\n' + errors.join('\n'));
}
