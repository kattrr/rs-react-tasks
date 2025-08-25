'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from './Modal';
import { UncontrolledForm } from './UncontrolledForm';
import { HookForm } from './HookForm';
import { FormHeader } from './FormHeader';
import { FormButtons } from './FormButtons';
import { SubmittedFormsList } from './SubmittedFormsList';
import { EmptyState } from './EmptyState';
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
      <FormHeader title={t('title')} subtitle={t('subtitle')} />

      <FormButtons
        onUncontrolledClick={() => setIsUncontrolledModalOpen(true)}
        onHookFormClick={() => setIsHookFormModalOpen(true)}
        uncontrolledLabel={t('uncontrolledForm')}
        hookFormLabel={t('hookForm')}
      />

      {formData.length > 0 && (
        <SubmittedFormsList formData={formData} title={t('submittedForms')} />
      )}

      {formData.length === 0 && (
        <EmptyState
          title={t('noFormsSubmitted')}
          description={t('noFormsDescription')}
        />
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
