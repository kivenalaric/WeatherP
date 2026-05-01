import type { ForecastDay } from '../types';

interface WeeklyForecastProps {
  forecastData: ForecastDay[];
  unit: 'C' | 'F';
}

function toTemp(c: number, unit: 'C' | 'F'): string {
  return unit === 'F' ? `${Math.round(c * 9 / 5 + 32)}°` : `${Math.round(c)}°`;
}

function formatDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function WeeklyForecast({ forecastData, unit }: WeeklyForecastProps) {
  return (
    <div className="space-y-2">
      {forecastData.map((day, index) => (
        <div
          key={index}
          className="bg-black/20 backdrop-blur-lg rounded-2xl px-4 py-3 flex items-center justify-between"
        >
          <span className="text-white font-medium w-20">{formatDay(day.dt)}</span>

          <div className="flex items-center gap-1">
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].main}
              className="w-10 h-10"
            />
            <span className="text-white/60 text-sm hidden sm:block">{day.weather[0].main}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-white font-semibold">
              {toTemp(day.temp.max ?? day.temp.day, unit)}
            </span>
            <span className="text-white/45">
              {toTemp(day.temp.min ?? day.temp.day, unit)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
