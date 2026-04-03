"use client"

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useTheme } from "next-themes"
import { projectData } from "@/lib/projects"

// ── content ───────────────────────────────────────
const INFO = [
  "Name    : Diogo Ferreira",
  "Role    : Junior Software Engineer",
  "Based   : Porto, Portugal",
  "Focus   : Game development, full-stack, open source",
  "Contact : linkedin.com/in/diogof146",
]

const ABOUT_CAT = [
  "I'm a Junior Software Engineer with a passion for exploring and learning about various tech areas. Currently game development peaks my interest. ",
  " Always open to learn, collaborate and connect with others who share similar passions.",
]

const HOBBIES = [
  "Unix Customization", "Gaming", "Playing Guitar",
  "Playing Chess", "Gym", "Reading Manga",
]

const MUSIC = [
  "Top Artist  : Periphery",
  "Top Track   : Reptile",
  "Top Genre   : Progressive Metal",
]

const PROJECT_CMDS = Object.fromEntries(
  projectData.filter(p => p.cmd).map(p => [p.cmd, p])
)

const PROJECTS_CAT = [
  "type the command to open on GitHub:",
  "",
  ...projectData
    .filter(p => p.cmd)
    .map(p => `  ${p.cmd.padEnd(12)}—  ${p.title}`)
]
// ──────────────────────────────────────────────────────────────

// ── Context — lets any component open the terminal ─────────────
const TerminalContext = createContext(null)

export function useTerminal() {
  return useContext(TerminalContext)
}
// ──────────────────────────────────────────────────────────────

// ── useInterval — fixes stale closure issues with setInterval ──
// (required for games to work correctly in React)
function useInterval(callback, delay) {
  const savedCallback = useRef()
  useEffect(() => { savedCallback.current = callback }, [callback])
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// ── Games ──────────────────────────────────────────────────────

function RPSGame({ onQuit }) {
  const choices = ["rock", "paper", "scissors"]
  const [history, setHistory] = useState([])
  const [score, setScore] = useState({ w: 0, l: 0, d: 0 })
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "q") { onQuit(); return }
      const map = { r: "rock", p: "paper", s: "scissors" }
      if (!map[e.key]) return
      const player = map[e.key]
      const cpu = choices[Math.floor(Math.random() * 3)]
      let result
      if (player === cpu) result = "draw"
      else if (
        (player === "rock" && cpu === "scissors") ||
        (player === "paper" && cpu === "rock") ||
        (player === "scissors" && cpu === "paper")
      ) result = "win"
      else result = "lose"
      setScore(sc => ({ ...sc, w: sc.w + (result === "win" ? 1 : 0), l: sc.l + (result === "lose" ? 1 : 0), d: sc.d + (result === "draw" ? 1 : 0) }))
      setHistory(h => [...h, { player, cpu, result }])
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onQuit])

  const emoji = { rock: "🪨", paper: "📄", scissors: "✂️" }
  const color = { win: "text-green-400", lose: "text-red-400", draw: "text-yellow-400" }

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-primary/60 mb-1">RPS · r=rock p=paper s=scissors · q to quit</div>
      <div className="text-sm text-primary/60 mb-2">W:{score.w} L:{score.l} D:{score.d}</div>
      {history.length === 0 && <div className="text-primary/40">press r, p, or s to play</div>}
      {history.map((h, i) => (
        <div key={i} className={`text-sm ${color[h.result]}`}>
          you {emoji[h.player]} vs cpu {emoji[h.cpu]} → {h.result.toUpperCase()}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

function GuessGame({ onQuit }) {
  const [target] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([])
  const [won, setWon] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = (e) => {
    e.preventDefault()
    if (won) return
    if (input.trim() === "") return
    const n = parseInt(input)
    if (isNaN(n) || n < 1 || n > 100) {
      setHistory(h => [...h, "invalid number (1-100)"])
      setInput("")
      return
    }
    if (n === target) {
      setHistory(h => [...h, `Correct! the number was ${target}. press q to quit.`])
      setWon(true)
    } else {
      setHistory(h => [...h, `${n} → ${n < target ? "too low ↑" : "too high ↓"}`])
    }
    setInput("")
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === "q") onQuit() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onQuit])

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-primary/60 mb-1">GUESS THE NUMBER (1-100) · q to quit</div>
      {history.map((h, i) => <div key={i} className="text-sm text-primary/80">{h}</div>)}
      {!won && (
        <form onSubmit={submit} className="flex items-center gap-2 mt-1">
          <span className="text-primary">›</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="bg-transparent outline-none text-primary w-20 text-sm"
            placeholder="guess..."
          />
        </form>
      )}
    </div>
  )
}

