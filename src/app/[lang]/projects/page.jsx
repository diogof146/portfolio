import { getDictionary } from "@/content/lang"
import { pathFor } from "@/content/lang/languages"
import { projectsInOrder } from "@/content/projects"
import ContourLines from "@/components/ContourLines"
import DuotoneFilter from "@/components/DuotoneFilter"
import Archive from "@/components/Archive"
import SiteFooter from "@/components/SiteFooter"
import Reveals from "@/components/Reveals"
import { pageMetadata } from "../seo"

export async function generateMetadata({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return pageMetadata(lang, "/projects", dict.projects.title, dict.projects.archive.intro)
}

function groupOf(project) {
  if (project.early) return "early"
  return String(project.year)
}

function buildRows(ordered, lang, text) {
  const rows = []
  let previousGroup = null
  for (const project of ordered) {
    const group = groupOf(project)
    if (group !== previousGroup) {
      let label = group
      if (group === "early") label = text.archive.early
      rows.push({ type: "group", key: "group-" + group, group: group, label: label })
      previousGroup = group
    }

    let liveLabel = text.links.live
    if (project.live && project.live.includes("itch.io")) liveLabel = text.page.play

    rows.push({
      type: "project",
      key: project.slug,
      group: group,
      slug: project.slug,
      kind: project.kind,
      kindLabel: text.kinds[project.kind],
      year: project.year,
      title: project.title,
      line: text.items[project.slug].line,
      stack: project.stack,
      image: project.image,
      github: project.github || null,
      live: project.live || null,
      liveLabel: liveLabel,
      href: pathFor(lang, "/projects/" + project.slug),
    })
  }
  return rows
}

function buildKinds(ordered, text) {
  const kinds = [{ key: "all", label: text.archive.all, count: ordered.length }]
  for (const project of ordered) {
    let found = null
    for (const kind of kinds) {
      if (kind.key === project.kind) found = kind
    }
    if (found) {
      found.count = found.count + 1
    } else {
      kinds.push({ key: project.kind, label: text.kinds[project.kind], count: 1 })
    }
  }
  return kinds
}

function yearSpan(ordered) {
  let first = null
  let last = null
  for (const project of ordered) {
    if (project.early) continue
    if (first === null || project.year < first) first = project.year
    if (last === null || project.year > last) last = project.year
  }
  return first + "–" + last
}

export default async function Projects({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const text = dict.projects
  const ordered = projectsInOrder()

  return (
    <>
      <DuotoneFilter />
      <ContourLines />
      <main>
        <Archive
          lang={lang}
          text={text}
          nav={dict.nav}
          rows={buildRows(ordered, lang, text)}
          kinds={buildKinds(ordered, text)}
          count={ordered.length}
          span={yearSpan(ordered)}
          homeHref={pathFor(lang, "/")}
        />
      </main>
      <SiteFooter lang={lang} text={dict.footer} nav={dict.nav} />
      <Reveals />
    </>
  )
}
