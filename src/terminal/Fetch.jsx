import { useEffect, useState } from "react"
import PortoClock from "@/components/PortoClock"
import { links } from "@/content/site"
import { figlet } from "./ascii"
import s from "./terminal.module.css"

const HAT = [
  { line: "           ___________", band: false },
  { line: "       _.-'           '-._", band: false },
  { line: "     .'                   '.", band: false },
  { line: "    /                       \\", band: false },
  { line: "   |=========================|", band: true },
  { line: " __|_________________________|__", band: false },
  { line: "(_______________________________)", band: false },
]

const FCP = figlet("FCP")
const PALETTE = ["#0a1219", "#ff7d93", "#7fd6a4", "#f0c27b", "#2f7fd8", "#b9a0ff", "#00aeef", "#d5e5ee"]
const SWAP_EVERY = 7000

const UNITS = [
  { size: 60, name: "s" },
  { size: 60, name: "min" },
  { size: 24, name: "h" },
  { size: 7, name: "d" },
  { size: 4.35, name: "wk" },
]

function timeAgo(date, now) {
  let value = Math.max(1, Math.round((now - new Date(date).getTime()) / 1000))
  for (const unit of UNITS) {
    if (value < unit.size) return Math.floor(value) + " " + unit.name + " ago"
    value = value / unit.size
  }
  return Math.floor(value) + " mo ago"
}

function Hat() {
  return (
    <pre className={s.fetchLogo} aria-hidden="true">
      {HAT.map(function (part, index) {
        return (
          <span key={index} className={part.band ? s.red : s.amber}>
            {part.line + "\n"}
          </span>
        )
      })}
    </pre>
  )
}

function StripedLine({ line }) {
  const characters = []
  for (let x = 0; x < line.length; x++) {
    let colour = s.blue
    if (Math.floor(x / 3) % 2 === 1) colour = s.fg
    characters.push(
      <span key={x} className={colour}>
        {line[x]}
      </span>,
    )
  }
  return characters
}

function Club() {
  return (
    <pre className={s.fetchLogo} aria-hidden="true">
      {FCP.map(function (line, index) {
        return (
          <span key={index}>
            <StripedLine line={line} />
            {"\n"}
          </span>
        )
      })}
    </pre>
  )
}

function Row({ name, children }) {
  return (
    <div className={s.row}>
      <dt className={s.cyan}>{name}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function Pushed({ live }) {
  if (!live || !live.push) return null
  const repo = live.push.repo.split("/")[1]
  return (
    <Row name="pushed">
      <a href={live.push.url} target="_blank" rel="noreferrer">
        {repo}
      </a>{" "}
      <span className={s.dim}>{"· " + timeAgo(live.push.date, live.at)}</span>
    </Row>
  )
}

export default function Fetch({ big, live }) {
  const [logo, setLogo] = useState("hat")

  function swap() {
    setLogo(function (current) {
      if (current === "hat") return "club"
      return "hat"
    })
  }

  useEffect(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(swap, SWAP_EVERY)
    return function () {
      clearInterval(timer)
    }
  }, [])

  let status = "open to work"
  if (big) status = "open to internships, junior roles & freelance"

  let className = s.fetch
  if (big) className = className + " " + s.big

  return (
    <div className={className}>
      <button type="button" className={s.fetchSwap} onClick={swap} aria-label="Swap the logo">
        {logo === "hat" ? <Hat /> : <Club />}
      </button>
      <dl className={s.info}>
        <div className={s.infoHead}>
          <span className={s.cyan}>diogo</span>@<span className={s.cyan}>porto</span>
        </div>
        <div className={s.rule} aria-hidden="true" />
        <Row name="os">macOS</Row>
        <Row name="shell">zsh</Row>
        <Row name="editor">neovim (lua, from scratch)</Row>
        <Row name="wm">this site</Row>
        <Row name="local">
          Porto · <PortoClock />
        </Row>
        <Row name="status">
          <i className={s.okDot} aria-hidden="true" /> {status}
        </Row>
        <Pushed live={live} />
        {big && (
          <Row name="links">
            {links.map(function (link) {
              return (
                <a key={link.name} className={s.link} href={link.url} target="_blank" rel="noreferrer">
                  {link.name.toLowerCase()}
                </a>
              )
            })}
          </Row>
        )}
        <div className={s.palette} aria-hidden="true">
          {PALETTE.map(function (colour) {
            return <i key={colour} style={{ background: colour }} />
          })}
        </div>
      </dl>
    </div>
  )
}
