import React from "react";
import { WeatherState } from "../types";
import { getWeatherCondition, formatDate } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcon";
import { motion } from "motion/react";

interface CurrentWeatherCardProps {
  weather: WeatherState;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather }) => {
  const { city, country, admin1, current } = weather;
  const condition = getWeatherCondition(current.weather_code);
  const unitSymbol = weather.unit === "fahrenheit" ? "°F" : "°C";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl bg-gradient-to-br ${condition.bgGradient} text-white`}
    >
      {/* Decorative background sun rays or glass highlights */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left column: Location & Big Weather Indicator */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-white/80 font-mono text-xs uppercase tracking-wider mb-1">
              <WeatherIcon name="MapPin" size={12} className="text-white/95 animate-pulse" />
              <span>Current Weather</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {city}
            </h2>
            <p className="text-white/80 font-medium text-sm md:text-base mt-0.5">
              {[admin1, country].filter(Boolean).join(", ")}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md border border-white/25 shadow-inner">
              <WeatherIcon name={condition.iconName} size={48} className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" />
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tighter">
                {current.temperature_2m}{unitSymbol}
              </p>
              <p className="text-sm font-semibold tracking-wide text-white/90 capitalize">
                {condition.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-3.5 min-w-[250px] md:min-w-[300px]">
          {/* Apparent Temp */}
          <div className="p-3.5 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-colors duration-200">
            <div className="flex items-center gap-2 text-white/70 mb-1">
              <WeatherIcon name="Thermometer" size={15} className="text-white/85" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Feels Like</span>
            </div>
            <p className="text-lg font-bold">{current.apparent_temperature}{unitSymbol}</p>
          </div>

          {/* Humidity */}
          <div className="p-3.5 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-colors duration-200">
            <div className="flex items-center gap-2 text-white/70 mb-1">
              <WeatherIcon name="Droplets" size={15} className="text-white/85" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Humidity</span>
            </div>
            <p className="text-lg font-bold">{current.relative_humidity_2m}%</p>
          </div>

          {/* Wind Speed */}
          <div className="p-3.5 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-colors duration-200">
            <div className="flex items-center gap-2 text-white/70 mb-1">
              <WeatherIcon name="Wind" size={15} className="text-white/85" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Wind Speed</span>
            </div>
            <p className="text-lg font-bold">{current.wind_speed_10m} km/h</p>
          </div>

          {/* Report Time */}
          <div className="p-3.5 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-colors duration-200">
            <div className="flex items-center gap-2 text-white/70 mb-1">
              <WeatherIcon name="Calendar" size={15} className="text-white/85" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Date Info</span>
            </div>
            <p className="text-xs font-bold leading-tight line-clamp-2 pt-0.5">
              {formatDate(current.time)}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default CurrentWeatherCard;
