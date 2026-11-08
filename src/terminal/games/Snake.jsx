import { useEffect, useState } from "react"
import Frame from "./Frame"
import s from "../terminal.module.css"

const WIDTH = 24
const HEIGHT = 14
const START_DELAY = 150
const FASTEST = 70

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
}

function same(a, b) {
  return a.x === b.x && a.y === b.y
}

function onSnake(snake, cell) {
  for (const part of snake) {
    if (same(part, cell)) return true
  }
  return false
}

function placeFood(snake) {
  const free = []
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (!onSnake(snake, { x: x, y: y })) free.push({ x: x, y: y })
    }
  }
  return free[Math.floor(Math.random() * free.length)]
}

function newGame() {
  const snake = [
    { x: 6, y: 7 },
    { x: 5, y: 7 },
    { x: 4, y: 7 },
  ]
  return { snake: snake, direction: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: placeFood(snake), score: 0, delay: START_DELAY, dead: false }
}

function step(game) {
  if (game.dead) return game
  const direction = game.next
  const head = { x: game.snake[0].x + direction.x, y: game.snake[0].y + direction.y }
  const outside = head.x < 0 || head.y < 0 || head.x >= WIDTH || head.y >= HEIGHT
  const eats = same(head, game.food)
  let body = game.snake
  if (!eats) body = game.snake.slice(0, -1)
  if (outside || onSnake(body, head)) return { ...game, dead: true }

  const snake = [head].concat(body)
  if (!eats) return { ...game, snake: snake, direction: direction }
  return {
    ...game,
    snake: snake,
    direction: direction,
    food: placeFood(snake),
    score: game.score + 1,
    delay: Math.max(FASTEST, game.delay - 5),
  }
}

function turn(game, wanted) {
  if (game.dead) return game
  if (wanted.x === -game.direction.x && wanted.y === -game.direction.y) return game
  return { ...game, next: wanted }
}

function Cell({ game, x, y }) {
  const cell = { x: x, y: y }
  if (same(game.snake[0], cell)) return <span className={s.cyan}>■</span>
  if (onSnake(game.snake, cell)) return <span className={s.fg}>█</span>
  if (same(game.food, cell)) return <span className={s.amber}>●</span>
  return <span className={s.faint}>·</span>
}

export default function Snake({ onQuit }) {
  const [game, setGame] = useState(newGame)

  useEffect(
    function () {
      if (game.dead) return
      const timer = setTimeout(function () {
        setGame(step)
      }, game.delay)
      return function () {
        clearTimeout(timer)
      }
    },
    [game],
  )

  function onKey(event) {
    const wanted = DIRECTIONS[event.key]
    if (wanted) {
      event.preventDefault()
      setGame(function (current) {
        return turn(current, wanted)
      })
    } else if (event.key === "r") {
      setGame(newGame())
    }
  }

  let status = "score: " + game.score
  if (game.dead) status = "game over! score: " + game.score + " · r to restart"

  const rows = []
  for (let y = 0; y < HEIGHT; y++) {
    const cells = []
    for (let x = 0; x < WIDTH; x++) cells.push(<Cell key={x} game={game} x={x} y={y} />)
    rows.push(<div key={y}>{cells}</div>)
  }

  return (
    <Frame title="SNAKE · arrows or wasd" status={status} onKey={onKey} onQuit={onQuit}>
      <div className={s.grid}>{rows}</div>
    </Frame>
  )
}
