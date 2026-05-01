import React from "react";
import { useEffect, useState } from "react";
import {
  Wind,
  Droplets,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  Moon,
  CloudSun,
  SunDim,
} from "lucide-react";
import type { WeatherData } from "../types";

const weatherEffectsCSS = `
  .rain-animation::after {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L15 20' stroke='%23FFFFFF' stroke-width='1' stroke-opacity='0.4'/%3E%3C/svg%3E");
    animation: rain 0.8s linear infinite;
    pointer-events: none;
  }
  .heavy-rain-animation::after {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 5 L10 15' stroke='%23FFFFFF' stroke-width='1.5' stroke-opacity='0.6'/%3E%3C/svg%3E");
    animation: rain 0.5s linear infinite;
    pointer-events: none;
  }
  @keyframes lightning {
    0%, 100% { background-color: transparent; }
    5%, 15%, 25% { background-color: rgba(255, 255, 255, 0.3); }
  }
  .lightning-animation { animation: lightning 8s infinite; }
  @keyframes rain {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100%);  }
  }
`;

interface MainWeatherCardProps {
  isStormy: boolean;
  temperature: string;
  windSpeed: string;
  data: WeatherData;
  pressure: string;
  humidity: string;
  backgroundStyle: React.CSSProperties;
  windDescription?: string;
}

export function MainWeatherCard({
  isStormy,
  temperature,
  windSpeed,
  humidity,
  backgroundStyle,
  pressure,
  windDescription,
  data,
}: MainWeatherCardProps) {
  const [flash, setFlash] = useState(false);
  const isRaining = data?.weather?.[0]?.main === 'Rain';
  const isThunderStorm = data?.weather?.[0]?.main === 'Thunderstorm';
  const isDaytime = data.weather[0].icon.includes('d');

  useEffect(() => {
    if (!isThunderStorm) return;
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 100);
    }, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [isThunderStorm]);

  const weatherStatus = isStormy
    ? 'Stormy'
    : parseFloat(windSpeed) > 30
    ? 'Windy'
    : parseFloat(windSpeed) > 15
    ? 'Breezy'
    : 'Sunny';

  const getWeatherIcon = () => {
    const id = data.weather[0].id;
    if (isThunderStorm) return <CloudLightning className="text-blue-400 w-10 h-10 animate-pulse" />;
    if (id >= 500 && id < 600) return <CloudRain className="w-10 h-10 text-blue-300" />;
    if (weatherStatus === 'Windy' || weatherStatus === 'Breezy') return <CloudSun className="w-10 h-10 text-gray-300" />;
    if (weatherStatus === 'Sunny') return <Sun className="w-10 h-10 text-yellow-400" />;
    return <Cloud className="w-10 h-10 text-gray-400" />;
  };

  return (
    <>
      <style>{weatherEffectsCSS}</style>
      {/* h-full so this card stretches to match the right column's dynamic height */}
      <div
        className={`relative backdrop-blur-lg rounded-3xl p-6 overflow-hidden transition-colors duration-300 flex flex-col h-full ${
          isStormy
            ? 'heavy-rain-animation lightning-animation'
            : isRaining
            ? 'rain-animation'
            : ''
        }`}
        style={{
          ...backgroundStyle,
          backgroundColor: flash ? 'rgba(255,255,255,0.1)' : backgroundStyle.backgroundColor,
        }}
      >
        {/* Corner icons */}
        <div className="absolute top-0 left-0 p-4">
          {isDaytime
            ? <SunDim className="w-10 h-10 text-yellow-400" />
            : <Moon className="w-10 h-10 text-gray-400" />
          }
        </div>
        <div className="absolute top-0 right-0 p-4">
          {getWeatherIcon()}
        </div>

        {/* Content: temp centered, stats at bottom */}
        <div className="relative z-10 flex flex-col flex-1 pt-12">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-6xl font-bold text-white mb-2">{temperature}</h2>
            <p className="text-xl text-white/80">
              {data?.weather?.[0]?.main || weatherStatus}
              {windDescription && (
                <span className="block text-sm mt-1 text-white/60">{windDescription}</span>
              )}
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-white/80">
              <Wind className="w-5 h-5" />
              <span>{windSpeed}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Droplets className="w-5 h-5" />
              <span>{humidity}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Cloud className="w-5 h-5" />
              <span>{pressure}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
