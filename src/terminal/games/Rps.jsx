import { useState } from "react"
import Frame from "./Frame"
import s from "../terminal.module.css"

const KEYS = { r: "rock", p: "paper", s: "scissors" }
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" }
const NAMES = ["rock", "paper", "scissors"]
const COLOURS = { win: s.green, lose: s.red, draw: s.amber }

function play(player) {
  const cpu = NAMES[Math.floor(Math.random() * NAMES.length)]
  let result = "lose"
  if (player === cpu) result = "draw"
  else if (BEATS[player] === cpu) result = "win"
  return { player: player, cpu: cpu, result: result }
}

function scoreOf(rounds) {
  const score = { win: 0, lose: 0, draw: 0 }
  for (const round of rounds) score[round.result] = score[round.result] + 1
  return "W:" + score.win + " L:" + score.lose + " D:" + score.draw
}

export default function Rps({ onQuit }) {
  const [rounds, setRounds] = useState([])

  function onKey(event) {
    const player = KEYS[event.key]
    if (!player) return
    setRounds(rounds.concat(play(player)))
  }

  return (
    <Frame title="RPS · r = rock, p = paper, s = scissors" status={scoreOf(rounds)} onKey={onKey} onQuit={onQuit}>
      {rounds.length === 0 && <p className={s.dim}>press r, p or s to play</p>}
      {rounds.map(function (round, index) {
        return (
          <p key={index} className={COLOURS[round.result]}>
            {"you " + round.player + " vs cpu " + round.cpu + " → " + round.result.toUpperCase()}
          </p>
        )
      })}
    </Frame>
  )
}
