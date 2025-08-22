import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ThemeSelector from '../ThemeSelector';
import { ThemeProvider } from '@/providers/ThemeProvider';

describe('ThemeSelector', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  it('should render theme selector buttons', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    expect(screen.getByText('Theme:')).toBeInTheDocument();
    expect(screen.getByText('common.theme.light')).toBeInTheDocument();
    expect(screen.getByText('common.theme.dark')).toBeInTheDocument();
  });

  it('should have light theme selected by default', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    const lightButton = screen.getByText('common.theme.light');
    const darkButton = screen.getByText('common.theme.dark');

    expect(lightButton).toHaveClass('bg-white', 'text-gray-900', 'shadow-sm');
    expect(darkButton).not.toHaveClass(
      'bg-white',
      'text-gray-900',
      'shadow-sm'
    );
  });

  it('should switch to dark theme when dark button is clicked', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('common.theme.dark');
    fireEvent.click(darkButton);

    expect(darkButton).toHaveClass('bg-white', 'text-gray-900', 'shadow-sm');

    expect(document.body.className).toBe('dark');
  });

  it('should switch to light theme when light button is clicked', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    const lightButton = screen.getByText('common.theme.light');
    const darkButton = screen.getByText('common.theme.dark');

    fireEvent.click(darkButton);
    expect(document.body.className).toBe('dark');

    fireEvent.click(lightButton);
    expect(document.body.className).toBe('');
  });

  it('should update document.body.className when theme changes', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('common.theme.dark');
    fireEvent.click(darkButton);

    expect(document.body.className).toBe('dark');
  });
});
