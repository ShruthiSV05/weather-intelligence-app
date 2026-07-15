import React from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  Search,
  MapPin,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  ChevronRight,
  Info
} from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = "", size = 24 }) => {
  switch (name) {
    case "Sun":
      return <Sun className={className} size={size} />;
    case "CloudSun":
      return <CloudSun className={className} size={size} />;
    case "Cloud":
      return <Cloud className={className} size={size} />;
    case "CloudFog":
      return <CloudFog className={className} size={size} />;
    case "CloudDrizzle":
      return <CloudDrizzle className={className} size={size} />;
    case "CloudRain":
      return <CloudRain className={className} size={size} />;
    case "CloudRainWind":
      return <CloudRainWind className={className} size={size} />;
    case "CloudSnow":
      return <CloudSnow className={className} size={size} />;
    case "Snowflake":
      return <Snowflake className={className} size={size} />;
    case "CloudLightning":
      return <CloudLightning className={className} size={size} />;
    case "Wind":
      return <Wind className={className} size={size} />;
    case "Droplets":
      return <Droplets className={className} size={size} />;
    case "Thermometer":
      return <Thermometer className={className} size={size} />;
    case "Calendar":
      return <Calendar className={className} size={size} />;
    case "Search":
      return <Search className={className} size={size} />;
    case "MapPin":
      return <MapPin className={className} size={size} />;
    case "AlertCircle":
      return <AlertCircle className={className} size={size} />;
    case "TrendingUp":
      return <TrendingUp className={className} size={size} />;
    case "Award":
      return <Award className={className} size={size} />;
    case "ChevronRight":
      return <ChevronRight className={className} size={size} />;
    case "Info":
      return <Info className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};

export default WeatherIcon;
