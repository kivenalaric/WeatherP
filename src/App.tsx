import React from 'react';
import { MapPin } from 'lucide-react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { MainWeatherCard } from './components/MainWeatherCard';
import { WeatherTabs } from './components/WeatherTabs';
import { HourlyForecast } from './components/HourlyForecast';
import { WeeklyForecast } from './components/WeeklyForcast';
import { AdditionalInfo } from './components/AdditionalInfo';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { TemperatureChart } from './components/TemperatureChart';
import { WeatherEffects } from './components/WeatherEffects';
import { useWeather } from './hooks/useWeather';
import './App.css';

function toTemp(celsius: number, unit: 'C' | 'F'): string {
  return unit === 'F'
    ? `${Math.round(celsius * 9 / 5 + 32)}°F`
    : `${Math.round(celsius)}°C`;
}

function App() {
  const [activeTab, setActiveTab] = React.useState('today');
  const [unit, setUnit] = React.useState<'C' | 'F'>(() =>
    (localStorage.getItem('weatherp_unit') as 'C' | 'F') || 'C'
  );

  const {
    weatherData,
    city,
    loading,
    forecastData,
    hourlyForecast,
    error,
    getLocationWeather,
    searchCity,
    getSuggestions,
  } = useWeather();

  const toggleUnit = () => {
    const next = unit === 'C' ? 'F' : 'C';
    setUnit(next);
    localStorage.setItem('weatherp_unit', next);
  };

  const getWindDescription = (speedMps: number) => {
    const kmh = speedMps * 3.6;
    if (kmh < 1) return 'Calm';
    if (kmh < 6) return 'Light Air';
    if (kmh < 12) return 'Light Breeze';
    if (kmh < 20) return 'Gentle Breeze';
    if (kmh < 29) return 'Moderate Breeze';
    if (kmh < 39) return 'Fresh Breeze';
    if (kmh < 50) return 'Strong Breeze';
    if (kmh < 62) return 'Near Gale';
    if (kmh < 75) return 'Gale';
    if (kmh < 89) return 'Strong Gale';
    if (kmh < 103) return 'Storm';
    return 'Hurricane Force';
  };

  const StormyWeather = weatherData?.weather?.[0]?.main === 'Thunderstorm' || weatherData?.weather?.[0]?.main === 'Rain';
  const isStormy = React.useMemo(() => {
    if (!weatherData) return false;
    const d = getWindDescription(weatherData.wind.speed);
    return d === 'Storm' || d === 'Strong Gale' || d === 'Hurricane Force';
  }, [weatherData]);

  const weatherBackgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, var(--gradient-start), var(--gradient-end)), url(${
      StormyWeather
        ? 'https://images.unsplash.com/photo-1594156596782-656c93e4d504?auto=format&fit=crop&w=1920'
        : 'https://images.unsplash.com/photo-1623846736569-1d90cba76d65?auto=format&fit=crop&w=1920'
    })`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const mainCardStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${
      StormyWeather
        ? 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200'
        : 'https://img.freepik.com/free-photo/natural-landscape-sunflowers-field-sunny-day_2829-9257.jpg?semt=ais_hybrid&w=740'
    })`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // Location permission prompt
  if (!weatherData && !loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-3xl opacity-40" style={{ background: 'rgba(14, 165, 233, 0.45)' }} />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: 'rgba(6, 182, 212, 0.4)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ background: 'rgba(255,255,255,0.3)' }} />

        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-10 mx-4 max-w-sm w-full text-center border border-white/20 shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border border-sky-300/40" style={{ background: 'rgba(14,165,233,0.2)' }}>
            <MapPin className="w-10 h-10 text-sky-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">WeatherP</h1>
          <p className="text-white/55 mb-8 text-sm leading-relaxed">
            Get accurate weather for your location or search any city worldwide.
          </p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={getLocationWeather}
            className="w-full text-white font-semibold py-4 px-6 rounded-2xl mb-3 transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#0284c7' }}
          >
            Use My Location
          </button>
          <button
            onClick={() => searchCity('Yaoundé')}
            className="w-full text-white/80 font-medium py-4 px-6 rounded-2xl border border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
            style={{ backgroundColor: 'transparent' }}
          >
            Use Default City
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: 'rgba(14, 165, 233, 0.45)' }} />
        <LoadingSkeleton />
      </div>
    );
  }

  if (!weatherData) return null;

  const isDaytime = weatherData.weather[0].icon.includes('d');
  const weatherCondition = weatherData.weather[0].main;

  const hourlyDisplay = [
    { hour: 'Now', temp: weatherData.main.temp, icon: weatherData.weather[0].icon, description: weatherData.weather[0].main },
    ...hourlyForecast.slice(0, 3),
  ];

  return (
    <div
      id="main-div"
      className="min-h-screen transition-all duration-300 relative"
      style={weatherBackgroundStyle}
    >
      <WeatherEffects condition={weatherCondition} isDaytime={isDaytime} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 py-6">
        <Header
          city={city}
          region={weatherData.sys?.country || 'Cameroon'}
          unit={unit}
          onToggleUnit={toggleUnit}
        />

        <SearchBar onSearch={searchCity} getSuggestions={getSuggestions} />

        <div className="md:grid md:grid-cols-2 md:gap-8 md:items-stretch">
          {/* Left: main weather card — h-full makes it grow to match right column */}
          <div className="mb-8 md:mb-0">
            <MainWeatherCard
              data={weatherData}
              isStormy={isStormy}
              temperature={toTemp(weatherData.main.temp, unit)}
              humidity={`${weatherData.main.humidity}%`}
              backgroundStyle={mainCardStyle}
              pressure={`${weatherData.main.pressure} hPa`}
              windSpeed={`${Math.round(weatherData.wind.speed * 3.6)} km/h`}
              windDescription={getWindDescription(weatherData.wind.speed)}
            />
          </div>

          {/* Right: forecast + stats */}
          <div>
            <WeatherTabs  activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'today' ? (
              <>
                <TemperatureChart data={hourlyDisplay} unit={unit} />
                <HourlyForecast hourlyData={hourlyDisplay} unit={unit} />
              </>
            ) : (
              <WeeklyForecast forecastData={forecastData} unit={unit} />
            )}

            <AdditionalInfo
              feelsLike={toTemp(weatherData.main.feels_like, unit)}
              windSpeed={`${Math.round(weatherData.wind.speed * 3.6)} km/h`}
              sunrise={weatherData.sys?.sunrise}
              sunset={weatherData.sys?.sunset}
            />
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center text-white/30 text-sm pb-6">
        &copy; {new Date().getFullYear()} WeatherP. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
