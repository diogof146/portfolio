import PortoClock from "@/components/PortoClock"
import PortoMap from "@/components/PortoMap"
import WeatherIcon from "@/components/WeatherIcon"
import { places } from "@/content/personal"
import { getWeather } from "@/lib/weather"
import s from "./Porto.module.css"

function describe(text, weather, kind) {
  if (weather === null) return text.map + "."
  let now = weather.temperature + " °C"
  if (kind) now = now + ", " + kind.toLowerCase()
  return text.map + ". " + text.now + ": " + now + "."
}

function Reading({ weather, kind }) {
  return (
    <div className={s.weather}>
      <WeatherIcon kind={weather.kind} isDay={weather.isDay} size={40} strokeWidth={1.4} aria-hidden="true" />
      <b>{weather.temperature + "°C"}</b>
      <span className="mono muted">{kind}</span>
    </div>
  )
}

export default async function Porto({ text }) {
  const weather = await getWeather()
  let kind = ""
  if (weather !== null && weather.kind !== null) kind = text.kinds[weather.kind]

  return (
    <section>
      <div className={s.row} data-reveal="up">
        <div>
          <h2 className="mono muted">{text.title}</h2>
          <div className={s.time}>
            <PortoClock />
          </div>
        </div>
        {weather && <Reading weather={weather} kind={kind} />}
      </div>
      <PortoMap weather={weather} kind={kind} places={places} label={describe(text, weather, kind)} className={s.map} />
    </section>
  )
}
