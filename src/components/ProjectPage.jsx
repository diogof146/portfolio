import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { pathFor } from "@/content/lang/languages"
import { stackKinds } from "@/content/stack"
import LanguageSwitch from "@/components/LanguageSwitch"
import Print from "@/components/Print"
import InkLayer from "@/components/InkLayer"
import CaseStudy from "@/components/CaseStudy"
import Download from "@/components/Download"
import s from "./ProjectPage.module.css"

function twoDigits(number) {
  if (number < 10) return "0" + number
  return String(number)
}

export default function ProjectPage({ lang, project, text, nav, position, total, next }) {
  const item = text.items[project.slug]
  const page = text.page

  let liveLabel = text.links.live
  if (project.live && project.live.includes("itch.io")) liveLabel = page.play

  let role = null
  if (item.case) role = item.case.role

  return (
    <article className={s.page}>
      <div className={"mono " + s.top}>
        <Link href={pathFor(lang, "/projects")} className={s.back}>
          <ArrowLeft size={14} aria-hidden="true" /> {page.back}
        </Link>
        <span>{twoDigits(position) + " " + page.of + " " + twoDigits(total)}</span>
        <span className={s.languages}>
          <LanguageSwitch lang={lang} label={nav.language} />
        </span>
      </div>

      <header className={s.head}>
        <span className="mono muted">{text.kinds[project.kind] + " · " + project.year}</span>
        <h1 className={"display " + s.title} data-reveal="title">
          {project.title}
        </h1>
        <p className="lead" data-reveal="fade">
          {item.line}
        </p>
      </header>

      <div className={s.hero}>
        <Print src={project.image} alt={project.title} sizes="(min-width: 1200px) 1140px, 100vw" preload>
          <InkLayer src={project.image.src} scrub />
        </Print>
      </div>

      <div className={s.overview}>
        <p className={s.description}>{item.description}</p>
        <dl className={s.facts}>
          <div>
            <dt className="mono muted">{page.year}</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="mono muted">{page.kind}</dt>
            <dd>{text.kinds[project.kind]}</dd>
          </div>
          {role && (
            <div>
              <dt className="mono muted">{page.role}</dt>
              <dd>{role}</dd>
            </div>
          )}
          <div className={s.wide}>
            <dt className="mono muted">{page.stack}</dt>
            <dd>
              <ul className={s.stack}>
                {project.stack.map((tool) => (
                  <li key={tool}>
                    {tool} <span className="mono muted">{text.stackKinds[stackKinds[tool]]}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={s.wide}>
            <dt className="mono muted">{page.links}</dt>
            <dd className={s.links}>
              {project.github && (
                <a className="btn-ghost" href={project.github} target="_blank" rel="noreferrer">
                  {text.links.code} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {project.live && (
                <a className="btn" href={project.live} target="_blank" rel="noreferrer">
                  {liveLabel} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {project.itchId && project.platforms && (
                <Download itchId={project.itchId} platforms={project.platforms} text={page} />
              )}
            </dd>
          </div>
        </dl>
      </div>

      {item.case && <CaseStudy project={project} content={item.case} text={text} />}

      <Link className={s.next} href={pathFor(lang, "/projects/" + next.slug)}>
        <span className="mono muted">{page.next}</span>
        <span className={"display " + s.nextTitle}>{next.title}</span>
        <ArrowRight size={36} aria-hidden="true" />
      </Link>
    </article>
  )
}
