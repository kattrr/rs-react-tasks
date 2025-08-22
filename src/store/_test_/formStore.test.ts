import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormStore } from '../formStore';

describe('Form Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useFormStore());
    act(() => {
      result.current.clearFormData();
      result.current.setCountries([]);
    });
  });

  describe('Initial State', () => {
    it('has empty form data initially', () => {
      const { result } = renderHook(() => useFormStore());

      expect(result.current.formData).toEqual([]);
      expect(result.current.countries).toEqual([]);
    });
  });

  describe('addFormData', () => {
    it('adds new form data with generated id and timestamp', () => {
      const { result } = renderHook(() => useFormStore());

      const mockFormData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
        formType: 'uncontrolled' as const,
      };

      act(() => {
        result.current.addFormData(mockFormData);
      });

      expect(result.current.formData).toHaveLength(1);
      expect(result.current.formData[0]).toMatchObject(mockFormData);
      expect(result.current.formData[0].id).toBeDefined();
      expect(result.current.formData[0].createdAt).toBeInstanceOf(Date);
    });

    it('adds multiple form data entries', () => {
      const { result } = renderHook(() => useFormStore());

      const mockData1 = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: '',
        country: 'United States',
        formType: 'uncontrolled' as const,
      };

      const mockData2 = {
        name: 'Jane Smith',
        age: 30,
        email: 'jane@example.com',
        password: 'Secure456!',
        confirmPassword: 'Secure456!',
        gender: 'female',
        acceptTerms: true,
        picture: '',
        country: 'Canada',
        formType: 'hookform' as const,
      };

      act(() => {
        result.current.addFormData(mockData1);
        result.current.addFormData(mockData2);
      });

      expect(result.current.formData).toHaveLength(2);
      expect(result.current.formData[0]).toMatchObject(mockData1);
      expect(result.current.formData[1]).toMatchObject(mockData2);
    });

    it('generates unique ids for each entry', () => {
      const { result } = renderHook(() => useFormStore());

      const mockData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: '',
        country: 'United States',
        formType: 'uncontrolled' as const,
      };

      act(() => {
        result.current.addFormData(mockData);
        result.current.addFormData(mockData);
      });

      expect(result.current.formData).toHaveLength(2);
      expect(result.current.formData[0].id).not.toBe(
        result.current.formData[1].id
      );
    });
  });

  describe('setCountries', () => {
    it('sets countries list', () => {
      const { result } = renderHook(() => useFormStore());

      const countries = ['United States', 'Canada', 'United Kingdom'];

      act(() => {
        result.current.setCountries(countries);
      });

      expect(result.current.countries).toEqual(countries);
    });

    it('overwrites existing countries list', () => {
      const { result } = renderHook(() => useFormStore());

      const initialCountries = ['United States', 'Canada'];
      const newCountries = ['Germany', 'France', 'Spain'];

      act(() => {
        result.current.setCountries(initialCountries);
        result.current.setCountries(newCountries);
      });

      expect(result.current.countries).toEqual(newCountries);
      expect(result.current.countries).not.toEqual(initialCountries);
    });

    it('handles empty countries list', () => {
      const { result } = renderHook(() => useFormStore());

      act(() => {
        result.current.setCountries([]);
      });

      expect(result.current.countries).toEqual([]);
    });
  });

  describe('clearFormData', () => {
    it('clears all form data', () => {
      const { result } = renderHook(() => useFormStore());

      const mockData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: '',
        country: 'United States',
        formType: 'uncontrolled' as const,
      };

      act(() => {
        result.current.addFormData(mockData);
        result.current.addFormData(mockData);
        result.current.clearFormData();
      });

      expect(result.current.formData).toEqual([]);
    });

    it('does not affect countries list', () => {
      const { result } = renderHook(() => useFormStore());

      const countries = ['United States', 'Canada'];

      act(() => {
        result.current.setCountries(countries);
        result.current.clearFormData();
      });

      expect(result.current.countries).toEqual(countries);
    });
  });

  describe('State Persistence', () => {
    it('maintains state between multiple hook calls', () => {
      const { result: result1 } = renderHook(() => useFormStore());
      const { result: result2 } = renderHook(() => useFormStore());

      const mockData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: '',
        country: 'United States',
        formType: 'uncontrolled' as const,
      };

      act(() => {
        result1.current.addFormData(mockData);
      });

      expect(result2.current.formData).toHaveLength(1);
      expect(result2.current.formData[0]).toMatchObject(mockData);
    });

    it('maintains countries between multiple hook calls', () => {
      const { result: result1 } = renderHook(() => useFormStore());
      const { result: result2 } = renderHook(() => useFormStore());

      const countries = ['United States', 'Canada'];

      act(() => {
        result1.current.setCountries(countries);
      });

      expect(result2.current.countries).toEqual(countries);
    });
  });

  describe('Data Integrity', () => {
    it('preserves all form data fields', () => {
      const { result } = renderHook(() => useFormStore());

      const mockData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
        formType: 'uncontrolled' as const,
      };

      act(() => {
        result.current.addFormData(mockData);
      });

      const storedData = result.current.formData[0];
      expect(storedData.name).toBe(mockData.name);
      expect(storedData.age).toBe(mockData.age);
      expect(storedData.email).toBe(mockData.email);
      expect(storedData.password).toBe(mockData.password);
      expect(storedData.confirmPassword).toBe(mockData.confirmPassword);
      expect(storedData.gender).toBe(mockData.gender);
      expect(storedData.acceptTerms).toBe(mockData.acceptTerms);
      expect(storedData.picture).toBe(mockData.picture);
      expect(storedData.country).toBe(mockData.country);
      expect(storedData.formType).toBe(mockData.formType);
    });

    it('handles different form types correctly', () => {
      const { result } = renderHook(() => useFormStore());

      const uncontrolledData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: '',
        country: 'United States',
        formType: 'uncontrolled' as const,
      };

      const hookFormData = {
        name: 'Jane Smith',
        age: 30,
        email: 'jane@example.com',
        password: 'Secure456!',
        confirmPassword: 'Secure456!',
        gender: 'female',
        acceptTerms: true,
        picture: '',
        country: 'Canada',
        formType: 'hookform' as const,
      };

      act(() => {
        result.current.addFormData(uncontrolledData);
        result.current.addFormData(hookFormData);
      });

      expect(result.current.formData[0].formType).toBe('uncontrolled');
      expect(result.current.formData[1].formType).toBe('hookform');
    });
  });
});
