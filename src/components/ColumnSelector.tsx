import React from 'react';
import type { ColumnOption } from '@types';

interface ColumnSelectorProps {
  selectedColumns: string[];
  availableColumns: ColumnOption[];
  onColumnsChange: (columns: string[]) => void;
  onClose: () => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = React.memo(
  ({ selectedColumns, availableColumns, onColumnsChange, onClose }) => {
    const handleColumnToggle = (columnKey: string) => {
      const newSelected = selectedColumns.includes(columnKey)
        ? selectedColumns.filter((col) => col !== columnKey)
        : [...selectedColumns, columnKey];

      onColumnsChange(newSelected);
    };

    const handleSelectAll = () => {
      onColumnsChange(availableColumns.map((col) => col.key));
    };

    const handleDeselectAll = () => {
      onColumnsChange([]);
    };

    return (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-0 max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-white/20 bg-white/10">
            <h3 className="text-2xl font-semibold text-white">
              Select Columns to Display
            </h3>
            <button
              className="bg-transparent border-none text-white text-2xl cursor-pointer p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors hover:bg-white/20"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="flex gap-4 p-4 bg-black/10">
            <button
              className="bg-green-500/30 border border-green-500/50 text-white px-4 py-2 rounded-md cursor-pointer text-sm transition-all hover:bg-green-500/40"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              className="bg-red-500/30 border border-red-500/50 text-white px-4 py-2 rounded-md cursor-pointer text-sm transition-all hover:bg-red-500/40"
              onClick={handleDeselectAll}
            >
              Deselect All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 max-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableColumns.map((column) => (
                <label
                  key={column.key}
                  className="flex items-center gap-3 p-4 bg-white/10 rounded-lg cursor-pointer transition-colors hover:bg-white/20 select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.key)}
                    onChange={() => handleColumnToggle(column.key)}
                    className="w-5 h-5 accent-indigo-500"
                  />
                  <span className="text-white text-base font-medium">
                    {column.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center p-6 border-t border-white/20 bg-black/10">
            <p className="text-white text-sm opacity-90">
              Selected: {selectedColumns.length} of {availableColumns.length}{' '}
              columns
            </p>
            <button
              className="bg-green-500/80 border-none text-white px-6 py-3 rounded-lg cursor-pointer text-base font-semibold transition-all hover:bg-green-500 hover:-translate-y-0.5 disabled:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onClose}
              disabled={selectedColumns.length === 0}
            >
              Apply ({selectedColumns.length})
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ColumnSelector.displayName = 'ColumnSelector';

export default ColumnSelector;
