import { person } from "@/content/site"
import { languages, defaultLanguage, localeOf, pathFor } from "@/content/lang/languages"

const OPEN_GRAPH_LOCALES = { en: "en_US", pt: "pt_PT" }

function languageLinks(path) {
  const links = {}
  for (const lang of languages) {
    links[localeOf(lang)] = pathFor(lang, path)
  }
  links["x-default"] = pathFor(defaultLanguage, path)
  return links
}

function otherLocales(lang) {
  const list = []
  for (const other of languages) {
    if (other !== lang) list.push(OPEN_GRAPH_LOCALES[other])
  }
  return list
}

function imageOf(lang, path, alt) {
  let name = path
  if (path === "/") name = "/home"
  return { url: "/og/" + lang + name + ".png", width: 1200, height: 630, alt: alt }
}

export function pageMetadata(lang, path, title, description) {
  let fullTitle = person.name
  if (title) fullTitle = title + " · " + person.name
  const url = pathFor(lang, path)
  const image = imageOf(lang, path, fullTitle)

  return {
    title: fullTitle,
    description: description,
    alternates: { canonical: url, languages: languageLinks(path) },
    openGraph: {
      type: "website",
      siteName: person.name,
      title: fullTitle,
      description: description,
      url: url,
      locale: OPEN_GRAPH_LOCALES[lang],
      alternateLocale: otherLocales(lang),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: description, images: [image] },
  }
}
