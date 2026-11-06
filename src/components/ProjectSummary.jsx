import Link from "next/link"
import Image from "next/image"
import { pathFor } from "@/content/lang/languages"

export default function ProjectSummary({ project, lang, text }) {
  let meta = text.kinds[project.kind] + " · " + project.year
  if (project.freelance) {
    meta = meta + " · " + text.freelance
  }

  return (
    <article>
      <Image src={project.image} alt="" width={600} placeholder="blur" />
      <h3>
        <Link href={pathFor(lang, "/projects/" + project.slug)}>{project.title}</Link>
      </h3>
      <p>{meta}</p>
      <p>{text.items[project.slug].line}</p>
      <p>{project.stack.join(", ")}</p>
    </article>
  )
}
