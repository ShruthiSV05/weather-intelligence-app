import React from "react";
import { WeatherState } from "../types";
import { getRecommendations } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherIcon";
import { motion } from "motion/react";

interface RecommendationCardProps {
  weather: WeatherState;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ weather }) => {
  const { current, daily } = weather;
  
  // Find max precipitation probability in next 24 hours (today)
  const maxRainProbToday = daily[0]?.rainProb || 0;

  const recommendations = getRecommendations(
    current.temperature_2m,
    maxRainProbToday,
    current.weather_code,
    current.wind_speed_10m,
    weather.unit
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full mb-8 bg-gradient-to-br from-indigo-950/30 to-slate-900/40 border border-indigo-500/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6"
    >
      <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-md flex items-center justify-center shrink-0">
        <WeatherIcon name="Award" size={28} className="animate-pulse" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[10px] text-indigo-300 font-bold uppercase tracking-wider bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded-full">
            Cast Advisor
          </span>
          <h4 className="text-base font-extrabold text-slate-100 tracking-tight">
            Smart Recommendations
          </h4>
        </div>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {recommendations.map((recommendation, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 p-3 rounded-xl shadow-sm text-sm text-slate-200 font-medium"
            >
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
