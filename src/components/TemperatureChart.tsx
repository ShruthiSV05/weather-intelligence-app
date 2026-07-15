import React from "react";
import { WeatherState } from "../types";
import { WeatherIcon } from "./WeatherIcon";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface TemperatureChartProps {
  weather: WeatherState;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ weather }) => {
  const { daily } = weather;
  const unitSymbol = weather.unit === "fahrenheit" ? "°F" : "°C";

  // Prepare chart data format
  const chartData = daily.map((day) => ({
    name: day.dayName,
    Max: day.tempMax,
    Min: day.tempMin,
    displayDate: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }));

  // Custom tool tip to fit our modern design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-4.5 rounded-2xl border border-white/15 shadow-xl text-xs flex flex-col gap-1.5 font-sans">
          <p className="font-bold border-b border-white/10 pb-1 text-slate-300">
            {label} ({payload[0].payload.displayDate})
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Max: {payload[0].value}{unitSymbol}
            </span>
            <span className="flex items-center gap-1 font-semibold text-sky-400 border-l border-white/10 pl-3">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              Min: {payload[1].value}{unitSymbol}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mb-8 p-5 md:p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl shadow-sm"
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <WeatherIcon name="TrendingUp" className="text-sky-500" size={20} />
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">
            7-Day Temperature Trends
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 inline-block" />
            <span>High Temp</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 inline-block" />
            <span>Low Temp</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Max"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="Min"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TemperatureChart;
