import { Suspense } from "react"
import { getDictionary } from "@/content/lang"
import { pathFor } from "@/content/lang/languages"
import { person } from "@/content/site"
import { featured, findProject } from "@/content/projects"
import { toolbox } from "@/content/toolbox"
import { getLatestPush } from "@/lib/github"
import { getNow } from "@/lib/gist"
import Contact from "@/components/Contact"
import ContourLines from "@/components/ContourLines"
import Hero from "@/components/Hero"
import LabelBox from "@/components/LabelBox"
import Panel from "@/components/Panel"
import NowCard from "@/components/NowCard"
import Statement from "@/components/Statement"
import Work from "@/components/Work"
import Experience from "@/components/Experience"
import Toolbox from "@/components/Toolbox"
import Now from "@/components/Now"
import DuotoneFilter from "@/components/DuotoneFilter"
import Reveals from "@/components/Reveals"
import s from "./home.module.css"

const SECTION_IDS = ["work", "experience", "toolbox", "now", "contact"]

export default async function Home({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const home = dict.home
  const latestPush = await getLatestPush()
  const notes = await getNow(lang)

  const sections = []
  for (const id of SECTION_IDS) {
    sections.push({ id: id, title: home.sections[id] })
  }

  const toolGroups = []
  for (const group of toolbox) {
    const projects = []
    for (const slug of group.projects) {
      projects.push({ title: findProject(slug).title, href: pathFor(lang, "/projects/" + slug) })
    }
    toolGroups.push({ id: group.id, name: dict.toolbox.groups[group.id], tools: group.tools, projects: projects })
  }

  const featuredProjects = []
  for (const slug of featured) {
    featuredProjects.push(findProject(slug))
  }

  return (
    <>
      <DuotoneFilter />
      <ContourLines />
      <Hero text={home}>
        <LabelBox text={home.hero.box} />
      </Hero>
      <Panel
        lang={lang}
        text={home.panel}
        name={person.name}
        role={home.role}
        status={home.hero.box.open}
        place={home.hero.box.place}
        languageLabel={dict.nav.language}
        sections={sections}
        allProjectsHref={pathFor(lang, "/projects")}
        face={<LabelBox text={home.hero.box} />}
        nowCard={
          <Suspense fallback={null}>
            <NowCard text={home.hero.box} />
          </Suspense>
        }
      />
      <main className={s.withPanel}>
        <Statement text={home.statement} label={home.statementLabel} />

        <Work
          lang={lang}
          title={home.sections.work}
          text={home.work}
          allProjects={home.panel.allProjects}
          projects={featuredProjects}
          projectText={dict.projects}
        />

        <Experience title={home.sections.experience} text={dict.experience} />

        <Toolbox title={home.sections.toolbox} text={dict.toolbox} groups={toolGroups} />

        <Now
          lang={lang}
          title={home.sections.now}
          text={home}
          push={latestPush}
          notes={notes}
          aboutHref={pathFor(lang, "/about")}
          aboutTitle={dict.nav.about}
        />

        <Contact lang={lang} text={home.contact} footerText={dict.footer} nav={dict.nav} />
      </main>
      <Reveals />
    </>
  )
}
