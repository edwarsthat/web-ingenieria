import { defineCollection, z } from 'astro:content';

const servicios = defineCollection({
  schema: z.object({
    title:   z.string(),
    summary: z.string(),
    icon:    z.string(),
    order:   z.number(),
    lang:    z.enum(['es', 'en']),
  }),
});

export const collections = { servicios };
