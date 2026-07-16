import React, { useState } from "react";
import { WeatherIcon } from "./WeatherIcon";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Check } from "lucide-react";

export const Header: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const shareUrl = window.location.origin + window.location.pathname;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <header className="w-full py-4 px-6 border-b border-white/10 bg-black/10 backdrop-blur-md flex items-center justify-between sticky top-0 z-40 gap-4">
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
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800/80 text-xs font-medium text-slate-300 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Public Open-Meteo Connection Active</span>
        </div>
        
        <motion.button
          id="share-app-btn"
          onClick={handleCopyLink}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border tracking-wide transition-all duration-300 relative overflow-hidden shadow-md cursor-pointer ${
            copied
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-200"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Link Copied!</span>
              </motion.span>
            ) : (
              <motion.span
                key="share"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Share2 size={14} className="text-sky-400 shrink-0" />
                <span>Share App</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
