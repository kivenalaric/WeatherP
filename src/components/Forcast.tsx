import type { ForecastData } from '../types';

interface ForecastProps {
  data: ForecastData;
  onDaySelect: (index: number) => void;
  selectedDay: number;
}

export function Forecast({ data, onDaySelect, selectedDay }: ForecastProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
      {data.list.filter((_, index) => index % 8 === 0).map((day, index) => (
        <div
          key={day.dt}
          className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-200 ${
            selectedDay === index
              ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
              : 'hover:shadow-md'
          }`}
          onClick={() => onDaySelect(index)}
        >
          <p className="text-sm font-medium text-gray-500 mb-2">
            {new Date(day.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
            alt={day.weather[0].main}
            className="w-16 h-16 mx-auto"
          />
          <p className="text-xl font-semibold text-gray-800 mt-2">{Math.round(day.main.temp)}°C</p>
          <p className="text-sm text-gray-500 mt-1 capitalize">{day.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
}