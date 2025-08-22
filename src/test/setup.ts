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
    useTranslations: (namespace: string) => (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        common: {
          search: 'Search',
          loading: 'Loading...',
          'theme.light': 'Light',
          'theme.dark': 'Dark',
          error: 'Something went wrong',
          previous: 'Previous',
          next: 'Next',
          close: 'Close modal',
        },
        pokemon: {
          noResults: 'No Pokemon found',
        },
        navigation: {
          about: 'About',
          home: 'Home',
        },
        mainPage: {
          title: '🔍 Pokémon Search',
          goHomeButton: 'Go Home',
          searchPlaceholder: 'Search Pokémon by name...',
        },
        forms: {
          title: 'Form Management System',
          subtitle:
            'Choose between uncontrolled components or React Hook Form approaches',
          uncontrolledForm: 'Open Uncontrolled Form',
          hookForm: 'Open React Hook Form',
          submittedForms: 'Submitted Forms',
          noFormsSubmitted: 'No forms submitted yet',
          noFormsDescription:
            'Submit a form using one of the buttons above to see the data here.',

          // Form fields
          'fields.name': 'Name',
          'fields.age': 'Age',
          'fields.email': 'Email',
          'fields.password': 'Password',
          'fields.confirmPassword': 'Confirm Password',
          'fields.gender': 'Gender',
          'fields.picture': 'Profile Picture',
          'fields.country': 'Country',
          'fields.acceptTerms': 'I accept the Terms and Conditions',

          // Form placeholders
          'placeholders.name': 'Enter your name',
          'placeholders.age': 'Enter your age',
          'placeholders.email': 'Enter your email',
          'placeholders.password': 'Enter your password',
          'placeholders.confirmPassword': 'Confirm your password',
          'placeholders.country': 'Enter your country',

          // Form options
          'options.selectGender': 'Select gender',
          'options.male': 'Male',
          'options.female': 'Female',
          'options.other': 'Other',
          'options.preferNotToSay': 'Prefer not to say',
          'options.selectCountry': 'Select country',

          // Form validation
          'validation.required': 'This field is required',
          'validation.nameRequired': 'Name is required',
          'validation.nameUppercase':
            'Name must start with an uppercase letter',
          'validation.ageRequired': 'Age is required',
          'validation.agePositive': 'Age must be a positive number',
          'validation.ageWhole': 'Age must be a whole number',
          'validation.emailRequired': 'Email is required',
          'validation.emailValid': 'Please enter a valid email address',
          'validation.passwordRequired': 'Password is required',
          'validation.passwordStrength':
            'Password must contain at least one number, uppercase letter, lowercase letter, and special character',
          'validation.confirmPasswordRequired': 'Please confirm your password',
          'validation.passwordsMatch': 'Passwords do not match',
          'validation.genderRequired': 'Please select a gender',
          'validation.termsRequired':
            'You must accept the terms and conditions',
          'validation.countryRequired': 'Please select a country',

          // Form buttons
          'buttons.cancel': 'Cancel',
          'buttons.submit': 'Submit',
          'buttons.submitting': 'Submitting...',

          // Form display
          'display.uncontrolledForm': 'Uncontrolled Form',
          'display.reactHookForm': 'React Hook Form',
          'display.new': 'New',
          'display.personalInformation': 'Personal Information',
          'display.additionalDetails': 'Additional Details',
          'display.profilePicture': 'Profile Picture',
          'display.termsAccepted': 'Terms Accepted',
          'display.yes': 'Yes',
          'display.no': 'No',
          'display.uploaded': 'Uploaded',
          'display.none': 'None',

          // Password strength
          'passwordStrength.number': 'Number',
          'passwordStrength.uppercase': 'Uppercase',
          'passwordStrength.lowercase': 'Lowercase',
          'passwordStrength.special': 'Special',
        },
      };

      const namespaceTranslations = translations[namespace];
      if (!namespaceTranslations) {
        return key;
      }

      const result = namespaceTranslations[key];
      if (!result) {
        return key;
      }

      return result;
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
    console.debug('Navigation API not supported');
  }

  HTMLAnchorElement.prototype.click = function () {
    return;
  };
}

export { mockRouter };
