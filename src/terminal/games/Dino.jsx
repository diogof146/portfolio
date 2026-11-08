import { useEffect, useState } from "react"
import Frame from "./Frame"
import s from "../terminal.module.css"

const WIDTH = 50
const HEIGHT = 12
const GROUND = HEIGHT - 2
const DINO = 4
const TICK = 50

function newGame() {
  return { height: 0, velocity: 0, cactus: WIDTH, speed: 1, score: 0, dead: false }
}

function step(game) {
  if (game.dead) return game
  let height = game.height
  let velocity = game.velocity
  if (height > 0 || velocity > 0) {
    height = height + velocity
    velocity = velocity - 0.5
    if (height <= 0) {
      height = 0
      velocity = 0
    }
  }
  let cactus = game.cactus - game.speed
  let speed = game.speed
  let score = game.score
  if (cactus <= DINO + 1 && cactus >= DINO - 2 && height <= 1) {
    return { ...game, height: height, velocity: velocity, dead: true }
  }
  if (cactus < 0) {
    cactus = WIDTH
    score = score + 1
    speed = Math.min(speed + 0.1, 3)
  }
  return { height: height, velocity: velocity, cactus: cactus, speed: speed, score: score, dead: false }
}

function draw(game) {
  const dinoRow = GROUND - Math.round(game.height)
  const cactusColumn = Math.round(game.cactus)
  const rows = []
  for (let row = 0; row < HEIGHT; row++) {
    let line = ""
    for (let column = 0; column < WIDTH; column++) {
      if (row === dinoRow && column === DINO) line = line + "▲"
      else if (row >= GROUND - 2 && row <= GROUND && column === cactusColumn) line = line + "▐"
      else if (row === GROUND && column % 2 === 0) line = line + "─"
      else line = line + " "
    }
    rows.push(line)
  }
  return rows.join("\n")
}

export default function Dino({ onQuit }) {
  const [game, setGame] = useState(newGame)

  useEffect(function () {
    const timer = setInterval(function () {
      setGame(step)
    }, TICK)
    return function () {
      clearInterval(timer)
    }
  }, [])

  function onKey(event) {
    if (event.key === " " || event.key === "ArrowUp") {
      event.preventDefault()
      setGame(function (current) {
        if (current.dead || current.height > 0) return current
        return { ...current, velocity: 3 }
      })
    } else if (event.key === "r") {
      setGame(newGame())
    }
  }

  let status = "score: " + game.score
  if (game.dead) status = "game over! score: " + game.score + " · r to restart"

  return (
    <Frame title="DINO · space or ↑ to jump" status={status} onKey={onKey} onQuit={onQuit}>
      <pre className={s.board}>{draw(game)}</pre>
    </Frame>
  )
}
