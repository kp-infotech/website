import { defineType, defineField } from 'sanity';
import { proofErrors, proofTypes, evidenceStatuses, permissionStatuses } from '../../src/lib/proof-governance.js';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  validation: (Rule) => Rule.custom((document) => {
    const errors = proofErrors(document);
    return errors.length ? errors.join(' ') : true;
  }),
  fieldsets: [{ name: 'proofReview', title: 'Public proof review — statuses only', description: 'Keep contracts, billing, client identities, security reports and approvals in approved private storage. Never upload evidence here.' }],
  fields: [
    defineField({ name: 'presentationType', type: 'string', title: 'Legacy Presentation Type', hidden: true, readOnly: true, description: 'Historical compatibility only. Ignored by publication gates; use the proof review statuses.' }),
    defineField({
      name: 'publicProofType', type: 'string', title: 'Public Proof Type', fieldset: 'proofReview',
      description: 'Technical Overview does not imply verified client or outcome proof. Verified Case Study requires verified evidence and approved publication permission.',
      options: { list: [{ title: 'Technical Overview', value: proofTypes[0] }, { title: 'Verified Case Study', value: proofTypes[1] }] },
      initialValue: 'technicalOverview', validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'evidenceStatus', type: 'string', title: 'Evidence Status', fieldset: 'proofReview',
      description: 'Status only. Do not store private evidence here. Existing public copy is not substantiation.',
      options: { list: evidenceStatuses.map(value => ({ title: value === 'partiallyVerified' ? 'Partially verified' : value, value })) },
      initialValue: 'pending', validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publicationPermission', type: 'string', title: 'Publication Permission', fieldset: 'proofReview',
      description: 'Controls whether reviewed client/outcome material can be presented publicly. Existing publication does not establish permission.',
      options: { list: permissionStatuses }, initialValue: 'unknown', validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'projectDateReviewed', type: 'boolean', title: 'Delivery Year Reviewed', fieldset: 'proofReview', initialValue: false, description: 'Status only: dated delivery evidence was separately reviewed in private. CMS timestamps are not delivery evidence.' }),
    defineField({ name: 'resultsSummaryReviewed', type: 'boolean', title: 'Results Summary Reviewed', fieldset: 'proofReview', initialValue: false, description: 'Status only: each outcome in the summary has approved evidence, methodology and public wording in private review.' }),
    defineField({ name: 'testimonialReviewed', type: 'boolean', title: 'Testimonial Reviewed', fieldset: 'proofReview', initialValue: false, description: 'Status only: original source, identity/role, exact quote approval and portrait permission were reviewed privately. Do not upload raw source material.' }),

    defineField({ name: 'title', type: 'string', title: 'Project Title', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'client', type: 'string', title: 'Approved Public Client / Context', description: 'Never enter a confidential identity. Technical Overviews render only the policy-approved anonymous descriptor; named public identity requires the verified publication gate.' }),
    defineField({ name: 'year', type: 'string', title: 'Year' }),
    defineField({ name: 'featured', type: 'boolean', title: 'Featured on Homepage', initialValue: false }),
    defineField({ name: 'heroImage', type: 'image', title: 'Hero Image', options: { hotspot: true } }),
    defineField({ name: 'thumbnailImage', type: 'image', title: 'Thumbnail Image', options: { hotspot: true } }),
    defineField({ name: 'excerpt', type: 'text', title: 'Excerpt', rows: 3 }),
    defineField({ name: 'resultsSummary', type: 'text', title: 'Results Summary', rows: 4, description: 'Prose summary for the overview section (separate from metric counters)' }),
    defineField({ name: 'order', type: 'number', title: 'Sort Order', description: 'Manual sort order for work grid (lower = first)' }),
    defineField({
      name: 'cardSize',
      type: 'string',
      title: 'Card Size',
      description: 'Controls masonry card size on the work grid',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Large', value: 'large' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
    }),
    defineField({ name: 'challenge', type: 'array', title: 'Challenge', of: [{ type: 'richText' }] }),
    defineField({ name: 'approach', type: 'array', title: 'Approach', of: [{ type: 'richText' }] }),
    defineField({ name: 'content', type: 'array', title: 'Full Content', of: [{ type: 'richText' }, { type: 'image', options: { hotspot: true } }, { type: 'code' }] }),
    defineField({ name: 'results', type: 'array', title: 'Results', of: [{ type: 'resultMetric' }] }),
    defineField({ name: 'testimonial', type: 'reference', title: 'Testimonial', to: [{ type: 'testimonial' }] }),
    defineField({ name: 'services', type: 'array', title: 'Services', of: [{ type: 'reference', to: [{ type: 'service' }] }] }),
    defineField({ name: 'industries', type: 'array', title: 'Industries', of: [{ type: 'reference', to: [{ type: 'industry' }] }] }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO Title' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'thumbnailImage' },
  },
});
