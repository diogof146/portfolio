import Link from "next/link"
import { pathFor } from "@/content/lang/languages"
import LanguageSwitch from "@/components/LanguageSwitch"

export default function SiteNav({ lang, dict }) {
  return (
    <nav>
      <Link href={pathFor(lang, "/")}>{dict.home}</Link>
      <Link href={pathFor(lang, "/projects")}>{dict.projects}</Link>
      <Link href={pathFor(lang, "/about")}>{dict.about}</Link>
      <LanguageSwitch lang={lang} label={dict.language} />
    </nav>
  )
}
