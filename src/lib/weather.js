import { cacheLife } from "next/cache";

const FORECAST = "https://api.open-meteo.com/v1/forecast?latitude=41.15&longitude=-8.61&current=temperature_2m,weather_code,is_day,wind_direction_10m";

const KINDS = [
  { kind: "clear", codes: [0] },
  { kind: "partlyCloudy", codes: [1, 2] },
  { kind: "overcast", codes: [3] },
  { kind: "fog", codes: [45, 48] },
  { kind: "drizzle", codes: [51, 53, 55, 56, 57] },
  { kind: "rain", codes: [61, 63, 65, 66, 67, 80, 81, 82] },
  { kind: "snow", codes: [71, 73, 75, 77, 85, 86] },
  { kind: "thunder", codes: [95, 96, 99] },
];

function kindOf(code) {
  for (const entry of KINDS) {
    if (entry.codes.includes(code)) {
      return entry.kind;
    }
  }
  return null;
}

async function fetchWeather() {
  "use cache";
  cacheLife({ revalidate: 900 });
  const res = await fetch(FORECAST);
  if (!res.ok) {
    throw new Error("Open-Meteo: " + res.status);
  }
  const data = await res.json();
  return {
    temperature: Math.round(data.current.temperature_2m),
    kind: kindOf(data.current.weather_code),
    isDay: data.current.is_day === 1,
    windFrom: data.current.wind_direction_10m,
  };
}

export async function getWeather() {
  try {
    return await fetchWeather();
  } catch (error) {
    console.error(error);
    return null;
  }
}
