# Weather Forecast App

A responsive weather dashboard built with React and TypeScript. Displays current conditions, hourly forecasts, and a 7-day outlook for the user's location — fetched from a custom weather API.

**Live Demo:** (https://weather-forecastertl.netlify.app/)

---

## Features

- Current weather — temperature, wind speed & direction, condition code
- Hourly forecast — humidity, UV index, precipitation probability, feels-like, wind gust
- 7-day daily forecast — min/max temps, precipitation, sunrise & sunset times
- Location detection via API (country, timezone, coordinates)
- Responsive layout, works on mobile and desktop

---

## Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Framework     | React 18 + TypeScript                |
| Build Tool    | Vite                                 |
| Styling       | Tailwind CSS                         |
| Data Fetching | TanStack Query (React Query) + Axios |
| API           | Custom weather REST API              |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root of the project:

   ```bash
   cp .env.example .env
   ```

   Then fill in your values (see [Environment Variables](#environment-variables) below).

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
VITE_API_URL=https://your-weather-api-base-url.com
VITE_API_KEY=your_api_key_here
```

| Variable       | Description                                |
| -------------- | ------------------------------------------ |
| `VITE_API_URL` | Base URL of the weather API                |
| `VITE_API_KEY` | Bearer token used to authenticate requests |

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## API Reference

The app makes a single authenticated GET request:

```
GET /api/v1/weather
Authorization: Bearer <VITE_API_KEY>
```

### Response Shape

```ts
{
  location: {
    lat: number;
    lon: number;
    timezone: string;
    requested_lat: number;
    requested_lon: number;
    country: string;
  }
  current: {
    time: string; // ISO datetime
    temperature: number; // °C
    wind_speed: number; // m/s
    wind_direction: number; // degrees
    condition_code: number;
    icon: string; // URL
  }
  hourly: Array<{
    time: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_gust: number;
    uv_index: number;
    precipitation_probability: number;
    condition_code: number;
    icon: string;
  }>;
  daily: Array<{
    date: string;
    temp_min: number;
    temp_max: number;
    precipitation_sum: number;
    precipitation_probability: number;
    wind_max: number;
    sunrise: string;
    sunset: string;
    condition_code: number;
    icon: string;
  }>;
  client_geo: {
    country: string;
    ip_hash: string;
  }
}
```

---

## Project Structure

```
src/
├── App.tsx          # Main component — layout, data fetching, rendering
├── index.css          # Global styles (loader animation etc.)
├── types.ts         # TypeScript interfaces for HourlyWeather, DailyWeather
└── main.tsx         # React entry point
```

---

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

---

## Deployment

This project is a static frontend and can be deployed to any static host.

**Netlify / Vercel**

1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add your environment variables in the platform's dashboard

**Environment variables must be set in your hosting platform's dashboard — not just in your local `.env` file.**
