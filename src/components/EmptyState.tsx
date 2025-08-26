import React from 'react';
import { EmptyStateIcon } from './EmptyStateIcon';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
}) => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <EmptyStateIcon />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);
