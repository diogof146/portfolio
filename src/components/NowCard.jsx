import Image from "next/image"
import Marquee from "@/components/Marquee"
import { getListening } from "@/components/LabelBoxListening"
import s from "./NowCard.module.css"

export default async function NowCard({ text }) {
  const listening = await getListening()
  if (listening === null) return null
  const track = listening.track

  let label = text.onRepeat
  if (listening.playing) label = text.listening

  return (
    <a className={s.card} href={track.url} target="_blank" rel="noreferrer" data-cursor="Spotify">
      {track.image && <Image src={track.image} alt="" width={52} height={52} className={s.cover} />}
      <span className={s.text}>
        <span className={"mono muted " + s.label}>
          {label}
          {listening.playing && (
            <span className={s.equaliser} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </span>
        <span className={s.title}>
          <Marquee>{track.title}</Marquee>
        </span>
        <span className={s.artist}>{track.artist}</span>
      </span>
    </a>
  )
}
