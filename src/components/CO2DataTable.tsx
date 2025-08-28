import React, { useState } from 'react';
import type { CountryDisplayData, SortField, SortDirection } from '@types';
import { getColumnDefinitions } from '@services';
import {
  ColumnSelector,
  YearChangeHighlight,
  TableRowHighlight,
} from '@components';
import PropTypes from 'prop-types';

interface CO2DataTableProps {
  data: CountryDisplayData[];
  selectedColumns: string[];
  sortField: SortField;
  sortDirection: SortDirection;
  highlightYearChange: boolean;
  onSort: (field: SortField, direction: SortDirection) => void;
  onColumnsChange: (columns: string[]) => void;
}

const CO2DataTable: React.FC<CO2DataTableProps> = React.memo(
  ({
    data,
    selectedColumns,
    sortField,
    sortDirection,
    highlightYearChange,
    onSort,
    onColumnsChange,
  }) => {
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const columnDefinitions = getColumnDefinitions();

    const handleSort = (field: SortField) => {
      const direction =
        sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(field, direction);
    };

    const getSortIcon = (field: SortField) => {
      if (sortField !== field) return '↕️';
      return sortDirection === 'asc' ? '↑' : '↓';
    };

    const formatValue = (value: number | null, columnKey: string) => {
      if (value === null || value === undefined) return 'N/A';

      const columnDef = columnDefinitions.find((col) => col.key === columnKey);
      return columnDef ? columnDef.format(value) : value.toString();
    };

    return (
      <div className="bg-white/10 rounded-xl backdrop-blur-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-2xl font-semibold">
            CO2 Emissions Data ({data.length} countries)
          </h3>
          <div className="flex items-center gap-4">
            <YearChangeHighlight isActive={highlightYearChange} size="large" />
            <button
              className="bg-white/20 border border-white/30 text-white px-6 py-3 rounded-lg cursor-pointer text-base transition-all hover:bg-white/30 hover:border-white/50"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              📊 Select Columns
            </button>
          </div>
        </div>

        {showColumnSelector && (
          <ColumnSelector
            selectedColumns={selectedColumns}
            availableColumns={columnDefinitions.map((col) => ({
              key: col.key,
              label: col.label,
            }))}
            onColumnsChange={onColumnsChange}
            onClose={() => setShowColumnSelector(false)}
          />
        )}

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  className="p-4 text-left border-b border-white/10 bg-white/10 font-semibold sticky top-0 z-10 cursor-pointer select-none transition-colors hover:bg-white/20"
                  onClick={() => handleSort('name')}
                >
                  Country Name {getSortIcon('name')}
                </th>
                <th
                  className="p-4 text-left border-b border-white/10 bg-white/10 font-semibold sticky top-0 z-10 cursor-pointer select-none transition-colors hover:bg-white/20"
                  onClick={() => handleSort('population')}
                >
                  Population {getSortIcon('population')}
                </th>
                {selectedColumns.map((columnKey) => {
                  const columnDef = columnDefinitions.find(
                    (col) => col.key === columnKey
                  );
                  if (!columnDef) return null;

                  return (
                    <th
                      key={columnKey}
                      className="p-4 text-left border-b border-white/10 bg-white/10 font-semibold sticky top-0 z-10 cursor-pointer select-none transition-colors hover:bg-white/20"
                      onClick={() => handleSort(columnKey as SortField)}
                    >
                      {columnDef.label} {getSortIcon(columnKey as SortField)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((country, index) => (
                <TableRowHighlight
                  key={country.name}
                  isActive={highlightYearChange}
                  className={
                    index % 2 === 0
                      ? 'bg-white/5'
                      : 'bg-black/5 hover:bg-white/15'
                  }
                >
                  <td className="p-4 border-b border-white/10 font-medium">
                    <strong>{country.name}</strong>
                    {country.iso_code && (
                      <span className="opacity-70 text-sm font-normal">
                        {' '}
                        ({country.iso_code})
                      </span>
                    )}
                  </td>
                  <td className="p-4 border-b border-white/10">
                    {formatValue(country.population, 'population')}
                  </td>
                  {selectedColumns.map((columnKey) => (
                    <td
                      key={columnKey}
                      className="p-4 border-b border-white/10"
                    >
                      {formatValue(country.data[columnKey], columnKey)}
                    </td>
                  ))}
                </TableRowHighlight>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-12 opacity-70">
            <p>No data available for the selected filters.</p>
          </div>
        )}
      </div>
    );
  }
);

CO2DataTable.displayName = 'CO2DataTable';

CO2DataTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      iso_code: PropTypes.string.isRequired,
      population: PropTypes.number,
      data: PropTypes.object.isRequired,
    })
  ).isRequired,
  selectedColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortField: PropTypes.oneOf(['name', 'population', 'co2', 'co2_per_capita'])
    .isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
  highlightYearChange: PropTypes.bool.isRequired,
  onSort: PropTypes.func.isRequired,
  onColumnsChange: PropTypes.func.isRequired,
};

export default CO2DataTable;
