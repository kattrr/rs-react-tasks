import type { CO2DataSet, CO2DataPoint } from '@types';

const CO2_DATA_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

let cachedData: CO2DataSet | null = null;
let dataPromise: Promise<CO2DataSet> | null = null;

export const fetchCO2Data = async (): Promise<CO2DataSet> => {
  if (cachedData) {
    return cachedData;
  }

  if (dataPromise) {
    return dataPromise;
  }

  dataPromise = fetch(CO2_DATA_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch CO2 data: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data: CO2DataSet) => {
      cachedData = data;
      return data;
    })
    .catch((error) => {
      console.error('Error fetching CO2 data:', error);
      throw error;
    });

  return dataPromise;
};

export const getLatestDataPoint = (
  dataPoints: CO2DataPoint[],
  year?: number
): CO2DataPoint | null => {
  if (dataPoints.length === 0) return null;

  if (year) {
    return dataPoints.find((point) => point.year === year) || null;
  }

  const sortedData = dataPoints
    .filter(
      (point) => point.population !== undefined || point.co2 !== undefined
    )
    .sort((a, b) => b.year - a.year);

  return sortedData[0] || null;
};

export const getAvailableYears = (data: CO2DataSet): number[] => {
  const years = new Set<number>();

  Object.values(data).forEach((countryData) => {
    countryData.data.forEach((dataPoint) => {
      years.add(dataPoint.year);
    });
  });

  return Array.from(years).sort((a, b) => b - a);
};

export const getColumnDefinitions = () => [
  {
    key: 'population',
    label: 'Population',
    format: (value: number) => value?.toLocaleString(),
  },
  {
    key: 'co2',
    label: 'CO2 (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'co2_per_capita',
    label: 'CO2 per capita (tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'methane',
    label: 'Methane (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'oil_co2',
    label: 'Oil CO2 (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'coal_co2',
    label: 'Coal CO2 (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'gas_co2',
    label: 'Gas CO2 (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'cement_co2',
    label: 'Cement CO2 (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'flaring_co2',
    label: 'Flaring CO2 (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'land_use_change_co2',
    label: 'Land Use CO2 (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'temperature_change_from_co2',
    label: 'Temperature Change from CO2 (°C)',
    format: (value: number) => value?.toFixed(4),
  },
  {
    key: 'total_ghg',
    label: 'Total GHG (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'nitrous_oxide',
    label: 'Nitrous Oxide (million tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'ghg_per_capita',
    label: 'GHG per capita (tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
  {
    key: 'ghg_excluding_lucf_per_capita',
    label: 'GHG excluding LUC (tonnes)',
    format: (value: number) => value?.toFixed(2),
  },
];

export const getAvailableRegions = (data: CO2DataSet): string[] => {
  const regions = new Set<string>();

  Object.keys(data).forEach((countryName) => {
    if (
      countryName.toLowerCase().includes('europe') ||
      countryName.toLowerCase().includes('germany') ||
      countryName.toLowerCase().includes('france') ||
      countryName.toLowerCase().includes('united kingdom') ||
      countryName.toLowerCase().includes('italy') ||
      countryName.toLowerCase().includes('spain') ||
      countryName.toLowerCase().includes('netherlands') ||
      countryName.toLowerCase().includes('belgium') ||
      countryName.toLowerCase().includes('switzerland') ||
      countryName.toLowerCase().includes('austria') ||
      countryName.toLowerCase().includes('sweden') ||
      countryName.toLowerCase().includes('norway') ||
      countryName.toLowerCase().includes('denmark') ||
      countryName.toLowerCase().includes('finland')
    ) {
      regions.add('Europe');
    } else if (
      countryName.toLowerCase().includes('asia') ||
      countryName.toLowerCase().includes('china') ||
      countryName.toLowerCase().includes('japan') ||
      countryName.toLowerCase().includes('india') ||
      countryName.toLowerCase().includes('south korea') ||
      countryName.toLowerCase().includes('singapore') ||
      countryName.toLowerCase().includes('russia')
    ) {
      regions.add('Asia');
    } else if (
      countryName.toLowerCase().includes('america') ||
      countryName.toLowerCase().includes('united states') ||
      countryName.toLowerCase().includes('canada') ||
      countryName.toLowerCase().includes('mexico') ||
      countryName.toLowerCase().includes('brazil')
    ) {
      regions.add('Americas');
    } else if (
      countryName.toLowerCase().includes('africa') ||
      countryName.toLowerCase().includes('south africa') ||
      countryName.toLowerCase().includes('nigeria') ||
      countryName.toLowerCase().includes('egypt')
    ) {
      regions.add('Africa');
    } else if (
      countryName.toLowerCase().includes('oceania') ||
      countryName.toLowerCase().includes('australia') ||
      countryName.toLowerCase().includes('new zealand')
    ) {
      regions.add('Oceania');
    } else {
      regions.add('Other');
    }
  });

  return Array.from(regions).sort();
};
