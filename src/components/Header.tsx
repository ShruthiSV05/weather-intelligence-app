import React from "react";
import { WeatherIcon } from "./WeatherIcon";

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 border-b border-white/10 bg-black/10 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md flex items-center justify-center text-white">
          <WeatherIcon name="Sun" size={24} className="animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight bg-gradient-to-r from-sky-400 via-sky-100 to-white bg-clip-text text-transparent">
            AetherCast
          </h1>
          <p className="text-xs text-slate-400 font-mono">WEATHER INTELLIGENCE ENGINE</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800/80 text-xs font-medium text-slate-300 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Public Open-Meteo Connection Active</span>
      </div>
    </header>
  );
};

export default Header;
