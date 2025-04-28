import React, { useEffect } from 'react';
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
  const [initialLoad, setInitialLoad] = React.useState(true);
  const { 
    weatherData, 
    city, 
    loading,
    forecastData,
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

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      const userConfirmed = confirm('Allow location access for weather?');
      if (userConfirmed) {
        getLocationWeather();
      } else {
        searchCity('Yaoundé');
      }
    }
  }, [initialLoad, getLocationWeather, searchCity]);

  // const isStormy = React.useMemo(() => {
  //   if (!weatherData) return false;
  //   const stormyConditions = ['Rain', 'Thunderstorm', 'Drizzle', 'Snow'];
  //   return stormyConditions.some(condition => 
  //     weatherData.weather[0].main.toLowerCase().includes(condition.toLowerCase())
  //   );
  // }, [weatherData]);
  const isStormy = React.useMemo(() => {
    if (!weatherData) return false;
    const description = getWindDescription(weatherData.wind.speed);
    return description === 'Storm' || description === 'Strong Gale' || description === 'Hurricane Force';
  }, [weatherData]);

  const weatherBackgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, var(--gradient-start), var(--gradient-end)), url(${
      isStormy 
        ? 'https://images.unsplash.com/photo-1594156596782-656c93e4d504?auto=format&fit=crop&w=1920'
        : 'https://images.unsplash.com/photo-1623846736569-1d90cba76d65?auto=format&fit=crop&w=1920'
    })`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const mainCardStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${
      isStormy 
        ? 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200'
        : 'https://images.unsplash.com/photo-1623846736569-1d90cba76d65?auto=format&fit=crop&w=1200'
    })`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Initializing weather app...</div>
      </div>
    );
  }

  return (
    <div
      id="main-div"
      className="min-h-screen transition-all duration-300"
      style={weatherBackgroundStyle}
    >
      <div className="max-w-md mx-auto px-4 py-6">
        <Header city={city} region={weatherData.sys?.country || "Cameroon"} />

        <SearchBar onSearch={searchCity} />

        <MainWeatherCard
          data={weatherData}
          isStormy={isStormy}
          temperature={`${Math.round(weatherData.main.temp)}°C`}
          // windSpeed={`${Math.round(weatherData.wind.speed * 3.6)} km/h`}
          humidity={`${weatherData.main.humidity}%`}
          backgroundStyle={mainCardStyle}
          pressure={`${weatherData.main.pressure} hPa`}
          windSpeed={`${Math.round(weatherData.wind.speed * 3.6)} km/h`}
          windDescription={getWindDescription(weatherData.wind.speed)}
        />
        
        <WeatherTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "today" ? <HourlyForecast /> : <WeeklyForecast forecastData={forecastData} />}

        <AdditionalInfo
          feelsLike={`${Math.round(weatherData.main.feels_like)}°C`}
          windSpeed={`${Math.round(weatherData.wind.speed * 3.6)} km/h`}
        />
      </div>
      <footer className="text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} Weather App. All rights reserved.
      </footer>
    </div>
  );
}

export default App;