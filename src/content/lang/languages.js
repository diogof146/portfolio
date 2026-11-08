export const languages = ["en", "pt"]
export const defaultLanguage = "en"

const locales = { en: "en", pt: "pt-PT" }

export function localeOf(lang) {
  return locales[lang]
}

export function hasLanguage(lang) {
  return languages.includes(lang)
}

export function languageOf(path) {
  for (const lang of languages) {
    if (path === "/" + lang || path.startsWith("/" + lang + "/")) {
      return lang
    }
  }
  return null
}

export function addLanguage(lang, path) {
  if (path === "/") return "/" + lang
  return "/" + lang + path
}

export function stripLanguage(path) {
  const lang = languageOf(path)
  if (lang === null) return path
  const rest = path.slice(lang.length + 1)
  if (rest === "") return "/"
  return rest
}

export function pathFor(lang, path) {
  if (lang === defaultLanguage) return path
  return addLanguage(lang, path)
}
