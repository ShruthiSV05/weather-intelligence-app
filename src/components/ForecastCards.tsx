import React from "react";
import { WeatherState } from "../types";
import { getWeatherCondition } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcon";
import { motion } from "motion/react";

interface ForecastCardsProps {
  weather: WeatherState;
}

export const ForecastCards: React.FC<ForecastCardsProps> = ({ weather }) => {
  const { daily } = weather;
  const unitSymbol = weather.unit === "fahrenheit" ? "°F" : "°C";

  // Animation variants for staggered grid loading
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4">
        <WeatherIcon name="Calendar" className="text-sky-500" size={20} />
        <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
          7-Day Detailed Forecast
        </h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5"
      >
        {daily.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode);
          return (
            <motion.div
              key={day.date}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col items-center p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-sky-500/50 shadow-md hover:shadow-sky-500/5 transition-all duration-300"
            >
              {/* Day name */}
              <span className="font-bold text-sm text-slate-200 tracking-tight">
                {day.dayName}
              </span>
              
              {/* Date string */}
              <span className="text-[10px] text-slate-400 font-mono mb-3">
                {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>

              {/* Icon & Details */}
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${condition.bgGradient} text-white mb-2 shadow-sm`}>
                <WeatherIcon name={condition.iconName} size={22} className="drop-shadow-sm" />
              </div>

              {/* Description */}
              <span className="text-xs font-semibold text-slate-300 text-center line-clamp-1 mb-2 max-w-full">
                {condition.description}
              </span>

              {/* High / Low Temp */}
              <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-slate-800/80">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-mono block">MAX</span>
                  <span className="text-sm font-extrabold text-slate-100 font-sans">{day.tempMax}{unitSymbol}</span>
                </div>
                <div className="text-center border-l border-slate-800/80 pl-2">
                  <span className="text-[10px] text-slate-400 font-mono block">MIN</span>
                  <span className="text-xs font-bold text-slate-400 font-sans">{day.tempMin}{unitSymbol}</span>
                </div>
              </div>

              {/* Rain Probability Indicator */}
              <div className="w-full mt-2.5 flex items-center justify-center gap-1 bg-sky-950/40 border border-sky-900/30 py-1 rounded-lg text-[10px] font-bold text-sky-400">
                <WeatherIcon name="Droplets" size={10} className="text-sky-400" />
                <span>{day.rainProb}% rain</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ForecastCards;
