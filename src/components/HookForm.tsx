import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useFormStore } from '../store/formStore';
import {
  validatePasswordStrength,
  validateImageFile,
  convertImageToBase64,
} from '../utils/validation';

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine((name) => name[0] === name[0]?.toUpperCase(), {
        message: 'Name must start with an uppercase letter',
      }),
    age: z
      .number()
      .min(0, 'Age must be a positive number')
      .int('Age must be a whole number'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .refine(
        (password) => {
          const strength = validatePasswordStrength(password);
          return strength.score === 4;
        },
        {
          message:
            'Password must contain at least one number, uppercase letter, lowercase letter, and special character',
        }
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: z.string().min(1, 'Please select a gender'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    picture: z.instanceof(File).optional(),
    country: z.string().min(1, 'Please select a country'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

interface HookFormProps {
  onClose: () => void;
}

export const HookForm: React.FC<HookFormProps> = ({ onClose }) => {
  const t = useTranslations('forms');
  const addFormData = useFormStore((state) => state.addFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (validation.isValid) {
        setPictureFile(file);
        setValue('picture', file);
      } else {
        setValue('picture', undefined);
        setPictureFile(null);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      let pictureBase64 = '';
      if (pictureFile) {
        pictureBase64 = await convertImageToBase64(pictureFile);
      }

      const formData = {
        name: data.name,
        age: data.age,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        gender: data.gender,
        acceptTerms: data.acceptTerms,
        picture: pictureBase64,
        country: data.country,
        formType: 'hookform' as const,
      };

      addFormData(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field: keyof FormData) => {
    return errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>
    ) : null;
  };

  const renderPasswordStrength = () => {
    if (!password) return null;

    const strength = validatePasswordStrength(password);
    const strengthColors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-green-500',
    };

    return (
      <div className="mt-2">
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-2 w-full rounded ${
                level <= strength.score
                  ? strengthColors[level as keyof typeof strengthColors]
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="mt-1 text-xs text-gray-600">
          <span
            className={strength.hasNumber ? 'text-green-600' : 'text-gray-400'}
          >
            {t('passwordStrength.number')}
          </span>
          {' • '}
          <span
            className={
              strength.hasUpperCase ? 'text-green-600' : 'text-gray-400'
            }
          >
            {t('passwordStrength.uppercase')}
          </span>
          {' • '}
          <span
            className={
              strength.hasLowerCase ? 'text-green-600' : 'text-gray-400'
            }
          >
            {t('passwordStrength.lowercase')}
          </span>
          {' • '}
          <span
            className={
              strength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'
            }
          >
            {t('passwordStrength.special')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="hook-name"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.name')} *
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="hook-name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('placeholders.name')}
            />
          )}
        />
        {renderError('name')}
      </div>

      <div>
        <label
          htmlFor="hook-age"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.age')} *
        </label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              id="hook-age"
              min="0"
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('placeholders.age')}
            />
          )}
        />
        {renderError('age')}
      </div>

      <div>
        <label
          htmlFor="hook-email"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.email')} *
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              id="hook-email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('placeholders.email')}
            />
          )}
        />
        {renderError('email')}
      </div>

      <div>
        <label
          htmlFor="hook-password"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.password')} *
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              id="hook-password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('placeholders.password')}
            />
          )}
        />
        {renderError('password')}
        {renderPasswordStrength()}
      </div>

      <div>
        <label
          htmlFor="hook-confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.confirmPassword')} *
        </label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              id="hook-confirmPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('placeholders.confirmPassword')}
            />
          )}
        />
        {renderError('confirmPassword')}
      </div>

      <div>
        <label
          htmlFor="hook-gender"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.gender')} *
        </label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="hook-gender"
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
          )}
        />
        {renderError('gender')}
      </div>

      <div>
        <label
          htmlFor="hook-picture"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.picture')}
        </label>
        <input
          type="file"
          id="hook-picture"
          accept=".png,.jpeg,.jpg"
          onChange={handlePictureChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {renderError('picture')}
      </div>

      <div>
        <label
          htmlFor="hook-country"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.country')} *
        </label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="hook-country"
              list="hook-countries"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('placeholders.country')}
            />
          )}
        />
        <datalist id="hook-countries">
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
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              id="hook-acceptTerms"
              checked={field.value}
              onChange={field.onChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
        />
        <label
          htmlFor="hook-acceptTerms"
          className="ml-2 block text-sm text-gray-900"
        >
          {t('fields.acceptTerms')} *
        </label>
      </div>
      {renderError('acceptTerms')}

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
          disabled={!isValid || isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
        </button>
      </div>
    </form>
  );
};
