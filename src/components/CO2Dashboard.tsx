import React from 'react';
import { useCO2Data } from '@hooks';
import { FilterControls, CO2DataTable } from '@components';

const CO2Dashboard: React.FC = () => {
  const {
    data,
    loading,
    error,
    filters,
    availableYears,
    availableRegions,
    updateYear,
    updateRegion,
    updateSearchTerm,
    updateSort,
    updateSelectedColumns,
  } = useCO2Data();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-8"></div>
        <p className="text-xl mb-2">Loading CO2 emissions data...</p>
        <small className="opacity-70">
          This may take a moment as we fetch ~100MB of global data
        </small>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white/10 rounded-xl backdrop-blur-lg p-8">
        <h2 className="text-red-400 text-2xl mb-4">Error Loading Data</h2>
        <p className="text-white opacity-90 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 border-none text-white px-6 py-3 rounded-lg cursor-pointer text-base transition-colors hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <FilterControls
        year={filters.year}
        availableYears={availableYears}
        region={filters.region}
        availableRegions={availableRegions}
        searchTerm={filters.searchTerm}
        onYearChange={updateYear}
        onRegionChange={updateRegion}
        onSearchChange={updateSearchTerm}
      />

      <CO2DataTable
        data={data}
        selectedColumns={filters.selectedColumns}
        sortField={filters.sortField}
        sortDirection={filters.sortDirection}
        onSort={updateSort}
        onColumnsChange={updateSelectedColumns}
      />
    </div>
  );
};

export default CO2Dashboard;
