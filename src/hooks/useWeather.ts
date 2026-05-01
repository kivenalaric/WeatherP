/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { WeatherData, ForecastDay, HourlyForecast as HourlyForecastItem, GeoSuggestion } from '../types';

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

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [city, setCity] = useState('Yaoundé');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

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

      // Next 4 three-hour slots for hourly forecast
      const hourly: HourlyForecastItem[] = forecastJson.list.slice(0, 4).map((item: any) => ({
        hour: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].main,
      }));
      setHourlyForecast(hourly);

      // Group forecast entries by day, compute min/max per day
      const dayGroups: Record<string, any[]> = {};
      forecastJson.list.forEach((item: any) => {
        const key = new Date(item.dt * 1000).toDateString();
        if (!dayGroups[key]) dayGroups[key] = [];
        dayGroups[key].push(item);
      });

      const dailyForecast: ForecastDay[] = Object.values(dayGroups)
        .slice(0, 5)
        .map((items: any[]) => {
          const temps = items.map((i: any) => i.main.temp);
          const mid = items[Math.floor(items.length / 2)];
          return {
            dt: mid.dt,
            temp: {
              day: mid.main.temp,
              min: Math.min(...temps),
              max: Math.max(...temps),
            },
            weather: mid.weather,
          };
        });

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
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        await fetchWeather(latitude, longitude);
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

  const getSuggestions = useCallback(async (query: string): Promise<GeoSuggestion[]> => {
    if (query.trim().length < 2) return [];
    try {
      const res = await fetch(
        `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      if (!res.ok) return [];
      const data: Array<{ name: string; lat: number; lon: number; country: string; state?: string }> = await res.json();

      const suggestions: GeoSuggestion[] = data.map(item => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
        distanceKm: userCoords
          ? haversineKm(userCoords.lat, userCoords.lon, item.lat, item.lon)
          : undefined,
      }));

      if (userCoords) {
        suggestions.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
      }

      return suggestions;
    } catch {
      return [];
    }
  }, [userCoords]);

  return {
    weatherData,
    forecastData,
    hourlyForecast,
    city,
    loading,
    error,
    getLocationWeather,
    searchCity,
    getSuggestions,
  };
};