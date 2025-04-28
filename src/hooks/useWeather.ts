/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { WeatherData, ForecastDay } from '../types';

// interface ForecastDay {
//   dt: number;
//   temp: {
//     day: number;
//   };
//   weather: {
//     id: number;
//     main: string;
//   }[];
// }

const YAOUNDE_COORDS = { lat: 3.8689867, lon: 11.5213344 };
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState('Yaoundé');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) throw new Error(`Current weather API error: ${currentResponse.status}`);
      
      const currentData: WeatherData = await currentResponse.json();
      setWeatherData(currentData);
      setCity(currentData.name);

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) throw new Error(`Forecast API error: ${forecastResponse.status}`);
      
      const forecastJson = await forecastResponse.json();
      
      // Process forecast data to get one entry per day
      const dailyForecast = forecastJson.list.reduce((acc: ForecastDay[], item: any) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        if (!acc.find(d => new Date(d.dt * 1000).toDateString() === dateString)) {
          acc.push({
            dt: item.dt,
            temp: { day: item.main.temp },
            weather: item.weather
          });
        }
        return acc;
      }, []).slice(0, 5); 
      // Get next 5 days

      setForecastData(dailyForecast);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      await fetchWeather(YAOUNDE_COORDS.lat, YAOUNDE_COORDS.lon);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const geoResponse = await fetch(
        `${BASE_URL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) throw new Error('Failed to find city');
      
      const geoData = await geoResponse.json();
      if (!geoData.length) throw new Error('City not found');
      
      await fetchWeather(geoData[0].lat, geoData[0].lon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'City search failed');
      await fetchWeather(YAOUNDE_COORDS.lat, YAOUNDE_COORDS.lon);
    }
  }, [fetchWeather]);

  const getLocationWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      await fetchWeather(YAOUNDE_COORDS.lat, YAOUNDE_COORDS.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      async (_err) => {
        setError('Location access denied. Using default location.');
        await fetchWeather(YAOUNDE_COORDS.lat, YAOUNDE_COORDS.lon);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [fetchWeather]);

  return { 
    weatherData, 
    forecastData,
    city, 
    loading, 
    error, 
    getLocationWeather,
    searchCity
  };
};