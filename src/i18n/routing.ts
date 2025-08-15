import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
});

export const locales = routing.locales;
export type Locale = (typeof locales)[number];
