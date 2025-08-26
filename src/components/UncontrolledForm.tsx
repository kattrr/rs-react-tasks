import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormStore } from '../store/formStore';
import {
  validatePasswordStrength,
  validateImageFile,
  convertImageToBase64,
} from '../utils/validation';

interface UncontrolledFormProps {
  onClose: () => void;
}

export const UncontrolledForm: React.FC<UncontrolledFormProps> = ({
  onClose,
}) => {
  const t = useTranslations('forms');
  const addFormData = useFormStore((state) => state.addFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const acceptTermsRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    const name = nameRef.current?.value || '';
    if (!name) {
      newErrors.name = t('validation.nameRequired');
    } else if (name[0] !== name[0]?.toUpperCase()) {
      newErrors.name = t('validation.nameUppercase');
    }

    // Age validation
    const age = parseInt(ageRef.current?.value || '0');
    if (!ageRef.current?.value) {
      newErrors.age = t('validation.ageRequired');
    } else if (isNaN(age) || age < 0) {
      newErrors.age = t('validation.agePositive');
    }

    // Email validation
    const email = emailRef.current?.value || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = t('validation.emailRequired');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('validation.emailValid');
    }

    // Password validation
    const password = passwordRef.current?.value || '';
    if (!password) {
      newErrors.password = t('validation.passwordRequired');
    } else {
      const strength = validatePasswordStrength(password);
      if (strength.score < 4) {
        newErrors.password = t('validation.passwordStrength');
      }
    }

    // Confirm password validation
    const confirmPassword = confirmPasswordRef.current?.value || '';
    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordsMatch');
    }

    // Gender validation
    if (!genderRef.current?.value) {
      newErrors.gender = t('validation.genderRequired');
    }

    // Terms validation
    if (!acceptTermsRef.current?.checked) {
      newErrors.acceptTerms = t('validation.termsRequired');
    }

    // Picture validation
    const pictureFile = pictureRef.current?.files?.[0];
    if (pictureFile) {
      const validation = validateImageFile(pictureFile);
      if (!validation.isValid) {
        newErrors.picture = validation.error || 'Invalid image file';
      }
    }

    // Country validation
    if (!countryRef.current?.value) {
      newErrors.country = t('validation.countryRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let pictureBase64 = '';
      const pictureFile = pictureRef.current?.files?.[0];
      if (pictureFile) {
        pictureBase64 = await convertImageToBase64(pictureFile);
      }

      const formData = {
        name: nameRef.current?.value || '',
        age: parseInt(ageRef.current?.value || '0'),
        email: emailRef.current?.value || '',
        password: passwordRef.current?.value || '',
        confirmPassword: confirmPasswordRef.current?.value || '',
        gender: genderRef.current?.value || '',
        acceptTerms: acceptTermsRef.current?.checked || false,
        picture: pictureBase64,
        country: countryRef.current?.value || '',
        formType: 'uncontrolled' as const,
      };

      addFormData(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Error submitting form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field: string) => {
    return errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.name')} *
        </label>
        <input
          ref={nameRef}
          type="text"
          id="name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('placeholders.name')}
        />
        {renderError('name')}
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.age')} *
        </label>
        <input
          ref={ageRef}
          type="number"
          id="age"
          min="0"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('placeholders.age')}
        />
        {renderError('age')}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.email')} *
        </label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('placeholders.email')}
        />
        {renderError('email')}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.password')} *
        </label>
        <input
          ref={passwordRef}
          type="password"
          id="password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('placeholders.password')}
        />
        {renderError('password')}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.confirmPassword')} *
        </label>
        <input
          ref={confirmPasswordRef}
          type="password"
          id="confirmPassword"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('placeholders.confirmPassword')}
        />
        {renderError('confirmPassword')}
      </div>

      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.gender')} *
        </label>
        <select
          ref={genderRef}
          id="gender"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{t('options.selectGender')}</option>
          <option value="male">{t('options.male')}</option>
          <option value="female">{t('options.female')}</option>
          <option value="other">{t('options.other')}</option>
          <option value="prefer-not-to-say">
            {t('options.preferNotToSay')}
          </option>
        </select>
        {renderError('gender')}
      </div>

      <div>
        <label
          htmlFor="picture"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.picture')}
        </label>
        <input
          ref={pictureRef}
          type="file"
          id="picture"
          accept=".png,.jpeg,.jpg"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {renderError('picture')}
      </div>

      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.country')} *
        </label>
        <input
          ref={countryRef}
          type="text"
          id="country"
          list="countries"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('placeholders.country')}
        />
        <datalist id="countries">
          <option value="United States" />
          <option value="Canada" />
          <option value="United Kingdom" />
          <option value="Germany" />
          <option value="France" />
          <option value="Spain" />
          <option value="Italy" />
          <option value="Japan" />
          <option value="China" />
          <option value="India" />
        </datalist>
        {renderError('country')}
      </div>

      <div className="flex items-center">
        <input
          ref={acceptTermsRef}
          type="checkbox"
          id="acceptTerms"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="acceptTerms"
          className="ml-2 block text-sm text-gray-900"
        >
          {t('fields.acceptTerms')} *
        </label>
      </div>
      {renderError('acceptTerms')}

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {t('buttons.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
        </button>
      </div>
    </form>
  );
};
