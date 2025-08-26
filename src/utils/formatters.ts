/**
 * Utility functions for formatting data values
 */

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString();
};

export const formatPercentage = (
  value: number | null | undefined,
  decimals = 2
): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

export const formatCurrency = (
  value: number | null | undefined,
  currency = 'USD'
): string => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};
