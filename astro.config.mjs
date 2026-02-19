// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    site: 'https://edwarsthat.github.io',
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
    },
});