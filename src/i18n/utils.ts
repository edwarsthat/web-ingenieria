import es from './es.json';
import en from './en.json';

const translations = { es, en };

export type Lang = keyof typeof translations;

export const languages: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
};

export function useTranslations(lang: Lang) {
  return translations[lang];
}
