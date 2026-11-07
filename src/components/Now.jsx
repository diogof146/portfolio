import { Suspense } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import NextExam from "@/components/NextExam"
import s from "./Now.module.css"

const dateOptions = { day: "numeric", month: "short", timeZone: "Europe/Lisbon" }

export default function Now({ lang, title, text, push, notes, aboutHref, aboutTitle }) {
  let pushDate = ""
  if (push) {
    pushDate = new Intl.DateTimeFormat(lang, dateOptions).format(new Date(push.date))
  }

  return (
    <section id="now" className={s.now} data-theme="ink">
      <div className="section-head">
        <h2 className="display section-title" data-reveal="title">
          {title}
        </h2>
      </div>

      <div className={s.grid}>
        {notes ? (
          <ul className={s.notes}>
            {notes.map((note) => (
              <li key={note} data-reveal="up">
                {note}
              </li>
            ))}
          </ul>
        ) : (
          <div />
        )}

        <div className={s.live}>
          {push && (
            <a className={s.item} href={push.url} target="_blank" rel="noreferrer" data-reveal="up" data-cursor="GitHub">
              <span className="mono muted">{text.latestPush + " · " + pushDate}</span>
              <b>{push.repo}</b>
              <span className={s.note}>{"“" + push.message + "”"}</span>
            </a>
          )}
          <Suspense fallback={null}>
            <NextExam text={text.nextExam} lang={lang} />
          </Suspense>
          <Link className={s.item} href={aboutHref} data-reveal="up">
            <span className="mono muted">{aboutTitle}</span>
            <b>{text.offTheClock}</b>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
