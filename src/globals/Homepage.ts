import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  /**slug: 'homepage', Payload automatically exposes 
   a REST endpoint under its API prefix:

/api/globals/homepage Homepage.ts
  ↓
slug: 'homepage'
  ↓
Payload registers the Global
  ↓
Payload auto-generates REST API
  ↓
http://localhost:3001/api/globals/homepage
 */
  label: 'Homepage',

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'hero',
      label: 'Hero Section',
      type: 'group',
      fields: [
        {
          name: 'badge',
          type: 'text',
          defaultValue: 'UJAN LABS',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'headline',
          label: 'Main Hero Headline',
          type: 'text',
          required: true,
          defaultValue: 'We build modern software for your business.',
        },
        {
          name: 'subtitle',
          type: 'textarea',
        },
        {
          name: 'primaryButtonText',
          type: 'text',
          defaultValue: 'Request Demo',
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          defaultValue: 'Contact Us',
        },
      ],
    },

    {
      name: 'mission',
      type: 'textarea',
    },

    {
      name: 'services',
      type: 'textarea',
    },

    {
      name: 'featuredProduct',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    {
      name: 'audience',
      type: 'textarea',
    },

    {
      name: 'vision',
      type: 'textarea',
    },
  ],
}
