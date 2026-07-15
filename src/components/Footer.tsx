import React from "react";
import { WeatherIcon } from "./WeatherIcon";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto py-8 border-t border-slate-800 bg-slate-950/40 backdrop-blur-md text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-sky-500 text-white flex items-center justify-center">
            <WeatherIcon name="Sun" size={14} />
          </div>
          <span className="font-bold text-slate-200 text-sm tracking-tight">
            AetherCast
          </span>
          <span className="text-slate-700 font-light">|</span>
          <span className="text-xs">Intelligence-Driven Weather Insights</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span>Powered by</span>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 font-bold hover:underline transition-all"
          >
            Open-Meteo Weather APIs
          </a>
          <span className="text-slate-700">·</span>
          <span>No keys required</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
