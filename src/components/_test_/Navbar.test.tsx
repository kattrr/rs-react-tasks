import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'navigation.home': 'Home',
      'navigation.about': 'About',
    };
    return translations[key] || key;
  },
}));

// Mock next/navigation
let mockPathname = '/en/home';
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    Link: ({
      children,
      href,
      className,
    }: {
      children: React.ReactNode;
      href: string;
      className?: string;
    }) => (
      <a href={href} className={className} data-testid={`nav-link-${href}`}>
        {children}
      </a>
    ),
  }),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('@/i18n/routing', () => ({
  locales: ['en', 'es', 'ru', 'de', 'be'],
}));

describe('Navbar', () => {
  beforeEach(() => {
    mockPathname = '/en/home';
    vi.clearAllMocks();
  });

  it('renders navigation links with correct text', () => {
    render(<Navbar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders theme and language selectors', () => {
    render(<Navbar />);
    expect(screen.getByText('Theme:')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();

    const languageButton = screen.getByText('English').closest('button');
    if (languageButton) {
      fireEvent.click(languageButton);
      expect(screen.getByText('Español')).toBeInTheDocument();
    }
  });

  it('renders Pokédex SPA text', () => {
    render(<Navbar />);

    expect(screen.getByText('Pokédex SPA')).toBeInTheDocument();
  });

  it('applies active styles to home link when on home page', () => {
    mockPathname = '/en/';
    render(<Navbar />);

    const homeLink = screen.getByTestId('nav-link-/');
    expect(homeLink).toHaveClass('hover:text-purple-500');
    expect(homeLink).not.toHaveClass(
      'underline',
      'underline-offset-4',
      'text-purple-400'
    );
  });

  it('applies active styles to about link when on about page', () => {
    mockPathname = '/en/about';
    render(<Navbar />);

    const aboutLink = screen.getByTestId('nav-link-/about');
    expect(aboutLink).toHaveClass(
      'underline',
      'underline-offset-4',
      'text-purple-400'
    );
  });

  it('applies inactive styles to home link when not on home page', () => {
    mockPathname = '/en/about';
    render(<Navbar />);

    const homeLink = screen.getByTestId('nav-link-/');
    expect(homeLink).toHaveClass('hover:text-purple-500');
    expect(homeLink).not.toHaveClass(
      'underline',
      'underline-offset-4',
      'text-purple-400'
    );
  });

  it('applies inactive styles to about link when not on about page', () => {
    mockPathname = '/en/';
    render(<Navbar />);

    const aboutLink = screen.getByTestId('nav-link-/about');
    expect(aboutLink).toHaveClass('hover:text-purple-500');
    expect(aboutLink).not.toHaveClass(
      'underline',
      'underline-offset-4',
      'text-purple-400'
    );
  });

  it('handles pathname without locale segment', () => {
    mockPathname = '/home';
    render(<Navbar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('handles empty pathname', () => {
    mockPathname = '';
    render(<Navbar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('handles different locale in pathname', () => {
    mockPathname = '/es/about';
    render(<Navbar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
