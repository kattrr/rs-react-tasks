import React from 'react';
import { FormDataDisplay } from './FormDataDisplay';
import { FormData } from '../store/formStore';

interface SubmittedFormsListProps {
  formData: FormData[];
  title: string;
}

export const SubmittedFormsList: React.FC<SubmittedFormsListProps> = ({
  formData,
  title,
}) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
      {title} ({formData.length})
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {formData.map((data) => (
        <FormDataDisplay key={data.id} data={data} />
      ))}
    </div>
  </div>
);
