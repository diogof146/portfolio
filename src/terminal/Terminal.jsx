"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { usePathname, useRouter } from "next/navigation"
import { CircleHelp, Power } from "lucide-react"
import { defaultLanguage, languageOf, pathFor } from "@/content/lang/languages"
import PortoClock from "@/components/PortoClock"
import { isTerminalShortcut } from "@/components/TerminalLauncher"
import { projects } from "@/content/projects"
import { mono } from "./font"
import { SPACES, WINDOWS } from "./windows"
import Window from "./Window"
import Help from "./Help"
import Shell from "./Shell"
import Fetch from "./Fetch"
import Music from "./Music"
import Steam from "./Steam"
import Projects from "./Projects"
import Tab from "./Tab"
import Wttr from "./Wttr"
import s from "./terminal.module.css"

gsap.registerPlugin(useGSAP)

const GAP = 10
const NARROW = "(max-width: 899px)"
const TYPING = "input, textarea, [contenteditable]"
const INTERACTIVE = "a, button, input, textarea, select, label"

const BOOT = [
  { ok: true, text: "Started Session 1 of User diogo." },
  { ok: true, text: "Mounted /home/diogo/projects (" + projects.length + " projects)." },
  { ok: true, text: "Started spotify-now-playing.service." },
  { ok: true, text: "Started steam-library.service." },
  { ok: true, text: "Started porto-clock.service." },
  { ok: true, text: "Reached target Open To Work." },
  { ok: false, text: "Starting hyprland…" },
]

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function watchNarrow(onChange) {
  const query = window.matchMedia(NARROW)
  query.addEventListener("change", onChange)
  return function () {
    query.removeEventListener("change", onChange)
  }
}

function readNarrow() {
  return window.matchMedia(NARROW).matches
}

function readNarrowOnServer() {
  return false
}

function firstWindows() {
  const ids = []
  for (const space of SPACES) ids.push(space.windows[0])
  return ids
}

function startingOrders() {
  const orders = []
  for (const space of SPACES) orders.push(space.windows)
  return orders
}

function spaceOf(id) {
  for (let i = 0; i < SPACES.length; i++) {
    if (SPACES[i].windows.includes(id)) return i
  }
  return -1
}

function windowList() {
  const list = []
  for (const space of SPACES) {
    for (const id of space.windows) list.push({ name: WINDOWS[id].name, title: WINDOWS[id].title })
  }
  return list
}

function findWindow(name) {
  for (const id of Object.keys(WINDOWS)) {
    if (id === name || WINDOWS[id].name === name) return id
  }
  return null
}

function isTyping(target) {
  return target instanceof Element && target.closest(TYPING) !== null
}

function replaceAt(list, index, value) {
  const copy = list.slice()
  copy[index] = value
  return copy
}

function sideGap(from, to, dx, dy) {
  if (dx > 0) return to.left - from.right
  if (dx < 0) return from.left - to.right
  if (dy > 0) return to.top - from.bottom
  return from.top - to.bottom
}

function BootLine({ line }) {
  if (!line.ok) return <p data-line>{"         " + line.text}</p>
  return (
    <p data-line>
      [ <span className={s.green}>OK</span> ] {line.text}
    </p>
  )
}

