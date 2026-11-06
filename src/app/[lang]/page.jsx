import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { getDictionary } from "@/content/lang"
import { pathFor } from "@/content/lang/languages"
import { person, links } from "@/content/site"
import { featured, findProject } from "@/content/projects"
import { experience, yearsOf } from "@/content/experience"
import { toolbox } from "@/content/toolbox"
import { getLatestPush } from "@/lib/github"
import { getNow } from "@/lib/gist"
import ProjectSummary from "@/components/ProjectSummary"
import LatestPush from "@/components/LatestPush"
import NextExam from "@/components/NextExam"
import ContactForm from "@/components/ContactForm"

export default async function Home({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const home = dict.home
  const latestPush = await getLatestPush()
  const notes = await getNow(lang)

  const featuredProjects = []
  for (const slug of featured) {
    featuredProjects.push(findProject(slug))
  }

  return (
    <main>
      <section>
        <h1 data-reveal="chars">{person.name}</h1>
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
        <h2 data-reveal="title">{home.sections.work}</h2>
        {featuredProjects.map((project) => (
          <ProjectSummary key={project.slug} project={project} lang={lang} text={dict.projects} />
        ))}
      </section>

      <section>
        <h2 data-reveal="title">{home.sections.experience}</h2>
        {experience.map((item) => (
          <article key={item.id}>
            <h3>{dict.experience.items[item.id].short}</h3>
            <p>
              {yearsOf(item)} · {dict.experience.kinds[item.kind]}
            </p>
            <p>{dict.experience.items[item.id].text}</p>
            {item.photo && (
              <figure>
                <Image
                  src={item.photo}
                  alt={dict.experience.items[item.id].photo.title}
                  width={800}
                  placeholder="blur"
                />
                <figcaption>
                  {dict.experience.items[item.id].photo.title} · {dict.experience.items[item.id].photo.people}
                </figcaption>
              </figure>
            )}
          </article>
        ))}
      </section>

      <section>
        <h2 data-reveal="title">{home.sections.toolbox}</h2>
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
        <h2 data-reveal="title">{home.sections.now}</h2>
        <LatestPush label={home.latestPush} push={latestPush} lang={lang} />
        <Suspense fallback={null}>
          <NextExam text={home.nextExam} lang={lang} />
        </Suspense>
        {notes && (
          <ul>
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 data-reveal="title">{home.sections.contact}</h2>
        <ContactForm text={home.contact} />
      </section>
    </main>
  )
}
