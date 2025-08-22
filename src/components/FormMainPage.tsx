'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from './Modal';
import { UncontrolledForm } from './UncontrolledForm';
import { HookForm } from './HookForm';
import { FormDataDisplay } from './FormDataDisplay';
import { useFormStore } from '../store/formStore';

const FormMainPage: React.FC = () => {
  const t = useTranslations('forms');
  const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] = useState(false);
  const [isHookFormModalOpen, setIsHookFormModalOpen] = useState(false);
  const { formData, setCountries } = useFormStore();

  useEffect(() => {
    // Initialize countries list
    const countries = [
      'United States',
      'Canada',
      'United Kingdom',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Japan',
      'China',
      'India',
      'Brazil',
      'Australia',
      'Mexico',
      'Netherlands',
      'Switzerland',
      'Sweden',
      'Norway',
      'Denmark',
      'Finland',
      'Poland',
      'Czech Republic',
      'Austria',
      'Belgium',
      'Portugal',
      'Greece',
      'Turkey',
      'Russia',
      'South Korea',
      'Singapore',
      'New Zealand',
    ];
    setCountries(countries);
  }, [setCountries]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Form Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={() => setIsUncontrolledModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {t('uncontrolledForm')}
        </button>
        <button
          onClick={() => setIsHookFormModalOpen(true)}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          {t('hookForm')}
        </button>
      </div>

      {/* Submitted Data Display */}
      {formData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {t('submittedForms')} ({formData.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formData.map((data) => (
              <FormDataDisplay key={data.id} data={data} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {formData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-testid="empty-state-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noFormsSubmitted')}
          </h3>
          <p className="text-gray-500">{t('noFormsDescription')}</p>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isUncontrolledModalOpen}
        onClose={() => setIsUncontrolledModalOpen(false)}
        title={t('uncontrolledForm')}
      >
        <UncontrolledForm onClose={() => setIsUncontrolledModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isHookFormModalOpen}
        onClose={() => setIsHookFormModalOpen(false)}
        title={t('hookForm')}
      >
        <HookForm onClose={() => setIsHookFormModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default FormMainPage;
