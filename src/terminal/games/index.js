import Rps from "./Rps"
import Guess from "./Guess"
import Dino from "./Dino"
import Snake from "./Snake"
import Mines from "./Mines"
import Hangman from "./Hangman"
import Typing from "./Typing"
import Twenty48 from "./Twenty48"

export const GAMES_BY_COMMAND = {
  rps: { name: "rock paper scissors", Game: Rps },
  guess: { name: "guess the number", Game: Guess },
  dino: { name: "dino", Game: Dino },
  snake: { name: "snake", Game: Snake },
  mines: { name: "minesweeper", Game: Mines },
  hangman: { name: "hangman", Game: Hangman },
  typing: { name: "the typing test", Game: Typing },
  2048: { name: "2048", Game: Twenty48 },
}
