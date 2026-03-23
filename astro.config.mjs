// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare(),
    output: 'static',
    vite: {
        plugins: [tailwindcss()],
    },
    site: 'https://sigmaprosas.com',
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
    },
});