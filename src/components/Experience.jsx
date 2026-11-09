import { experience, highlights, yearsOf } from "@/content/experience"
import Highlights from "@/components/Highlights"
import s from "./Experience.module.css"

function highlightsOf(text) {
  const list = []
  for (const id of highlights) {
    for (const item of experience) {
      if (item.id !== id) continue
      const words = text.items[id].photo
      list.push({ id: id, photo: item.photo, title: words.title, people: words.people })
    }
  }
  return list
}

export default function Experience({ title, text }) {

  return (
    <section id="experience" className={s.experience} data-theme="mist">
      <div className="section-head">
        <h2 className="display section-title" data-reveal="title">
          {title}
        </h2>
        <p className="body-text" data-reveal="fade">
          {text.intro}
        </p>
      </div>

      <div className={s.grid}>
        <ol className={s.list}>
          {experience.map((item) => (
            <li key={item.id} className={s.row} data-reveal="up">
              <span className={"mono " + s.when}>{yearsOf(item)}</span>
              <span className={"mono " + s.kind}>{text.kinds[item.kind]}</span>
              <span className={s.text}>{text.items[item.id].text}</span>
            </li>
          ))}
        </ol>

        <div className={s.photos}>
          <Highlights items={highlightsOf(text)} label={text.highlights} />
        </div>
      </div>
    </section>
  )
}
