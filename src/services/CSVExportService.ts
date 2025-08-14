import type { SelectedItem } from '@store/selectedItemsStore';

export const exportSelectedItems = (items: SelectedItem[]): string => {
  if (items.length === 0) return '';

  const csvContent = [
    ['Name', 'Description', 'Details URL', 'Image URL', 'Types'].join(','),
    ...items.map((item) =>
      [
        item.name,
        item.description,
        item.detailsUrl,
        item.imageUrl,
        item.types.join(';'),
      ].join(',')
    ),
  ].join('\n');

  return csvContent;
};
