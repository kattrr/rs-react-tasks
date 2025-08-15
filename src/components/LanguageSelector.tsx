'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

const LanguageSelector = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: string) => {
    if (!pathname) return;

    const segments = pathname.split('/');
    if (
      segments.length > 1 &&
      locales.includes(segments[1] as 'en' | 'es' | 'ru' | 'de')
    ) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
    setIsOpen(false);
  };

  const currentLocale = pathname?.split('/')[1] || 'en';

  const getLanguageName = (locale: string) => {
    const languageNames: Record<string, string> = {
      en: 'English',
      es: 'Español',
      ru: 'Русский',
      de: 'Deutsch',
    };
    return languageNames[locale] || locale.toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white text-indigo-600 rounded-md border border-indigo-200 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="font-medium">{getLanguageName(currentLocale)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-indigo-200 rounded-md shadow-lg z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                currentLocale === locale
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-indigo-50'
              }`}
            >
              {getLanguageName(locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
