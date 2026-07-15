import React, { useState, useEffect, useRef } from "react";
import { GeocodingResult } from "../types";
import { searchCity } from "../services/weatherService";
import { WeatherIcon } from "./WeatherIcon";

interface SearchSectionProps {
  onSearchSubmit: (query: string) => void;
  onSelectCity: (city: GeocodingResult) => void;
  isLoading: boolean;
  initialError?: string | null;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSearchSubmit,
  onSelectCity,
  isLoading,
  initialError
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recent_weather_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Save recent search helper
  const saveToRecent = (city: GeocodingResult) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id);
      const updated = [city, ...filtered].slice(0, 4); // Keep top 4
      try {
        localStorage.setItem("recent_weather_searches", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent search", e);
      }
      return updated;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear external errors when typing
  useEffect(() => {
    if (initialError) {
      setError(initialError);
    } else {
      setError(null);
    }
  }, [initialError]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setError(null);

    const trimmed = val.trim();
    // Only search autocomplete if there are no commas in the input
    if (trimmed.length > 2 && !trimmed.includes(",")) {
      try {
        const results = await searchCity(trimmed);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        // Silent fail for typing suggestions to avoid interrupting the user's flow
        console.warn("Typing suggestions error:", err);
      }
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    
    if (!trimmed) {
      setError("Please enter a city name to search.");
      return;
    }

    setError(null);
    onSearchSubmit(trimmed);
    setQuery("");
    setShowDropdown(false);
  };

  const handleSelectSuggestion = (city: GeocodingResult) => {
    onSelectCity(city);
    saveToRecent(city);
    setQuery("");
    setShowDropdown(false);
    setError(null);
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem("recent_weather_searches");
      setRecentSearches([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8 relative" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2">
        <label htmlFor="city-search" className="sr-only">Search City Name</label>
        <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 backdrop-blur-md focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all duration-300">
          <div className="pl-4 text-slate-500">
            <WeatherIcon name="Search" size={20} />
          </div>
          <input
            id="city-search"
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter cities separated by commas (e.g., London, Paris, Tokyo)..."
            className="w-full py-4 pl-3 pr-4 pr-24 outline-none text-slate-100 font-sans text-sm md:text-base placeholder-slate-500 bg-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 py-2.5 px-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-medium text-sm rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : null}
            <span>Search</span>
          </button>
        </div>
      </form>
 
      {/* Error Message */}
      {error && (
        <div className="mt-3 px-4 py-3 bg-rose-950/40 border border-rose-900/50 rounded-xl flex items-start gap-2.5 text-rose-200 text-xs md:text-sm shadow-sm animate-fadeIn">
          <WeatherIcon name="AlertCircle" size={16} className="mt-0.5 shrink-0 text-rose-400" />
          <span className="leading-relaxed font-sans">{error}</span>
        </div>
      )}
 
      {/* Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-[10px] font-mono tracking-wider text-slate-500">
            SEARCH RESULTS
          </div>
          <ul className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
            {suggestions.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(city)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/50 flex items-center justify-between transition-colors duration-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <WeatherIcon name="MapPin" size={16} className="text-sky-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-200 text-sm group-hover:text-sky-400 transition-colors">
                        {city.name}
                      </span>
                      {city.admin1 && (
                        <span className="text-slate-400 text-xs font-sans ml-1.5">
                          {city.admin1}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                    {city.country}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
 
      {/* Recent Searches */}
      {!showDropdown && recentSearches.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Recent:</span>
          {recentSearches.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className="px-3 py-1.5 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/50 rounded-full text-slate-300 flex items-center gap-1 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            >
              <WeatherIcon name="MapPin" size={10} className="text-sky-400" />
              <span className="font-medium text-xs">{city.name}</span>
              <span className="text-[10px] text-slate-500">({city.country_code.toUpperCase()})</span>
            </button>
          ))}
          <button
            onClick={clearRecentSearches}
            className="text-[10px] text-rose-400 hover:text-rose-300 font-mono underline ml-auto pl-2"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
