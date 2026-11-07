import Image from "next/image"
import { notFound } from "next/navigation"
import { getDictionary } from "@/content/lang"
import SiteNav from "@/components/SiteNav"
import SiteFooter from "@/components/SiteFooter"
import { projects, findProject } from "@/content/projects"

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
  const text = dict.projects

  return (
    <>
      <SiteNav lang={lang} dict={dict.nav} />
      <main>
        <h1>{project.title}</h1>
        <Image src={project.image} alt="" width={1200} placeholder="blur" preload />
        <p>
          {text.kinds[project.kind]} · {project.year}
        </p>
        <p>{text.items[slug].description}</p>
        <p>{project.stack.join(", ")}</p>
        <p>
          <a href={project.github} target="_blank" rel="noreferrer">
            {text.links.code}
          </a>
          {project.live && (
            <>
              {" · "}
              <a href={project.live} target="_blank" rel="noreferrer">
                {text.links.live}
              </a>
            </>
          )}
        </p>
      </main>
      <SiteFooter lang={lang} text={dict.footer} nav={dict.nav} />
    </>
  )
}
