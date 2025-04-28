import React from 'react';
import { Wind, Droplets, Cloud } from 'lucide-react';
import type { WeatherData } from '../types';



interface MainWeatherCardProps {
  isStormy: boolean;
  temperature: string;
  windSpeed: string;
  data: WeatherData;
  pressure: string;
  humidity: string;
  backgroundStyle: React.CSSProperties;
  windDescription?: string; // Optional wind description
}

export function MainWeatherCard({ 
  isStormy, 
  temperature, 
  windSpeed, 
  humidity, 
  backgroundStyle,
  pressure,
  windDescription,
  data 
}: MainWeatherCardProps) {
  
    // Determine weather status text
  const weatherStatus = isStormy 
    ? 'Stormy' 
    : parseFloat(windSpeed) > 30 
      ? 'Windy' 
      : parseFloat(windSpeed) > 15 
        ? 'Breezy' 
        : 'Sunny';

  return (
    <div 
      className="relative backdrop-blur-lg rounded-3xl p-6 mb-8 overflow-hidden"
      style={backgroundStyle}
    >
      <div className="absolute top-0 right-0 p-4">
      <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
            className="w-15 h-15 mx-auto"
          />
      </div>
      <div className="mt-4 relative z-10">
        <h2 className="text-6xl font-bold text-white mb-2">{temperature}</h2>
        <p className="text-xl text-white/80">
          {weatherStatus}
          <span>{windDescription && (
            <span className="block text-sm mt-1">{windDescription}</span>
          )}</span>
          
        </p>
        <div className="flex gap-4 mt-6">
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
  );
}