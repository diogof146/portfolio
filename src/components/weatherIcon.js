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

export function weatherIcon(kind, isDay) {
  if (!isDay && NIGHT[kind]) return NIGHT[kind]
  if (DAY[kind]) return DAY[kind]
  return Cloud
}
