"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { defaultLanguage, hasLanguage, pathFor } from "@/content/lang/languages"
import text from "@/content/lang/not-found.json"

export default function NotFound() {
  const params = useParams()
  let lang = params.lang
  if (!hasLanguage(lang)) lang = defaultLanguage

  return (
    <main>
      <h1>{text[lang].title}</h1>
      <Link href={pathFor(lang, "/")}>{text[lang].back}</Link>
    </main>
  )
}
