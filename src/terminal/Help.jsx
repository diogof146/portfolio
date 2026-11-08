import s from "./terminal.module.css"

const KEYS = [
  { keys: "alt + 1 / 2", does: "switch workspace" },
  { keys: "alt + h j k l · alt + arrows", does: "move to the window on that side" },
  { keys: "alt + enter · click", does: "bring a window to the big spot" },
  { keys: "(no alt)", does: "the same keys work when you're not typing" },
  { keys: "j k · h l · enter", does: "move, change folder, open a page (in yazi)" },
  { keys: "help", does: "everything the shell can do" },
  { keys: "q · esc in hangman and typing", does: "quit a game (in the shell)" },
  { keys: "esc · exit · ⌘K", does: "back to the site" },
]

export default function Help() {
  return (
    <div className={s.help} role="dialog" aria-label="Keyboard shortcuts">
      <header className={s.windowBar}>
        <span className={s.windowTitle}>man terminal</span>
      </header>
      <dl className={s.keys}>
        {KEYS.map(function (key) {
          return (
            <div key={key.keys} className={s.key}>
              <dt>{key.keys}</dt>
              <dd>{key.does}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
