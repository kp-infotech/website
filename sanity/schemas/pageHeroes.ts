import { defineType, defineField } from 'sanity';

export const pageHeroes = defineType({
  name: 'pageHeroes',
  title: 'Page Heroes',
  type: 'document',
  fields: [
    defineField({
      name: 'homeHero',
      type: 'image',
      title: 'Homepage',
      description: 'Hero background image for the homepage',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutHero',
      type: 'image',
      title: 'About Page',
      description: 'Hero background image for the About page',
      options: { hotspot: true },
    }),
    defineField({
      name: 'contactHero',
      type: 'image',
      title: 'Contact Page',
      description: 'Hero background image for the Contact page',
      options: { hotspot: true },
    }),
    defineField({
      name: 'workHero',
      type: 'image',
      title: 'Work Page',
      description: 'Hero background image for the Work (Portfolio) index page',
      options: { hotspot: true },
    }),
    defineField({
      name: 'servicesHero',
      type: 'image',
      title: 'Services Page',
      description: 'Hero background image for the Services index page',
      options: { hotspot: true },
    }),
    defineField({
      name: 'industriesHero',
      type: 'image',
      title: 'Industries Page',
      description: 'Hero background image for the Industries index page',
      options: { hotspot: true },
    }),
    defineField({
      name: 'insightsHero',
      type: 'image',
      title: 'Insights Page',
      description: 'Hero background image for the Insights (Blog) index page',
      options: { hotspot: true },
    }),
    defineField({
      name: 'homeServicesBg',
      type: 'image',
      title: 'Homepage — Services Background',
      description: 'Background image for the Services section on the homepage',
      options: { hotspot: true },
    }),
    defineField({
      name: 'homeStatsBg',
      type: 'image',
      title: 'Homepage — Stats Background',
      description: 'Background image for the Stats/Numbers section on the homepage',
      options: { hotspot: true },
    }),
    defineField({
      name: 'homeIndustriesBg',
      type: 'image',
      title: 'Homepage — Industries Background',
      description: 'Background image for the Industries section on the homepage',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Page Heroes' };
    },
  },
});
