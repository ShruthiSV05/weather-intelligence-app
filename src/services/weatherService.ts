import { GeocodingResponse, GeocodingResult, WeatherResponse, WeatherState } from "../types";
import { getDayName } from "../utils/weatherUtils";

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("Search query cannot be empty.");
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Geocoding service is temporarily unavailable.");
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to connect to the geocoding service.");
  }
}

export async function fetchWeather(
  city: GeocodingResult,
  unit: "celsius" | "fahrenheit" = "celsius"
): Promise<WeatherState> {
  const { latitude, longitude, name, country, admin1, timezone } = city;
  
  try {
    const tz = timezone || "auto";
    const unitParam = unit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=${encodeURIComponent(tz)}${unitParam}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Weather forecast service is temporarily unavailable.");
    }

    const data: WeatherResponse = await response.json();

    // Map the 7-day arrays into a structured array
    const dailyItems = data.daily.time.map((timeStr, idx) => {
      return {
        date: timeStr,
        dayName: getDayName(timeStr),
        weatherCode: data.daily.weather_code[idx],
        tempMax: Math.round(data.daily.temperature_2m_max[idx]),
        tempMin: Math.round(data.daily.temperature_2m_min[idx]),
        rainProb: data.daily.precipitation_probability_max[idx] || 0
      };
    });

    return {
      city: name,
      country: country,
      admin1: admin1,
      current: {
        ...data.current,
        temperature_2m: Math.round(data.current.temperature_2m),
        apparent_temperature: Math.round(data.current.apparent_temperature),
        wind_speed_10m: Math.round(data.current.wind_speed_10m)
      },
      daily: dailyItems,
      timezone: data.timezone,
      latitude,
      longitude,
      unit
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to load weather forecast details.");
  }
}
