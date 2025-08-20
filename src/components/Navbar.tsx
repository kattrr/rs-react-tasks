'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { createNavigation } from 'next-intl/navigation';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import { locales } from '@/i18n/routing';

const navigation = createNavigation({ locales });

const Navbar = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`;
  };

  return (
    <nav className="w-full bg-indigo-200 text-indigo-900 top-0 py-6 px-[20%] flex items-center justify-between mb-8 shadow">
      <div className="flex items-center gap-6">
        <navigation.Link
          href="/"
          className={`text-lg font-bold transition-colors ${isActive('') ? 'underline underline-offset-4 text-purple-400' : 'hover:text-purple-500'}`}
        >
          {t('navigation.home')}
        </navigation.Link>
        <navigation.Link
          href="/about"
          className={`text-lg font-bold transition-colors ${isActive('/about') ? 'underline underline-offset-4 text-purple-400' : 'hover:text-purple-500'}`}
        >
          {t('navigation.about')}
        </navigation.Link>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <ThemeSelector />
        <span className="font-mono text-sm text-indigo-200">Pokédex SPA</span>
      </div>
    </nav>
  );
};

export default Navbar;
