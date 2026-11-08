import { useEffect, useRef, useState } from "react"
import {
  ABOUT,
  ANTHEM,
  COMPLETABLE,
  FC_PORTO,
  GAMES,
  HELP,
  HOBBIES,
  INFO,
  MUSIC,
  PROJECTS_LIST,
  PROJECT_COMMANDS,
  QUOTES,
  SOCIALS,
} from "./commands"
import { GAMES_BY_COMMAND } from "./games"
import s from "./terminal.module.css"

const WELCOME = { type: "out", lines: ["Welcome to diogo.sh: type 'help' to get started."] }

function bullets(list) {
  const lines = []
  for (const item of list) lines.push("  • " + item)
  return lines
}

function openTab(url) {
  window.open(url, "_blank", "noopener")
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function Prompt() {
  return (
    <>
      <span className={s.green}>diogo@porto</span> <span className={s.cyan}>~</span> <span className={s.violet}>❯</span>
    </>
  )
}

function Entry({ entry }) {
  if (entry.type === "in") {
    return (
      <p className={s.shellIn}>
        <Prompt /> {entry.text}
      </p>
    )
  }
  return (
    <div className={s.shellBlock}>
      {entry.lines.map(function (line, index) {
        return <p key={index}>{line || " "}</p>
      })}
    </div>
  )
}

export default function Shell({ active, wm }) {
  const [log, setLog] = useState([WELCOME])
  const [value, setValue] = useState("")
  const [game, setGame] = useState(null)
  const past = useRef([])
  const cursor = useRef(-1)
  const input = useRef(null)
  const bottom = useRef(null)

  useEffect(
    function () {
      if (game) return
      if (active) input.current.focus({ preventScroll: true })
      else if (document.activeElement === input.current) input.current.blur()
    },
    [active, game],
  )

  useEffect(
    function () {
      bottom.current.scrollIntoView({ block: "end" })
    },
    [log, game],
  )

  function print(lines) {
    setLog(function (current) {
      return current.concat({ type: "out", lines: lines })
    })
  }

  function quitGame() {
    setGame(null)
    print(["game exited."])
  }

  function cat(file) {
    if (file === "about.txt") return print(ABOUT)
    if (file === "hobbies.txt") return print(bullets(HOBBIES))
    if (file === "music.txt") return print(MUSIC)
    if (file === "projects.txt") return print(PROJECTS_LIST)
    if (file === ".secret") return print(["try: fflogs or the best club in the world"])
    if (file === ".env") return print(["DATABASE_URL=nice_try", "SECRET_KEY=no", "ADMIN_PASS=lol"])
    if (file === undefined) return print(["usage: cat <file>"])
    print(["cat: " + file + ": No such file or directory"])
  }

  function listWindows() {
    const lines = ["windows:"]
    for (const item of wm.windows) lines.push("  " + item.name.padEnd(10) + "·  " + item.title)
    lines.push("", "type: open <name>")
    print(lines)
  }

  function openWindow(name) {
    const id = wm.find(name)
    if (!id) return print(["open: " + (name || "") + ": no such window (try 'windows')"])
    print(["opening " + name + "..."])
    wm.open(id)
  }

  function run(raw) {
    const words = raw.trim().toLowerCase().split(/\s+/)
    const command = words[0]
    const args = words.slice(1)
    setLog(function (current) {
      return current.concat({ type: "in", text: raw })
    })
    if (raw.trim()) past.current = [raw].concat(past.current)
    cursor.current = -1
    setValue("")

    if (GAMES_BY_COMMAND[command]) {
      print(["launching " + GAMES_BY_COMMAND[command].name + "..."])
      setGame(command)
      return
    }

    switch (command) {
      case "":
        return
      case "help":
        return print(HELP)
      case "info":
        return print(INFO)
      case "windows":
        return listWindows()
      case "open":
        return openWindow(args[0])
      case "ws":
      case "workspace":
        if (args[0] === "1" || args[0] === "2") {
          print(["switching to workspace " + args[0] + "..."])
          return wm.go(Number(args[0]) - 1)
        }
        return print(["usage: ws 1|2"])
      case "home":
      case "about":
      case "exit":
        return wm.exit()
      case "projects":
        return openWindow("projects")
      case "neofetch":
      case "fastfetch":
        return openWindow("fetch")
      case "contact":
        return print(["the form lives on the site: type 'exit' and scroll to Contact."])
      case "theme":
        return print(["only one theme here: cyan."])
      case "hobbies":
        return print(bullets(HOBBIES))
      case "music":
        return print(MUSIC)
      case "games":
        return print(GAMES)
      case "clear":
        return setLog([])
      case "cat":
        return cat(args[0])
      case "rm":
        return print(["rm: " + (args.join(" ") || "/") + ": Permission denied. Try with sudo."])
      case "sudo":
        if (args[0] === "rm") return print(["nice try."])
        return run(args.join(" "))
      case "ls":
        return print(["about.txt  hobbies.txt  music.txt  projects.txt  .secret  .env"])
      case "whoami":
        return print(["diogo — junior software engineer, porto, portugal"])
      case "pwd":
        return print(["/home/diogo/portfolio"])
      case "date":
        return print([new Date().toString()])
      case "echo":
        return print([args.join(" ")])
      case "uname":
        return print(["diogo.sh 1.0.0 (porto) 2026"])
      case "socials":
        return print([
          "socials — type the command to open:",
          "",
          "  instagram  —  instagram.com/diogof146",
          "  github     —  github.com/diogof146",
          "  linkedin   —  linkedin.com/in/diogof146",
        ])
      case "instagram":
      case "github":
      case "linkedin":
        print(["opening " + command + "..."])
        return openTab(SOCIALS[command])
      case "ping":
        return print([
          "PING " + (args[0] || "world") + " — 56 bytes of data",
          "64 bytes: icmp_seq=0 ttl=64 time=0.42 ms",
          "64 bytes: icmp_seq=1 ttl=64 time=0.39 ms",
          "— diogo says hello from Porto.",
        ])
      case "fc":
        if (args[0] === "porto") return print(FC_PORTO)
        return print(["command not found: fc — type 'help' for available commands"])
      case "porto":
      case "fcp":
      case "fcporto":
        return print(FC_PORTO)
      case "anthem":
        return print(ANTHEM)
      case "quote":
        return print([pick(QUOTES)])
      case "inshallah":
        return print(["hehehe siuuuuuuuuu"])
      case "nvim":
      case "vim":
      case "vi":
      case "neovim":
        print(["good choice x)"])
        return wm.page("nvim-config")
      case "fflogs":
        print(["opening fflogs profile..."])
        return openTab("https://www.fflogs.com/character/eu/alpha/the%20king?zone=43")
    }

    const project = PROJECT_COMMANDS[command]
    if (project) {
      print(["opening " + project.title + "..."])
      return wm.page(project.slug)
    }
    if (/^siu+$/.test(command)) return print(["SIUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"])
    print(["command not found: " + command + " — type 'help' for available commands"])
  }

  function walkHistory(step) {
    const next = Math.max(-1, Math.min(past.current.length - 1, cursor.current + step))
    cursor.current = next
    if (next === -1) setValue("")
    else setValue(past.current[next])
  }

  function complete() {
    const typed = value.trim().toLowerCase()
    const matches = []
    for (const command of COMPLETABLE) {
      if (command.startsWith(typed)) matches.push(command)
    }
    if (matches.length === 1) setValue(matches[0] + " ")
    else if (matches.length > 1 && typed) print([matches.join("  ")])
  }

  function keyDown(event) {
    if (event.key === "Enter") {
      run(value)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      walkHistory(1)
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      walkHistory(-1)
    } else if (event.key === "Tab") {
      event.preventDefault()
      complete()
    }
  }

  let playing = null
  if (game) {
    const Game = GAMES_BY_COMMAND[game].Game
    playing = <Game onQuit={quitGame} />
  }

  return (
    <div
      className={s.shell}
      onClick={function () {
        if (!game) input.current.focus({ preventScroll: true })
      }}
    >
      <div className={s.shellOut} data-no-swipe>
        {log.map(function (entry, index) {
          return <Entry key={index} entry={entry} />
        })}
        {playing}
        <div ref={bottom} />
      </div>
      {!game && (
        <label className={s.promptRow}>
          <Prompt />
          <input
            ref={input}
            className={s.promptInput}
            value={value}
            onChange={function (event) {
              setValue(event.target.value)
            }}
            onKeyDown={keyDown}
            placeholder="type a command…"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Shell command"
          />
        </label>
      )}
    </div>
  )
}
