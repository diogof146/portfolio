import Link from "next/link"
import { getDictionary } from "@/content/lang"
import { pathFor } from "@/content/lang/languages"
import { person, links } from "@/content/site"
import { featured, findProject } from "@/content/projects"
import { experience, yearsOf } from "@/content/experience"
import { toolbox } from "@/content/toolbox"
import ProjectSummary from "@/components/ProjectSummary"

export default async function Home({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const home = dict.home

  const featuredProjects = []
  for (const slug of featured) {
    featuredProjects.push(findProject(slug))
  }

  return (
    <main>
      <section>
        <h1>{person.name}</h1>
        <p>{home.role}</p>
        <p>{home.lead}</p>
        <p>{home.status}</p>
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p>{home.statement}</p>

      <section>
        <h2>{home.sections.work}</h2>
        {featuredProjects.map((project) => (
          <ProjectSummary key={project.slug} project={project} lang={lang} text={dict.projects} />
        ))}
      </section>

      <section>
        <h2>{home.sections.experience}</h2>
        {experience.map((item) => (
          <article key={item.id}>
            <h3>{dict.experience.items[item.id].short}</h3>
            <p>
              {yearsOf(item)} · {dict.experience.kinds[item.kind]}
            </p>
            <p>{dict.experience.items[item.id].text}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>{home.sections.toolbox}</h2>
        {toolbox.map((group) => (
          <article key={group.id}>
            <h3>{dict.toolbox.groups[group.id]}</h3>
            <p>{group.tools.join(", ")}</p>
            <p>{home.usedIn}:</p>
            <ul>
              {group.projects.map((slug) => (
                <li key={slug}>
                  <Link href={pathFor(lang, "/projects/" + slug)}>{findProject(slug).title}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>{home.sections.now}</h2>
        <ul>
          {home.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
