import React from 'react';

interface FormButtonsProps {
  onUncontrolledClick: () => void;
  onHookFormClick: () => void;
  uncontrolledLabel: string;
  hookFormLabel: string;
}

export const FormButtons: React.FC<FormButtonsProps> = ({
  onUncontrolledClick,
  onHookFormClick,
  uncontrolledLabel,
  hookFormLabel,
}) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
    <button
      onClick={onUncontrolledClick}
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      {uncontrolledLabel}
    </button>
    <button
      onClick={onHookFormClick}
      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
    >
      {hookFormLabel}
    </button>
  </div>
);
