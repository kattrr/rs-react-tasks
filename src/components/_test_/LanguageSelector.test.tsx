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
  locales: ['en', 'es', 'ru', 'de', 'be'],
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = '/en/home';
  });

  it('renders dropdown button with current language', () => {
    render(<LanguageSelector />);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows dropdown when clicked', () => {
    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    // Check if dropdown options are visible
    const englishElements = screen.getAllByText('English');
    expect(englishElements).toHaveLength(2); // One in button, one in dropdown
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Русский')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('calls router.push with correct path when changing to different locale', () => {
    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const esButton = screen.getByText('Español');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/home');
  });

  it('calls router.push with correct path when changing to same locale', () => {
    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const enButtons = screen.getAllByText('English');
    const enButton = enButtons[1]; // Select the dropdown option, not the button text
    fireEvent.click(enButton);

    expect(mockPush).toHaveBeenCalledWith('/en/home');
  });

  it('handles pathname without locale segment', () => {
    mockPathname = '/home';

    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const esButton = screen.getByText('Español');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/home');
  });

  it('handles empty pathname', () => {
    mockPathname = '';

    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const esButton = screen.getByText('Español');
    fireEvent.click(esButton);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles pathname with single segment', () => {
    mockPathname = '/';

    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const esButton = screen.getByText('Español');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/');
  });

  it('handles pathname with multiple segments', () => {
    mockPathname = '/en/about/contact';

    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    const esButton = screen.getByText('Español');
    fireEvent.click(esButton);

    expect(mockPush).toHaveBeenCalledWith('/es/about/contact');
  });

  it('closes dropdown when clicking outside', () => {
    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    expect(screen.getByText('Español')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Español')).not.toBeInTheDocument();
  });

  it('closes dropdown after selecting a language', () => {
    render(<LanguageSelector />);

    const dropdownButton = screen.getByRole('button');
    fireEvent.click(dropdownButton);

    // Verify dropdown is open
    expect(screen.getByText('Español')).toBeInTheDocument();

    // Select a language
    const esButton = screen.getByText('Español');
    fireEvent.click(esButton);

    // Verify dropdown is closed
    expect(screen.queryByText('Español')).not.toBeInTheDocument();
  });
});
