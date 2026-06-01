import { defineField, defineType } from 'sanity';
import { HighlightIcon } from '@sanity/icons';
import React from 'react';

const HighlightDecorator = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: '#c9a87c' }}>{children}</span>
);

export const richText = defineType({
  name: 'richText',
  type: 'block',
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Underline', value: 'underline' },
      { title: 'Strike', value: 'strike-through' },
      { title: 'Code', value: 'code' },
      {
        title: 'Highlight',
        value: 'highlight',
        icon: HighlightIcon,
        component: HighlightDecorator,
      },
    ],
    annotations: [
      defineField({
        name: 'externalLink',
        title: 'External Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'openInNewTab',
            title: 'Open in new tab',
            type: 'boolean',
            initialValue: true,
          }),
        ],
      }),
      defineField({
        name: 'internalLink',
        title: 'Internal Link',
        type: 'object',
        fields: [
          defineField({
            name: 'reference',
            title: 'Page',
            type: 'reference',
            to: [
              { type: 'service' },
              { type: 'industry' },
              { type: 'caseStudy' },
              { type: 'blogPost' },
            ],
            validation: (Rule) => Rule.required(),
          }),
        ],
      }),
    ],
  },
});
