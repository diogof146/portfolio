import { notFound } from "next/navigation"
import { hasLanguage } from "./languages"

export async function getDictionary(lang) {
  if (!hasLanguage(lang)) notFound()
  const file = await import(`./${lang}.json`)
  return file.default
}
