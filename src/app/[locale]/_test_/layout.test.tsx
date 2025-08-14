import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LocaleLayout from '../layout';

// Mock next-intl
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

// Mock the providers
vi.mock('@/providers', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  QueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}));

// Mock the components
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

// Mock CSS import
vi.mock('@/index.css', () => ({}));

describe('LocaleLayout', () => {
  it('renders layout with all components', async () => {
    const layout = await LocaleLayout({
      children: <div>Test Content</div>,
      params: Promise.resolve({ locale: 'en' }),
    });

    render(layout);

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('selected-items-flyout')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('sets correct lang attribute', async () => {
    const layout = await LocaleLayout({
      children: <div>Test Content</div>,
      params: Promise.resolve({ locale: 'es' }),
    });

    render(layout);

    const html = document.querySelector('html');
    expect(html).toHaveAttribute('lang', 'es');
  });
});
