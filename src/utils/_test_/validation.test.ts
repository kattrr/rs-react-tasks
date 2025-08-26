import { describe, it, expect } from 'vitest';
import {
  validatePasswordStrength,
  validateImageFile,
  convertImageToBase64,
  filterCountries,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validatePasswordStrength', () => {
    it('returns correct strength for strong password', () => {
      const result = validatePasswordStrength('Password123!');

      expect(result).toEqual({
        score: 4,
        hasNumber: true,
        hasUpperCase: true,
        hasLowerCase: true,
        hasSpecialChar: true,
      });
    });

    it('returns correct strength for weak password', () => {
      const result = validatePasswordStrength('password');

      expect(result).toEqual({
        score: 1,
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: true,
        hasSpecialChar: false,
      });
    });

    it('returns correct strength for password with numbers and uppercase', () => {
      const result = validatePasswordStrength('Password123');

      expect(result).toEqual({
        score: 3,
        hasNumber: true,
        hasUpperCase: true,
        hasLowerCase: true,
        hasSpecialChar: false,
      });
    });

    it('handles empty password', () => {
      const result = validatePasswordStrength('');

      expect(result).toEqual({
        score: 0,
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasSpecialChar: false,
      });
    });

    it('handles password with only special characters', () => {
      const result = validatePasswordStrength('!@#$%^');

      expect(result).toEqual({
        score: 1,
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasSpecialChar: true,
      });
    });
  });

  describe('validateImageFile', () => {
    it('validates valid PNG file', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('validates valid JPEG file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects invalid file type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only PNG and JPEG files are allowed');
    });

    it('rejects file larger than 5MB', () => {
      // Create a mock file with size > 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      const result = validateImageFile(largeFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size must be less than 5MB');
    });

    it('accepts file exactly 5MB', () => {
      // Create a mock file with size exactly 5MB
      const exactFile = new File(['x'.repeat(5 * 1024 * 1024)], 'exact.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(exactFile, 'size', { value: 5 * 1024 * 1024 });

      const result = validateImageFile(exactFile);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('convertImageToBase64', () => {
    it('converts file to base64 successfully', async () => {
      const file = new File(['test content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const result = await convertImageToBase64(file);

      expect(typeof result).toBe('string');
      expect(result).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('handles empty file', async () => {
      const file = new File([''], 'empty.jpg', { type: 'image/jpeg' });
      const result = await convertImageToBase64(file);

      expect(typeof result).toBe('string');
      expect(result).toMatch(/^data:image\/jpeg;base64,/);
    });
  });

  describe('filterCountries', () => {
    const countries = [
      'United States',
      'Canada',
      'United Kingdom',
      'Germany',
      'France',
      'Spain',
      'Italy',
    ];

    it('returns all countries when query is empty', () => {
      const result = filterCountries(countries, '');

      expect(result).toEqual(countries);
    });

    it('returns all countries when query is whitespace only', () => {
      const result = filterCountries(countries, '   ');

      expect(result).toEqual(countries);
    });

    it('filters countries case-insensitively', () => {
      const result = filterCountries(countries, 'united');

      expect(result).toEqual(['United States', 'United Kingdom']);
    });

    it('filters countries by partial match', () => {
      const result = filterCountries(countries, 'ger');

      expect(result).toEqual(['Germany']);
    });

    it('returns empty array when no matches found', () => {
      const result = filterCountries(countries, 'xyz');

      expect(result).toEqual([]);
    });

    it('handles special characters in query', () => {
      const result = filterCountries(countries, 'united states');

      expect(result).toEqual(['United States']);
    });

    it('handles empty countries array', () => {
      const result = filterCountries([], 'test');

      expect(result).toEqual([]);
    });
  });
});
