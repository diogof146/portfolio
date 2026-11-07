import { getNextExam } from "@/lib/calendar"
import s from "./Now.module.css"

const dateOptions = { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }

function whenText(daysLeft, text) {
  if (daysLeft === 0) return text.today
  if (daysLeft === 1) return text.tomorrow
  return text.inDays.replace("#", daysLeft)
}

export default async function NextExam({ text, lang }) {
  const exam = await getNextExam()
  if (exam === null) return null

  const date = new Intl.DateTimeFormat(lang, dateOptions).format(new Date(exam.day))

  return (
    <div className={s.item}>
      <span className="mono muted">{text.label}</span>
      <b className={s.days}>{whenText(exam.daysLeft, text)}</b>
      <span className={s.note}>{exam.title + " · " + date}</span>
    </div>
  )
}
