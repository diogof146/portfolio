import PortoClock from "@/components/PortoClock"
import { reading, riff } from "@/content/personal"
import text from "@/content/lang/en.json"
import { CLEAR_NIGHT, WEATHER_ART } from "./ascii"
import s from "./terminal.module.css"

function artFor(weather) {
  if (!weather || !WEATHER_ART[weather.kind]) return WEATHER_ART.overcast
  if (weather.kind === "clear" && !weather.isDay) return CLEAR_NIGHT
  return WEATHER_ART[weather.kind]
}

function Reading({ manga }) {
  if (!manga) return reading.title
  return (
    <a href={manga.url} target="_blank" rel="noreferrer">
      {reading.title}
    </a>
  )
}

export default function Wttr({ live }) {
  let weather = null
  let manga = null
  if (live) {
    weather = live.weather
    manga = live.manga
  }

  let kind = "…"
  let temperature = ""
  if (weather) {
    if (weather.kind) kind = text.about.porto.kinds[weather.kind]
    temperature = weather.temperature + " °C"
  }

  return (
    <div className={s.wttr}>
      <p className={s.dim}>Weather report: Porto, Portugal</p>
      <div className={s.report}>
        <pre className={s.weatherArt} aria-hidden="true">
          {artFor(weather).join("\n")}
        </pre>
        <div>
          <p>{kind}</p>
          <p className={s.amber}>{temperature}</p>
          <p className={s.clock}>
            <PortoClock />
          </p>
        </div>
      </div>
      <dl className={s.extras}>
        <div className={s.row}>
          <dt className={s.cyan}>reading</dt>
          <dd>
            <Reading manga={manga} />
          </dd>
        </div>
        <div className={s.row}>
          <dt className={s.cyan}>learning</dt>
          <dd>
            {riff.song} <span className={s.dim}>{"· " + riff.artist}</span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
