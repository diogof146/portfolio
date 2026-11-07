import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { pathFor } from "@/content/lang/languages"
import Print from "@/components/Print"
import InkLayer from "@/components/InkLayer"
import WorkStrip from "@/components/WorkStrip"
import s from "./Work.module.css"

export default function Work({ lang, title, text, allProjects, projects, projectText }) {
  return (
    <section id="work" className={s.work} data-theme="paper">
      <div className={"section-head " + s.head}>
        <h2 className="display section-title" data-reveal="title">
          {title}
        </h2>
        <p className="body-text" data-reveal="fade">
          {text.intro}
        </p>
      </div>

      <WorkStrip>
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={pathFor(lang, "/projects/" + project.slug)}
            className={s.card}
            data-card
            data-cursor={text.view}
          >
            <div className={"mono " + s.meta}>
              <span>{project.year}</span>
              <span>{projectText.kinds[project.kind]}</span>
            </div>
            <div className={s.picture}>
              <Print src={project.image} sizes="(min-width: 1100px) 460px, 78vw">
                <InkLayer src={project.image.src} />
              </Print>
            </div>
            <div className={s.title}>
              {project.title}
              <ArrowUpRight size={22} aria-hidden="true" />
            </div>
            <div className={"mono " + s.stack}>{project.stack.join(" · ")}</div>
          </Link>
        ))}
        <Link href={pathFor(lang, "/projects")} className={s.allCard}>
          <span className="mono">{text.archive}</span>
          <b className="display">{allProjects}</b>
          <ArrowUpRight size={36} aria-hidden="true" />
        </Link>
      </WorkStrip>
    </section>
  )
}
