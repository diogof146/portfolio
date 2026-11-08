import { useEffect, useRef } from "react"
import s from "../terminal.module.css"

function isQuit(event, quitKey) {
  if (quitKey === "q") return event.key === "q" || event.key === "Q"
  return event.key === quitKey
}

export default function Frame({ title, status, quitKey = "q", onKey, onQuit, children }) {
  const box = useRef(null)

  useEffect(function () {
    if (!box.current.contains(document.activeElement)) box.current.focus({ preventScroll: true })
  }, [])

  function keyDown(event) {
    if (event.altKey || event.metaKey || event.ctrlKey) return
    if (event.key === "Escape" && quitKey !== "Escape") return
    event.stopPropagation()
    if (isQuit(event, quitKey)) {
      event.preventDefault()
      onQuit()
      return
    }
    if (onKey) onKey(event)
  }

  return (
    <div ref={box} className={s.game} tabIndex={0} onKeyDown={keyDown} data-no-swipe>
      <p className={s.dim}>{title + " · " + (quitKey === "q" ? "q" : "esc") + " to quit"}</p>
      {status && <p>{status}</p>}
      {children}
      <p className={s.gameAway}>click to play</p>
    </div>
  )
}
