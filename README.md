# WeatherP

A responsive, feature-rich weather application built with React, TypeScript, and Vite. WeatherP provides real-time weather data, multi-day forecasts, and a polished UI with weather-condition-driven visuals and animations.

**Live demo:** https://weather-p-vert.vercel.app

---

## Features

### Core Weather Data
- **Current conditions** — temperature, humidity, atmospheric pressure, wind speed and Beaufort-scale description
- **Hourly forecast** — next 4 time slots (3-hour intervals from the OpenWeatherMap API), with real weather icons and a smooth temperature area chart
- **5-day forecast** — daily min/max temperatures, weather icons, and condition labels
- **Feels Like, Sunrise & Sunset** — pulled directly from the API with no extra calls

### Search & Location
- **GPS location** — on first launch, a clean in-app prompt (no browser `confirm()` dialog) asks to use your device location
- **City search** — search any city worldwide with a debounced autocomplete dropdown (300 ms delay, up to 5 results)
- **Proximity-aware suggestions** — results are sorted by Haversine distance from your GPS coordinates, so the nearest match always appears first with a distance badge
- **Search history** — last 5 searches are saved to `localStorage` and shown as quick-access items when you focus the search bar; individual entries can be removed

### UI & UX
- **Responsive layout** — single-column on mobile, two-column (weather card | forecast + stats) on desktop (≥ 768 px)
- **°C / °F toggle** — switch units instantly; preference is persisted to `localStorage`
- **Light / dark theme** — persisted to `localStorage`
- **Loading skeleton** — animated placeholder that mirrors the full two-column layout while data loads
- **Weather-driven backgrounds** — different Unsplash background photos for clear vs stormy weather, with a sky-blue gradient overlay
- **Weather effects** — subtle ambient animations driven by current conditions:
  - ☀️ Clear day → pulsing golden sun glow
  - 🌙 Night → twinkling stars
  - 🌨 Snow → falling snowflakes
  - ⛈ Rain / Thunderstorm → animated rain streaks + lightning flash on the main card

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI (via shadcn/ui) |
| Charts | Recharts |
| Icons | Lucide React |
| Weather API | OpenWeatherMap (current weather, 5-day forecast, geocoding) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── AdditionalInfo.tsx     # Feels Like, Wind, Sunrise, Sunset grid
│   ├── Header.tsx             # City name, theme toggle, °C/°F toggle
│   ├── HourlyForecast.tsx     # 4-slot hourly cards with OWM icons
│   ├── LoadingSkeleton.tsx    # Animated pulse skeleton matching full layout
│   ├── MainWeatherCard.tsx    # Hero card with temp, conditions, rain/storm animations
│   ├── SearchBar.tsx          # Debounced autocomplete + search history
│   ├── TemperatureChart.tsx   # Recharts area chart of hourly temps
│   ├── WeatherEffects.tsx     # Ambient background animations (snow, stars, sun)
│   ├── WeatherTabs.tsx        # Today / Next 5 days tab switcher
│   └── WeeklyForcast.tsx      # 5-day forecast rows with icons and min/max
├── hooks/
│   └── useWeather.ts          # All data fetching, state, and Haversine sorting
├── types.tsx                  # Shared TypeScript interfaces
├── App.tsx                    # Root layout, unit state, routing between views
├── App.css                    # Main div layout
└── index.css                  # Global styles, CSS variables, animation keyframes
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn (or npm)
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier is sufficient)

### Installation

```bash
git clone https://github.com/kivenalaric/WeatherP.git
cd WeatherP
yarn install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org
```

### Development

```bash
yarn dev
```

### Production Build

```bash
yarn build
yarn preview
```

---

## API Endpoints Used

| Endpoint | Purpose |
|---|---|
| `/data/2.5/weather` | Current weather by coordinates |
| `/data/2.5/forecast` | 5-day / 3-hour forecast by coordinates |
| `/geo/1.0/direct` | City name → coordinates (search autocomplete) |

All requests use `units=metric`. The °F conversion happens in the display layer so only one set of API calls is needed.

---

## Key Implementation Details

**Proximity-sorted search** — `useWeather` stores the user's GPS coordinates when location permission is granted. Every autocomplete result has a Haversine distance calculated against those coordinates and results are sorted ascending before being returned. If location was denied, results fall back to the API's default relevance order.

**Min/max daily temps** — the 5-day forecast endpoint returns data in 3-hour intervals. The hook groups these by calendar day, computes `Math.min` / `Math.max` across all intervals in each day, and uses the midpoint entry for the representative icon and condition.

**Unit persistence** — the selected unit (`C`/`F`) and theme (`light`/`dark`) are both stored in `localStorage` under the keys `weatherp_unit` and `theme` respectively, so preferences survive page reloads.

**Weather effects** — `WeatherEffects.tsx` renders a `fixed inset-0 pointer-events-none` overlay containing CSS-animated elements. Snowflakes use staggered `animationDelay` and `animationDuration` to avoid uniformity. Stars use an opacity/scale pulse. The sun glow is a single radial-gradient div animated with `transform: scale`.

---

## Author

**Kiven Alaric** — [kivenalaric2@gmail.com](mailto:kivenalaric2@gmail.com)

Portfolio: [alarics-portfolio](https://alarics-portfolio.vercel.app)
