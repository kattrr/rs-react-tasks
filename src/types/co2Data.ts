export interface CO2DataPoint {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  oil_co2?: number;
  temperature_change_from_co2?: number;
  coal_co2?: number;
  cement_co2?: number;
  gas_co2?: number;
  flaring_co2?: number;
  land_use_change_co2?: number;
  total_ghg?: number;
  nitrous_oxide?: number;
  ghg_per_capita?: number;
  ghg_excluding_lucf_per_capita?: number;
}

export interface CountryData {
  iso_code: string;
  data: CO2DataPoint[];
}

export interface CO2DataSet {
  [countryName: string]: CountryData;
}

export type SortField = 'name' | 'population' | 'co2' | 'co2_per_capita';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  year: number;
  region: string;
  searchTerm: string;
  sortField: SortField;
  sortDirection: SortDirection;
  selectedColumns: string[];
}

export interface CountryDisplayData {
  name: string;
  iso_code: string;
  population: number | null;
  data: Record<string, number | null>;
}

export interface ColumnOption {
  key: string;
  label: string;
}
