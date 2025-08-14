import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-intl
vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useTranslations: () => (key: string) => {
      // Return actual translations for common keys
      const translations: Record<string, string> = {
        'common.search': 'Search',
        'common.loading': 'Loading...',
        'common.theme.light': 'Light',
        'common.theme.dark': 'Dark',
        'common.error': 'Something went wrong',
        'pokemon.noResults': 'No Pokemon found',
        'navigation.about': 'About',
        'navigation.home': 'Home',
      };
      return translations[key] || key;
    },
    useLocale: () => 'en',
    getMessages: vi.fn(() => ({})),
  };
});

vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  return {
    ...actual,
    getMessages: vi.fn(() => ({})),
  };
});

// Mock next-intl/navigation
vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    Link: ({
      children,
      href,
      ...props
    }: {
      children: React.ReactNode;
      href: string;
      [key: string]: unknown;
    }) => {
      return { type: 'a', props: { href, ...props }, children };
    },
    redirect: vi.fn(),
    usePathname: () => '/en',
    useRouter: () => mockRouter,
    getPathname: () => '/en',
  }),
}));

// Mock localStorage
if (!globalThis.localStorage) {
  const localStorageMock = (() => {
    let store: Record<string, string | undefined> = {};
    return {
      getItem(key: string) {
        return store[key] ?? null;
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      removeItem(key: string) {
        store[key] = undefined;
      },
      clear() {
        store = {};
      },
    };
  })();

  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
}

// Mock fetch
globalThis.fetch = vi.fn();

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

export { mockRouter };
