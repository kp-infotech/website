import { defineType, defineField } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', type: 'string', title: 'Tagline' }),
    defineField({ name: 'excerpt', type: 'text', title: 'Excerpt', rows: 3 }),
    defineField({
      name: 'iconName',
      type: 'string',
      title: 'Icon Name (Lucide)',
      description: 'Lucide icon name, e.g., "pen-tool", "code", "smartphone". See lucide.dev/icons',
    }),
    defineField({
      name: 'iconCustom',
      type: 'image',
      title: 'Custom Icon (SVG)',
      description: 'Upload a custom SVG icon (overrides Lucide icon if both are set)',
      options: {
        accept: 'image/svg+xml,image/png,image/webp',
      },
    }),
    defineField({ name: 'heroImage', type: 'image', title: 'Hero Image', options: { hotspot: true } }),
    defineField({
      name: 'contentHeading',
      type: 'string',
      title: 'Content Section Heading',
      description: 'Use *asterisks* to highlight a word in accent color. E.g., "Designing for *Impact*"',
    }),
    defineField({ name: 'content', type: 'array', title: 'Content', of: [{ type: 'richText' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({
      name: 'processHeading',
      type: 'string',
      title: 'Process Section Heading',
      description: 'Use *asterisks* to highlight a word. E.g., "How We *Work*"',
    }),
    defineField({ name: 'process', type: 'array', title: 'Process Steps', of: [{ type: 'processStep' }] }),
    defineField({
      name: 'techHeading',
      type: 'string',
      title: 'Technologies Section Heading',
      description: 'Use *asterisks* to highlight a word. E.g., "Our *Toolkit*"',
    }),
    defineField({ name: 'technologies', type: 'array', title: 'Technologies', of: [{ type: 'string' }] }),
    defineField({
      name: 'faqHeading',
      type: 'string',
      title: 'FAQ Section Heading',
      description: 'Use *asterisks* to highlight a word. E.g., "Common *Questions*"',
    }),
    defineField({ name: 'faqs', type: 'array', title: 'FAQs', of: [{ type: 'faqItem' }] }),
    defineField({
      name: 'workHeading',
      type: 'string',
      title: 'Related Work Section Heading',
      description: 'Use *asterisks* to highlight a word. E.g., "Featured *Projects*"',
    }),
    defineField({ name: 'relatedWork', type: 'array', title: 'Related Work', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }] }),
    defineField({
      name: 'serviceArea',
      type: 'string',
      title: 'Geographic Service Area',
      description: 'Actual service coverage for Service structured data, e.g. Worldwide. Leave empty to preserve the existing default.',
    }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO Title' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 }),
    defineField({ name: 'order', type: 'number', title: 'Display Order' }),
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
  },
});
