import { ImageResponse } from "next/og"
import { cacheLife } from "next/cache"
import { getDictionary } from "@/content/lang"
import { languages, hasLanguage } from "@/content/lang/languages"
import { person } from "@/content/site"
import { projects, featured, findProject } from "@/content/projects"
import Card, { SIZE } from "@/og/Card"
import { loadFonts, printFrom, fileOf, PORTRAIT, OFF_THE_CLOCK } from "@/og/assets"

export function generateStaticParams() {
  const params = []
  for (const lang of languages) {
    params.push({ lang: lang, page: ["home.png"] })
    params.push({ lang: lang, page: ["about.png"] })
    params.push({ lang: lang, page: ["projects.png"] })
    for (const project of projects) {
      params.push({ lang: lang, page: ["projects", project.slug + ".png"] })
    }
  }
  return params
}

function picture(print) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={print.src} width={print.width} height={print.height} alt="" />
}

async function homeCard(dict) {
  const home = dict.home
  const print = await printFrom(PORTRAIT,null, SIZE.height - 40, "inside")
  return (
    <Card
      label={home.hero.edition + " · " + home.hero.box.place}
      lines={person.name.split(" ")}
      lead={home.role}
      status={home.status}
      side={picture(print)}
      sideWidth={print.width + 40}
    />
  )
}

async function aboutCard(dict) {
  const about = dict.about
  const print = await printFrom(OFF_THE_CLOCK,460, SIZE.height, "cover")
  return <Card label={dict.home.hero.box.place} lines={about.heading} lead={about.lede} side={picture(print)} sideWidth={print.width} />
}

async function archiveCard(dict) {
  const text = dict.projects
  let first = projects[0].year
  let last = projects[0].year
  for (const project of projects) {
    if (project.year < first) first = project.year
    if (project.year > last) last = project.year
  }

  const prints = []
  for (const slug of featured.slice(0, 4)) {
    prints.push(await printFrom(fileOf(findProject(slug).image), 230, SIZE.height / 2, "cover"))
  }

  const grid = (
    <div style={{ display: "flex", flexWrap: "wrap", width: 460, height: SIZE.height }}>
      {prints.map(function (print, index) {
        return (
          <div key={index} style={{ display: "flex" }}>
            {picture(print)}
          </div>
        )
      })}
    </div>
  )

  return (
    <Card
      label={projects.length + " " + text.archive.projects + " · " + first + "–" + last}
      lines={[text.title]}
      lead={text.archive.intro}
      side={grid}
      sideWidth={460}
    />
  )
}

async function projectCard(dict, slug) {
  const project = findProject(slug)
  if (project === null) return null
  const text = dict.projects
  const print = await printFrom(fileOf(project.image), 460, SIZE.height, "cover")
  return (
    <Card
      label={text.kinds[project.kind] + " · " + project.year}
      lines={[project.title]}
      lead={text.items[slug].line}
      side={picture(print)}
      sideWidth={print.width}
    />
  )
}

async function cardFor(dict, page) {
  const name = page.join("/")
  if (name === "home.png") return homeCard(dict)
  if (name === "about.png") return aboutCard(dict)
  if (name === "projects.png") return archiveCard(dict)
  if (page.length === 2 && page[0] === "projects" && page[1].endsWith(".png")) {
    return projectCard(dict, page[1].slice(0, -4))
  }
  return null
}

async function pngFor(params) {
  "use cache"
  cacheLife("max")
  const { lang, page } = await params
  if (!hasLanguage(lang)) return null
  const dict = await getDictionary(lang)
  const card = await cardFor(dict, page)
  if (card === null) return null
  const image = new ImageResponse(card, { ...SIZE, fonts: await loadFonts() })
  return new Uint8Array(await image.arrayBuffer())
}

export async function GET(request, { params }) {
  const png = await pngFor(params)
  if (png === null) return new Response(null, { status: 404 })
  return new Response(png, { headers: { "Content-Type": "image/png" } })
}
