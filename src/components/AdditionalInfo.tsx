import { Thermometer, Wind, Sunrise, Sunset } from 'lucide-react';

interface AdditionalInfoProps {
  feelsLike: string;
  windSpeed: string;
  sunrise?: number;
  sunset?: number;
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function AdditionalInfo({ feelsLike, windSpeed, sunrise, sunset }: AdditionalInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="w-5 h-5 text-white/70" />
          <p className="text-white/70 text-sm">Feels Like</p>
        </div>
        <p className="text-2xl font-bold text-white">{feelsLike}</p>
      </div>

      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Wind className="w-5 h-5 text-white/70" />
          <p className="text-white/70 text-sm">Wind Speed</p>
        </div>
        <p className="text-2xl font-bold text-white">{windSpeed}</p>
      </div>

      {sunrise !== undefined && (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunrise className="w-5 h-5 text-amber-300" />
            <p className="text-white/70 text-sm">Sunrise</p>
          </div>
          <p className="text-2xl font-bold text-white">{formatTime(sunrise)}</p>
        </div>
      )}

      {sunset !== undefined && (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunset className="w-5 h-5 text-orange-300" />
            <p className="text-white/70 text-sm">Sunset</p>
          </div>
          <p className="text-2xl font-bold text-white">{formatTime(sunset)}</p>
        </div>
      )}
    </div>
  );
}
