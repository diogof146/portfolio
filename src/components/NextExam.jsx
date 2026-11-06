import { getNextExam } from "@/lib/calendar"

const dateOptions = { day: "numeric", month: "short", timeZone: "UTC" }

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
    <p>
      {text.label}: {exam.title} · {date} · {whenText(exam.daysLeft, text)}
    </p>
  )
}
