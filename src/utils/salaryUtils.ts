export interface NormalizedSalary {
  min: number | null;
  max: number | null;
  currency: string;      // e.g. '₹', '$', '€', '£'
  currencyCode: string;  // e.g. 'INR', 'USD', 'EUR'
  country: string;       // e.g. 'India', 'USA'
  period: 'year' | 'month' | 'hour';
  sourceType: 'market_benchmark' | 'actual_job';
  originalString?: string;
}

const currencyMap: Record<string, { symbol: string, code: string }> = {
  'india': { symbol: '₹', code: 'INR' },
  'united states': { symbol: '$', code: 'USD' },
  'us': { symbol: '$', code: 'USD' },
  'usa': { symbol: '$', code: 'USD' },
  'australia': { symbol: 'A$', code: 'AUD' },
  'united kingdom': { symbol: '£', code: 'GBP' },
  'uk': { symbol: '£', code: 'GBP' },
  'canada': { symbol: 'C$', code: 'CAD' },
  'germany': { symbol: '€', code: 'EUR' },
  'france': { symbol: '€', code: 'EUR' },
  'singapore': { symbol: 'S$', code: 'SGD' },
  'netherlands': { symbol: '€', code: 'EUR' },
};

// Benchmarks (in local currency, annualized)
const roleBenchmarks: Record<string, Record<string, { min: number, max: number }>> = {
  'Data Analyst': {
    'india': { min: 400000, max: 1200000 },
    'us': { min: 65000, max: 120000 },
    'australia': { min: 70000, max: 110000 },
    'uk': { min: 30000, max: 55000 },
    'canada': { min: 60000, max: 95000 }
  },
  'Data Scientist': {
    'india': { min: 800000, max: 2500000 },
    'us': { min: 100000, max: 180000 },
    'australia': { min: 100000, max: 160000 },
    'uk': { min: 45000, max: 85000 },
    'canada': { min: 80000, max: 140000 }
  },
  'ML Engineer': {
    'india': { min: 1200000, max: 3500000 },
    'us': { min: 120000, max: 220000 },
    'australia': { min: 120000, max: 180000 },
    'uk': { min: 55000, max: 105000 },
    'canada': { min: 95000, max: 160000 }
  },
  'MLOps Infrastructure Engineer': {
    'india': { min: 1500000, max: 4000000 },
    'us': { min: 140000, max: 240000 },
    'australia': { min: 130000, max: 190000 }
  },
  'Staff AI Systems Architect': {
    'india': { min: 3000000, max: 8000000 },
    'us': { min: 180000, max: 350000 },
    'australia': { min: 160000, max: 250000 }
  },
  'Product Analyst - Operations Reference Data, AVP': {
    'india': { min: 1500000, max: 3000000 }
  },
  'AI / LLM Systems Engineer': {
    'india': { min: 1800000, max: 4500000 },
    'us': { min: 150000, max: 260000 },
    'australia': { min: 140000, max: 210000 }
  }
};

export function getCurrencyForCountry(country: string) {
  const c = (country || 'us').toLowerCase();
  return currencyMap[c] || currencyMap['us'];
}

export function formatSalaryNumber(num: number, currencyCode: string) {
  if (currencyCode === 'INR') {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
}

export function getMarketBenchmark(role: string, country: string): string {
  const cInfo = getCurrencyForCountry(country);
  const c = (country || 'us').toLowerCase();
  
  // Default mapping country if missing exact match
  let lookupCountry = 'us';
  if (c.includes('india') || c === 'in') lookupCountry = 'india';
  else if (c.includes('australia') || c === 'au') lookupCountry = 'australia';
  else if (c.includes('uk') || c === 'united kingdom') lookupCountry = 'uk';
  else if (c.includes('canada') || c === 'ca') lookupCountry = 'canada';

  const roleData = roleBenchmarks[role] || roleBenchmarks['Data Analyst'];
  const b = roleData[lookupCountry] || roleData['us'];

  if (!b) return 'Market benchmark unavailable';

  return `${cInfo.symbol}${formatSalaryNumber(b.min, cInfo.code)} - ${formatSalaryNumber(b.max, cInfo.code)} / yr`;
}

export function parseActualSalary(rawSalary: string, fallbackCountry: string): NormalizedSalary | null {
  if (!rawSalary || rawSalary === 'Not Disclosed' || rawSalary.toLowerCase() === 'salary not disclosed') return null;

  let currencyCode = getCurrencyForCountry(fallbackCountry).code;
  let symbol = getCurrencyForCountry(fallbackCountry).symbol;
  let period: 'year' | 'month' | 'hour' = 'year';

  const rawLower = rawSalary.toLowerCase();
  
  if (rawLower.includes('₹') || rawLower.includes('inr') || rawLower.includes('rs')) {
    currencyCode = 'INR'; symbol = '₹';
  } else if (rawLower.includes('£') || rawLower.includes('gbp')) {
    currencyCode = 'GBP'; symbol = '£';
  } else if (rawLower.includes('€') || rawLower.includes('eur')) {
    currencyCode = 'EUR'; symbol = '€';
  } else if (rawLower.includes('a$') || rawLower.includes('aud')) {
    currencyCode = 'AUD'; symbol = 'A$';
  } else if (rawLower.includes('c$') || rawLower.includes('cad')) {
    currencyCode = 'CAD'; symbol = 'C$';
  } else if (rawLower.includes('$') || rawLower.includes('usd')) {
    // If USD is explicitly there, or $ is there and country isn't AUD/CAD etc
    if (currencyCode !== 'AUD' && currencyCode !== 'CAD' && currencyCode !== 'SGD') {
      currencyCode = 'USD'; symbol = '$';
    }
  }

  if (rawLower.includes('month') || rawLower.includes('/mo')) period = 'month';
  if (rawLower.includes('hour') || rawLower.includes('/hr')) period = 'hour';

  // Extract numbers
  const nums = rawSalary.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/g);
  let min = null;
  let max = null;

  if (nums && nums.length >= 1) {
    min = parseFloat(nums[0].replace(/,/g, ''));
    if (nums.length >= 2) {
      max = parseFloat(nums[1].replace(/,/g, ''));
    } else {
      max = min;
    }
  }

  return {
    min,
    max,
    currency: symbol,
    currencyCode,
    country: fallbackCountry,
    period,
    sourceType: 'actual_job',
    originalString: rawSalary
  };
}

export function formatNormalizedSalary(sal: NormalizedSalary | null): string {
  if (!sal) return 'Salary not disclosed';
  if (sal.min === null) return 'Currency not specified';
  
  const formattedMin = formatSalaryNumber(sal.min, sal.currencyCode);
  const formattedMax = sal.max !== null ? formatSalaryNumber(sal.max, sal.currencyCode) : null;
  
  if (formattedMin === formattedMax || !formattedMax) {
    return `${sal.currency}${formattedMin} / ${sal.period}`;
  }
  return `${sal.currency}${formattedMin} - ${sal.currency}${formattedMax} / ${sal.period}`;
}
