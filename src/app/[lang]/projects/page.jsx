import { getDictionary } from "@/content/lang"
import { projects } from "@/content/projects"
import ProjectSummary from "@/components/ProjectSummary"

export default async function Projects({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const main = []
  const early = []
  for (const project of projects) {
    if (project.early) {
      early.push(project)
    } else {
      main.push(project)
    }
  }

  return (
    <main>
      <h1>{dict.projects.title}</h1>
      {main.map((project) => (
        <ProjectSummary key={project.slug} project={project} lang={lang} text={dict.projects} />
      ))}

      <h2>{dict.projects.early}</h2>
      {early.map((project) => (
        <ProjectSummary key={project.slug} project={project} lang={lang} text={dict.projects} />
      ))}
    </main>
  )
}
