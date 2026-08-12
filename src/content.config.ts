import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
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

const blogs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blogs' }),
  schema: z.object({
    title:   z.string(),
    summary: z.string(),
    // id de una entrada de `equipo` — ej. "es-alejandro-vargas"
    author:  reference('equipo'),
    date:    z.coerce.date(),
    lang:    z.enum(['es', 'en']),
    photo:   z.string().optional(),
    tags:    z.array(z.string()).default([]),
  }),
});

export const collections = { servicios, equipo, blogs };
