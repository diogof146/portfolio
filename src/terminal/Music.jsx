import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import s from "./terminal.module.css"

const BLOCKS = " ▁▂▃▄▅▆▇█"
const FRAME_MS = 42

function drawBars(levels, rows) {
  const lines = []
  for (let row = rows - 1; row >= 0; row--) {
    let line = ""
    for (const level of levels) {
      const eighths = Math.round(level * rows * 8) - row * 8
      line = line + BLOCKS[Math.max(0, Math.min(8, eighths))]
    }
    lines.push(line)
  }
  return lines.join("\n")
}

function Spectrum({ bars, rows, playing }) {
  const box = useRef(null)

  useEffect(
    function () {
      const element = box.current
      const levels = []
      for (let i = 0; i < bars; i++) levels.push(0.3)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        element.textContent = drawBars(levels, rows)
        return
      }

      let volume = 0.3
      if (playing) volume = 1
      let visible = false
      const visibility = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting
      })
      visibility.observe(element)

      let time = 0
      let waited = 0
      function tick(now, deltaMs) {
        if (!visible) return
        waited = waited + deltaMs
        if (waited < FRAME_MS) return
        time = time + waited / 1000
        waited = 0
        for (let i = 0; i < bars; i++) {
          const bass = 1 - (i / bars) * 0.55
          const wave = Math.abs(Math.sin(time * (1.4 + i * 0.09) + i * 0.7) * Math.sin(time * 0.8 + i * 0.21))
          const target = (0.18 + 0.82 * wave) * bass * volume
          levels[i] = levels[i] + (target - levels[i]) * 0.35
        }
        element.textContent = drawBars(levels, rows)
      }
      gsap.ticker.add(tick)

      return function () {
        gsap.ticker.remove(tick)
        visibility.disconnect()
      }
    },
    [bars, rows, playing],
  )

  return <pre ref={box} className={s.spectrum} aria-hidden="true" />
}

function number(index) {
  return String(index + 1).padStart(2, "0")
}

function TopArtists({ artists, withPhotos }) {
  if (!artists) return <p className={s.dim}>connecting to spotify…</p>

  let className = s.chart
  if (!withPhotos) className = className + " " + s.chartSmall

  return (
    <ol className={className}>
      {artists.map(function (artist, index) {
        return (
          <li key={artist.url}>
            <span className={s.amber}>{number(index)}</span>
            {withPhotos && artist.image && <Image src={artist.image} alt="" width={28} height={28} />}
            <a href={artist.url} target="_blank" rel="noreferrer">
              {artist.name}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

function NowPlaying({ listening }) {
  if (!listening) {
    return (
      <div className={s.nowRow}>
        <p className={s.dim}>connecting to spotify…</p>
      </div>
    )
  }

  const track = listening.track
  let state = "❚❚ on repeat this month"
  if (listening.playing) state = "▶ playing"

  return (
    <div className={s.nowRow}>
      {track.image && <Image className={s.cover} src={track.image} alt="" width={112} height={112} />}
      <div className={s.nowText}>
        <p className={s.green}>{state}</p>
        <a className={s.songTitle} href={track.url} target="_blank" rel="noreferrer">
          {track.title}
        </a>
        <p className={s.dim}>{track.artist}</p>
        <div className={s.track} aria-hidden="true">
          <i />
        </div>
      </div>
    </div>
  )
}

function TopSong({ song }) {
  if (!song) return null
  return (
    <section>
      <h3 className={s.violet}>most played song · all-time</h3>
      <a className={s.topSong} href={song.url} target="_blank" rel="noreferrer">
        {song.image && <Image src={song.image} alt="" width={76} height={76} />}
        <span>
          <b>{song.title}</b>
          <span className={s.dim}>{song.artist}</span>
        </span>
      </a>
    </section>
  )
}

export default function Music({ big, live }) {
  let listening = null
  let artists = null
  let song = null
  if (live) {
    listening = live.listening
    artists = live.artists
    song = live.song
  }
  const playing = listening !== null && listening.playing

  if (!big) {
    return (
      <div className={s.music}>
        <h3 className={s.violet}>top artists · all-time</h3>
        <TopArtists artists={artists} withPhotos={false} />
        <Spectrum bars={28} rows={2} playing={playing} />
      </div>
    )
  }

  return (
    <div className={s.music + " " + s.big}>
      <NowPlaying listening={listening} />
      <Spectrum bars={56} rows={6} playing={playing} />
      <div className={s.charts}>
        <section>
          <h3 className={s.violet}>top artists · all-time</h3>
          <TopArtists artists={artists} withPhotos={true} />
        </section>
        <TopSong song={song} />
      </div>
    </div>
  )
}
