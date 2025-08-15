import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LanguageSelector from '../LanguageSelector';

const mockPush = vi.fn();
let mockPathname = '/en/home';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/i18n/routing', () => ({
  locales: ['en', 'es'],
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPathname = '/en/home';
  });

  it('renders language buttons for all locales', () => {
    render(<LanguageSelector />);

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('highlights current locale button', () => {
    render(<LanguageSelector />);

    const enButton = screen.getByText('EN');
    const esButton = screen.getByText('ES');

    expect(enButton).toHaveClass('bg-indigo-600', 'text-white');

    expect(esButton).toHaveClass('bg-white', 'text-indigo-600');
  });

  it('calls router.push with correct path when changing to different locale', () => {
    render(<LanguageSelector />);

    const esButton = screen.getByText('ES');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/home');
  });

  it('calls router.push with correct path when changing to same locale', () => {
    render(<LanguageSelector />);

    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);

    expect(mockPush).toHaveBeenCalledWith('/en/home');
  });

  it('handles pathname without locale segment', () => {
    mockPathname = '/home';

    render(<LanguageSelector />);

    const esButton = screen.getByText('ES');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/home');
  });

  it('handles empty pathname', () => {
    mockPathname = '';

    render(<LanguageSelector />);

    const esButton = screen.getByText('ES');
    fireEvent.click(esButton);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles pathname with single segment', () => {
    mockPathname = '/';

    render(<LanguageSelector />);

    const esButton = screen.getByText('ES');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/');
  });

  it('handles pathname with multiple segments', () => {
    mockPathname = '/en/about/contact';

    render(<LanguageSelector />);

    const esButton = screen.getByText('ES');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/about/contact');
  });
});
