import { getEnv } from '../config/env';

const env = getEnv();

const countryCodeMap: Record<string, string> = {
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'Ghana': 'GH',
  'South Africa': 'ZA',
  'United States': 'US',
  'Australia': 'AU',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB'
};

export interface MacroData {
  country: string;
  gdpGrowthRate: number | null;
  inflationRate: number | null;
  easeOfDoingBusiness: number | null;
  urbanGrowthRate: number | null;
  realInterestRate: number | null;
  fetchedAt: Date;
}

const indicators = {
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',
  INFLATION: 'FP.CPI.TOTL.ZG',
  EASE_OF_BUSINESS: 'IC.BUS.EASE.XQ',
  URBAN_GROWTH: 'SP.URB.GROW',
  REAL_INTEREST: 'FR.INR.RINR'
};

export async function fetchWorldBankData(country: string): Promise<MacroData> {
  const countryCode = countryCodeMap[country];
  if (!countryCode) {
    throw new Error(`Country code not found for: ${country}`);
  }

  const baseUrl = 'https://api.worldbank.org/v2/country';
  
  const fetchIndicator = async (indicatorCode: string): Promise<number | null> => {
    try {
      const response = await fetch(`${baseUrl}/${countryCode}/indicator/${indicatorCode}?format=json&per_page=1`);
      const data = await response.json();
      
      if (!data || !Array.isArray(data) || data.length < 2) return null;
      
      const value = data[1]?.[0]?.value;
      return typeof value === 'number' ? value : null;
    } catch (error) {
      console.error(`Error fetching ${indicatorCode}:`, error);
      return null;
    }
  };

  const [gdpGrowthRate, inflationRate, easeOfDoingBusiness, urbanGrowthRate, realInterestRate] = await Promise.all([
    fetchIndicator(indicators.GDP_GROWTH),
    fetchIndicator(indicators.INFLATION),
    fetchIndicator(indicators.EASE_OF_BUSINESS),
    fetchIndicator(indicators.URBAN_GROWTH),
    fetchIndicator(indicators.REAL_INTEREST)
  ]);

  return {
    country,
    gdpGrowthRate,
    inflationRate,
    easeOfDoingBusiness,
    urbanGrowthRate,
    realInterestRate,
    fetchedAt: new Date()
  };
}
