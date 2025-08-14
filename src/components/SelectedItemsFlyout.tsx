'use client';
import { useSelectedItemsStore } from '@store/selectedItemsStore';
import { exportCSVAction } from '@/app/actions';

const SelectedItemsFlyout = () => {
  const { selectedItems, clearAll, getSelectedCount } = useSelectedItemsStore();
  const selectedCount = getSelectedCount();

  const handleDownload = async () => {
    if (selectedCount === 0) return;

    try {
      const result = await exportCSVAction(
        selectedItems,
        `${selectedCount}_pokemon_export.csv`
      );

      if (result.success && result.data) {
        // Create and download the CSV file
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || 'pokemon_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">
            {selectedCount} {selectedCount === 1 ? 'item is' : 'items are'}{' '}
            selected
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearAll}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedItemsFlyout;
