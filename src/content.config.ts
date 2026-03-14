import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/servicios' }),
  schema: z.object({
    title:   z.string(),
    summary: z.string(),
    icon:    z.string(),
    order:   z.number(),
    lang:    z.enum(['es', 'en']),
    photo:   z.string().optional(),
  }),
});

const equipo = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/equipo' }),
  schema: z.object({
    name:       z.string(),
    role:       z.string(),
    bio:        z.string(),
    initials:   z.string(),
    specialty:  z.array(z.string()),
    order:      z.number(),
    lang:       z.enum(['es', 'en']),
    photo:      z.string().optional(),
  }),
});

export const collections = { servicios, equipo };
