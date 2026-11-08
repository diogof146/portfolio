import { BookOpen, ChessKnight, Dumbbell, Gamepad2, Guitar, SquareTerminal } from "lucide-react"
import InterestsMotion from "@/components/InterestsMotion"
import { interests } from "@/content/personal"
import s from "./Interests.module.css"

const ICONS = {
  guitar: Guitar,
  chess: ChessKnight,
  games: Gamepad2,
  manga: BookOpen,
  gym: Dumbbell,
  setup: SquareTerminal,
}

function Interest({ id, text }) {
  const Icon = ICONS[id]
  return (
    <div className={s.interest} data-reveal="up">
      <span className={s.float}>
        <Icon className={s.icon} data-interest={id} aria-hidden="true" />
      </span>
      <b>
        {text.title}
        {id === "setup" && <span className={s.blink} aria-hidden="true" />}
      </b>
      <p>{text.text}</p>
    </div>
  )
}

export default function Interests({ title, text }) {
  return (
    <InterestsMotion>
      <div className="section-head">
        <h2 className="display section-title" data-reveal="title">
          {title}
        </h2>
      </div>
      <div className={s.interests}>
        {interests.map(function (id) {
          return <Interest key={id} id={id} text={text[id]} />
        })}
      </div>
    </InterestsMotion>
  )
}
