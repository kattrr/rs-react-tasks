import type { SelectedItem } from '../store/selectedItemsStore';

export const exportSelectedItems = (
  items: SelectedItem[],
  filename: string
): void => {
  if (items.length === 0) return;

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

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
