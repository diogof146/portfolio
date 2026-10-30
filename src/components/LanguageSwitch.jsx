"use client"

import { usePathname } from "next/navigation"
import { languages, addLanguage, stripLanguage } from "@/content/lang/languages"

export default function LanguageSwitch({ lang, label }) {
  const page = stripLanguage(usePathname())

  return (
    <span role="group" aria-label={label}>
      {languages.map((code) => (
        <a key={code} href={addLanguage(code, page)} hrefLang={code} aria-current={code === lang}>
          {code.toUpperCase()}
        </a>
      ))}
    </span>
  )
}
