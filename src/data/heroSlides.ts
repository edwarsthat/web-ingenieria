import type { ImageMetadata } from 'astro';

import control       from '../assets/hero/control-tecnico.webp';
import consultoria   from '../assets/hero/consultoria.webp';
import interventoria from '../assets/hero/interventoria.webp';
import auditoria     from '../assets/hero/auditoria-energetica.webp';
import blogs         from '../assets/hero/blogsIndex.webp'
/**
 * Imágenes de fondo del carrusel del hero.
 * La clave cruza con el campo `id` de `hero.slides` en `src/i18n/{es,en}.json`
 * — el texto vive traducido en los JSON, la imagen se comparte entre idiomas.
 */
export const heroImages = {
  general:       control,
  consultoria:   consultoria,
  interventoria: interventoria,
  auditoria:     auditoria,
  blogs:         blogs,
} as const satisfies Record<string, ImageMetadata>;

export type HeroSlideId = keyof typeof heroImages;

/** Forma de cada entrada de `hero.slides` en los JSON de i18n. */
export interface HeroSlide {
  id: HeroSlideId;
  badge: string;
  h1a: string;
  h1b: string;
  sub: string;
  cta1: HeroCta;
  cta2: HeroCta;
}

export interface HeroCta {
  label: string;
  /** Ruta sin prefijo de idioma — el componente compone `/${lang}${href}`. */
  href: string;
}

export function getHeroImage(id: string): ImageMetadata {
  const image = heroImages[id as HeroSlideId];
  if (!image) throw new Error(`[hero] No hay imagen registrada para el slide "${id}"`);
  return image;
}
