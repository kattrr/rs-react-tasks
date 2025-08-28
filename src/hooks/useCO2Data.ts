import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type {
  CO2DataSet,
  FilterOptions,
  CountryDisplayData,
  SortField,
  SortDirection,
} from '@types';
import {
  fetchCO2Data,
  getLatestDataPoint,
  getAvailableYears,
  getAvailableRegions,
} from '@services';

export const useCO2Data = () => {
  const [data, setData] = useState<CO2DataSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    year: 2020,
    region: 'All',
    searchTerm: '',
    sortField: 'name',
    sortDirection: 'asc',
    selectedColumns: ['population', 'co2', 'co2_per_capita'],
  });

  // Add state for year change highlighting
  const [highlightYearChange, setHighlightYearChange] = useState(false);
  const previousYearRef = useRef<number>(2020);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const co2Data = await fetchCO2Data();
        setData(co2Data);

        const years = getAvailableYears(co2Data);
        if (years.length > 0) {
          setFilters((prev) => ({ ...prev, year: years[0] }));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load CO2 data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const availableYears = useMemo(() => {
    return data ? getAvailableYears(data) : [];
  }, [data]);

  const availableRegions = useMemo(() => {
    return data ? ['All', ...getAvailableRegions(data)] : ['All'];
  }, [data]);
  const processedData = useMemo(() => {
    if (!data) return [];

    const filteredData: CountryDisplayData[] = [];

    Object.entries(data).forEach(([countryName, countryData]) => {
      if (filters.region !== 'All') {
        const countryLower = countryName.toLowerCase();
        const isInRegion =
          countryLower.includes(filters.region.toLowerCase()) ||
          (filters.region === 'Europe' &&
            (countryLower.includes('germany') ||
              countryLower.includes('france') ||
              countryLower.includes('united kingdom') ||
              countryLower.includes('italy') ||
              countryLower.includes('spain') ||
              countryLower.includes('netherlands') ||
              countryLower.includes('belgium') ||
              countryLower.includes('switzerland') ||
              countryLower.includes('austria') ||
              countryLower.includes('sweden') ||
              countryLower.includes('norway') ||
              countryLower.includes('denmark') ||
              countryLower.includes('finland'))) ||
          (filters.region === 'Asia' &&
            (countryLower.includes('china') ||
              countryLower.includes('japan') ||
              countryLower.includes('india') ||
              countryLower.includes('south korea') ||
              countryLower.includes('singapore') ||
              countryLower.includes('russia'))) ||
          (filters.region === 'Americas' &&
            (countryLower.includes('united states') ||
              countryLower.includes('canada') ||
              countryLower.includes('mexico') ||
              countryLower.includes('brazil'))) ||
          (filters.region === 'Africa' &&
            (countryLower.includes('south africa') ||
              countryLower.includes('nigeria') ||
              countryLower.includes('egypt'))) ||
          (filters.region === 'Oceania' &&
            (countryLower.includes('australia') ||
              countryLower.includes('new zealand')));

        if (!isInRegion) return;
      }

      if (
        filters.searchTerm &&
        !countryName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return;
      }

      const dataPoint = getLatestDataPoint(countryData.data, filters.year);
      if (!dataPoint) return;

      const displayData: CountryDisplayData = {
        name: countryName,
        iso_code: countryData.iso_code,
        population: dataPoint.population || null,
        data: {},
      };

      filters.selectedColumns.forEach((column) => {
        displayData.data[column] =
          (dataPoint[column as keyof typeof dataPoint] as number | undefined) ||
          null;
      });

      filteredData.push(displayData);
    });

    filteredData.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (filters.sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (filters.sortField === 'population') {
        aValue = a.population || 0;
        bValue = b.population || 0;
      } else {
        aValue = (a.data[filters.sortField] as number) || 0;
        bValue = (b.data[filters.sortField] as number) || 0;
      }

      if (filters.sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredData;
  }, [data, filters]);

  const updateYear = useCallback((year: number) => {
    // Check if year actually changed
    if (year !== previousYearRef.current) {
      setHighlightYearChange(true);
      // Remove highlight after animation duration
      setTimeout(() => setHighlightYearChange(false), 1500);
      previousYearRef.current = year;

      // Dispatch custom event for parent component
      window.dispatchEvent(new CustomEvent('yearChange', { detail: { year } }));
    }
    setFilters((prev) => ({ ...prev, year }));
  }, []);

  const updateRegion = useCallback((region: string) => {
    setFilters((prev) => ({ ...prev, region }));
  }, []);

  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, []);

  const updateSort = useCallback(
    (sortField: SortField, sortDirection: SortDirection) => {
      setFilters((prev) => ({ ...prev, sortField, sortDirection }));
    },
    []
  );

  const updateSelectedColumns = useCallback((selectedColumns: string[]) => {
    setFilters((prev) => ({ ...prev, selectedColumns }));
  }, []);

  return {
    data: processedData,
    loading,
    error,
    filters,
    availableYears,
    availableRegions,
    highlightYearChange,
    updateYear,
    updateRegion,
    updateSearchTerm,
    updateSort,
    updateSelectedColumns,
  };
};
