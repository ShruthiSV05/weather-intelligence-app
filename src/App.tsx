import React, { useState, useEffect } from "react";
import { GeocodingResult, WeatherState, CityWeatherResult } from "./types";
import { fetchWeather, searchCity } from "./services/weatherService";
import { getWeatherCondition } from "./utils/weatherUtils";
import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import CityOverviewGrid from "./components/CityOverviewGrid";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import ForecastCards from "./components/ForecastCards";
import RecommendationCard from "./components/RecommendationCard";
import TemperatureChart from "./components/TemperatureChart";
import Footer from "./components/Footer";
import { WeatherIcon } from "./components/WeatherIcon";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_CITY: GeocodingResult = {
  id: 2643743,
  name: "London",
  latitude: 51.50853,
  longitude: -0.12574,
  country: "United Kingdom",
  country_code: "GB",
  admin1: "England",
  timezone: "Europe/London"
};

export default function App() {
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">(() => {
    try {
      const saved = localStorage.getItem("weather_temp_unit");
      return (saved as "celsius" | "fahrenheit") || "celsius";
    } catch (e) {
      return "celsius";
    }
  });
  const [cityResults, setCityResults] = useState<CityWeatherResult[]>([]);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch single selected city (from autocomplete or recent searches)
  const handleSelectCity = async (city: GeocodingResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const weatherData = await fetchWeather(city, unit);
      const singleItem: CityWeatherResult = {
        id: city.name.toLowerCase(),
        queryName: city.name,
        weather: weatherData,
        error: null,
        isLoading: false,
        geoData: city
      };
      setCityResults([singleItem]);
      setActiveCityId(singleItem.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weather forecast.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch multiple cities concurrently from search query string
  const handleSearchSubmit = async (query: string) => {
    const rawCities = query.split(",").map((c) => c.trim()).filter(Boolean);
    if (rawCities.length === 0) {
      setError("Please enter a city name to search.");
      return;
    }

    // Deduplicate case-insensitively keeping the first spelling
    const uniqueCities: string[] = [];
    const seen = new Set<string>();
    for (const c of rawCities) {
      const lower = c.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueCities.push(c);
      }
    }

    // Support up to 10 cities max
    const citiesToFetch = uniqueCities.slice(0, 10);

    setIsLoading(true);
    setError(null);

    // Initialize list with loading states
    const initialItems: CityWeatherResult[] = citiesToFetch.map((name) => ({
      id: name.toLowerCase(),
      queryName: name,
      weather: null,
      error: null,
      isLoading: true
    }));
    setCityResults(initialItems);

    try {
      // Concurrently fetch each city's data using Promise.all()
      const finalResults = await Promise.all(
        citiesToFetch.map(async (name): Promise<CityWeatherResult> => {
          const id = name.toLowerCase();
          try {
            const geoResults = await searchCity(name);
            if (geoResults.length === 0) {
              return {
                id,
                queryName: name,
                weather: null,
                error: `No matching results found for '${name}'.`,
                isLoading: false
              };
            }
            const selectedGeo = geoResults[0];
            const weatherData = await fetchWeather(selectedGeo, unit);
            return {
              id,
              queryName: weatherData.city,
              weather: weatherData,
              error: null,
              isLoading: false,
              geoData: selectedGeo
            };
          } catch (err) {
            return {
              id,
              queryName: name,
              weather: null,
              error: err instanceof Error ? err.message : "Failed to load weather forecast.",
              isLoading: false
            };
          }
        })
      );

      setCityResults(finalResults);

      // Check if all searches failed
      const allFailed = finalResults.every((r) => r.error !== null);
      if (allFailed) {
        setError("No matching cities were found. Please check the spelling and try again.");
        setActiveCityId(null);
      } else {
        // Automatically activate first successful city
        const firstSuccess = finalResults.find((r) => r.weather !== null);
        if (firstSuccess) {
          setActiveCityId(firstSuccess.id);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred during weather processing.");
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch all loaded cities when temperature unit changes
  useEffect(() => {
    if (cityResults.length === 0) return;

    // Check if any loaded city results actually need an update to prevent infinite loops
    const needsUpdate = cityResults.some(
      (r) => r.weather && r.weather.unit !== unit
    );
    if (!needsUpdate) return;

    const refreshCities = async () => {
      setIsLoading(true);
      const refreshed = await Promise.all(
        cityResults.map(async (item): Promise<CityWeatherResult> => {
          if (!item.geoData) {
            if (item.weather) {
              const dummyGeo: GeocodingResult = {
                id: Math.random(),
                name: item.weather.city,
                latitude: item.weather.latitude,
                longitude: item.weather.longitude,
                country: item.weather.country,
                country_code: "",
                admin1: item.weather.admin1,
                timezone: item.weather.timezone
              };
              try {
                const weatherData = await fetchWeather(dummyGeo, unit);
                return {
                  ...item,
                  weather: weatherData,
                  error: null,
                  isLoading: false,
                  geoData: dummyGeo
                };
              } catch (err) {
                return {
                  ...item,
                  error: err instanceof Error ? err.message : "Failed to load weather forecast.",
                  isLoading: false
                };
              }
            }
            return item;
          }

          try {
            const weatherData = await fetchWeather(item.geoData, unit);
            return {
              ...item,
              weather: weatherData,
              error: null,
              isLoading: false
            };
          } catch (err) {
            return {
              ...item,
              error: err instanceof Error ? err.message : "Failed to load weather forecast.",
              isLoading: false
            };
          }
        })
      );
      setCityResults(refreshed);
      setIsLoading(false);
    };

    refreshCities();
  }, [unit]);

  const handleUnitToggle = (newUnit: "celsius" | "fahrenheit") => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    try {
      localStorage.setItem("weather_temp_unit", newUnit);
    } catch (e) {
      console.error("Failed to persist unit preference", e);
    }
  };

  // Load London by default on mount
  useEffect(() => {
    handleSelectCity(DEFAULT_CITY);
  }, []);

  // Determine active city weather info
  const activeCityResult = cityResults.find((r) => r.id === activeCityId);
  const activeWeather = activeCityResult?.weather;

  // Get condition to alter ambient background gradient based on selected active city's weather
  const currentCondition = activeWeather
    ? getWeatherCondition(activeWeather.current.weather_code)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-sky-500/30 selection:text-sky-100 transition-colors duration-500 relative overflow-hidden">
      
      {/* Dynamic ambient blur sphere representing weather gradient */}
      <div 
        className={`absolute -top-32 right-1/4 w-[450px] h-[450px] rounded-full opacity-25 blur-[120px] transition-all duration-1000 bg-gradient-to-br ${
          currentCondition?.bgGradient || "from-sky-500 to-indigo-600"
        }`} 
      />
      <div 
        className="absolute top-1/2 -left-32 w-[350px] h-[350px] rounded-full opacity-15 blur-[100px] bg-gradient-to-br from-indigo-500 to-purple-600" 
      />

      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10 flex flex-col">
        {/* Temperature Unit Toggle positioned beautifully above the search box */}
        <div className="w-full max-w-xl mx-auto mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Satellite Feed
          </span>
          
          <div className="flex bg-slate-900/80 hover:bg-slate-900 p-0.5 rounded-xl border border-slate-800/80 shadow-inner shrink-0">
            <button
              onClick={() => handleUnitToggle("celsius")}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide transition-all duration-300 flex items-center justify-center ${
                unit === "celsius"
                  ? "bg-slate-800 text-slate-100 shadow-md scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => handleUnitToggle("fahrenheit")}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide transition-all duration-300 flex items-center justify-center ${
                unit === "fahrenheit"
                  ? "bg-slate-800 text-slate-100 shadow-md scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °F
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <SearchSection 
          onSearchSubmit={handleSearchSubmit}
          onSelectCity={handleSelectCity} 
          isLoading={isLoading} 
          initialError={error}
        />

        <AnimatePresence mode="wait">
          {isLoading && cityResults.length === 0 ? (
            /* Immersive first-time loader */
            <motion.div
              key="initial-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-20"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-sky-500 animate-spin"></div>
                <WeatherIcon name="Sun" size={24} className="absolute text-amber-500 animate-pulse" />
              </div>
              <p className="mt-4 font-semibold text-slate-300 text-sm">Retrieving real-time forecast data...</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Connecting to Open-Meteo satellite feed</p>
            </motion.div>
          ) : error && cityResults.length === 0 ? (
            /* Immersive first-time error state if mount fails */
            <motion.div
              key="initial-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto"
            >
              <div className="p-4 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-rose-400 mb-4 shadow-sm">
                <WeatherIcon name="AlertCircle" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Forecast Fetch Failure</h3>
              <p className="text-slate-400 text-sm mt-1 mb-6">
                {error}
              </p>
              <button
                onClick={() => handleSelectCity(DEFAULT_CITY)}
                className="py-2.5 px-5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm"
              >
                Retry London Forecast
              </button>
            </motion.div>
          ) : cityResults.length > 0 ? (
            /* Primary Weather Dashboard Content */
            <motion.div
              key="dashboard-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6 md:gap-8 animate-fadeIn"
            >
              {/* Grid Overview of All Cities */}
              <CityOverviewGrid
                results={cityResults}
                activeId={activeCityId}
                onSelectActive={(id) => setActiveCityId(id)}
              />

              {/* Active Forecast details section */}
              {activeWeather ? (
                <div className="flex flex-col gap-6 md:gap-8">
                  {/* Divider line showing focused area */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      DETAILED INTELLIGENCE: {activeWeather.city}
                    </span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>

                  {/* Current Weather Card */}
                  <CurrentWeatherCard weather={activeWeather} />

                  {/* Smart Advisories & Recommendations */}
                  <RecommendationCard weather={activeWeather} />

                  {/* 7-Day Forecast Cards */}
                  <ForecastCards weather={activeWeather} />

                  {/* Temperature Line Charts */}
                  <TemperatureChart weather={activeWeather} />
                </div>
              ) : null}

            </motion.div>
          ) : (
            /* Empty state backup */
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <WeatherIcon name="Cloud" size={48} className="text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">Please enter a city name to search weather intelligence.</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
