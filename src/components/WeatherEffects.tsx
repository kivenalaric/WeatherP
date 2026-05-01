interface WeatherEffectsProps {
  condition: string;
  isDaytime: boolean;
}

export function WeatherEffects({ condition, isDaytime }: WeatherEffectsProps) {
  if (condition === 'Snow') {
    const flakes = Array.from({ length: 28 }, (_, i) => i);
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {flakes.map(i => (
          <div
            key={i}
            className="snow-flake absolute rounded-full bg-white"
            style={{
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              left: `${(i * 3.7) % 100}%`,
              opacity: 0.5 + (i % 4) * 0.1,
              animationDelay: `${(i * 0.42) % 6}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === 'Clear' && isDaytime) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="sun-glow absolute -top-20 left-1/2 w-[480px] h-[480px] rounded-full" />
      </div>
    );
  }

  if (!isDaytime) {
    const stars = Array.from({ length: 40 }, (_, i) => i);
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {stars.map(i => (
          <div
            key={i}
            className="star absolute rounded-full bg-white"
            style={{
              width: `${1 + (i % 2)}px`,
              height: `${1 + (i % 2)}px`,
              top: `${(i * 6.7) % 60}%`,
              left: `${(i * 5.3) % 100}%`,
              animationDelay: `${(i * 0.31) % 3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
