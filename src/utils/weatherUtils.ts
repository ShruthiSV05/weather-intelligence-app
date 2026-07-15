import { WeatherConditionDetails } from "../types";

export function getWeatherCondition(code: number): WeatherConditionDetails {
  // Mapping of WMO weather codes to user-friendly descriptions, Lucide icons, and dynamic theme classes
  switch (code) {
    case 0:
      return {
        description: "Clear Sky",
        iconName: "Sun",
        bgGradient: "from-amber-400 via-sky-400 to-blue-600",
        themeColor: "amber",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 1:
      return {
        description: "Mainly Clear",
        iconName: "CloudSun",
        bgGradient: "from-sky-400 via-blue-500 to-indigo-600",
        themeColor: "sky",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 2:
      return {
        description: "Partly Cloudy",
        iconName: "CloudSun",
        bgGradient: "from-blue-400 via-slate-400 to-slate-600",
        themeColor: "blue",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 3:
      return {
        description: "Overcast",
        iconName: "Cloud",
        bgGradient: "from-slate-400 via-slate-500 to-slate-700",
        themeColor: "slate",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 45:
    case 48:
      return {
        description: "Foggy",
        iconName: "CloudFog",
        bgGradient: "from-slate-300 via-zinc-400 to-slate-500",
        themeColor: "slate",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 51:
    case 53:
    case 55:
      return {
        description: "Drizzle",
        iconName: "CloudDrizzle",
        bgGradient: "from-teal-400 via-blue-500 to-indigo-700",
        themeColor: "indigo",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 56:
    case 57:
      return {
        description: "Freezing Drizzle",
        iconName: "CloudSnow",
        bgGradient: "from-cyan-300 via-sky-500 to-blue-800",
        themeColor: "cyan",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 61:
    case 63:
      return {
        description: "Rainy",
        iconName: "CloudRain",
        bgGradient: "from-blue-400 via-indigo-500 to-slate-800",
        themeColor: "blue",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 65:
      return {
        description: "Heavy Rain",
        iconName: "CloudRainWind",
        bgGradient: "from-blue-600 via-indigo-700 to-slate-950",
        themeColor: "indigo",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 66:
    case 67:
      return {
        description: "Freezing Rain",
        iconName: "CloudSnow",
        bgGradient: "from-cyan-400 via-blue-600 to-slate-900",
        themeColor: "cyan",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 71:
    case 73:
    case 75:
      return {
        description: "Snowy",
        iconName: "Snowflake",
        bgGradient: "from-sky-200 via-cyan-400 to-blue-600",
        themeColor: "sky",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 77:
      return {
        description: "Snow Grains",
        iconName: "Snowflake",
        bgGradient: "from-slate-200 via-slate-400 to-blue-500",
        themeColor: "slate",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 80:
    case 81:
    case 82:
      return {
        description: "Rain Showers",
        iconName: "CloudRain",
        bgGradient: "from-sky-500 via-blue-600 to-slate-900",
        themeColor: "blue",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 85:
    case 86:
      return {
        description: "Snow Showers",
        iconName: "CloudSnow",
        bgGradient: "from-teal-200 via-sky-400 to-indigo-800",
        themeColor: "sky",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
    case 95:
      return {
        description: "Thunderstorm",
        iconName: "CloudLightning",
        bgGradient: "from-indigo-900 via-purple-950 to-slate-950",
        themeColor: "indigo",
        cardBg: "bg-white/10 border-white/10 text-white"
      };
    case 96:
    case 99:
      return {
        description: "Severe Storm",
        iconName: "CloudLightning",
        bgGradient: "from-red-950 via-purple-950 to-slate-950",
        themeColor: "red",
        cardBg: "bg-white/10 border-white/10 text-white"
      };
    default:
      return {
        description: "Unknown Weather",
        iconName: "Cloud",
        bgGradient: "from-slate-400 to-slate-700",
        themeColor: "slate",
        cardBg: "bg-white/15 border-white/20 text-slate-900"
      };
  }
}

export function getRecommendations(
  tempCurrent: number,
  maxRainProb: number,
  weatherCode: number,
  windSpeed: number,
  unit: "celsius" | "fahrenheit" = "celsius"
): string[] {
  const list: string[] = [];
  
  // Convert temperature to Celsius for checking logic boundaries
  const tempC = unit === "fahrenheit" ? Math.round(((tempCurrent - 32) * 5) / 9) : tempCurrent;

  // Weather-specific recommendations
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    list.push("Stay indoors to avoid severe lighting and storm hazards.");
  } else if (maxRainProb > 60) {
    list.push("Carry an umbrella. High probability of precipitation.");
  } else if (maxRainProb > 30) {
    list.push("Unsettled weather. Keep an umbrella or light jacket handy.");
  }

  // Temperature recommendations using converted Celsius
  if (tempC > 35) {
    list.push("Stay hydrated. Avoid direct heat during mid-day hours.");
  } else if (tempC > 28) {
    list.push("Warm weather. Remember sunscreen and stay in shade where possible.");
  } else if (tempC < 15) {
    list.push("Wear warm clothes. Layer up to maintain body heat.");
  } else if (tempC < 5) {
    list.push("Extremely cold. Heavy winter wear is highly recommended.");
  }

  // Wind recommendations
  if (windSpeed > 25) {
    list.push("Windy day. Watch for flying debris if you're outdoors.");
  }

  // Clear/Nice weather recommendations using converted Celsius
  if ((weatherCode === 0 || weatherCode === 1) && tempC >= 15 && tempC <= 28) {
    list.push("Great day for outdoor activities, light exercise, or a walk!");
  }

  // Default baseline recommendation if nothing else triggered
  if (list.length === 0) {
    list.push("Pleasant conditions. Enjoy your day and check local advisories.");
  }

  return list;
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  
  // Format to local date string to ignore timezone offsets during equality check
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return "Today";

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  if (isTomorrow) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
