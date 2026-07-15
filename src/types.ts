export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: CurrentWeather;
  daily: DailyForecast;
}

export interface WeatherState {
  city: string;
  country: string;
  admin1?: string;
  current: CurrentWeather;
  daily: {
    date: string;
    dayName: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    rainProb: number;
  }[];
  timezone: string;
  latitude: number;
  longitude: number;
  unit: "celsius" | "fahrenheit";
}

export interface CityWeatherResult {
  id: string;
  queryName: string;
  weather: WeatherState | null;
  error: string | null;
  isLoading: boolean;
  geoData?: GeocodingResult;
}

export interface WeatherConditionDetails {
  description: string;
  iconName: string; // Map to Lucide icon string
  bgGradient: string; // Tailwind bg class
  themeColor: string; // primary tailwind color class
  cardBg: string; // Glassmorphism background style
}
