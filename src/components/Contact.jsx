import Image from "next/image"
import { projects } from "@/content/projects"
import ContactForm from "@/components/ContactForm"
import SiteFooter from "@/components/SiteFooter"
import ContactMotion from "@/components/ContactMotion"
import s from "./Contact.module.css"

const ORDER = [0, 5, 9, 2, 7, 11, 4, 1, 8, 10, 3, 6]
const COLUMNS = 6

function wallTiles() {
  const tiles = new Array(ORDER.length * 2)
  for (let i = 0; i < ORDER.length; i++) {
    const project = projects[ORDER[i] % projects.length]
    const row = Math.floor(i / COLUMNS)
    const column = i % COLUMNS
    tiles[i] = project
    tiles[(3 - row) * COLUMNS + ((column + 3) % COLUMNS)] = project
  }
  return tiles
}

export default function Contact({ lang, text, footerText, nav }) {
  const tiles = wallTiles()

  return (
    <section id="contact" className={s.contact} data-theme="blue">
      <div className={s.stage} data-contact-stage>
        <div className={s.wallWrap} aria-hidden="true">
          <div className={s.wallLean} data-wall-lean>
            <div className={s.wall} data-wall>
              {tiles.map((project, index) => (
                <div key={index} className={s.tile} data-tile>
                  <Image src={project.image} alt="" fill sizes="240px" className={s.tileImage} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={s.shade} aria-hidden="true" data-shade />

        <div className={s.card} data-contact-card>
          <span className={s.cardBack} aria-hidden="true" data-card-back />
          <h2 className={"display " + s.head} data-contact-head>
            {text.heading[0]}
            <br />
            {text.heading[1]}
          </h2>
          <div className={s.body} data-contact-body>
            <p className="body-text">{text.intro}</p>
            <ContactForm text={text} />
          </div>
        </div>

        <SiteFooter lang={lang} text={footerText} nav={nav} className={s.foot} />
      </div>
      <ContactMotion />
    </section>
  )
}
