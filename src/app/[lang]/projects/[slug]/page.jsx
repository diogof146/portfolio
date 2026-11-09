import { notFound } from "next/navigation"
import { getDictionary } from "@/content/lang"
import { projects, findProject, projectsInOrder } from "@/content/projects"
import ContourLines from "@/components/ContourLines"
import DuotoneFilter from "@/components/DuotoneFilter"
import ProjectPage from "@/components/ProjectPage"
import SiteFooter from "@/components/SiteFooter"
import Reveals from "@/components/Reveals"
import { pageMetadata } from "../../seo"

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const project = findProject(slug)
  if (project === null) notFound()
  const dict = await getDictionary(lang)
  const text = dict.projects.items[slug]
  return pageMetadata(lang, "/projects/" + slug, project.title, text.description)
}

export function generateStaticParams() {
  const params = []
  for (const project of projects) {
    params.push({ slug: project.slug })
  }
  return params
}

export default async function Project({ params }) {
  const { lang, slug } = await params
  const project = findProject(slug)
  if (project === null) notFound()

  const dict = await getDictionary(lang)
  const ordered = projectsInOrder()
  let index = 0
  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i].slug === slug) index = i
  }
  const next = ordered[(index + 1) % ordered.length]

  return (
    <>
      <DuotoneFilter />
      <ContourLines />
      <main>
        <ProjectPage
          lang={lang}
          project={project}
          text={dict.projects}
          nav={dict.nav}
          position={index + 1}
          total={ordered.length}
          next={next}
        />
      </main>
      <SiteFooter lang={lang} text={dict.footer} nav={dict.nav} />
      <Reveals />
    </>
  )
}
