import React from 'react';
import { YearSelectorHighlight } from '@components';

interface FilterControlsProps {
  year: number;
  availableYears: number[];
  region: string;
  availableRegions: string[];
  searchTerm: string;
  highlightYearChange: boolean;
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
    highlightYearChange,
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
          <YearSelectorHighlight
            isActive={highlightYearChange}
            showProgress={true}
          >
            <select
              id="year-select"
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className={`px-3 py-3 border border-white/20 rounded-lg bg-white/10 text-white text-base transition-all duration-500 ease-in-out focus:outline-none focus:border-white/50 focus:bg-white/15 focus:shadow-lg focus:shadow-white/10 ${
                highlightYearChange
                  ? 'border-yellow-400 bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-300/10 animate-pulse shadow-lg shadow-yellow-400/25 scale-105'
                  : 'hover:border-white/40 hover:bg-white/15'
              }`}
            >
              {availableYears.map((y) => (
                <option key={y} value={y} className="bg-gray-800 text-white">
                  {y}
                </option>
              ))}
            </select>
          </YearSelectorHighlight>
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

export default FilterControls;
