import React from 'react';
import { Sun, Cloud, CloudRain, Moon } from 'lucide-react';

export function HourlyForecast() {
  const hourlyData = [
    { time: 'Now', temp: '24°', icon: Sun },
    { time: '2 PM', temp: '26°', icon: Cloud },
    { time: '3 PM', temp: '25°', icon: CloudRain },
    { time: '4 PM', temp: '23°', icon: Moon },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {hourlyData.map((hour, index) => (
        <div
          key={index}
          className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 text-center"
        >
          <p className="text-white/80 text-sm mb-2">{hour.time}</p>
          <hour.icon className="w-8 h-8 mx-auto mb-2 text-white" />
          <p className="text-white font-semibold">{hour.temp}</p>
        </div>
      ))}
    </div>
  );
}