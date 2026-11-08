import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { pathFor } from "@/content/lang/languages"
import LanguageSwitch from "@/components/LanguageSwitch"
import LightReveal from "@/components/LightReveal"
import HeroVideo from "@/components/HeroVideo"
import s from "./OffTheClockHero.module.css"

const FOG = { color: "#0b3756", light: "#3f7fa6", dark: "#04172a", density: 0.7, clear: 0.6, top: 0.96, topEnd: 0.62 }

export default function OffTheClockHero({ lang, text, languageLabel }) {
  return (
    <header className={s.hero} data-theme="blue">
      <div className={s.art}>
        <LightReveal fog={FOG} intensity={1.8} cursorLabel={text.light}>
          <div className={s.clip} data-under-fog>
            <HeroVideo
              className={s.video}
              src="/videos/off-the-clock.mp4"
              smallSrc="/videos/off-the-clock-720.mp4"
              poster="/videos/off-the-clock.jpg"
            />
            <span className={s.tintShadow} />
            <span className={s.tintLight} />
          </div>
          <div className={s.base} />
        </LightReveal>
      </div>

      <div className={s.inner}>
        <div className={"mono " + s.top}>
          <Link href={pathFor(lang, "/")} className={s.back}>
            <ArrowLeft size={14} aria-hidden="true" /> {text.back}
          </Link>
          <span className={"muted " + s.side}>{text.side}</span>
          <span className={s.languages}>
            <LanguageSwitch lang={lang} label={languageLabel} />
          </span>
        </div>
        <h1 className={"display " + s.title} data-reveal="chars" data-delay="0.2">
          {text.heading[0]}
          <br />
          {text.heading[1]}
        </h1>
        <p className={"lead " + s.lede} data-reveal="fade" data-delay="0.6">
          {text.lede}
        </p>
      </div>
    </header>
  )
}
