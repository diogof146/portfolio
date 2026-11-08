import { useState } from "react"
import Frame from "./Frame"
import s from "../terminal.module.css"

const SIZE = 4
const GOAL = 2048
const COLOURS = { 2: s.dim, 4: s.fg, 8: s.cyan, 16: s.cyan, 32: s.green, 64: s.green, 128: s.amber, 256: s.amber, 512: s.violet, 1024: s.violet }

const DIRECTIONS = {
  ArrowLeft: "left",
  a: "left",
  ArrowRight: "right",
  d: "right",
  ArrowUp: "up",
  w: "up",
  ArrowDown: "down",
  s: "down",
}

function linesFor(direction) {
  const lines = []
  for (let i = 0; i < SIZE; i++) {
    const line = []
    for (let k = 0; k < SIZE; k++) {
      if (direction === "left") line.push(i * SIZE + k)
      if (direction === "right") line.push(i * SIZE + (SIZE - 1 - k))
      if (direction === "up") line.push(k * SIZE + i)
      if (direction === "down") line.push((SIZE - 1 - k) * SIZE + i)
    }
    lines.push(line)
  }
  return lines
}

const LINES = { left: linesFor("left"), right: linesFor("right"), up: linesFor("up"), down: linesFor("down") }

function slide(values) {
  const tiles = []
  for (const value of values) {
    if (value !== 0) tiles.push(value)
  }
  const out = []
  let gained = 0
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1]) {
      out.push(tiles[i] * 2)
      gained = gained + tiles[i] * 2
      i = i + 1
    } else {
      out.push(tiles[i])
    }
  }
  while (out.length < SIZE) out.push(0)
  return { values: out, gained: gained }
}

function addTile(board) {
  const empty = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 0) empty.push(i)
  }
  if (empty.length === 0) return board
  const next = board.slice()
  let value = 2
  if (Math.random() < 0.1) value = 4
  next[empty[Math.floor(Math.random() * empty.length)]] = value
  return next
}

function shift(board, direction) {
  const next = board.slice()
  let gained = 0
  for (const line of LINES[direction]) {
    const values = []
    for (const index of line) values.push(board[index])
    const result = slide(values)
    gained = gained + result.gained
    for (let k = 0; k < SIZE; k++) next[line[k]] = result.values[k]
  }
  let moved = false
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== next[i]) moved = true
  }
  return { board: next, gained: gained, moved: moved }
}

function canMove(board) {
  for (const direction of Object.keys(LINES)) {
    if (shift(board, direction).moved) return true
  }
  return false
}

function newGame() {
  const empty = []
  for (let i = 0; i < SIZE * SIZE; i++) empty.push(0)
  return { board: addTile(addTile(empty)), score: 0 }
}

function play(game, direction) {
  const result = shift(game.board, direction)
  if (!result.moved) return game
  return { board: addTile(result.board), score: game.score + result.gained }
}

function Tile({ value }) {
  if (value === 0) return <span className={s.tile + " " + s.faint}>·</span>
  let colour = s.red
  if (COLOURS[value]) colour = COLOURS[value]
  return <span className={s.tile + " " + colour}>{value}</span>
}

export default function Twenty48({ onQuit }) {
  const [game, setGame] = useState(newGame)
  const over = !canMove(game.board)
  const won = game.board.includes(GOAL)

  function onKey(event) {
    const direction = DIRECTIONS[event.key]
    if (direction) {
      event.preventDefault()
      if (!over) setGame(play(game, direction))
    } else if (event.key === "r") {
      setGame(newGame())
    }
  }

  let status = "score: " + game.score
  if (won) status = status + " · 2048! keep going"
  if (over) status = "no moves left · score: " + game.score + " · r to restart"

  const rows = []
  for (let y = 0; y < SIZE; y++) {
    const tiles = []
    for (let x = 0; x < SIZE; x++) tiles.push(<Tile key={x} value={game.board[y * SIZE + x]} />)
    rows.push(<div key={y}>{tiles}</div>)
  }

  return (
    <Frame title="2048 · arrows or wasd" status={status} onKey={onKey} onQuit={onQuit}>
      <div className={s.grid}>{rows}</div>
    </Frame>
  )
}
