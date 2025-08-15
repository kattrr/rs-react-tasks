import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from '../useTheme';
import { ThemeContext } from '@contexts/ThemeContext';

describe('useTheme', () => {
  it('should return theme context when used within ThemeProvider', () => {
    const mockTheme = {
      theme: 'light' as const,
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        ThemeContext.Provider,
        { value: mockTheme },
        children
      );
    };

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toBe(mockTheme);
  });

  it('should throw error when used outside ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });
});
