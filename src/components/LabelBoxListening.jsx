import { cache } from "react"
import { getMonthlyTrack, getNowPlaying } from "@/lib/spotify"
import Marquee from "@/components/Marquee"
import s from "./LabelBox.module.css"

export const getListening = cache(async function () {
  const playing = await getNowPlaying()
  if (playing !== null) {
    return { playing: true, track: playing }
  }
  const monthly = await getMonthlyTrack()
  if (monthly !== null) {
    return { playing: false, track: monthly }
  }
  return null
})

export default async function LabelBoxListening({ text }) {
  const listening = await getListening()
  let label = text.onRepeat
  let track = null
  if (listening !== null) {
    track = listening.track
    if (listening.playing) label = text.listening
  }

  if (track === null) {
    return (
      <div className={"mono " + s.cell}>
        <span>{text.onRepeat}</span>
        <b>…</b>
      </div>
    )
  }

  return (
    <a className={"mono " + s.cell + " " + s.link} href={track.url} target="_blank" rel="noreferrer" data-cursor="Spotify">
      <span>{label}</span>
      <b>
        <Marquee>{track.title + " · " + track.artist}</Marquee>
      </b>
    </a>
  )
}
