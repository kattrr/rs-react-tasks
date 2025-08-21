import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FormData } from '../store/formStore';

interface FormDataDisplayProps {
  data: FormData;
}

export const FormDataDisplay: React.FC<FormDataDisplayProps> = ({ data }) => {
  const t = useTranslations('forms');
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm transition-all duration-500 ${
        isNew
          ? 'border-green-400 bg-green-50 shadow-green-200'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">
            {data.formType === 'uncontrolled'
              ? t('display.uncontrolledForm')
              : t('display.reactHookForm')}
          </span>
          {isNew && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {t('display.new')}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {data.createdAt.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">
            {t('display.personalInformation')}
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">{t('fields.name')}:</span>
              <span className="ml-2 text-gray-900">{data.name}</span>
            </div>
            <div>
              <span className="text-gray-500">{t('fields.age')}:</span>
              <span className="ml-2 text-gray-900">{data.age}</span>
            </div>
            <div>
              <span className="text-gray-500">{t('fields.email')}:</span>
              <span className="ml-2 text-gray-900">{data.email}</span>
            </div>
            <div>
              <span className="text-gray-500">{t('fields.gender')}:</span>
              <span className="ml-2 text-gray-900 capitalize">
                {data.gender}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">
            {t('display.additionalDetails')}
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">{t('fields.country')}:</span>
              <span className="ml-2 text-gray-900">{data.country}</span>
            </div>
            <div>
              <span className="text-gray-500">
                {t('display.termsAccepted')}:
              </span>
              <span
                className={`ml-2 ${data.acceptTerms ? 'text-green-600' : 'text-red-600'}`}
              >
                {data.acceptTerms ? t('display.yes') : t('display.no')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">{t('fields.picture')}:</span>
              <span className="ml-2 text-gray-900">
                {data.picture ? t('display.uploaded') : t('display.none')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.picture && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 mb-2">
            {t('display.profilePicture')}
          </h3>
          <Image
            src={data.picture}
            alt="Profile"
            width={80}
            height={80}
            className="object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};
