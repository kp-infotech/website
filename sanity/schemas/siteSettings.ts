import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string', title: 'Site Name', initialValue: 'KP Infotech' }),
    defineField({ name: 'siteTagline', type: 'string', title: 'Site Tagline' }),
    defineField({ name: 'heroHeadline', type: 'string', title: 'Hero Headline', description: 'Main headline for the homepage hero section' }),
    defineField({ name: 'logo', type: 'image', title: 'Logo' }),
    defineField({ name: 'logoLight', type: 'image', title: 'Logo (Light Version)' }),
    defineField({ name: 'contactEmail', type: 'string', title: 'Contact Email' }),
    defineField({ name: 'contactPhone', type: 'string', title: 'Contact Phone' }),
    defineField({ name: 'address', type: 'text', title: 'Address', rows: 3 }),
    defineField({
      name: 'socialLinks',
      type: 'object',
      title: 'Social Links',
      fields: [
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
        defineField({ name: 'twitter', type: 'url', title: 'Twitter' }),
        defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
        defineField({ name: 'facebook', type: 'url', title: 'Facebook' }),
        defineField({ name: 'dribbble', type: 'url', title: 'Dribbble' }),
      ],
    }),
    defineField({
      name: 'techStack',
      type: 'array',
      title: 'Tech Stack (Marquee)',
      description: 'Simple Icons slugs for the homepage tech marquee. Find slugs at simpleicons.org (e.g. "react", "nodedotjs", "figma")',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'stats', type: 'array', title: 'Homepage Stats', of: [{ type: 'statItem' }] }),
    defineField({ name: 'footerText', type: 'text', title: 'Footer Description', rows: 2 }),
    defineField({ name: 'defaultSeoTitle', type: 'string', title: 'Default SEO Title' }),
    defineField({ name: 'defaultSeoDescription', type: 'text', title: 'Default SEO Description', rows: 2 }),
    defineField({ name: 'defaultOgImage', type: 'image', title: 'Default OG Image' }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
