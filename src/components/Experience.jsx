import { experience, yearsOf } from "@/content/experience"
import Print from "@/components/Print"
import InkLayer from "@/components/InkLayer"
import s from "./Experience.module.css"

export default function Experience({ title, text }) {
  const withPhotos = []
  for (const item of experience) {
    if (item.photo) withPhotos.push(item)
  }

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
          {withPhotos.map((item) => (
            <figure key={item.id} className={s.figure} data-reveal="up">
              <div className={s.picture} style={{ aspectRatio: item.photo.width + " / " + item.photo.height }}>
                <Print src={item.photo} alt={text.items[item.id].photo.title} sizes="(min-width: 768px) 400px, 90vw">
                  <InkLayer src={item.photo.src} scrub />
                </Print>
              </div>
              <figcaption>
                <span className="mono">{text.items[item.id].photo.title}</span>
                <span>{text.items[item.id].photo.people}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
