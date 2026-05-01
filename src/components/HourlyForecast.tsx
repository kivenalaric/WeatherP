import type { HourlyForecast as HourlyForecastItem } from '../types';

interface HourlyForecastProps {
  hourlyData: HourlyForecastItem[];
}

export function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {hourlyData.map((hour, index) => (
        <div
          key={index}
          className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 text-center"
        >
          <p className="text-white/80 text-sm mb-2">{hour.hour}</p>
          <img
            src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
            alt={hour.description}
            className="w-10 h-10 mx-auto"
          />
          <p className="text-white font-semibold">{Math.round(hour.temp)}°</p>
        </div>
      ))}
    </div>
  );
}
