import { Suspense } from "react"
import { BookOpen, Gamepad2, Guitar, Music } from "lucide-react"
import Print from "@/components/Print"
import { getListening } from "@/components/LabelBoxListening"
import { getLastPlayedGame, getPlayingNow } from "@/lib/steam"
import { getManga } from "@/lib/anilist"
import { reading, riff } from "@/content/personal"
import s from "./RightNow.module.css"

function Cell({ href, external = false, cursor, image, Icon, label, title, sub }) {
  let art = <Icon aria-hidden="true" />
  if (image) art = <Print src={image} sizes="64px" />

  const content = (
    <>
      <span className={s.art}>{art}</span>
      <span className={s.text}>
        <span className="mono">{label}</span>
        <b>{title}</b>
        {sub && <span className={s.sub}>{sub}</span>}
      </span>
    </>
  )

  if (!href) return <div className={s.item}>{content}</div>

  if (external) {
    return (
      <a className={s.item} href={href} target="_blank" rel="noreferrer" data-cursor={cursor}>
        {content}
      </a>
    )
  }

  return (
    <a className={s.item} href={href} data-cursor={cursor}>
      {content}
    </a>
  )
}

async function Listening({ text }) {
  const listening = await getListening()
  if (listening === null) return <Cell Icon={Music} label={text.onRepeat} title="…" />

  let label = text.onRepeat
  if (listening.playing) label = text.listening
  const track = listening.track

  return (
    <Cell href={track.url} external cursor="Spotify" image={track.image} Icon={Music} label={label} title={track.title} sub={track.artist} />
  )
}

async function Gaming({ text }) {
  let game = await getPlayingNow()
  let label = text.playing
  if (game === null) {
    game = await getLastPlayedGame()
    label = text.played
  }
  if (game === null) return <Cell Icon={Gamepad2} label={text.played} title="…" />

  return <Cell href={game.url} external cursor="Steam" image={game.image} Icon={Gamepad2} label={label} title={game.title} />
}

export default async function RightNow({ text, learningHref }) {
  const manga = await getManga(reading.anilistId)

  let mangaUrl = null
  let mangaCover = null
  if (manga !== null) {
    mangaUrl = manga.url
    mangaCover = manga.cover
  }

  return (
    <section>
      <div className="section-head">
        <h2 className="display section-title" data-reveal="title">
          {text.title}
        </h2>
      </div>

      <div className={s.strip} data-reveal="up">
        <Suspense fallback={<Cell Icon={Music} label={text.onRepeat} title="…" />}>
          <Listening text={text} />
        </Suspense>
        <Suspense fallback={<Cell Icon={Gamepad2} label={text.played} title="…" />}>
          <Gaming text={text} />
        </Suspense>
        <Cell href={mangaUrl} external cursor="AniList" image={mangaCover} Icon={BookOpen} label={text.reading} title={reading.title} />
        <Cell href={learningHref} cursor={text.listen} Icon={Guitar} label={text.learning} title={riff.song} sub={riff.artist} />
      </div>
    </section>
  )
}
