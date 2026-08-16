// ---------------------------------------------------------------------------
// Cost-of-living dataset for the City Emergency Fund calculator.
//
// This is a *bundled* dataset (no external API), so it can never break or be
// rate-limited — it "lasts forever" by having no dependency. Numbers are rough
// estimates of ESSENTIAL monthly living cost for ONE person (housing + food +
// utilities + local transport, excluding luxuries), expressed in USD. They are
// scaled to a household size and converted to any currency at run time using
// live exchange rates. Figures are approximate and always editable in the UI.
// ---------------------------------------------------------------------------

import { countryInfo, sizeMultiplier } from "./countryCol";

export type City = {
  /** Stable id / slug used as the select value. */
  id: string;
  city: string;
  country: string;
  /** ISO-3166 alpha-2 country code (used for location matching + flag). */
  cc: string;
  /** ISO-4217 currency code for that country. */
  currency: string;
  /** Estimated essential monthly living cost for a single person, in USD. */
  monthlyUsd: number;
};

export const CITIES: City[] = [
  // North America
  { id: "new-york-us", city: "New York", country: "United States", cc: "US", currency: "USD", monthlyUsd: 3700 },
  { id: "san-francisco-us", city: "San Francisco", country: "United States", cc: "US", currency: "USD", monthlyUsd: 3900 },
  { id: "los-angeles-us", city: "Los Angeles", country: "United States", cc: "US", currency: "USD", monthlyUsd: 3000 },
  { id: "seattle-us", city: "Seattle", country: "United States", cc: "US", currency: "USD", monthlyUsd: 2900 },
  { id: "boston-us", city: "Boston", country: "United States", cc: "US", currency: "USD", monthlyUsd: 3200 },
  { id: "washington-us", city: "Washington, D.C.", country: "United States", cc: "US", currency: "USD", monthlyUsd: 3000 },
  { id: "chicago-us", city: "Chicago", country: "United States", cc: "US", currency: "USD", monthlyUsd: 2400 },
  { id: "miami-us", city: "Miami", country: "United States", cc: "US", currency: "USD", monthlyUsd: 2500 },
  { id: "austin-us", city: "Austin", country: "United States", cc: "US", currency: "USD", monthlyUsd: 2300 },
  { id: "toronto-ca", city: "Toronto", country: "Canada", cc: "CA", currency: "CAD", monthlyUsd: 2500 },
  { id: "vancouver-ca", city: "Vancouver", country: "Canada", cc: "CA", currency: "CAD", monthlyUsd: 2500 },
  { id: "montreal-ca", city: "Montreal", country: "Canada", cc: "CA", currency: "CAD", monthlyUsd: 1900 },
  { id: "mexico-city-mx", city: "Mexico City", country: "Mexico", cc: "MX", currency: "MXN", monthlyUsd: 1200 },

  // Europe
  { id: "london-gb", city: "London", country: "United Kingdom", cc: "GB", currency: "GBP", monthlyUsd: 3200 },
  { id: "edinburgh-gb", city: "Edinburgh", country: "United Kingdom", cc: "GB", currency: "GBP", monthlyUsd: 2200 },
  { id: "manchester-gb", city: "Manchester", country: "United Kingdom", cc: "GB", currency: "GBP", monthlyUsd: 2000 },
  { id: "dublin-ie", city: "Dublin", country: "Ireland", cc: "IE", currency: "EUR", monthlyUsd: 2700 },
  { id: "paris-fr", city: "Paris", country: "France", cc: "FR", currency: "EUR", monthlyUsd: 2400 },
  { id: "berlin-de", city: "Berlin", country: "Germany", cc: "DE", currency: "EUR", monthlyUsd: 2100 },
  { id: "munich-de", city: "Munich", country: "Germany", cc: "DE", currency: "EUR", monthlyUsd: 2300 },
  { id: "frankfurt-de", city: "Frankfurt", country: "Germany", cc: "DE", currency: "EUR", monthlyUsd: 2200 },
  { id: "amsterdam-nl", city: "Amsterdam", country: "Netherlands", cc: "NL", currency: "EUR", monthlyUsd: 2600 },
  { id: "brussels-be", city: "Brussels", country: "Belgium", cc: "BE", currency: "EUR", monthlyUsd: 1900 },
  { id: "madrid-es", city: "Madrid", country: "Spain", cc: "ES", currency: "EUR", monthlyUsd: 1700 },
  { id: "barcelona-es", city: "Barcelona", country: "Spain", cc: "ES", currency: "EUR", monthlyUsd: 1800 },
  { id: "lisbon-pt", city: "Lisbon", country: "Portugal", cc: "PT", currency: "EUR", monthlyUsd: 1600 },
  { id: "rome-it", city: "Rome", country: "Italy", cc: "IT", currency: "EUR", monthlyUsd: 1700 },
  { id: "milan-it", city: "Milan", country: "Italy", cc: "IT", currency: "EUR", monthlyUsd: 2000 },
  { id: "vienna-at", city: "Vienna", country: "Austria", cc: "AT", currency: "EUR", monthlyUsd: 1900 },
  { id: "zurich-ch", city: "Zurich", country: "Switzerland", cc: "CH", currency: "CHF", monthlyUsd: 3800 },
  { id: "geneva-ch", city: "Geneva", country: "Switzerland", cc: "CH", currency: "CHF", monthlyUsd: 3600 },
  { id: "oslo-no", city: "Oslo", country: "Norway", cc: "NO", currency: "NOK", monthlyUsd: 2800 },
  { id: "stockholm-se", city: "Stockholm", country: "Sweden", cc: "SE", currency: "SEK", monthlyUsd: 2100 },
  { id: "copenhagen-dk", city: "Copenhagen", country: "Denmark", cc: "DK", currency: "DKK", monthlyUsd: 2500 },
  { id: "helsinki-fi", city: "Helsinki", country: "Finland", cc: "FI", currency: "EUR", monthlyUsd: 2000 },
  { id: "athens-gr", city: "Athens", country: "Greece", cc: "GR", currency: "EUR", monthlyUsd: 1400 },
  { id: "prague-cz", city: "Prague", country: "Czechia", cc: "CZ", currency: "CZK", monthlyUsd: 1500 },
  { id: "warsaw-pl", city: "Warsaw", country: "Poland", cc: "PL", currency: "PLN", monthlyUsd: 1400 },
  { id: "budapest-hu", city: "Budapest", country: "Hungary", cc: "HU", currency: "HUF", monthlyUsd: 1300 },
  { id: "moscow-ru", city: "Moscow", country: "Russia", cc: "RU", currency: "RUB", monthlyUsd: 1400 },
  { id: "istanbul-tr", city: "Istanbul", country: "Türkiye", cc: "TR", currency: "TRY", monthlyUsd: 1000 },

  // Middle East & Africa
  { id: "dubai-ae", city: "Dubai", country: "United Arab Emirates", cc: "AE", currency: "AED", monthlyUsd: 2200 },
  { id: "abu-dhabi-ae", city: "Abu Dhabi", country: "United Arab Emirates", cc: "AE", currency: "AED", monthlyUsd: 2000 },
  { id: "doha-qa", city: "Doha", country: "Qatar", cc: "QA", currency: "QAR", monthlyUsd: 2000 },
  { id: "riyadh-sa", city: "Riyadh", country: "Saudi Arabia", cc: "SA", currency: "SAR", monthlyUsd: 1600 },
  { id: "tel-aviv-il", city: "Tel Aviv", country: "Israel", cc: "IL", currency: "ILS", monthlyUsd: 2800 },
  { id: "cairo-eg", city: "Cairo", country: "Egypt", cc: "EG", currency: "EGP", monthlyUsd: 700 },
  { id: "nairobi-ke", city: "Nairobi", country: "Kenya", cc: "KE", currency: "KES", monthlyUsd: 800 },
  { id: "lagos-ng", city: "Lagos", country: "Nigeria", cc: "NG", currency: "NGN", monthlyUsd: 800 },
  { id: "cape-town-za", city: "Cape Town", country: "South Africa", cc: "ZA", currency: "ZAR", monthlyUsd: 1200 },
  { id: "johannesburg-za", city: "Johannesburg", country: "South Africa", cc: "ZA", currency: "ZAR", monthlyUsd: 1200 },

  // Asia
  { id: "singapore-sg", city: "Singapore", country: "Singapore", cc: "SG", currency: "SGD", monthlyUsd: 2900 },
  { id: "hong-kong-hk", city: "Hong Kong", country: "Hong Kong", cc: "HK", currency: "HKD", monthlyUsd: 2900 },
  { id: "tokyo-jp", city: "Tokyo", country: "Japan", cc: "JP", currency: "JPY", monthlyUsd: 2100 },
  { id: "osaka-jp", city: "Osaka", country: "Japan", cc: "JP", currency: "JPY", monthlyUsd: 1800 },
  { id: "seoul-kr", city: "Seoul", country: "South Korea", cc: "KR", currency: "KRW", monthlyUsd: 1900 },
  { id: "shanghai-cn", city: "Shanghai", country: "China", cc: "CN", currency: "CNY", monthlyUsd: 1600 },
  { id: "beijing-cn", city: "Beijing", country: "China", cc: "CN", currency: "CNY", monthlyUsd: 1500 },
  { id: "kuala-lumpur-my", city: "Kuala Lumpur", country: "Malaysia", cc: "MY", currency: "MYR", monthlyUsd: 1100 },
  { id: "bangkok-th", city: "Bangkok", country: "Thailand", cc: "TH", currency: "THB", monthlyUsd: 1200 },
  { id: "jakarta-id", city: "Jakarta", country: "Indonesia", cc: "ID", currency: "IDR", monthlyUsd: 900 },
  { id: "manila-ph", city: "Manila", country: "Philippines", cc: "PH", currency: "PHP", monthlyUsd: 900 },
  { id: "ho-chi-minh-vn", city: "Ho Chi Minh City", country: "Vietnam", cc: "VN", currency: "VND", monthlyUsd: 900 },
  { id: "hanoi-vn", city: "Hanoi", country: "Vietnam", cc: "VN", currency: "VND", monthlyUsd: 850 },
  { id: "colombo-lk", city: "Colombo", country: "Sri Lanka", cc: "LK", currency: "LKR", monthlyUsd: 700 },
  { id: "kathmandu-np", city: "Kathmandu", country: "Nepal", cc: "NP", currency: "NPR", monthlyUsd: 550 },
  { id: "dhaka-bd", city: "Dhaka", country: "Bangladesh", cc: "BD", currency: "BDT", monthlyUsd: 600 },
  { id: "karachi-pk", city: "Karachi", country: "Pakistan", cc: "PK", currency: "PKR", monthlyUsd: 600 },

  // India
  { id: "mumbai-in", city: "Mumbai", country: "India", cc: "IN", currency: "INR", monthlyUsd: 900 },
  { id: "delhi-in", city: "Delhi", country: "India", cc: "IN", currency: "INR", monthlyUsd: 800 },
  { id: "new-delhi-in", city: "New Delhi", country: "India", cc: "IN", currency: "INR", monthlyUsd: 800 },
  { id: "bangalore-in", city: "Bengaluru", country: "India", cc: "IN", currency: "INR", monthlyUsd: 850 },
  { id: "hyderabad-in", city: "Hyderabad", country: "India", cc: "IN", currency: "INR", monthlyUsd: 700 },
  { id: "chennai-in", city: "Chennai", country: "India", cc: "IN", currency: "INR", monthlyUsd: 700 },
  { id: "pune-in", city: "Pune", country: "India", cc: "IN", currency: "INR", monthlyUsd: 750 },
  { id: "kolkata-in", city: "Kolkata", country: "India", cc: "IN", currency: "INR", monthlyUsd: 650 },
  { id: "gurugram-in", city: "Gurugram", country: "India", cc: "IN", currency: "INR", monthlyUsd: 900 },
  { id: "noida-in", city: "Noida", country: "India", cc: "IN", currency: "INR", monthlyUsd: 800 },
  { id: "ahmedabad-in", city: "Ahmedabad", country: "India", cc: "IN", currency: "INR", monthlyUsd: 650 },
  { id: "jaipur-in", city: "Jaipur", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  { id: "chandigarh-in", city: "Chandigarh", country: "India", cc: "IN", currency: "INR", monthlyUsd: 700 },
  { id: "lucknow-in", city: "Lucknow", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  { id: "indore-in", city: "Indore", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  { id: "nagpur-in", city: "Nagpur", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  { id: "surat-in", city: "Surat", country: "India", cc: "IN", currency: "INR", monthlyUsd: 650 },
  { id: "coimbatore-in", city: "Coimbatore", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  { id: "visakhapatnam-in", city: "Visakhapatnam", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  // Kerala
  { id: "kochi-in", city: "Kochi", country: "India", cc: "IN", currency: "INR", monthlyUsd: 700 },
  { id: "thiruvananthapuram-in", city: "Thiruvananthapuram", country: "India", cc: "IN", currency: "INR", monthlyUsd: 650 },
  { id: "kozhikode-in", city: "Kozhikode", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  { id: "thrissur-in", city: "Thrissur", country: "India", cc: "IN", currency: "INR", monthlyUsd: 600 },
  { id: "kannur-in", city: "Kannur", country: "India", cc: "IN", currency: "INR", monthlyUsd: 580 },
  { id: "kollam-in", city: "Kollam", country: "India", cc: "IN", currency: "INR", monthlyUsd: 560 },

  // Oceania & South America
  { id: "sydney-au", city: "Sydney", country: "Australia", cc: "AU", currency: "AUD", monthlyUsd: 2600 },
  { id: "melbourne-au", city: "Melbourne", country: "Australia", cc: "AU", currency: "AUD", monthlyUsd: 2300 },
  { id: "auckland-nz", city: "Auckland", country: "New Zealand", cc: "NZ", currency: "NZD", monthlyUsd: 2200 },
  { id: "sao-paulo-br", city: "São Paulo", country: "Brazil", cc: "BR", currency: "BRL", monthlyUsd: 1200 },
  { id: "rio-de-janeiro-br", city: "Rio de Janeiro", country: "Brazil", cc: "BR", currency: "BRL", monthlyUsd: 1100 },
  { id: "buenos-aires-ar", city: "Buenos Aires", country: "Argentina", cc: "AR", currency: "ARS", monthlyUsd: 1000 },
  { id: "santiago-cl", city: "Santiago", country: "Chile", cc: "CL", currency: "CLP", monthlyUsd: 1300 },
  { id: "bogota-co", city: "Bogotá", country: "Colombia", cc: "CO", currency: "COP", monthlyUsd: 900 },
  { id: "lima-pe", city: "Lima", country: "Peru", cc: "PE", currency: "PEN", monthlyUsd: 900 },
];

/** Household presets scale a single-person cost. Shared housing gives economies of scale. */
export const HOUSEHOLDS: { id: string; label: string; multiplier: number }[] = [
  { id: "single", label: "Single (1 person)", multiplier: 1 },
  { id: "couple", label: "Couple (2 people)", multiplier: 1.7 },
  { id: "family3", label: "Small family (3)", multiplier: 2.1 },
  { id: "family4", label: "Family (4)", multiplier: 2.5 },
];

export type ResolvedPlace = City & {
  /** true = precise curated figure; false = estimated from the country baseline. */
  curated: boolean;
  /** State / province, when known (e.g. "Kerala"). */
  region?: string;
};

/** A place from geocoding search or reverse-geocoding, before we attach costs. */
export type PlaceInput = {
  name: string;
  country?: string;
  cc?: string;
  population?: number;
  region?: string;
  id?: string | number;
};

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/[.'’]/g, "");
}

/**
 * Turn any geocoded place into a cost figure + currency. Curated cities use their
 * precise value; everything else is estimated from the country baseline scaled by
 * population — so ANY city on Earth resolves to something sensible and editable.
 */
export function resolvePlace(p: PlaceInput): ResolvedPlace {
  const cc = (p.cc || "").toUpperCase();
  const n = norm(p.name);
  const override = CITIES.find((c) => c.cc === cc && norm(c.city) === n);
  if (override) return { ...override, curated: true, region: p.region };

  const info = countryInfo(cc);
  return {
    id: String(p.id ?? `${n}-${cc || "xx"}`),
    city: p.name,
    country: p.country || info.name || cc,
    cc,
    currency: info.currency,
    monthlyUsd: Math.round(info.base * sizeMultiplier(p.population)),
    curated: false,
    region: p.region,
  };
}
