"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { CloudMoon, Sun } from "lucide-react";

interface WeatherData {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { main: string; icon: string }[];
  wind: { speed: number };
}

interface ForecastResponse {
  list: WeatherData[];
  city: {
    sunrise: number;
    sunset: number;
  };
}

interface WeatherProps {
  dark: boolean;
}

const Weather = ({ dark }: WeatherProps) => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [sunTime, setSunTime] = useState<ForecastResponse["city"] | null>(null);
  const [now, setNow] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get<ForecastResponse>(
          "https://api.openweathermap.org/data/2.5/forecast?q=Tehran&units=metric&appid=60143f5e0e91ca3fd8c2bda48717cb7d"
        );

        const daily = res.data.list.filter(
          (_: WeatherData, i: number) => i % 8 === 0
        );

        setForecast(daily);
        setNow(res.data.list[0]);
        setSunTime(res.data.city);
      } catch (err) {
        console.error("Weather API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading || !now || !sunTime) {
    return (
      <div
        className={`text-center text-3xl mt-20 ${
          dark ? "text-white" : "text-black"
        }`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-w-75 rounded-3xl p-4 backdrop-blur-sm ${
        dark ? "bg-zinc-800" : "bg-emerald-800"
      }`}
    >
      <div
        className={`p-3 backdrop-blur-sm rounded-3xl ${
          dark ? "bg-zinc-700" : "bg-emerald-500"
        }`}
      >
        <div className="flex flex-row gap-3 m-2">
          <CloudMoon />
          <div className="flex flex-col">
            <p
              className={`text-sm ${
                dark ? "text-gray-400" : "text-gray-200"
              }`}
            >
              {new Date(now.dt * 1000).toLocaleString("en-US", {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <h1 className="font-bold text-xl">
              {now.weather[0].main} {Math.round(now.main.temp)}°C
            </h1>

            <p
              className={`text-sm ${
                dark ? "text-gray-400" : "text-gray-200"
              }`}
            >
              Tehran, Iran
            </p>
          </div>
        </div>

        <div className="flex justify-between p-3 rounded-full bg-zinc-900">
          <p className="text-xs text-zinc-400">
            sunrise :{" "}
            {new Date(sunTime.sunrise * 1000).toLocaleTimeString()}
          </p>

          <p className="text-xs text-zinc-400">
            sunset :{" "}
            {new Date(sunTime.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div
        className={`flex items-center justify-center gap-2 rounded-full mt-3 p-3 ${
          dark ? "bg-zinc-700" : "bg-emerald-500"
        }`}
      >
        <p>{now.weather[0].main}</p>
        <p>{now.main.humidity}%</p>
      </div>

      <div>
        <div className="flex flex-row my-3 justify-between">
          <div className="flex gap-1">
            <p>Humidity:</p>
            <h1>{now.main.humidity}%</h1>
          </div>

          <div className="flex gap-1">
            <p className="text-zinc-400">wind:</p>
            <h1>{Math.round(now.wind.speed * 3.6)} km/h</h1>
          </div>
        </div>

        <div className="flex flex-row gap-1 rounded-full">
          {forecast.map((f, i) => (
            <div
              key={f.dt}
              className={`flex flex-col gap-2 min-w-13 max-w-13 p-3 items-center rounded-full ${
                dark ? "bg-zinc-700" : "bg-emerald-500"
              }`}
            >
              <p>
                {i === 0
                  ? "Today"
                  : new Date(f.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
              </p>

              <Sun />

              <p className="font-semibold">
                {Math.round(f.main.temp)}°C
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
