import Image from "next/image"
import s from "./terminal.module.css"

function Bar({ hours, most, width }) {
  const filled = Math.max(1, Math.round((hours / most) * width))
  return (
    <span className={s.meter} aria-hidden="true">
      <span className={s.cyan}>{"█".repeat(filled)}</span>
      <span className={s.faint}>{"░".repeat(Math.max(0, width - filled))}</span>
    </span>
  )
}

function GameRow({ game, label, most, big }) {
  let width = 18
  if (big) width = 36

  return (
    <a className={s.steamGame} href={game.url} target="_blank" rel="noreferrer">
      {big && <Image src={game.image} alt="" width={150} height={70} />}
      <span className={s.steamText}>
        <span className={s.green}>{label}</span>
        <b>{game.title}</b>
        {game.hours !== null && (
          <span className={s.steamHours}>
            <Bar hours={game.hours} most={most} width={width} />{" "}
            <span className={s.amber}>{game.hours.toLocaleString("en") + " h"}</span>
          </span>
        )}
      </span>
    </a>
  )
}

function rowsOf(live) {
  const rows = []
  if (!live) return rows
  if (live.mostPlayed) rows.push({ game: live.mostPlayed, label: "most played" })
  if (live.recent) {
    let label = "last played"
    if (live.recent.playing) label = "playing now"
    rows.push({ game: live.recent.game, label: label })
  }
  return rows
}

export default function Steam({ big, live }) {
  const rows = rowsOf(live)
  let most = 1
  for (const row of rows) {
    if (row.game.hours !== null) most = Math.max(most, row.game.hours)
  }

  let empty = "connecting to steam…"
  if (live) empty = "steam is quiet right now"

  return (
    <div className={s.steam}>
      <p className={s.dim}>
        ┌─ <span className={s.cyan}>steam</span> ─ library ─────────
      </p>
      {rows.map(function (row) {
        return <GameRow key={row.label} game={row.game} label={row.label} most={most} big={big} />
      })}
      {rows.length === 0 && <p className={s.dim}>{empty}</p>}
    </div>
  )
}
