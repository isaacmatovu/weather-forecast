import { useQuery } from "@tanstack/react-query";
import { type DailyWeather, type HourlyWeather } from "./types";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const fetchWeather = async () => {
  const res = await axios.get(`/api/v1/weather`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  console.log("weather data:", res.data);
  return res.data;
};

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDateandTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

function formatHour(timeStr: string) {
  return new Date(timeStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export default function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center gap-4">
        <div className="loader" />
        <p>Fetching weather…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center gap-4">
        <p className="text-2xl">⚠️</p>
        <p className="text-sm text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-red-600 text-xl">No data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-950 text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* ── Title ── */}
        <h1 className="font-display text-5xl text-white mb-8">
          Weather Forecast
        </h1>

        {/* ── Overview grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#d8d2c8] divide-y divide-x divide-[#d8d2c8] rounded-lg overflow-hidden">
          {/* Location */}
          <div className="flex justify-center items-center flex-col">
            <p className="text-white text-xl mb-3">Location</p>
            {[
              ["Country", data?.location?.country],
              ["Timezone", data?.location?.timezone],
              ["Lat", data?.location?.lat],
              ["Lon", data?.location?.lon],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex sm:flex-row items-start justify-between "
              >
                <p className="text-stone-400 mr-2 mb-2">{label}</p>
                <p className="text-blue-300">{val}</p>
              </div>
            ))}
          </div>

          {/* Current */}
          <div className="flex justify-center items-center flex-col gap-2 py-3">
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center ">
              <p className="text-white text-xl">Right Now</p>
              <p className="text-gray-500">
                {formatDateandTime(data?.current?.time)}
              </p>
            </div>
            <div className="flex justify-center items-center gap-4">
              <p className="text-3xl text-white">
                {data?.current?.temperature}°C
              </p>
              <p className="text-2xl">
                {data?.current?.temperature > 20
                  ? "☀️"
                  : data?.current?.temperature > 10 &&
                      data?.current?.temperature < 20
                    ? "🌥️"
                    : "🌧️"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <img
                src={data?.current?.icon}
                alt="icon"
                className="w-8 h-8 text-white"
              />
              <p className="text-stone-400">
                Code {data?.current?.condition_code}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex justify-center items-center gap-4">
                <p className="text-stone-400">
                  Wind {data?.current?.wind_speed} m/s
                </p>
                <p className="text-xl">🌪️</p>
              </div>
              <div className="flex justify-center items-center gap-4">
                <p className="text-stone-400">
                  Wind Direction: {data?.current?.wind_direction}
                </p>
                <p className="text-xl">🧭</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hourly ── */}
        <h2 className="text-stone-400 mt-10 mb-3 pb-2 border-b border-[#d8d2c8]">
          HOURLY
        </h2>
        <div className="flex gap-1 overflow-x-auto bg-[#d8d2c8] border border-[#d8d2c8]">
          {data?.hourly?.map((h: HourlyWeather, i: number) => (
            <div
              key={i}
              className="bg-[#f5f2ed] min-w-28 shrink-0 flex flex-col gap-1 p-3"
            >
              <p className="font-mono-dm text-[15px] text-stone-400">
                {formatHour(h.time)}
              </p>
              <img src={h.icon} alt="icon" className="w-7 h-7 my-1" />
              <div className="flex justify-center items-center gap-2 text-xl text-[#1a1a1a]">
                <p>{h.temperature}°C</p>
                <p className="text-2xl">🌡️</p>
              </div>
              <p>Condition Code:{h.condition_code}</p>
              <p>Clear Atmosphere: {h.feels_like} %</p>
              <p>Wind Gust: {h.wind_gust} m/s</p>
              <div className="font-mono-dm text-[10px] text-stone-400 leading-relaxed">
                {[
                  ["Wind Speed", `${h.wind_speed} m/s`],
                  ["Humidity", `${h.humidity}%`],
                  ["UV Index", h.uv_index],
                  ["Precipitation", `${h.precipitation_probability}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-1">
                    <p className="text-gray-700">{label}:</p>
                    <p className="text-gray-700">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Daily ── */}
        <h2 className="text-[10px] text-stone-400 mt-10 mb-3 pb-2 border-b border-[#d8d2c8]">
          7-Day
        </h2>
        <div className="divide-y divide-[#d8d2c8]">
          {data?.daily?.map((d: DailyWeather, i: number) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-3 items-center gap-3 py-2.5"
            >
              <div className="text-[13px] font-medium flex flex-col sm:flex-row gap-5">
                <div>
                  <p className="text-gray-400">Date:</p>
                  <p className="text-white">{formatDay(d.date)}</p>
                </div>
                <img src={d.icon} alt="" className="w-6 h-6" />
              </div>

              <div className="font-mono-dm text-[12px]">
                {[
                  ["Min", `${d.temp_min}°C`],
                  ["Max", `${d.temp_max}°C`],
                  ["Precipitation", `${d.precipitation_sum} mm`],
                  ["Condition_code", d.condition_code],
                  ["Wind_max", d.wind_max],
                  ["Precipitation_probability", d.precipitation_probability],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-2">
                    <p className="text-stone-400">{label}:</p>
                    <p className="text-white">{val}</p>
                  </div>
                ))}
              </div>
              <div className="font-mono-dm text-[10px] text-stone-400 text-right leading-relaxed">
                <div className="text-sm flex flex-col sm:flex-row items-center gap-1 justify-end">
                  {formatDateandTime(d.sunrise)}
                  <p className="text-sm">🌅</p>
                </div>
                <div className="text-sm flex flex-col sm:flex-row items-center gap-1 justify-end">
                  {formatDateandTime(d.sunset)}
                  <p className="text-sm">🌇</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="mt-12 pt-4 border-t border-[#d8d2c8] flex gap-6">
          <p className="text-[10px] text-stone-300 ">
            Country: {data?.client_geo?.country}
          </p>
          <p className="text-[10px] text-stone-300">
            IP: {data?.client_geo?.ip_hash}
          </p>
        </div>
      </div>
    </div>
  );
}
