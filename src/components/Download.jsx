import { ArrowDown } from "lucide-react"
import s from "./Download.module.css"

export default function Download({ itchId, platforms, text }) {
  return (
    <details className={s.download}>
      <summary className={"btn " + s.summary}>
        {text.download} <ArrowDown size={15} aria-hidden="true" className={s.arrow} />
      </summary>
      <div className={s.panel}>
        <span className="mono muted">{text.platform}</span>
        <div className={s.options}>
          {platforms.map((platform) => (
            <a key={platform} className={"mono " + s.option} href={"/api/itch?gameId=" + itchId + "&platform=" + platform}>
              {text.platforms[platform]}
            </a>
          ))}
        </div>
      </div>
    </details>
  )
}
