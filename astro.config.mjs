// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bootmap.dev',

  integrations: [starlight({
      title: 'bootmap.dev',
      description:
          'The Java ecosystem reference, reorganized and deeply explained. Production patterns, version-aware, cross-linked. Starting with Spring Boot.',
      customCss: ['./src/styles/global.css'],
      social: [
          {
              icon: 'github',
              label: 'GitHub',
              href: 'https://github.com/imbacraft/bootmap',
          },
      ],
      editLink: {
          baseUrl: 'https://github.com/imbacraft/bootmap/edit/master/',
      },
      lastUpdated: true,
      sidebar: [
          {
              label: 'Spring Boot',
              items: [
                  {
                      label: 'Auto-Configuration',
                      autogenerate: { directory: 'spring-boot/auto-configuration' },
                  },
              ],
          },
      ],
      }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});