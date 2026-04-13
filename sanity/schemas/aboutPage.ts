import { defineType, defineField } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'storyImage',
      type: 'image',
      title: 'Our Story Image',
      description: 'Photo for the "Our Story" section',
      options: { hotspot: true },
    }),
    defineField({
      name: 'craftIcon',
      type: 'image',
      title: 'Craft Value Icon',
      description: 'Icon image for the "Craft" value card',
    }),
    defineField({
      name: 'partnershipIcon',
      type: 'image',
      title: 'Partnership Value Icon',
      description: 'Icon image for the "Partnership" value card',
    }),
    defineField({
      name: 'innovationIcon',
      type: 'image',
      title: 'Innovation Value Icon',
      description: 'Icon image for the "Innovation" value card',
    }),
    defineField({
      name: 'integrityIcon',
      type: 'image',
      title: 'Integrity Value Icon',
      description: 'Icon image for the "Integrity" value card',
    }),
    defineField({
      name: 'partnersImage',
      type: 'image',
      title: 'Trusted Partners Image',
      description: 'Image for the "Trusted Partnerships" / Certifications section',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' };
    },
  },
});