export default function Terminal({ boot: withBoot, onExit }) {
  const root = useRef(null)
  const boot = useRef(null)
  const areas = useRef([])
  const windows = useRef({})
  const placed = useRef(false)
  const shown = useRef(firstWindows())
  const tucked = useRef(new Set())
  const swipe = useRef(null)
  const settling = useRef(0)
  const sliding = useRef(null)
  const closing = useRef(false)

  const router = useRouter()
  const pathname = usePathname()
  const narrow = useSyncExternalStore(watchNarrow, readNarrow, readNarrowOnServer)
  const [space, setSpace] = useState(0)
  const [orders, setOrders] = useState(startingOrders)
  const [focus, setFocus] = useState(firstWindows)
  const [help, setHelp] = useState(false)
  const [live, setLive] = useState(null)

  useEffect(function () {
    let alive = true
    fetch("/api/terminal")
      .then(function (response) {
        if (!response.ok) throw new Error("/api/terminal: " + response.status)
        return response.json()
      })
      .then(function (data) {
        if (alive) setLive({ ...data, at: Date.now() })
      })
      .catch(function (error) {
        console.warn("The terminal's live data didn't load:", error)
      })
    return function () {
      alive = false
    }
  }, [])

  const exit = useCallback(
    function () {
      if (closing.current) return
      closing.current = true
      delete document.documentElement.dataset.covered
      if (reducedMotion()) {
        onExit()
        return
      }
      gsap
        .timeline({ onComplete: onExit })
        .to(root.current, { scaleY: 0.006, duration: 0.28, ease: "power3.in" })
        .to(root.current, { scaleX: 0, autoAlpha: 0, duration: 0.2, ease: "power2.in" })
    },
    [onExit],
  )

  useEffect(function () {
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    const previousFocus = document.activeElement
    html.style.overflow = "hidden"
    html.dataset.covered = "true"
    if (!root.current.contains(document.activeElement)) root.current.focus({ preventScroll: true })

    return function () {
      html.style.overflow = previousOverflow
      delete html.dataset.covered
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  const layout = useCallback(
    function (animate) {
      for (let i = 0; i < SPACES.length; i++) {
        const area = areas.current[i]
        if (!area) continue
        const width = area.clientWidth
        const height = area.clientHeight
        const ids = orders[i]
        let rects = []
        if (narrow) {
          for (let k = 0; k < ids.length; k++) rects.push({ x: 0, y: 0, w: width, h: height })
        } else {
          rects = SPACES[i].layout(ids.length, width, height, GAP)
        }
        for (let k = 0; k < ids.length; k++) {
          const rect = rects[k]
          const to = { left: rect.x, top: rect.y, width: rect.w, height: rect.h }
          if (animate) gsap.to(windows.current[ids[k]], { ...to, duration: 0.65, ease: "expo.inOut", overwrite: "auto" })
          else gsap.set(windows.current[ids[k]], to)
        }
      }
    },
    [orders, narrow],
  )

  useEffect(
    function () {
      layout(placed.current)
      placed.current = true
    },
    [layout],
  )

  useEffect(
    function () {
      const observer = new ResizeObserver(function () {
        layout(false)
      })
      observer.observe(root.current)
      return function () {
        observer.disconnect()
      }
    },
    [layout],
  )

  useEffect(
    function () {
      for (let i = 0; i < SPACES.length; i++) {
        const ids = SPACES[i].windows
        let direction = 1
        if (ids.indexOf(focus[i]) < ids.indexOf(shown.current[i])) direction = -1

        for (const id of ids) {
          const element = windows.current[id]
          const hidden = tucked.current.has(id)
          if (!narrow || focus[i] === id) {
            if (!hidden) continue
            tucked.current.delete(id)
            if (narrow) gsap.fromTo(element, { autoAlpha: 0, x: 60 * direction }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "expo.out" })
            else gsap.set(element, { autoAlpha: 1, x: 0 })
          } else {
            if (hidden) continue
            tucked.current.add(id)
            gsap.to(element, { autoAlpha: 0, x: -60 * direction, duration: 0.3, ease: "power2.in", overwrite: "auto" })
          }
        }
      }
      shown.current = focus
    },
    [focus, narrow],
  )

  useGSAP(
    function () {
      for (let i = 1; i < SPACES.length; i++) gsap.set(areas.current[i], { xPercent: 100, visibility: "hidden" })
      if (reducedMotion() || !withBoot) gsap.set(boot.current, { autoAlpha: 0 })
      if (reducedMotion()) return

      let first = SPACES[0].windows
      if (readNarrow()) first = [SPACES[0].windows[0]]
      const popping = []
      for (const id of first) popping.push(windows.current[id])
      const popIn = { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "expo.out", stagger: 0.07 }
      const popFrom = { opacity: 0, scale: 0.94, y: 18 }

      if (!withBoot) {
        gsap
          .timeline()
          .fromTo(root.current, { scaleX: 0, scaleY: 0.006, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.2, ease: "power2.out" })
          .to(root.current, { scaleY: 1, duration: 0.28, ease: "power3.out" })
          .fromTo(popping, popFrom, popIn, 0.3)
        return
      }

      const timeline = gsap.timeline()
      timeline.from(boot.current.querySelectorAll("[data-line]"), { autoAlpha: 0, duration: 0.01, stagger: 0.08 })
      timeline.to(boot.current, { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, "+=0.25")
      timeline.fromTo(popping, popFrom, popIn, "<0.15")

      function skip() {
        timeline.progress(1)
      }
      window.addEventListener("keydown", skip, { once: true })
      window.addEventListener("pointerdown", skip, { once: true })
      return function () {
        window.removeEventListener("keydown", skip)
        window.removeEventListener("pointerdown", skip)
      }
    },
    { scope: root },
  )

  const go = useCallback(
    function (next) {
      if (next === space || next < 0 || next >= SPACES.length) return
      let direction = 1
      if (next < space) direction = -1
      const from = areas.current[space]
      const to = areas.current[next]
      if (sliding.current) sliding.current.kill()
      for (const area of areas.current) {
        if (area !== from && area !== to) gsap.set(area, { visibility: "hidden" })
      }
      sliding.current = gsap
        .timeline()
        .set(from, { visibility: "visible" })
        .set(to, { visibility: "visible", xPercent: 100 * direction })
        .to(from, { xPercent: -100 * direction, duration: 0.7, ease: "expo.inOut" }, 0)
        .to(to, { xPercent: 0, duration: 0.7, ease: "expo.inOut" }, 0)
        .set(from, { visibility: "hidden" })
      setSpace(next)
    },
    [space],
  )

  const focusOn = useCallback(
    function (id, where = space) {
      setFocus(function (current) {
        return replaceAt(current, where, id)
      })
    },
    [space],
  )

  const hoverFocus = useCallback(
    function (id, where) {
      if (performance.now() > settling.current) focusOn(id, where)
    },
    [focusOn],
  )

  const zoom = useCallback(
    function (id, where = space) {
      focusOn(id, where)
      settling.current = performance.now() + 800
      setOrders(function (current) {
        const ids = current[where]
        if (ids[0] === id) return current
        const next = ids.slice()
        const index = next.indexOf(id)
        next[index] = next[0]
        next[0] = id
        return replaceAt(current, where, next)
      })
    },
    [space, focusOn],
  )

  const cycle = useCallback(
    function (step) {
      let ids = orders[space]
      if (narrow) ids = SPACES[space].windows
      const index = ids.indexOf(focus[space])
      focusOn(ids[(index + step + ids.length) % ids.length])
    },
    [narrow, orders, space, focus, focusOn],
  )

  const moveFocus = useCallback(
    function (dx, dy) {
      if (narrow) {
        cycle(dx + dy)
        return
      }
      const from = windows.current[focus[space]].getBoundingClientRect()
      let across = [from.left, from.right]
      if (dx) across = [from.top, from.bottom]

      let best = null
      let bestScore = Infinity
      for (const id of orders[space]) {
        if (id === focus[space]) continue
        const box = windows.current[id].getBoundingClientRect()
        const gap = sideGap(from, box, dx, dy)
        if (gap < -2) continue
        let span = [box.left, box.right]
        if (dx) span = [box.top, box.bottom]
        const overlap = Math.min(across[1], span[1]) - Math.max(across[0], span[0])
        const offset = Math.abs((span[0] + span[1]) / 2 - (across[0] + across[1]) / 2)
        let score = gap * 10 + offset
        if (overlap <= 0) score = score + 1e6
        if (score < bestScore) {
          bestScore = score
          best = id
        }
      }
      if (best) focusOn(best)
    },
    [narrow, cycle, focus, space, orders, focusOn],
  )

  const open = useCallback(
    function (id) {
      const where = spaceOf(id)
      if (where < 0) return
      if (where !== space) go(where)
      zoom(id, where)
    },
    [space, go, zoom],
  )

  const openPage = useCallback(
    function (slug) {
      let lang = languageOf(pathname)
      if (lang === null) lang = defaultLanguage
      router.push(pathFor(lang, "/projects/" + slug))
      exit()
    },
    [pathname, router, exit],
  )

  const wm = useMemo(
    function () {
      return { windows: windowList(), find: findWindow, open: open, go: go, exit: exit, page: openPage }
    },
    [open, go, exit, openPage],
  )

  useEffect(
    function () {
      const withAlt = {
        Digit1: function () {
          go(0)
        },
        Digit2: function () {
          go(1)
        },
        KeyH: function () {
          moveFocus(-1, 0)
        },
        ArrowLeft: function () {
          moveFocus(-1, 0)
        },
        KeyL: function () {
          moveFocus(1, 0)
        },
        ArrowRight: function () {
          moveFocus(1, 0)
        },
        KeyK: function () {
          moveFocus(0, -1)
        },
        ArrowUp: function () {
          moveFocus(0, -1)
        },
        KeyJ: function () {
          moveFocus(0, 1)
        },
        ArrowDown: function () {
          moveFocus(0, 1)
        },
        Enter: function () {
          zoom(focus[space])
        },
      }

      function onKey(event) {
        if (isTerminalShortcut(event)) {
          event.preventDefault()
          exit()
          return
        }
        if (event.key === "Escape") {
          if (help) setHelp(false)
          else exit()
          return
        }
        if (event.altKey && !event.metaKey && !event.ctrlKey && withAlt[event.code]) {
          event.preventDefault()
          withAlt[event.code]()
          return
        }
        if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
        const claimed = WINDOWS[focus[space]].keys
        if (claimed && claimed.includes(event.key)) return
        if (event.key === "1" || event.key === "2") go(Number(event.key) - 1)
        else if (event.key === "?") setHelp(!help)
        else if (event.key === "l" || event.key === "ArrowRight") cycle(1)
        else if (event.key === "h" || event.key === "ArrowLeft") cycle(-1)
        else if (event.key === "Enter" && !event.target.closest(INTERACTIVE)) zoom(focus[space])
      }

      window.addEventListener("keydown", onKey)
      return function () {
        window.removeEventListener("keydown", onKey)
      }
    },
    [go, cycle, moveFocus, zoom, focus, space, help, exit],
  )

  function swipeStart(event) {
    if (!narrow || event.pointerType === "mouse") return
    swipe.current = { x: event.clientX, y: event.clientY }
  }

  function swipeEnd(event) {
    const start = swipe.current
    swipe.current = null
    if (!start || event.target.closest("[data-no-swipe]")) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) cycle(1)
      else cycle(-1)
    }
  }

  function content(id, big) {
    if (id === "shell") return <Shell active={space === 0 && focus[0] === "shell"} wm={wm} />
    if (id === "fetch") return <Fetch big={big} live={live} />
    if (id === "music") return <Music big={big} live={live} />
    if (id === "games") return <Steam big={big} live={live} />
    if (id === "projects") {
      return <Projects big={big} active={space === 0 && focus[0] === "projects"} onPage={openPage} />
    }
    if (id === "tab") return <Tab big={big} />
    if (id === "porto") return <Wttr live={live} />
    return null
  }

  let className = s.terminal + " " + mono.variable
  if (narrow) className = className + " " + s.narrow

  return (
    <div ref={root} className={className} role="dialog" aria-modal="true" aria-label="Terminal" tabIndex={-1} data-lenis-prevent>
      <div className={s.wallpaper} aria-hidden="true" />

      <header className={s.bar}>
        <nav className={s.spaces} aria-label="Workspaces">
          {SPACES.map(function (item, index) {
            return (
              <button
                key={item.label}
                type="button"
                className={s.space}
                aria-pressed={space === index}
                onClick={function () {
                  go(index)
                }}
              >
                <b>{index + 1}</b> {item.label}
              </button>
            )
          })}
        </nav>
        <span className={s.barTitle}>{WINDOWS[focus[space]].title}</span>
        <div className={s.mods}>
          <span className={s.mod}>
            <PortoClock />
          </span>
          <button
            type="button"
            className={s.mod + " " + s.helpButton}
            onClick={function () {
              setHelp(!help)
            }}
            aria-label="Keyboard shortcuts"
            aria-expanded={help}
          >
            <CircleHelp size={14} aria-hidden="true" />
          </button>
          <button type="button" className={s.mod + " " + s.exit} onClick={exit} aria-label="Close the terminal">
            <Power size={14} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={s.areas} onPointerDown={swipeStart} onPointerUp={swipeEnd}>
        {SPACES.map(function (item, index) {
          return (
            <div
              key={item.label}
              ref={function (element) {
                areas.current[index] = element
              }}
              className={s.area}
              inert={index !== space}
            >
              {item.windows.map(function (id) {
                const big = narrow || orders[index][0] === id
                return (
                  <Window
                    key={id}
                    id={id}
                    big={big}
                    focused={focus[index] === id}
                    onFocus={function () {
                      focusOn(id, index)
                    }}
                    onHover={function () {
                      hoverFocus(id, index)
                    }}
                    onZoom={function () {
                      zoom(id, index)
                    }}
                    setRef={function (element) {
                      windows.current[id] = element
                    }}
                  >
                    {content(id, big)}
                  </Window>
                )
              })}
            </div>
          )
        })}
      </div>

      {narrow && (
        <nav className={s.tabs} aria-label="Windows" data-no-swipe>
          {SPACES[space].windows.map(function (id, index) {
            let label = index + ":" + WINDOWS[id].name
            if (focus[space] === id) label = label + "*"
            return (
              <button
                key={id}
                type="button"
                className={s.tab}
                aria-pressed={focus[space] === id}
                onClick={function () {
                  focusOn(id)
                }}
              >
                {label}
              </button>
            )
          })}
        </nav>
      )}

      {help && <Help />}

      <div ref={boot} className={s.boot} aria-hidden="true">
        {BOOT.map(function (line, index) {
          return <BootLine key={index} line={line} />
        })}
      </div>
    </div>
  )
}
