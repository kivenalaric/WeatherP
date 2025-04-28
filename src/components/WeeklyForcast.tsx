// WeeklyForecast.tsx
import React from 'react';
import { ForecastDay } from '../types';

interface WeeklyForecastProps {
  forecastData: ForecastDay[];
}

export function WeeklyForecast({ forecastData }: WeeklyForecastProps) {
  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    if (date.getDate() === new Date().getDate() + 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {forecastData.map((day, index) => (
        <div
          key={index}
          className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 flex flex-col items-center justify-between"
        >
          <p className="text-white">{formatDay(day.dt)}</p>
          <div className="flex items-center flex-col gap-1">
            <h3 className='text-white bold font-extrabold'>Temp</h3>
            <p className="text-white font-semibold">{Math.round(day.temp.day)}°</p>
          </div>
        </div>
      ))}
    </div>
  );
}