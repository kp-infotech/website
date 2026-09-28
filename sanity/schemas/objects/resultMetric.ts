import { defineType, defineField } from 'sanity';

export const resultMetric = defineType({
  name: 'resultMetric',
  title: 'Result Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'reviewStatus', title: 'Public Result Review', type: 'string',
      options: { list: ['pending', 'approved'] }, initialValue: 'pending',
      description: 'Status only. Approve only after private review of source, definition, baseline, period, calculation, attribution and publication permission. Do not store evidence or private links here.',
      validation: (Rule) => Rule.custom((value, context) => context.document?.publicProofType !== 'verifiedCaseStudy' || value === 'approved' ? true : 'Each public result needs approved private review.'),
    }),
    defineField({
      name: 'metric',
      title: 'Metric Value',
      type: 'string',
      description: 'e.g., "45%", "3x", "$2M"',
      validation: (Rule) => Rule.custom((value, context) => context.document?.publicProofType !== 'verifiedCaseStudy' || (typeof value === 'string' && value.trim().length > 0) ? true : 'A public result requires a non-empty value.'),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g., "Increase in Conversions", "Revenue Growth"',
      validation: (Rule) => Rule.custom((value, context) => context.document?.publicProofType !== 'verifiedCaseStudy' || (typeof value === 'string' && value.trim().length > 0) ? true : 'A public result requires a non-empty value.'),
    }),
  ],
  preview: {
    select: {
      metric: 'metric',
      label: 'label',
    },
    prepare({ metric, label }) {
      return {
        title: `${metric} - ${label}`,
      };
    },
  },
});
