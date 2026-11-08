import { useState } from "react"
import Frame from "./Frame"
import { QUOTES } from "../commands"
import s from "../terminal.module.css"

const MAX_LENGTH = 140

const TEXTS = []
for (const quote of QUOTES) {
  const words = quote.slice(1, quote.lastIndexOf('"'))
  if (words.length <= MAX_LENGTH) TEXTS.push(words)
}

function newGame() {
  return { text: TEXTS[Math.floor(Math.random() * TEXTS.length)], typed: "", started: null, result: null }
}

function correctCount(game) {
  let count = 0
  for (let i = 0; i < game.typed.length; i++) {
    if (game.typed[i] === game.text[i]) count = count + 1
  }
  return count
}

function finish(game, now) {
  const minutes = Math.max((now - game.started) / 60000, 1 / 60)
  const correct = correctCount(game)
  return {
    ...game,
    result: {
      wpm: Math.round(correct / 5 / minutes),
      accuracy: Math.round((correct / game.text.length) * 100),
    },
  }
}

function Letter({ game, index }) {
  const letter = game.text[index]
  if (index === game.typed.length && !game.result) return <span className={s.typingCursor}>{letter}</span>
  if (index >= game.typed.length) return <span className={s.faint}>{letter}</span>
  if (game.typed[index] === letter) return <span className={s.fg}>{letter}</span>
  return <span className={s.typo}>{letter}</span>
}

export default function Typing({ onQuit }) {
  const [game, setGame] = useState(newGame)

  function onKey(event) {
    if (game.result) {
      if (event.key === "Enter") setGame(newGame())
      return
    }
    if (event.key === "Backspace") {
      event.preventDefault()
      setGame({ ...game, typed: game.typed.slice(0, -1) })
      return
    }
    if (event.key.length !== 1) return
    event.preventDefault()
    const now = Date.now()
    let started = game.started
    if (started === null) started = now
    const next = { ...game, typed: game.typed + event.key, started: started }
    if (next.typed.length === next.text.length) setGame(finish(next, now))
    else setGame(next)
  }

  let status = "start typing, the clock starts on your first key"
  if (game.started !== null) status = game.typed.length + " / " + game.text.length
  if (game.result) status = game.result.wpm + " wpm · " + game.result.accuracy + "% accuracy · enter for another"

  const letters = []
  for (let i = 0; i < game.text.length; i++) letters.push(<Letter key={i} game={game} index={i} />)

  return (
    <Frame title="TYPING TEST" status={status} quitKey="Escape" onKey={onKey} onQuit={onQuit}>
      <p className={s.typingText}>{letters}</p>
    </Frame>
  )
}
