'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/routing';

const LanguageSelector = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    if (!pathname) return;

    const segments = pathname.split('/');
    if (segments.length > 1 && locales.includes(segments[1] as 'en' | 'es')) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
  };

  const currentLocale = pathname?.split('/')[1] || 'en';

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale)}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            currentLocale === locale
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
