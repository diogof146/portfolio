import { useEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { riff } from "@/content/personal"
import { createGuitar } from "@/guitar/synth"
import { noteHz, noteName, parseRiff } from "@/guitar/tab"
import s from "./terminal.module.css"

const LEAD_IN = 0.08

function flash(element) {
  if (!element) return
  element.dataset.on = "true"
  setTimeout(function () {
    element.dataset.on = "false"
  }, 200)
}

function notesByPlace(notes) {
  const places = new Map()
  for (const note of notes) {
    places.set(note.string + ":" + note.step, note)
    if (note.fret > 9) places.set(note.string + ":" + (note.step + 1), note)
  }
  return places
}

export default function Tab({ big }) {
  const text = useRef(null)
  const view = useRef(null)
  const guitar = useRef(null)
  const ticking = useRef(null)
  const [playing, setPlaying] = useState(false)

  const parsed = useMemo(function () {
    return parseRiff(riff)
  }, [])
  const places = useMemo(
    function () {
      return notesByPlace(parsed.notes)
    },
    [parsed],
  )

  const names = []
  const openHz = []
  let nameWidth = 0
  for (const string of riff.strings) {
    names.push(noteName(string))
    openHz.push(noteHz(string))
    nameWidth = Math.max(nameWidth, noteName(string).length)
  }
  const offset = nameWidth + 1

  function getGuitar() {
    if (guitar.current === null) guitar.current = createGuitar()
    return guitar.current
  }

  function pluck(note, when, mute) {
    const hz = openHz[note.string] * Math.pow(2, note.fret / 12)
    getGuitar().pluck(hz, { when: when, tone: riff.tone, mute: mute, curve: note.curve })
  }

  function fretAt(note) {
    return text.current.querySelector('[data-note="' + note.string + ":" + note.step + '"]')
  }

  function stop() {
    if (ticking.current) gsap.ticker.remove(ticking.current)
    ticking.current = null
    if (guitar.current) guitar.current.stop()
    text.current.style.setProperty("--col", -10)
    setPlaying(false)
  }

  function play() {
    if (playing) {
      stop()
      return
    }
    const sound = getGuitar()
    const start = sound.now() + LEAD_IN
    for (const note of parsed.notes) pluck(note, start - sound.now() + note.time, note.mute)
    setPlaying(true)

    let next = 0
    function tick() {
      const at = sound.now() - start
      if (at < 0) return
      while (next < parsed.notes.length && parsed.notes[next].time <= at) {
        flash(fretAt(parsed.notes[next]))
        next = next + 1
      }
      const column = Math.floor(parsed.stepAt(Math.min(at, parsed.duration)))
      text.current.style.setProperty("--col", column)
      const box = view.current
      if (box.scrollWidth > box.clientWidth) {
        const width = text.current.scrollWidth / (parsed.steps + offset)
        box.scrollLeft = (column + offset) * width - box.clientWidth * 0.4
      }
      if (at >= parsed.duration) {
        stop()
        box.scrollTo({ left: 0, behavior: "smooth" })
      }
    }
    gsap.ticker.add(tick)
    ticking.current = tick
  }

  useEffect(function () {
    return function () {
      if (ticking.current) gsap.ticker.remove(ticking.current)
      if (guitar.current) guitar.current.stop()
    }
  }, [])

  let mode = "CLEAN"
  let modeClass = s.mode
  if (riff.tone === "drive") {
    mode = "DRIVE"
    modeClass = modeClass + " " + s.modeDrive
  }

  let className = s.nvim
  if (big) className = className + " " + s.big

  return (
    <div className={className}>
      <p className={s.dim}>{"-- " + riff.song + " · " + riff.artist + " · " + riff.tuning + " --"}</p>

      <div ref={view} className={s.tabScroll} data-no-swipe>
        <pre ref={text} className={s.tabText} style={{ "--col": -10, "--offset": offset }}>
          <span className={s.playColumn} aria-hidden="true" />
          {parsed.rows.map(function (row, string) {
            const characters = []
            for (let step = 0; step < row.length; step++) {
              const note = places.get(string + ":" + step)
              if (!note) {
                characters.push(<span key={step}>{row[step]}</span>)
                continue
              }
              characters.push(
                <button
                  key={step}
                  type="button"
                  className={s.fret}
                  data-note={note.string + ":" + note.step}
                  onClick={function (event) {
                    pluck(note, 0, false)
                    flash(event.currentTarget)
                  }}
                  aria-label={"Play fret " + note.fret + " on the " + names[string] + " string"}
                >
                  {row[step]}
                </button>,
              )
            }
            return (
              <span key={string}>
                <span className={s.cyan}>{names[string].padEnd(nameWidth)}</span>
                <span className={s.dim}>|</span>
                {characters}
                {"\n"}
              </span>
            )
          })}
        </pre>
      </div>

      <div className={s.statusline}>
        <span className={modeClass}>{mode}</span>
        <span className={s.fg}>byob.tab</span>
        <button type="button" className={s.button + " " + s.buttonHot} onClick={play}>
          {playing ? "■ stop" : "▶ play"}
        </button>
        <span className={s.dim}>{parsed.steps + " cols · tap a fret"}</span>
      </div>
    </div>
  )
}
