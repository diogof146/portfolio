import { useState } from "react"
import Frame from "./Frame"
import s from "../terminal.module.css"

function randomTarget() {
  return Math.floor(Math.random() * 100) + 1
}

function judge(value, target) {
  const number = parseInt(value, 10)
  if (Number.isNaN(number) || number < 1 || number > 100) return "invalid number (1-100)"
  if (number === target) return null
  if (number < target) return number + " → too low ↑"
  return number + " → too high ↓"
}

export default function Guess({ onQuit }) {
  const [target] = useState(randomTarget)
  const [value, setValue] = useState("")
  const [log, setLog] = useState([])
  const [won, setWon] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (value.trim() === "") return
    const verdict = judge(value, target)
    if (verdict === null) {
      setLog(log.concat("correct! the number was " + target + ", in " + (log.length + 1) + " tries."))
      setWon(true)
    } else {
      setLog(log.concat(verdict))
    }
    setValue("")
  }

  return (
    <Frame title="GUESS THE NUMBER (1-100)" onQuit={onQuit}>
      {log.map(function (line, index) {
        return <p key={index}>{line}</p>
      })}
      {!won && (
        <form onSubmit={submit} className={s.promptRow}>
          <span className={s.cyan}>›</span>
          <input
            className={s.promptInput}
            value={value}
            onChange={function (event) {
              setValue(event.target.value)
            }}
            placeholder="guess..."
            inputMode="numeric"
            aria-label="Your guess"
            autoFocus
          />
        </form>
      )}
    </Frame>
  )
}
