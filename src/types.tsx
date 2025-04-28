export interface WeatherData {
      name: string;
      main: {
        temp: number;
        humidity: number;
        feels_like: number;
        pressure: number;
      };
      weather: {
        icon: string;
        id: number;
        main: string;
        description: string;
      }[];
      wind: {
        speed: number;
      };
      sys?: {
        country: string;
      };
    }

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

export interface HourlyForecast {
  hour: string;
  temp: number;
  icon: string;
  description: string;
}

export interface ForecastDay {
  dt: number;
  temp: {
    day: number;
  };
  weather: {
    id: number;
    main: string;
  }[];
}

export interface ForecastApiResponse {
    list: Array<{
      dt: number;
      main: {
        temp: number;
      };
      weather: Array<{
        id: number;
        main: string;
      }>;
    }>;
  }
