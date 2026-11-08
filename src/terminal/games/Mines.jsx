import { useState } from "react"
import Frame from "./Frame"
import s from "../terminal.module.css"

const WIDTH = 12
const HEIGHT = 9
const MINES = 15
const CELLS = WIDTH * HEIGHT
const NUMBER_COLOURS = [s.dim, s.cyan, s.green, s.amber, s.violet, s.red, s.red, s.red, s.red]

const MOVES = {
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
}

function filled(value) {
  const list = []
  for (let i = 0; i < CELLS; i++) list.push(value)
  return list
}

function neighbours(index) {
  const x = index % WIDTH
  const y = Math.floor(index / WIDTH)
  const list = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && ny >= 0 && nx < WIDTH && ny < HEIGHT) list.push(ny * WIDTH + nx)
    }
  }
  return list
}

function countAround(mines, index) {
  let count = 0
  for (const other of neighbours(index)) {
    if (mines[other]) count = count + 1
  }
  return count
}

function layMines(safe) {
  const kept = neighbours(safe).concat(safe)
  const candidates = []
  for (let i = 0; i < CELLS; i++) {
    if (!kept.includes(i)) candidates.push(i)
  }
  const mines = filled(false)
  for (let placed = 0; placed < MINES; placed++) {
    const pick = Math.floor(Math.random() * candidates.length)
    mines[candidates[pick]] = true
    candidates.splice(pick, 1)
  }
  return mines
}

function newGame() {
  return { mines: null, revealed: filled(false), flagged: filled(false), cursor: 0, over: null }
}

function cleared(game) {
  for (let i = 0; i < CELLS; i++) {
    if (!game.mines[i] && !game.revealed[i]) return false
  }
  return true
}

function reveal(game, index) {
  if (game.over || game.flagged[index] || game.revealed[index]) return game
  let mines = game.mines
  if (mines === null) mines = layMines(index)
  if (mines[index]) return { ...game, mines: mines, revealed: filled(true), over: "lost", cursor: index }

  const revealed = game.revealed.slice()
  const stack = [index]
  while (stack.length > 0) {
    const current = stack.pop()
    if (revealed[current] || game.flagged[current]) continue
    revealed[current] = true
    if (countAround(mines, current) === 0) {
      for (const other of neighbours(current)) stack.push(other)
    }
  }
  const next = { ...game, mines: mines, revealed: revealed, cursor: index }
  if (cleared(next)) return { ...next, over: "won" }
  return next
}

function flag(game, index) {
  if (game.over || game.revealed[index]) return game
  const flagged = game.flagged.slice()
  flagged[index] = !flagged[index]
  return { ...game, flagged: flagged, cursor: index }
}

function move(game, delta) {
  const x = Math.min(WIDTH - 1, Math.max(0, (game.cursor % WIDTH) + delta.x))
  const y = Math.min(HEIGHT - 1, Math.max(0, Math.floor(game.cursor / WIDTH) + delta.y))
  return { ...game, cursor: y * WIDTH + x }
}

function flagsLeft(game) {
  let count = MINES
  for (const flagged of game.flagged) {
    if (flagged) count = count - 1
  }
  return count
}

function Square({ game, index }) {
  if (game.flagged[index] && !game.revealed[index]) return <span className={s.red}>⚑</span>
  if (!game.revealed[index]) return <span className={s.faint}>■</span>
  if (game.mines && game.mines[index]) return <span className={s.red}>✱</span>
  const count = countAround(game.mines, index)
  if (count === 0) return <span className={s.dim}>·</span>
  return <span className={NUMBER_COLOURS[count]}>{count}</span>
}

export default function Mines({ onQuit }) {
  const [game, setGame] = useState(newGame)

  function onKey(event) {
    const delta = MOVES[event.key]
    if (delta) {
      event.preventDefault()
      setGame(move(game, delta))
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      setGame(reveal(game, game.cursor))
    } else if (event.key === "f") {
      setGame(flag(game, game.cursor))
    } else if (event.key === "r") {
      setGame(newGame())
    }
  }

  let status = "mines: " + flagsLeft(game)
  if (game.over === "won") status = "cleared! · r for a new board"
  if (game.over === "lost") status = "boom. · r for a new board"

  const rows = []
  for (let y = 0; y < HEIGHT; y++) {
    const cells = []
    for (let x = 0; x < WIDTH; x++) {
      const index = y * WIDTH + x
      let className = s.cell
      if (index === game.cursor) className = className + " " + s.cursorCell
      cells.push(
        <span
          key={x}
          className={className}
          onClick={function () {
            setGame(reveal(game, index))
          }}
          onContextMenu={function (event) {
            event.preventDefault()
            setGame(flag(game, index))
          }}
        >
          <Square game={game} index={index} />
        </span>,
      )
    }
    rows.push(<div key={y}>{cells}</div>)
  }

  return (
    <Frame title="MINES · arrows to move, space to dig, f to flag" status={status} onKey={onKey} onQuit={onQuit}>
      <div className={s.grid}>{rows}</div>
    </Frame>
  )
}
