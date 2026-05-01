import type { HourlyForecast as HourlyForecastItem } from '../types';

interface HourlyForecastProps {
  hourlyData: HourlyForecastItem[];
  unit: 'C' | 'F';
}

function toTemp(c: number, unit: 'C' | 'F'): string {
  return unit === 'F' ? `${Math.round(c * 9 / 5 + 32)}°` : `${Math.round(c)}°`;
}

export function HourlyForecast({ hourlyData, unit }: HourlyForecastProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {hourlyData.map((hour, index) => (
        <div
          key={index}
          className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 text-center"
        >
          <p className="text-white/80 text-sm mb-1">{hour.hour}</p>
          <img
            src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
            alt={hour.description}
            className="w-10 h-10 mx-auto"
          />
          <p className="text-white font-semibold">{toTemp(hour.temp, unit)}</p>
        </div>
      ))}
    </div>
  );
}
