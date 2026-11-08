import { Cloud, CloudFog, CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, Sun, Zap } from "lucide-react"

const DAY = {
  clear: Sun,
  partlyCloudy: CloudSun,
  overcast: Cloud,
  fog: CloudFog,
  drizzle: CloudRain,
  rain: CloudRain,
  snow: CloudSnow,
  thunder: Zap,
}

const NIGHT = {
  clear: Moon,
  partlyCloudy: CloudMoon,
}

export default function WeatherIcon({ kind, isDay, ...props }) {
  if (!isDay && NIGHT[kind]) {
    const Night = NIGHT[kind]
    return <Night {...props} />
  }
  const Day = DAY[kind] || Cloud
  return <Day {...props} />
}
