"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { Play, Square } from "lucide-react"
import { createGuitar } from "@/guitar/synth"
import { noteHz, noteName, parseRiff } from "@/guitar/tab"
import s from "./GuitarTab.module.css"

const ROW = 40
const COL = 12
const LEAD_IN = 0.08

function flash(element) {
  element.dataset.on = "true"
  setTimeout(function () {
    element.dataset.on = "false"
  }, 220)
}

function describe(text, note, name) {
  let label = text.note.replace("#", note.fret).replace("%", name)
  if (note.curve.length > 0) label = label + text.bent
  return label
}

export default function GuitarTab({ riff, text }) {
  const scroller = useRef(null)
  const staff = useRef(null)
  const playhead = useRef(null)
  const guitar = useRef(null)
  const ticking = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)

  const parsed = useMemo(
    function () {
      return parseRiff(riff)
    },
    [riff],
  )

  const names = []
  const openHz = []
  for (const string of riff.strings) {
    names.push(noteName(string))
    openHz.push(noteHz(string))
  }

  function across(step) {
    return (step + 0.5) / parsed.steps
  }

  function getGuitar() {
    if (guitar.current === null) guitar.current = createGuitar()
    return guitar.current
  }

  function pluck(note, when, mute) {
    const hz = openHz[note.string] * Math.pow(2, note.fret / 12)
    getGuitar().pluck(hz, { when: when, tone: riff.tone, mute: mute, curve: note.curve })
  }

  function stop() {
    if (ticking.current) gsap.ticker.remove(ticking.current)
    ticking.current = null
    if (guitar.current) guitar.current.stop()
    playhead.current.dataset.on = "false"
    setPlaying(false)
  }

  function play() {
    if (playing) {
      stop()
      return
    }
    const sound = getGuitar()
    const start = sound.now() + LEAD_IN
    for (const note of parsed.notes) {
      pluck(note, start - sound.now() + note.time, note.mute)
    }
    setPlaying(true)

    const buttons = staff.current.querySelectorAll("[data-note]")
    const view = scroller.current
    const head = playhead.current
    head.style.setProperty("--x", across(0))
    head.dataset.on = "true"
    let next = 0

    function tick() {
      const at = sound.now() - start
      if (at < 0) return
      while (next < parsed.notes.length && parsed.notes[next].time <= at) {
        flash(buttons[next])
        next = next + 1
      }
      const position = across(parsed.stepAt(Math.min(at, parsed.duration)))
      head.style.setProperty("--x", position)
      if (view.scrollWidth > view.clientWidth) {
        view.scrollLeft = position * view.scrollWidth - view.clientWidth * 0.4
      }
      if (at >= parsed.duration) {
        stop()
        view.scrollTo({ left: 0, behavior: "smooth" })
      }
    }
    gsap.ticker.add(tick)
    ticking.current = tick
  }

  function moveFrom(index, event) {
    const last = parsed.notes.length - 1
    let next = index
    if (event.key === "ArrowRight") next = Math.min(last, index + 1)
    else if (event.key === "ArrowLeft") next = Math.max(0, index - 1)
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = last
    else return
    event.preventDefault()
    setCurrent(next)
    staff.current.querySelectorAll("[data-note]")[next].focus()
  }

  useEffect(function () {
    return function () {
      if (ticking.current) gsap.ticker.remove(ticking.current)
      if (guitar.current) guitar.current.stop()
    }
  }, [])

  return (
    <div>
      <div ref={scroller} className={s.scroll}>
        <div
          ref={staff}
          className={s.staff}
          style={{ height: (riff.strings.length - 1) * ROW, minWidth: parsed.steps * COL }}
        >
          {names.map(function (name, index) {
            return (
              <div key={index} className={s.row} style={{ top: index * ROW }}>
                <span className={"mono " + s.name}>{name}</span>
                <span className={s.line} data-reveal="rule" />
              </div>
            )
          })}
          {parsed.notes.map(function (note, index) {
            return (
              <button
                key={index}
                type="button"
                className={s.note}
                style={{ top: note.string * ROW, "--x": across(note.step) }}
                data-note
                data-cursor={text.pluck}
                aria-label={describe(text, note, names[note.string])}
                tabIndex={index === current ? 0 : -1}
                onFocus={function () {
                  setCurrent(index)
                }}
                onKeyDown={function (event) {
                  moveFrom(index, event)
                }}
                onClick={function (event) {
                  pluck(note, 0, false)
                  flash(event.currentTarget)
                }}
              >
                {note.fret}
                {note.curve.length > 0 && <sup>↑</sup>}
              </button>
            )
          })}
          <div ref={playhead} className={s.playhead} aria-hidden="true" />
        </div>
      </div>

      <div className={s.transport}>
        <button type="button" className="btn" onClick={play}>
          {playing ? <Square size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {playing ? text.stop : text.play}
        </button>
        <span className="mono muted">{riff.tuning}</span>
        <span className="mono muted">{text.hint}</span>
      </div>
    </div>
  )
}
