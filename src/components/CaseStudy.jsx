import { stackKinds } from "@/content/stack"
import Exploded from "@/components/Exploded"
import s from "./CaseStudy.module.css"

function Paragraphs({ items }) {
  return items.map((text) => {
    let className = s.paragraph
    if (text.startsWith("[TBW")) className = s.paragraph + " " + s.placeholder
    return (
      <p key={text} className={className}>
        {text}
      </p>
    )
  })
}

export default function CaseStudy({ project, content, text }) {
  const layers = []
  for (const tool of project.stack) {
    let role = text.page.tbw
    if (content.layers && content.layers[tool]) role = content.layers[tool]
    layers.push({ name: tool, kind: stackKinds[tool], kindLabel: text.stackKinds[stackKinds[tool]], role: role })
  }

  return (
    <div className={s.case}>
      {content.sections.map((section, index) => (
        <section key={section.title} className={s.section}>
          <header className={s.sectionHead}>
            <span className={"mono " + s.number}>{"0" + (index + 1)}</span>
            <h2 className={"display " + s.title} data-reveal="title">
              {section.title}
            </h2>
          </header>
          <div className={s.body}>
            <Paragraphs items={section.body} />
            {section.stack && <Exploded layers={layers} />}
          </div>
        </section>
      ))}
    </div>
  )
}
