import { describe, it, expect, vi } from 'vitest';
import LocaleLayout from '../layout';

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn(() => Promise.resolve({})),
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({
    children,
    locale,
  }: {
    children: React.ReactNode;
    locale: string;
  }) => (
    <div data-testid="next-intl-provider" data-locale={locale}>
      {children}
    </div>
  ),
}));

vi.mock('@/providers', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  QueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}));

vi.mock('@/components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navigation</nav>,
}));

vi.mock('@/components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('@/components/SelectedItemsFlyout', () => ({
  default: () => <div data-testid="selected-items-flyout">Flyout</div>,
}));

vi.mock('@/index.css', () => ({}));

describe('LocaleLayout', () => {
  it('returns a valid React element', async () => {
    const layout = await LocaleLayout({
      children: <div>Test Content</div>,
      params: Promise.resolve({ locale: 'en' }),
    });

    expect(layout).toBeDefined();
    expect(typeof layout).toBe('object');
    expect(layout).toHaveProperty('type');
    expect(layout).toHaveProperty('props');
  });

  it('accepts locale parameter correctly', async () => {
    const mockParams = Promise.resolve({ locale: 'es' });

    const layout = await LocaleLayout({
      children: <div>Test Content</div>,
      params: mockParams,
    });

    expect(layout).toBeDefined();

    const resolvedParams = await mockParams;
    expect(resolvedParams.locale).toBe('es');
  });
});
