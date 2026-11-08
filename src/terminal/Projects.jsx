import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { projects } from "@/content/projects"
import text from "@/content/lang/en.json"
import s from "./terminal.module.css"

const FOLDERS = [
  { name: "all", kinds: null },
  { name: "games", kinds: ["game"] },
  { name: "web", kinds: ["web"] },
  { name: "backend", kinds: ["backend"] },
  { name: "apps", kinds: ["app"] },
  { name: "tools", kinds: ["tools", "cli"] },
]

const NEWEST_FIRST = projects.slice().sort(function (a, b) {
  return b.year - a.year
})

function listOf(folder) {
  const kinds = FOLDERS[folder].kinds
  if (kinds === null) return NEWEST_FIRST
  const list = []
  for (const project of NEWEST_FIRST) {
    if (kinds.includes(project.kind)) list.push(project)
  }
  return list
}

function liveLabel(url) {
  if (url.includes("itch.io")) return "play"
  return "visit"
}

function Preview({ project, onPage }) {
  return (
    <article className={s.preview} key={project.slug}>
      <div className={s.previewImage}>
        <Image src={project.image} alt={project.title + " screenshot"} fill sizes="(min-width: 900px) 34vw, 90vw" />
      </div>
      <h2 className={s.previewTitle}>{project.title}</h2>
      <p className={s.dim}>{text.projects.kinds[project.kind].toLowerCase() + " · " + project.year}</p>
      <p>{text.projects.items[project.slug].line + "."}</p>
      <ul className={s.tags}>
        {project.stack.map(function (tool) {
          return <li key={tool}>{tool}</li>
        })}
      </ul>
      <div className={s.actions}>
        <button
          type="button"
          className={s.button}
          onClick={function () {
            onPage(project.slug)
          }}
        >
          page
        </button>
        {project.github && (
          <a className={s.button} href={project.github} target="_blank" rel="noreferrer">
            github <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
        {project.live && (
          <a className={s.button + " " + s.buttonHot} href={project.live} target="_blank" rel="noreferrer">
            {liveLabel(project.live)} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}

export default function Projects({ big, active, onPage }) {
  const [folder, setFolder] = useState(0)
  const [selected, setSelected] = useState(0)

  const list = listOf(folder)
  const index = Math.min(selected, Math.max(0, list.length - 1))
  const project = list[index]

  function changeFolder(next) {
    setFolder((next + FOLDERS.length) % FOLDERS.length)
    setSelected(0)
  }

  useEffect(
    function () {
      if (!active) return

      function shift(step) {
        setFolder((folder + step + FOLDERS.length) % FOLDERS.length)
        setSelected(0)
      }

      function onKey(event) {
        if (event.metaKey || event.ctrlKey || event.altKey) return
        if (event.target instanceof Element && event.target.closest("input, textarea")) return
        if (event.key === "j" || event.key === "ArrowDown") setSelected(Math.min(list.length - 1, index + 1))
        else if (event.key === "k" || event.key === "ArrowUp") setSelected(Math.max(0, index - 1))
        else if (event.key === "l" || event.key === "ArrowRight") shift(1)
        else if (event.key === "h" || event.key === "ArrowLeft") shift(-1)
        else if (event.key === "Enter" && project) onPage(project.slug)
        else if (event.key === "o" && project) window.open(project.live || project.github, "_blank", "noopener")
        else return
        event.preventDefault()
      }

      window.addEventListener("keydown", onKey)
      return function () {
        window.removeEventListener("keydown", onKey)
      }
    },
    [active, list.length, index, folder, project, onPage],
  )

  let path = "~/projects/"
  if (FOLDERS[folder].name !== "all") path = path + FOLDERS[folder].name + "/"

  let className = s.yazi
  if (big) className = className + " " + s.big

  return (
    <div className={className}>
      <p className={s.cyan}>{path}</p>

      <div className={s.columns}>
        {big && (
          <ul className={s.folders} aria-label="Folders">
            {FOLDERS.map(function (item, position) {
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    className={s.entry}
                    aria-current={position === folder}
                    onClick={function () {
                      changeFolder(position)
                    }}
                  >
                    <span className={s.violet}>▸</span> {item.name + "/"}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <ul className={s.files} aria-label="Projects">
          {list.map(function (item, position) {
            return (
              <li key={item.slug}>
                <button
                  type="button"
                  className={s.entry}
                  aria-current={position === index}
                  onMouseEnter={function () {
                    if (big) setSelected(position)
                  }}
                  onClick={function () {
                    setSelected(position)
                  }}
                >
                  <span className={s.fileName}>{item.slug + "/"}</span>
                  <span className={s.dim}>{item.year}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {big && project && <Preview project={project} onPage={onPage} />}
      </div>

      {big && (
        <p className={s.hint}>
          <span className={s.cyan}>j/k</span> move · <span className={s.cyan}>h/l</span> folder · <span className={s.cyan}>enter</span> page ·{" "}
          <span className={s.cyan}>o</span> open
        </p>
      )}
    </div>
  )
}
