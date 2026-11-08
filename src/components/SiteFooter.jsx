import Link from "next/link"
import { pathFor } from "@/content/lang/languages"
import { person } from "@/content/site"
import { getLikeCount } from "@/lib/likes"
import PortoClock from "@/components/PortoClock"
import Socials from "@/components/Socials"
import LikeButton from "@/components/LikeButton"
import TopButton from "@/components/TopButton"
import TerminalButton from "@/components/TerminalButton"
import s from "./SiteFooter.module.css"

export default async function SiteFooter({ lang, text, nav, className }) {
  const likes = await getLikeCount()

  let footerClass = "mono " + s.footer
  if (className) footerClass = footerClass + " " + className

  return (
    <footer className={footerClass}>
      <span className={s.sign}>
        © 2026 {person.name}{" "}
        <span className="muted">
          · Porto <PortoClock />
        </span>
      </span>
      <Socials size={16} />
      <nav className={s.pages} aria-label={text.pages}>
        <Link href={pathFor(lang, "/")}>{nav.home}</Link>
        <Link href={pathFor(lang, "/projects")}>{nav.projects}</Link>
        <Link href={pathFor(lang, "/about")}>{nav.about}</Link>
      </nav>
      <span className={s.end}>
        {likes !== null && <LikeButton initialCount={likes} label={text.like} />}
        <TerminalButton label={text.terminal} className={s.touchOnly} />
        <TopButton label={text.top} />
      </span>
    </footer>
  )
}
