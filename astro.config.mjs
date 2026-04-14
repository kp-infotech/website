import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import icon from 'astro-icon';

// Load environment variables from .env files (for local dev)
const env = loadEnv(
  process.env.NODE_ENV ?? 'production',
  process.cwd(),
  ''
);

// Check process.env first (hosting provider injects vars here), then fall back to loadEnv (local .env files)
const PUBLIC_SANITY_PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || env.PUBLIC_SANITY_PROJECT_ID;
const PUBLIC_SANITY_DATASET = process.env.PUBLIC_SANITY_DATASET || env.PUBLIC_SANITY_DATASET || 'production';

// Validate required environment variables
if (!PUBLIC_SANITY_PROJECT_ID) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID is not defined. ' +
    'Ensure it is set in your .env file locally or in your hosting provider\'s dashboard.'
  );
}

export default defineConfig({
  site: 'https://kpinfo.tech',
  adapter: cloudflare({ imageService: 'compile' }),
  image: {
    // Allow remote images from Sanity CDN for build-time optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  integrations: [
    sitemap(),
    react(),
    icon({
      include: {
        'fa6-brands': ['linkedin-in', 'x-twitter', 'instagram', 'facebook-f', 'dribbble', 'whatsapp'],
        'fa6-solid': ['phone', 'envelope', 'location-dot', 'clock', 'arrow-right', 'chevron-down', 'bars', 'xmark', 'arrow-up-right-from-square', 'chevron-right'],
      },
    }),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      useCdn: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
