import React from "react";
import { CityWeatherResult } from "../types";
import { getWeatherCondition } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcon";
import { motion } from "motion/react";

interface CityOverviewGridProps {
  results: CityWeatherResult[];
  activeId: string | null;
  onSelectActive: (id: string) => void;
}

export const CityOverviewGrid: React.FC<CityOverviewGridProps> = ({
  results,
  activeId,
  onSelectActive
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4">
        <WeatherIcon name="MapPin" className="text-sky-500" size={20} />
        <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
          Weather Intelligence Dashboard ({results.filter(r => r.weather).length} Cities Loaded)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => {
          const isActive = item.id === activeId;
          
          // Case 1: Loading state for individual city
          if (item.isLoading) {
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-sm flex items-center gap-4 animate-pulse"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-slate-700 border-t-sky-500 rounded-full animate-spin"></span>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-800 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
            );
          }

          // Case 2: Error state for individual city
          if (item.error) {
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 shadow-sm flex items-start gap-3 text-rose-300 font-sans relative overflow-hidden"
              >
                <div className="p-2 bg-rose-950 rounded-xl text-rose-400 shrink-0 mt-0.5">
                  <WeatherIcon name="AlertCircle" size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-200 leading-tight">
                    {item.queryName}
                  </h4>
                  <p className="text-xs text-rose-400 mt-1 font-medium">
                    No matching results found for '{item.queryName}'.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/5 rounded-bl-full pointer-events-none" />
              </div>
            );
          }

          // Case 3: Successful weather state
          if (item.weather) {
            const { city, country, admin1, current } = item.weather;
            const condition = getWeatherCondition(current.weather_code);
            const unitSymbol = item.weather.unit === "fahrenheit" ? "°F" : "°C";

            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectActive(item.id)}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`text-left p-5 rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[160px] cursor-pointer shadow-lg hover:shadow-sky-500/5 border-2 ${
                  isActive
                    ? "border-sky-500 bg-slate-900/90 ring-4 ring-sky-500/20"
                    : "border-slate-800/80 hover:border-slate-700 bg-slate-900/50"
                }`}
              >
                {/* Visual gradient highlight bar at the left */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${condition.bgGradient}`} />

                <div className="w-full pl-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-100 tracking-tight text-base md:text-lg line-clamp-1">
                        {city}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium line-clamp-1">
                        {[admin1, country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-sky-950 text-sky-400 border border-sky-800/45 px-2 py-0.5 rounded-md shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full flex items-center justify-between mt-auto pl-2 pt-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${condition.bgGradient} text-white shadow-sm`}>
                      <WeatherIcon name={condition.iconName} size={20} className="drop-shadow-sm" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200 leading-tight line-clamp-1">
                        {condition.description}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Feels like {current.apparent_temperature}{unitSymbol}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-extrabold tracking-tighter text-slate-100">
                      {current.temperature_2m}{unitSymbol}
                    </p>
                  </div>
                </div>

                {/* Subtle overlay accent */}
                <div className="absolute right-0 bottom-0 w-16 h-16 bg-white/5 rounded-tl-full pointer-events-none" />
              </motion.button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default CityOverviewGrid;
