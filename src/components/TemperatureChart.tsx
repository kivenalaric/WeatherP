import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { HourlyForecast } from '../types';

interface TemperatureChartProps {
  data: HourlyForecast[];
  unit: 'C' | 'F';
}

export function TemperatureChart({ data, unit }: TemperatureChartProps) {
  const chartData = data.map(d => ({
    hour: d.hour,
    temp: unit === 'F' ? Math.round(d.temp * 9 / 5 + 32) : Math.round(d.temp),
  }));

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl px-2 pt-4 pb-1 mb-4">
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="hour"
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(0,0,0,0.75)',
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontSize: 12,
              padding: '6px 10px',
            }}
            formatter={(val: number) => [`${val}°${unit}`, '']}
            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}
            cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#tempGrad)"
            dot={{ fill: '#38bdf8', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#7dd3fc', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
