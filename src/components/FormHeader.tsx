import React from 'react';

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-lg text-gray-600">{subtitle}</p>
  </div>
);
