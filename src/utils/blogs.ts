import { getCollection, getEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';
import type { Post } from '../components/blogs/BlogList.astro';

/**
 * Devuelve los posts de `src/content/blogs` del idioma indicado,
 * con el autor resuelto desde la colección `equipo` y ordenados
 * del más reciente al más antiguo.
 */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const entries = await getCollection('blogs', (p) => p.data.lang === lang);

  const posts = await Promise.all(
    entries.map(async (entry) => {
      const autor = await getEntry(entry.data.author);
      if (!autor) {
        throw new Error(
          `Blog "${entry.id}": el autor "${entry.data.author.id}" no existe en src/content/equipo/`,
        );
      }

      return {
        slug: entry.id,
        title: entry.data.title,
        summary: entry.data.summary,
        date: entry.data.date,
        image: entry.data.photo,
        tags: entry.data.tags,
        author: {
          name: autor.data.name,
          role: autor.data.role,
          initials: autor.data.initials,
          photo: autor.data.photo,
        },
      } satisfies Post;
    }),
  );

  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}
