import React from 'react';
import { MapPin } from 'lucide-react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { MainWeatherCard } from './components/MainWeatherCard';
import { WeatherTabs } from './components/WeatherTabs';
import { HourlyForecast } from './components/HourlyForecast';
import { WeeklyForecast } from './components/WeeklyForcast';
import { AdditionalInfo } from './components/AdditionalInfo';
// import { WeatherCard } from './components/WeatherCard';
import { useWeather } from './hooks/useWeather';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = React.useState('today');
  const {
    weatherData,
    city,
    loading,
    forecastData,
    hourlyForecast,
    error,
    getLocationWeather,
    searchCity
  } = useWeather();

  const getWindDescription = (speedMps: number) => {
    const speedKmh = speedMps * 3.6;
    
    if (speedKmh < 1) return 'Calm';
    if (speedKmh < 6) return 'Light Air';
    if (speedKmh < 12) return 'Light Breeze';
    if (speedKmh < 20) return 'Gentle Breeze';
    if (speedKmh < 29) return 'Moderate Breeze';
    if (speedKmh < 39) return 'Fresh Breeze';
    if (speedKmh < 50) return 'Strong Breeze';
    if (speedKmh < 62) return 'Near Gale';
    if (speedKmh < 75) return 'Gale';
    if (speedKmh < 89) return 'Strong Gale';
    if (speedKmh < 103) return 'Storm';
    return 'Hurricane Force';
  };

  const StormyWeather = weatherData?.weather?.[0]?.main === 'Thunderstorm' || weatherData?.weather?.[0]?.main === 'Rain';
  const isStormy = React.useMemo(() => {
    if (!weatherData) return false;
    const description = getWindDescription(weatherData.wind.speed);
    return description === 'Storm' || description === 'Strong Gale' || description === 'Hurricane Force';
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

  if (!weatherData && !loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        {/* Decorative blurred blobs for depth */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-3xl opacity-40" style={{ background: 'rgba(14, 165, 233, 0.45)' }} />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: 'rgba(6, 182, 212, 0.4)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ background: 'rgba(255,255,255,0.3)' }} />

        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-10 mx-4 max-w-sm w-full text-center border border-white/20 shadow-2xl">
          {/* Icon ring */}
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
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: 'rgba(14, 165, 233, 0.45)' }} />
        <div className="text-white text-xl font-medium tracking-wide">Loading weather data...</div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div
      id="main-div"
      className="min-h-screen transition-all duration-300"
      style={weatherBackgroundStyle}
    >
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6">
        <Header city={city} region={weatherData.sys?.country || "Cameroon"} />

        <SearchBar onSearch={searchCity} />

        {/* Mobile: single column. Desktop (md+): two column */}
        <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
          {/* Left column: main weather card */}
          <div>
            <MainWeatherCard
              data={weatherData}
              isStormy={isStormy}
              temperature={`${Math.round(weatherData.main.temp)}°C`}
              humidity={`${weatherData.main.humidity}%`}
              backgroundStyle={mainCardStyle}
              pressure={`${weatherData.main.pressure} hPa`}
              windSpeed={`${Math.round(weatherData.wind.speed * 3.6)} km/h`}
              windDescription={getWindDescription(weatherData.wind.speed)}
            />
          </div>

          {/* Right column: forecast + stats */}
          <div>
            <WeatherTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "today"
              ? <HourlyForecast hourlyData={[
                  { hour: 'Now', temp: weatherData.main.temp, icon: weatherData.weather[0].icon, description: weatherData.weather[0].main },
                  ...hourlyForecast.slice(0, 3),
                ]} />
              : <WeeklyForecast forecastData={forecastData} />
            }

            <AdditionalInfo
              feelsLike={`${Math.round(weatherData.main.feels_like)}°C`}
              windSpeed={`${Math.round(weatherData.wind.speed * 3.6)} km/h`}
            />
          </div>
        </div>
      </div>
      <footer className="text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} Weather App. All rights reserved.
      </footer>
    </div>
  );
}

export default App;