function DinoGame({ onQuit }) {
  const GROUND = 10, W = 50, H = 12
  const [dinoY, setDinoY] = useState(GROUND)
  const [cactus, setCactus] = useState(W)
  const [score, setScore] = useState(0)
  const [dead, setDead] = useState(false)
  const [speed, setSpeed] = useState(1)
  const dinoYRef = useRef(GROUND)
  const jumpRef = useRef(false)
  const velRef = useRef(0)

  useEffect(() => { dinoYRef.current = dinoY }, [dinoY])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "q") { onQuit(); return }
      if ((e.key === " " || e.key === "ArrowUp") && !jumpRef.current && !dead) {
        jumpRef.current = true
        velRef.current = 3
        e.preventDefault()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [dead, onQuit])

  useInterval(() => {
    if (dead) return
    // jump physics
    if (jumpRef.current) {
      const newY = dinoYRef.current + velRef.current
      velRef.current -= 0.5
      if (newY <= GROUND) {
        setDinoY(GROUND)
        dinoYRef.current = GROUND
        jumpRef.current = false
        velRef.current = 0
      } else {
        setDinoY(newY)
      }
    }
    // cactus movement + collision
    setCactus(prev => {
      const next = prev - speed
      if (next <= 5 && next >= 2 && dinoYRef.current <= GROUND + 1) {
        setDead(true)
        return prev
      }
      if (next < 0) {
        setScore(s => s + 1)
        setSpeed(sp => Math.min(sp + 0.1, 3))
        return W
      }
      return next
    })
  }, dead ? null : 50)

  const groundRow = H - 2
  const dinoRow = groundRow - Math.round(dinoY - GROUND)
  const cactusCol = Math.round(cactus)

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-primary/60">DINO · space/↑ to jump · q to quit · score: {score}</div>
      {dead && <div className="text-red-400 text-sm">game over! score: {score} · q to quit</div>}
      <div className="font-mono border border-primary/20 p-1 bg-primary/5">
        {Array.from({ length: H }, (_, r) => (
          <div key={r} className="flex" style={{ height: 10 }}>
            {Array.from({ length: W }, (_, c) => {
              const isDino = r === dinoRow && c === 4
              const isCactus = (r === groundRow || r === groundRow - 1 || r === groundRow - 2) && c === cactusCol
              const isGround = r === groundRow
              return (
                <div
                  key={c}
                  style={{ width: 7, height: 10, fontSize: 8, lineHeight: "10px", textAlign: "center" }}
                  className={isDino ? "text-primary" : isCactus ? "text-green-400" : isGround ? "text-primary/20" : ""}
                >
                  {isDino ? "▲" : isCactus ? "▐" : isGround && c % 2 === 0 ? "─" : ""}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
// ──────────────────────────────────────────────────────────────

const HELP = [
  "available commands:",
  "",
  "  help      ·  show this list",
  "  info      ·  show info about me",
  "  neofetch  ·  system info",
  "  quote     ·  random quote",

  "  home      ·  home page",
  "  about     ·  about page",
  "  projects  ·  projects page",
  "  contact   ·  contact me",
  "  socials   ·  lists my socials",

  "  theme     ·  toggle light/dark mode",
  "  hobbies   ·  my hobbies",
  "  music     ·  my music taste",
  "  anthem    ·  the anthem",

  "  games     ·  list available games",
  "  rps       ·  rock paper scissors",
  "  guess     ·  guess the number",
  "  dino      ·  dino jump game",

  "  whoami    ·  who am I",
  "  ls        ·  list files",
  "  cat       ·  read a file",
  "  clear     ·  clear terminal",
  "  exit      ·  close terminal",

  "  hint: there might be hidden commands...",
]

const GAMES = [
  "available games:",
  "  rps     — rock paper scissors (r/p/s keys)",
  "  guess   — guess the number (1-100)",
  "  dino    — dino jump game (space/↑ to jump)",
]

// ── Terminal modal ─────────────────────────────────────────────
function TerminalModal({ open, onClose }) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([
    { type: "output", lines: ["Welcome to diogo.sh — type 'help' to get started."] }
  ])
  const [game, setGame] = useState(null)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100) }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [history, game])

  const push = (lines) => setHistory(h => [...h, { type: "output", lines }])

  const quitGame = useCallback(() => {
    setGame(null)
    setHistory(h => [...h, { type: "output", lines: ["game exited."] }])
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const run = (cmd) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(/\s+/)
    setHistory(h => [...h, { type: "input", text: cmd }])
    setInput("")
    if (game) return

    switch (command) {
      case "help": push(HELP); break
      case "info": push(INFO); break

      case "home": router.push("/"); onClose(); break
      case "about": router.push("/about"); onClose(); break
      case "projects": router.push("/projects"); onClose(); break
      case "contact": router.push("#contact"); onClose(); break
      case "theme": setTheme(resolvedTheme === "dark" ? "light" : "dark"); push([`Switched to ${resolvedTheme === "dark" ? "light" : "dark"} mode.`]); break

      case "hobbies": push(HOBBIES.map(h => `  • ${h}`)); break
      case "music": push(MUSIC); break

      case "games": push(GAMES); break
      case "rps": push(["launching rock paper scissors..."]); setGame("rps"); break
      case "guess": push(["launching guess the number..."]); setGame("guess"); break
      case "dino": push(["launching dino..."]); setGame("dino"); break
      case "clear": setHistory([]); break
      case "exit": onClose(); break

      case "cat":
        switch (args[0]) {
          case "about.txt": push(ABOUT_CAT); break
          case "hobbies.txt": push(HOBBIES.map(h => `  • ${h}`)); break
          case "music.txt": push(MUSIC); break
          case "projects.txt": push(PROJECTS_CAT); break
          case ".secret": push(["try: fflogs or the best club in the world"]); break
          case ".env": push(["DATABASE_URL=nice_try", "SECRET_KEY=no", "ADMIN_PASS=lol"]); break
          case undefined: push(["usage: cat <file>"]); break
          default: push([`cat: ${args[0]}: No such file or directory`])
        }
        break

      case "rm":
        push([`rm: ${args.join(" ") || "/"}: Permission denied. Try with sudo.`]); break

      case "sudo":
        if (args[0] === "rm") {
          push(["nice try."])
        } else {
          run(args.join(" "))
        }
        break
      case "ls": push(["about.txt  hobbies.txt  music.txt  projects.txt  .secret  .env"]); break
      case "whoami": push(["diogo — junior software engineer, porto, portugal"]); break
      case "pwd": push(["/home/diogo/portfolio"]); break
      case "date": push([new Date().toString()]); break
      case "echo": push([args.join(" ") || ""]); break
      case "uname": push(["diogo.sh 1.0.0 (porto) 2026"]); break
      case "": break

      case "socials": push([
        "socials — type the command to open:",
        "",
        "  instagram  —  instagram.com/diogof146",
        "  github     —  github.com/diogof146",
        "  linkedin   —  linkedin.com/in/diogof146",
      ]); break

      case "instagram":
        push(["opening instagram..."])
        window.open("https://www.instagram.com/diogof146/", "_blank")
        break

      case "github":
        push(["opening github..."])
        window.open("https://github.com/diogof146/", "_blank")
        break

      case "linkedin":
        push(["opening linkedin..."])
        window.open("https://linkedin.com/in/diogof146/", "_blank")
        break


      case "neofetch": push([
        `  _____ ____ ____       diogo@portfolio`,
        ` |  ___/ ___|  _ \\      ───────────────`,
        ` | |_ | |   | |_) |    OS: diogo.sh 1.0.0`,
        ` |  _|| |___|  __/      Shell: terminal.tsx`,
        ` |_|   \\____|_|         Theme: ${(resolvedTheme ?? "system")}`,
        `                        Website: diogof146.com`,
        `                        Location: Porto`,
      ]); break

      case "ping": push([
        `PING ${args[0] ?? "world"} — 56 bytes of data`,
        "64 bytes: icmp_seq=0 ttl=64 time=0.42 ms",
        "64 bytes: icmp_seq=1 ttl=64 time=0.39 ms",
        `— diogo says hello from Porto.`,
      ]); break

      case "fc":
        if (!(args[0] === "porto")) {
          push([`command not found: ${command} — type 'help' for available commands`])
          break;
        }
      case "porto":
      case "fcp":
      case "fcporto":
        push([
          "F.C. Porto — Futebol Clube do Porto",
          "Founded  : 1893",
          "Stadium  : Estadio do Dragao (50,033)",
          "",
          "International:",
          "  2x Champions League        03/04, 86/87",
          "  1x Europa League           02/03, 10/11",
          "  1x UEFA Super Cup          87/88",
          "  2x Intercontinental Cup    2004, 1987",
          "",
          "Domestic:",
          "  30x Primeira Liga",
          "  20x Taça de Portugal",
          "  24x Supertaca de Portugal",
          "  1x Taça da Liga",
          " ",
          "  type 'anthem' to hear the hino.",
        ])
        break

      case "anthem":
        push([
          "Oh, meu Porto, onde a eterna mocidade",
          "Diz à gente o que é ser nobre e leal",
          "Teu pendão leva o escudo da cidade",
          "Que na história deu o nome a Portugal",
          "",
          "Oh, campeão, o teu passado",
          "É um livro de honra de vitórias sem igual",
          "O teu brasão abençoado",
          "Tem no teu Porto mais um arco triunfal",
          "",
          "Porto, Porto, Porto, Porto",
          "Porto, Porto, Porto, Porto",
          "Porto, Porto",
          "",
          "Quando alguém se atrever a sufocar",
          "O grito audaz da tua ardente voz",
          "Oh, oh, Porto, então verás vibrar",
          "A multidão num grito só de todos nós",
          "",
          "Oh, campeão, o teu passado",
          "É um livro de honra de vitórias sem igual",
          "O teu brasão abençoado",
          "Tem no teu Porto mais um arco triunfal",
          "",
          "Porto, Porto, Porto, Porto",
          "Porto, Porto, Porto, Porto",
          "Porto, Porto",
        ])
        break

      case "quote": {
        const quotes = [
          '"When do you think people die? When they are shot through the heart by the bullet of a pistol? No. When they are ravaged by an incurable disease? No. When they drink a soup made from a poisonous mushroom? No! It\'s when they are forgotten." — Dr. Hiluluk',
          '"Nothing happened." — Zoro',
          '"Power isn\'t determined by your size, but the size of your heart and dreams!" — Luffy',
          '"One Piece is real!" — Whitebeard',
          '"Inherited will, the destiny of age, the dreams of the people. These are things that will not be stopped. As long as people continue to pursue the meaning of freedom, these things will never cease to be!" — Gold Roger',
          '"I\'d rather die than live as a coward." — Shanks',
          '"If you don\'t take risks, you can\'t create a future." — Monkey D. Luffy',
          '"I\'m not gonna die. I\'m the man who will become Pirate King." — Luffy',
          '"When I decided to follow my dream, I had already discarded my life." — Roronoa Zoro',
          '"People\'s dreams... have no ends!" — Marshall D. Teach (Blackbeard)',
          '"Justice will prevail, you say? But of course it will! Whoever wins this war becomes justice!" — Donquixote Doflamingo',
          '"Pirates are evil? The Marines are righteous? These labels given by society are nothing but empty words." — Donquixote Doflamingo',
          '"The government says your existence is a crime. But no matter what kind of weapons you may hold, just being alive isn\'t a crime!" — Nico Robin',
          '"There are things you can\'t see unless you change your standing." — Trafalgar Law',
          '"Weak guys don\'t get to choose how they die." — Trafalgar Law',
          '"The one who has the best nakama is the true winner!" — Usopp',
          '"An incident is just the beginning of something greater." — Silvers Rayleigh',
          '"A king does not need a crown to lead. He needs the will to protect." — Silvers Rayleigh',
          '"The world is not safe. But that has never stopped us before." — Nami',
          '"Mediocrity is the only sin I cannot forgive." — Dracule Mihawk',
          '"You need to accept the fact that you\'re not the best and have all the will to strive to be better than anyone you face." — Roronoa Zoro',
          '"The strength to stand before the things that matter most — that is true courage." — Shanks',
          '"The reputation of a crew is built not on strength alone, but on the bonds between its members." — Ben Beckman',
          '"No matter what kind of era this is, people always find something to fight over." — Whitebeard',
          '"Before turning your back to your nakama, make sure you\'re ready to turn your back on yourself." — Jinbe',
        ]
        push([quotes[Math.floor(Math.random() * quotes.length)]])
        break
      }

      case "inshallah":
        push(["hehehe siuuuuuuuuu"])
        break

      case "nvim":
      case "vim":
      case "vi":
      case "neovim":
        push(["good choice x)"])
        window.open("https://github.com/diogof146/nvim-config", "_blank")
        break

      case "fflogs":
        push(["opening fflogs profile..."])
        window.open("https://www.fflogs.com/character/eu/alpha/the%20king?zone=43", "_blank")
        break
      default: {

        if (PROJECT_CMDS[command]) {
          const p = PROJECT_CMDS[command]
          push([`opening ${p.title} on GitHub...`])
          window.open(p.github, "_blank")
          break
        }

        if (command.match(/^siu+$/)) {
          push(["SIUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"])
          break
        }

        push([`command not found: ${command} — type 'help' for available commands`])
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop — darkens page*/}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* centering wrapper — pointer-events-none so backdrop clicks work */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">

            {/* terminal window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                width: "min(1200px, 85vw)",
                height: "min(800px, 75vh)",
                backgroundColor: "color-mix(in srgb, var(--background) 95%, transparent)"
              }}
              className="pointer-events-auto rounded-xl border border-primary backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* title bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 bg-primary/5 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-sm text-primary/50 ml-2 font-mono">diogo@portfolio ~</span>
                </div>
                <button onClick={onClose} className="text-primary/40 hover:text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* output area — scrollable */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 text-muted-foreground">
                {history.map((h, i) => (
                  <div key={i} className="mb-4">
                    {h.type === "input"
                      ? <div className="flex gap-2">
                        <span className="text-primary">{h.text}</span>
                      </div>
                      : h.lines.map((l, j) => (
                        <div key={j} className="text-primary/80 whitespace-pre pl-4">{l || " "}</div>
                      ))
                    }
                  </div>
                ))}
                {game === "rps" && <RPSGame onQuit={quitGame} />}
                {game === "guess" && <GuessGame onQuit={quitGame} />}
                {game === "dino" && <DinoGame onQuit={quitGame} />}
                <div ref={bottomRef} />
              </div>

              {/* input bar — hidden while a game is active */}
              {!game && (
                <div className="flex items-center gap-2 px-4 py-3 border-t border-primary/20 shrink-0">
                  <span className="text-primary font-mono text-base md:text-sm">›</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") run(input) }}
                    className="flex-1 bg-transparent outline-none font-mono text-base md:text-sm text-primary placeholder:text-primary/30"
                    placeholder="type a command..."
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Provider —─────────────────────
// It holds open/close state and exposes openTerminal() via context.
export function Terminal({ children }) {
  const [open, setOpen] = useState(false)
  const openTerminal = () => setOpen(true)
  const closeTerminal = () => setOpen(false)

  // Ctrl+K / Cmd+K to toggle · Escape to close
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setOpen(o => !o) }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <TerminalContext.Provider value={{ openTerminal }}>
      {children}
      <TerminalModal open={open} onClose={closeTerminal} />
    </TerminalContext.Provider>
  )
}
