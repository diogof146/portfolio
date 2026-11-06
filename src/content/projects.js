import forsakenelegy2Image from "./images/forsakenelegy2.webp"
import wanouniImage from "./images/wanouni.webp"
import neovimImage from "./images/neovim.webp"
import accImage from "./images/acc.webp"
import pttImage from "./images/ptt.webp"
import dotfilesImage from "./images/dotfiles.webp"
import vivreImage from "./images/vivre.webp"
import portfolioImage from "./images/portfolio.webp"
import riffheroImage from "./images/riffhero.webp"
import farmersmarketImage from "./images/farmersmarket.webp"
import fbsimImage from "./images/fbsim.webp"
import pmsImage from "./images/pms.webp"

export const projects = [
  {
    slug: "forsaken-elegy",
    title: "Forsaken Elegy",
    kind: "game",
    year: 2026,
    stack: ["Unity", "C#"],
    image: forsakenelegy2Image,
    github: "https://github.com/diogof146/forsaken-elegy",
    live: "https://diogof146.itch.io/forsaken-elegy",
    itchId: 4684152,
    command: "forsakenelegy",
  },
  {
    slug: "wano-university",
    title: "Wano University",
    kind: "web",
    year: 2026,
    stack: ["React", "Express.js", "Prisma", "PostgreSQL", "PLY"],
    image: wanouniImage,
    github: "https://github.com/Wano-University/wano-university",
    live: "https://wano-university.vercel.app",
    command: "wano",
  },
  {
    slug: "nvim-config",
    title: "Neovim Configuration",
    kind: "tools",
    year: 2025,
    stack: ["Lua", "Neovim", "Unix"],
    image: neovimImage,
    github: "https://github.com/diogof146/nvim-config",
    command: "nvim",
  },
  {
    slug: "animal-care-centre",
    title: "Animal Care Centre",
    kind: "backend",
    year: 2025,
    stack: ["Java", "Spring Boot", "MySQL", "Spring Security", "JavaFX"],
    image: accImage,
    github: "https://github.com/Animal-Care-UPT/Equipa3_comp3",
    command: "acc",
  },
  {
    slug: "pepe-tours",
    title: "PePe Tours & Travels",
    kind: "web",
    year: 2025,
    freelance: true,
    stack: ["HTML/CSS", "Bootstrap", "JavaScript"],
    image: pttImage,
    github: "https://github.com/diogof146/pepe-tours-travels",
    live: "https://pepetourstravels.com",
    command: "pepe",
  },
  {
    slug: "dotfiles",
    title: "Dotfiles",
    kind: "tools",
    year: 2025,
    stack: ["Bash", "Unix"],
    image: dotfilesImage,
    github: "https://github.com/diogof146/dotfiles",
    command: "dotfiles",
  },
  {
    slug: "vivre-bar",
    title: "Vivre Bar",
    kind: "app",
    year: 2025,
    stack: ["Swift", "AppKit", "macOS"],
    image: vivreImage,
    github: "https://github.com/diogof146/vivre-bar",
    command: "vivre",
  },
  {
    slug: "portfolio",
    title: "Personal Website",
    kind: "web",
    year: 2026,
    stack: ["Next.js", "React", "Tailwind"],
    image: portfolioImage,
    github: "https://github.com/diogof146/portfolio",
    command: "portfolio",
  },
  {
    slug: "riff-hero",
    title: "Riff Hero",
    kind: "game",
    year: 2025,
    stack: ["Java", "FXGL", "Mido"],
    image: riffheroImage,
    github: "https://github.com/diogof146/riff-hero",
    command: "riff",
  },
  {
    slug: "farmers-market",
    title: "Farmers Market",
    kind: "backend",
    year: 2025,
    stack: ["Java", "JavaFX", "SCRUM"],
    image: farmersmarketImage,
    github: "https://github.com/Farmers-Market-UPT/farmers-market",
    command: "farmers",
  },
  {
    slug: "fbsim",
    title: "Penalty Shootout Simulator",
    kind: "game",
    year: 2025,
    early: true,
    stack: ["Python", "Pygame"],
    image: fbsimImage,
    github: "https://github.com/diogof146/fbsim",
    command: "fbsim",
  },
  {
    slug: "pms",
    title: "Pollution Management System",
    kind: "cli",
    year: 2025,
    early: true,
    stack: ["Python", "CLI"],
    image: pmsImage,
    github: "https://github.com/diogof146/pollution-management-system",
    command: "pms",
  },
]

export const featured = [
  "forsaken-elegy",
  "wano-university",
  "nvim-config",
  "vivre-bar",
  "riff-hero",
  "animal-care-centre",
]

export function findProject(slug) {
  for (const project of projects) {
    if (project.slug === slug) return project
  }
  return null
}
