import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useTranslations: () => (key: string) => {
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

globalThis.fetch = vi.fn();

globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));



if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'URL', {
    value: {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    },
    writable: true,
    configurable: true,
  });

  // Mock navigation API to suppress JSDOM warnings
  try {
    const nav = (window as unknown as Record<string, unknown>).navigation;
    if (nav && typeof nav === 'object') {
      Object.defineProperty(nav, 'navigate', {
        value: vi.fn(),
        writable: true,
        configurable: true,
      });
    }
  } catch {
    // Navigation API not available, skip
  }

  // Mock HTMLAnchorElement.prototype.click to suppress navigation warnings
  HTMLAnchorElement.prototype.click = function () {
    // Suppress navigation warnings by doing nothing
    return;
  };
}

export { mockRouter };
