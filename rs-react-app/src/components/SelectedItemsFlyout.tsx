import { useSelectedItemsStore } from '../store/selectedItemsStore';
import { exportSelectedItems } from '../services/CSVExportService';

const SelectedItemsFlyout = () => {
  const { selectedItems, clearAll, getSelectedCount } = useSelectedItemsStore();
  const selectedCount = getSelectedCount();

  const handleDownload = () => {
    if (selectedCount === 0) return;
    exportSelectedItems(selectedItems, `${selectedCount}_items.csv`);
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
            Unselect all
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
