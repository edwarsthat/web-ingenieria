// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    // Base path for deployment to GitHub Pages
    base: '/web-ingenieria',
    // Public site URL for RSS, sitemaps, canonical URLs, etc.
    site: 'https://edwarsthat.github.io',
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
    },
});