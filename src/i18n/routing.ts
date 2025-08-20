import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['be', 'de', 'en', 'es', 'ru'],
  defaultLocale: 'en',
});

export const locales = routing.locales;
export type Locale = (typeof locales)[number];
