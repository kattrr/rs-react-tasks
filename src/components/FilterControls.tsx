import React from 'react';
import PropTypes from 'prop-types';

interface FilterControlsProps {
  year: number;
  availableYears: number[];
  region: string;
  availableRegions: string[];
  searchTerm: string;
  onYearChange: (year: number) => void;
  onRegionChange: (region: string) => void;
  onSearchChange: (searchTerm: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = React.memo(
  ({
    year,
    availableYears,
    region,
    availableRegions,
    searchTerm,
    onYearChange,
    onRegionChange,
    onSearchChange,
  }) => {
    return (
      <div className="flex gap-4 mb-8 p-6 bg-white/10 rounded-xl backdrop-blur-lg flex-wrap justify-center md:flex-row flex-col">
        <div className="flex flex-col gap-2 w-full md:min-w-[200px]">
          <label
            htmlFor="year-select"
            className="font-semibold text-sm opacity-90"
          >
            Year:
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-3 py-3 border border-white/20 rounded-lg bg-white/10 text-white text-base transition-all focus:outline-none focus:border-white/50 focus:bg-white/15 focus:shadow-lg focus:shadow-white/10"
          >
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-gray-800 text-white">
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:min-w-[200px]">
          <label
            htmlFor="region-select"
            className="font-semibold text-sm opacity-90"
          >
            Region:
          </label>
          <select
            id="region-select"
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="px-3 py-3 border border-white/20 rounded-lg bg-white/10 text-white text-base transition-all focus:outline-none focus:border-white/50 focus:bg-white/15 focus:shadow-lg focus:shadow-white/10"
          >
            {availableRegions.map((r) => (
              <option key={r} value={r} className="bg-gray-800 text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:min-w-[200px]">
          <label
            htmlFor="search-input"
            className="font-semibold text-sm opacity-90"
          >
            Search Countries:
          </label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Enter country name..."
            className="px-3 py-3 border border-white/20 rounded-lg bg-white/10 text-white text-base transition-all focus:outline-none focus:border-white/50 focus:bg-white/15 focus:shadow-lg focus:shadow-white/10 placeholder-white/60"
          />
        </div>
      </div>
    );
  }
);

FilterControls.displayName = 'FilterControls';

FilterControls.propTypes = {
  year: PropTypes.number.isRequired,
  availableYears: PropTypes.arrayOf(PropTypes.number).isRequired,
  region: PropTypes.string.isRequired,
  availableRegions: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default FilterControls;
