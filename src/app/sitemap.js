import { siteUrl } from "@/content/site"
import { languages, defaultLanguage, localeOf, pathFor } from "@/content/lang/languages"
import { projects } from "@/content/projects"

function pagePaths() {
  const paths = ["/", "/about", "/projects"]
  for (const project of projects) {
    paths.push("/projects/" + project.slug)
  }
  return paths
}

function addressOf(lang, path) {
  return siteUrl + pathFor(lang, path)
}

export default function sitemap() {
  const entries = []
  for (const path of pagePaths()) {
    const versions = {}
    for (const lang of languages) {
      versions[localeOf(lang)] = addressOf(lang, path)
    }
    versions["x-default"] = addressOf(defaultLanguage, path)
    for (const lang of languages) {
      entries.push({ url: addressOf(lang, path), alternates: { languages: versions } })
    }
  }
  return entries
}
