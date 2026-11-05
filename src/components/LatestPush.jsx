const dateOptions = { day: "numeric", month: "short", timeZone: "Europe/Lisbon" }

export default function LatestPush({ label, push, lang }) {
  if (push === null) return null

  const date = new Intl.DateTimeFormat(lang, dateOptions).format(new Date(push.date))

  return (
    <p>
      {label}:{" "}
      <a href={push.url} target="_blank" rel="noreferrer">
        {push.repo}
      </a>{" "}
      · {push.message} · {date}
    </p>
  )
}
