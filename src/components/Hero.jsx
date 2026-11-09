import Image from "next/image"
import { ArrowDown, ArrowRight } from "lucide-react"
import { person } from "@/content/site"
import LightReveal from "@/components/LightReveal"
import HoldButton from "@/components/HoldButton"
import portrait from "@/content/images/portrait.webp"
import s from "./Hero.module.css"

export default function Hero({ text, hold, children }) {
  const space = person.name.indexOf(" ")
  const firstName = person.name.slice(0, space)
  const lastName = person.name.slice(space + 1)

  return (
    <header className={s.hero} data-theme="paper" data-panel-hero>
      <div className={s.top}>
        <span className="mono">
          <span className={s.desktopOnly}>{person.name} · </span>
          {text.hero.edition}
        </span>
        <span className={"mono " + s.hint}>
          <svg viewBox="0 0 30 30" aria-hidden="true">
            <circle className={s.hintTrack} cx="15" cy="15" r="13" />
            <circle className={s.hintFill} cx="15" cy="15" r="13" />
          </svg>
          {hold.hint}
        </span>
        <HoldButton text={hold} fromHome className={s.holdButton} />
      </div>

      <div className={s.grid}>
        <div className={s.text}>
          <h1 className={"display " + s.name} data-reveal="chars">
            {firstName}
            <br />
            {lastName}
          </h1>
          <p className={"lead " + s.lead} data-reveal="fade" data-delay="0.35">
            {text.lead}
          </p>
          <span className={"mono " + s.status} data-reveal="up" data-delay="0.55">
            <span className="status-dot" aria-hidden="true" />
            {text.status}
          </span>
          <div className={s.buttons} data-reveal="up" data-delay="0.7">
            <a href="#work" className="btn">
              {text.hero.seeWork} <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a href="#contact" className="btn-ghost">
              {text.hero.getInTouch} <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={s.media}>
          <div className={s.cutout}>
            <LightReveal print focusX={0.5} focusY={1} intensity={1.7} cursorLabel={text.hero.light}>
              <Image
                src={portrait}
                alt={person.name}
                fill
                sizes="(min-width: 768px) 470px, 100vw"
                className={s.cutoutImage}
                preload
              />
            </LightReveal>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <a href="#work" className={"mono " + s.scrollCue}>
          <span className={s.scrollLine} aria-hidden="true" />
          {text.hero.scroll}
        </a>
        <div className={s.slot} data-panel-slot>
          {children}
        </div>
      </div>
    </header>
  )
}
