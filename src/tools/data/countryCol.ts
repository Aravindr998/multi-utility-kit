// ---------------------------------------------------------------------------
// Country-level cost-of-living baselines + currency, for the City Emergency
// Fund calculator's "search any city" mode.
//
// When a searched city isn't in the curated CITIES list, we estimate its
// essential monthly cost from its COUNTRY baseline (a typical mid-to-large city
// in that country, single person, USD) scaled by the city's population size.
// Bundled data = no external dependency = never breaks or gets rate-limited.
// Every figure is an approximation and stays editable in the UI.
// ---------------------------------------------------------------------------

export type CountryInfo = { name: string; currency: string; base: number };

/** ISO-3166 alpha-2 → { display name, ISO-4217 currency, single-person monthly USD baseline }. */
export const COUNTRIES: Record<string, CountryInfo> = {
  // North & Central America / Caribbean
  US: { name: "United States", currency: "USD", base: 2400 },
  CA: { name: "Canada", currency: "CAD", base: 1900 },
  MX: { name: "Mexico", currency: "MXN", base: 1000 },
  GT: { name: "Guatemala", currency: "GTQ", base: 800 },
  CR: { name: "Costa Rica", currency: "CRC", base: 1100 },
  PA: { name: "Panama", currency: "PAB", base: 1100 },
  DO: { name: "Dominican Republic", currency: "DOP", base: 800 },
  CU: { name: "Cuba", currency: "CUP", base: 500 },
  HN: { name: "Honduras", currency: "HNL", base: 700 },
  SV: { name: "El Salvador", currency: "USD", base: 700 },
  NI: { name: "Nicaragua", currency: "NIO", base: 650 },
  JM: { name: "Jamaica", currency: "JMD", base: 900 },
  TT: { name: "Trinidad & Tobago", currency: "TTD", base: 1000 },
  HT: { name: "Haiti", currency: "HTG", base: 600 },
  BZ: { name: "Belize", currency: "BZD", base: 900 },
  BS: { name: "Bahamas", currency: "BSD", base: 1500 },
  BB: { name: "Barbados", currency: "BBD", base: 1400 },

  // South America
  BR: { name: "Brazil", currency: "BRL", base: 1000 },
  AR: { name: "Argentina", currency: "ARS", base: 900 },
  CL: { name: "Chile", currency: "CLP", base: 1100 },
  CO: { name: "Colombia", currency: "COP", base: 800 },
  PE: { name: "Peru", currency: "PEN", base: 800 },
  VE: { name: "Venezuela", currency: "VES", base: 500 },
  EC: { name: "Ecuador", currency: "USD", base: 800 },
  BO: { name: "Bolivia", currency: "BOB", base: 700 },
  PY: { name: "Paraguay", currency: "PYG", base: 700 },
  UY: { name: "Uruguay", currency: "UYU", base: 1100 },
  GY: { name: "Guyana", currency: "GYD", base: 900 },
  SR: { name: "Suriname", currency: "SRD", base: 800 },

  // Europe
  GB: { name: "United Kingdom", currency: "GBP", base: 2200 },
  IE: { name: "Ireland", currency: "EUR", base: 2200 },
  FR: { name: "France", currency: "EUR", base: 1900 },
  DE: { name: "Germany", currency: "EUR", base: 1900 },
  NL: { name: "Netherlands", currency: "EUR", base: 2100 },
  BE: { name: "Belgium", currency: "EUR", base: 1800 },
  LU: { name: "Luxembourg", currency: "EUR", base: 2500 },
  ES: { name: "Spain", currency: "EUR", base: 1500 },
  PT: { name: "Portugal", currency: "EUR", base: 1400 },
  IT: { name: "Italy", currency: "EUR", base: 1600 },
  GR: { name: "Greece", currency: "EUR", base: 1300 },
  CH: { name: "Switzerland", currency: "CHF", base: 3400 },
  AT: { name: "Austria", currency: "EUR", base: 1800 },
  NO: { name: "Norway", currency: "NOK", base: 2500 },
  SE: { name: "Sweden", currency: "SEK", base: 1900 },
  DK: { name: "Denmark", currency: "DKK", base: 2200 },
  FI: { name: "Finland", currency: "EUR", base: 1900 },
  IS: { name: "Iceland", currency: "ISK", base: 2400 },
  PL: { name: "Poland", currency: "PLN", base: 1300 },
  CZ: { name: "Czechia", currency: "CZK", base: 1400 },
  SK: { name: "Slovakia", currency: "EUR", base: 1200 },
  HU: { name: "Hungary", currency: "HUF", base: 1200 },
  RO: { name: "Romania", currency: "RON", base: 1000 },
  BG: { name: "Bulgaria", currency: "BGN", base: 1000 },
  HR: { name: "Croatia", currency: "EUR", base: 1200 },
  SI: { name: "Slovenia", currency: "EUR", base: 1300 },
  RS: { name: "Serbia", currency: "RSD", base: 900 },
  BA: { name: "Bosnia & Herzegovina", currency: "BAM", base: 800 },
  MK: { name: "North Macedonia", currency: "MKD", base: 800 },
  AL: { name: "Albania", currency: "ALL", base: 800 },
  ME: { name: "Montenegro", currency: "EUR", base: 900 },
  UA: { name: "Ukraine", currency: "UAH", base: 700 },
  BY: { name: "Belarus", currency: "BYN", base: 700 },
  RU: { name: "Russia", currency: "RUB", base: 1200 },
  MD: { name: "Moldova", currency: "MDL", base: 700 },
  EE: { name: "Estonia", currency: "EUR", base: 1400 },
  LV: { name: "Latvia", currency: "EUR", base: 1300 },
  LT: { name: "Lithuania", currency: "EUR", base: 1300 },
  MT: { name: "Malta", currency: "EUR", base: 1600 },
  CY: { name: "Cyprus", currency: "EUR", base: 1500 },

  // Middle East
  AE: { name: "United Arab Emirates", currency: "AED", base: 2000 },
  SA: { name: "Saudi Arabia", currency: "SAR", base: 1500 },
  QA: { name: "Qatar", currency: "QAR", base: 1900 },
  KW: { name: "Kuwait", currency: "KWD", base: 1700 },
  BH: { name: "Bahrain", currency: "BHD", base: 1500 },
  OM: { name: "Oman", currency: "OMR", base: 1400 },
  IL: { name: "Israel", currency: "ILS", base: 2600 },
  JO: { name: "Jordan", currency: "JOD", base: 1100 },
  LB: { name: "Lebanon", currency: "LBP", base: 900 },
  TR: { name: "Türkiye", currency: "TRY", base: 1000 },
  IQ: { name: "Iraq", currency: "IQD", base: 800 },
  IR: { name: "Iran", currency: "IRR", base: 600 },
  YE: { name: "Yemen", currency: "YER", base: 500 },
  SY: { name: "Syria", currency: "SYP", base: 400 },

  // Africa
  EG: { name: "Egypt", currency: "EGP", base: 650 },
  MA: { name: "Morocco", currency: "MAD", base: 900 },
  DZ: { name: "Algeria", currency: "DZD", base: 700 },
  TN: { name: "Tunisia", currency: "TND", base: 700 },
  LY: { name: "Libya", currency: "LYD", base: 700 },
  NG: { name: "Nigeria", currency: "NGN", base: 800 },
  KE: { name: "Kenya", currency: "KES", base: 800 },
  ZA: { name: "South Africa", currency: "ZAR", base: 1100 },
  GH: { name: "Ghana", currency: "GHS", base: 800 },
  TZ: { name: "Tanzania", currency: "TZS", base: 700 },
  UG: { name: "Uganda", currency: "UGX", base: 650 },
  ET: { name: "Ethiopia", currency: "ETB", base: 600 },
  SN: { name: "Senegal", currency: "XOF", base: 800 },
  CI: { name: "Côte d'Ivoire", currency: "XOF", base: 800 },
  CM: { name: "Cameroon", currency: "XAF", base: 700 },
  ZW: { name: "Zimbabwe", currency: "USD", base: 700 },
  ZM: { name: "Zambia", currency: "ZMW", base: 700 },
  MZ: { name: "Mozambique", currency: "MZN", base: 700 },
  AO: { name: "Angola", currency: "AOA", base: 1200 },
  RW: { name: "Rwanda", currency: "RWF", base: 700 },
  BW: { name: "Botswana", currency: "BWP", base: 900 },
  NA: { name: "Namibia", currency: "NAD", base: 900 },
  MU: { name: "Mauritius", currency: "MUR", base: 1000 },
  MW: { name: "Malawi", currency: "MWK", base: 600 },
  SD: { name: "Sudan", currency: "SDG", base: 500 },
  SO: { name: "Somalia", currency: "SOS", base: 600 },

  // South & Central Asia
  IN: { name: "India", currency: "INR", base: 650 },
  PK: { name: "Pakistan", currency: "PKR", base: 550 },
  BD: { name: "Bangladesh", currency: "BDT", base: 550 },
  LK: { name: "Sri Lanka", currency: "LKR", base: 650 },
  NP: { name: "Nepal", currency: "NPR", base: 500 },
  BT: { name: "Bhutan", currency: "BTN", base: 600 },
  MV: { name: "Maldives", currency: "MVR", base: 1200 },
  KZ: { name: "Kazakhstan", currency: "KZT", base: 900 },
  UZ: { name: "Uzbekistan", currency: "UZS", base: 600 },
  KG: { name: "Kyrgyzstan", currency: "KGS", base: 550 },
  TJ: { name: "Tajikistan", currency: "TJS", base: 550 },
  TM: { name: "Turkmenistan", currency: "TMT", base: 700 },
  AZ: { name: "Azerbaijan", currency: "AZN", base: 700 },
  GE: { name: "Georgia", currency: "GEL", base: 800 },
  AM: { name: "Armenia", currency: "AMD", base: 700 },

  // East & Southeast Asia
  CN: { name: "China", currency: "CNY", base: 1300 },
  HK: { name: "Hong Kong", currency: "HKD", base: 2700 },
  MO: { name: "Macao", currency: "MOP", base: 1800 },
  TW: { name: "Taiwan", currency: "TWD", base: 1400 },
  JP: { name: "Japan", currency: "JPY", base: 1900 },
  KR: { name: "South Korea", currency: "KRW", base: 1700 },
  SG: { name: "Singapore", currency: "SGD", base: 2700 },
  MY: { name: "Malaysia", currency: "MYR", base: 1000 },
  TH: { name: "Thailand", currency: "THB", base: 1000 },
  VN: { name: "Vietnam", currency: "VND", base: 800 },
  ID: { name: "Indonesia", currency: "IDR", base: 800 },
  PH: { name: "Philippines", currency: "PHP", base: 800 },
  KH: { name: "Cambodia", currency: "KHR", base: 700 },
  LA: { name: "Laos", currency: "LAK", base: 650 },
  MM: { name: "Myanmar", currency: "MMK", base: 600 },
  MN: { name: "Mongolia", currency: "MNT", base: 800 },
  BN: { name: "Brunei", currency: "BND", base: 1400 },

  // Oceania
  AU: { name: "Australia", currency: "AUD", base: 2300 },
  NZ: { name: "New Zealand", currency: "NZD", base: 2100 },
  FJ: { name: "Fiji", currency: "FJD", base: 900 },
  PG: { name: "Papua New Guinea", currency: "PGK", base: 900 },
};

/** Global fallback when a country isn't in the table. */
export const DEFAULT_COUNTRY: CountryInfo = { name: "", currency: "USD", base: 900 };

export function countryInfo(cc: string | undefined): CountryInfo {
  if (!cc) return DEFAULT_COUNTRY;
  return COUNTRIES[cc.toUpperCase()] ?? { ...DEFAULT_COUNTRY, name: "" };
}

/**
 * Multiplier applied to a country baseline based on city population. Bigger
 * cities cost more; small towns cost less. Unknown population → 1.0 (baseline).
 */
export function sizeMultiplier(population: number | undefined): number {
  if (!population || !isFinite(population)) return 1;
  if (population >= 8_000_000) return 1.35;
  if (population >= 3_000_000) return 1.2;
  if (population >= 1_000_000) return 1.1;
  if (population >= 300_000) return 1.0;
  if (population >= 50_000) return 0.9;
  return 0.82;
}
