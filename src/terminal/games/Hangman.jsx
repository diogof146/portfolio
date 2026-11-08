import { useState } from "react"
import Frame from "./Frame"
import { WORDS } from "./words"
import s from "../terminal.module.css"

const MISSES = 6

const GALLOWS = [
  ["  +---+", "  |   |", "      |", "      |", "      |", "=======",],
  ["  +---+", "  |   |", "  O   |", "      |", "      |", "======="],
  ["  +---+", "  |   |", "  O   |", "  |   |", "      |", "======="],
  ["  +---+", "  |   |", "  O   |", " /|   |", "      |", "======="],
  ["  +---+", "  |   |", "  O   |", " /|\\  |", "      |", "======="],
  ["  +---+", "  |   |", "  O   |", " /|\\  |", " /    |", "======="],
  ["  +---+", "  |   |", "  O   |", " /|\\  |", " / \\  |", "======="],
]

function newGame() {
  return { word: WORDS[Math.floor(Math.random() * WORDS.length)], guessed: [] }
}

function wrongOf(game) {
  const wrong = []
  for (const letter of game.guessed) {
    if (!game.word.includes(letter)) wrong.push(letter)
  }
  return wrong
}

function shown(game) {
  let text = ""
  for (const letter of game.word) {
    if (letter === " ") text = text + "   "
    else if (game.guessed.includes(letter)) text = text + letter + " "
    else text = text + "_ "
  }
  return text.trimEnd()
}

function solved(game) {
  for (const letter of game.word) {
    if (letter !== " " && !game.guessed.includes(letter)) return false
  }
  return true
}

export default function Hangman({ onQuit }) {
  const [game, setGame] = useState(newGame)
  const wrong = wrongOf(game)
  const won = solved(game)
  const lost = wrong.length >= MISSES
  const over = won || lost

  function onKey(event) {
    if (over && event.key === "Enter") {
      setGame(newGame())
      return
    }
    const letter = event.key.toUpperCase()
    if (over || letter.length !== 1 || letter < "A" || letter > "Z" || game.guessed.includes(letter)) return
    setGame({ ...game, guessed: game.guessed.concat(letter) })
  }

  let status = "misses: " + wrong.length + "/" + MISSES
  if (won) status = "you got it! · enter for a new word"
  if (lost) status = "it was " + game.word + " · enter for a new word"

  return (
    <Frame title="HANGMAN · One Piece edition · type letters" status={status} quitKey="Escape" onKey={onKey} onQuit={onQuit}>
      <div className={s.hangman}>
        <pre className={s.board}>{GALLOWS[Math.min(wrong.length, MISSES)].join("\n")}</pre>
        <div>
          <p className={s.word}>{lost ? game.word : shown(game)}</p>
          {wrong.length > 0 && <p className={s.red}>{wrong.join(" ")}</p>}
        </div>
      </div>
    </Frame>
  )
}
