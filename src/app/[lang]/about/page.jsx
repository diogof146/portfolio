import { getDictionary } from "@/content/lang"
import SiteFooter from "@/components/SiteFooter"
import ContourLines from "@/components/ContourLines"
import DuotoneFilter from "@/components/DuotoneFilter"
import Reveals from "@/components/Reveals"
import OffTheClockHero from "@/components/OffTheClockHero"
import RightNow from "@/components/RightNow"
import Soundtrack from "@/components/Soundtrack"
import Learning from "@/components/Learning"
import Games from "@/components/Games"
import Interests from "@/components/Interests"
import Porto from "@/components/Porto"
import s from "./about.module.css"

export default async function About({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const about = dict.about

  return (
    <>
      <DuotoneFilter />
      <div className={s.glows} aria-hidden="true">
        <span className={s.glowA} />
        <span className={s.glowB} />
      </div>
      <ContourLines />
      <OffTheClockHero lang={lang} text={about} languageLabel={dict.nav.language} />
      <main className={s.main} data-theme="blue">
        <RightNow text={about.now} learningHref="#learning" />
        <Soundtrack text={about.soundtrack} />
        <Learning id="learning" text={about.learning} />
        <Games lang={lang} text={about.games} />
        <Interests title={about.interestsTitle} text={about.interests} />
        <Porto text={about.porto} />
      </main>
      <SiteFooter lang={lang} text={dict.footer} nav={dict.nav} />
      <Reveals />
    </>
  )
}
