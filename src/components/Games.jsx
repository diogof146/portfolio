import Print from "@/components/Print"
import { localeOf } from "@/content/lang/languages"
import { getLastPlayedGame, getMostPlayedGame } from "@/lib/steam"
import s from "./Games.module.css"

function label(name, game, lang) {
  if (game.hours === null) return name
  return name + " · " + new Intl.NumberFormat(localeOf(lang)).format(game.hours) + " h"
}

function GameCard({ game, label }) {
  return (
    <a className={s.card} href={game.url} target="_blank" rel="noreferrer" data-reveal="up" data-cursor="Steam">
      <div className={s.picture}>
        <Print src={game.image} alt={game.title} sizes="(min-width: 768px) 46vw, 90vw" />
      </div>
      <span className="mono muted">{label}</span>
      <b>{game.title}</b>
    </a>
  )
}

export default async function Games({ lang, text }) {
  const mostPlayed = await getMostPlayedGame()
  const lastPlayed = await getLastPlayedGame()

  return (
    <section>
      <div className="section-head">
        <h2 className="display section-title" data-reveal="title">
          {text.title}
        </h2>
        <p className="body-text" data-reveal="fade">
          {text.intro}
        </p>
      </div>

      <div className={s.games}>
        {mostPlayed && <GameCard game={mostPlayed} label={label(text.mostPlayed, mostPlayed, lang)} />}
        {lastPlayed && <GameCard game={lastPlayed} label={label(text.lastPlayed, lastPlayed, lang)} />}
        {!mostPlayed && !lastPlayed && <p className="body-text">{text.unavailable}</p>}
      </div>
    </section>
  )
}
