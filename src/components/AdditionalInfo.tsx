import { Thermometer, Wind } from 'lucide-react';

interface AdditionalInfoProps {
  feelsLike: string;
  windSpeed: string;
}

export function AdditionalInfo({ feelsLike, windSpeed }: AdditionalInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="w-5 h-5 text-white" />
          <p className="text-white/80">Feels Like</p>
        </div>
        <p className="text-2xl font-bold text-white">{feelsLike}</p>
      </div>
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Wind className="w-5 h-5 text-white" />
          <p className="text-white/80">Wind Speed</p>
        </div>
        <p className="text-2xl font-bold text-white">{windSpeed}</p>
      </div>
    </div>
  );
}