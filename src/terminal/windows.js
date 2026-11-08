import { mainLayout, tile } from "./tiling"

export const WINDOWS = {
  shell: { title: "zsh · diogo.sh", name: "shell" },
  fetch: { title: "~ ❯ fastfetch", name: "fetch" },
  games: { title: "btop · steam", name: "games" },
  music: { title: "spotify_player", name: "music" },
  projects: { title: "yazi ~/projects", name: "projects", keys: ["h", "l", "ArrowLeft", "ArrowRight", "Enter"] },
  tab: { title: "nvim ~/guitar/byob.tab", name: "guitar" },
  porto: { title: "wttr.in/porto", name: "porto" },
}

export const SPACES = [
  { label: "main", windows: ["shell", "fetch", "games", "music", "projects"], layout: mainLayout },
  { label: "extra", windows: ["tab", "porto"], layout: tile },
]
