import { projects } from "@/content/projects"

export const INFO = [
  "Name    : Diogo Ferreira",
  "Role    : Junior Software Engineer",
  "Based   : Porto, Portugal",
  "Focus   : Game development, full-stack, open source",
  "Contact : linkedin.com/in/diogof146",
]

export const ABOUT = [
  "I'm a Junior Software Engineer with a passion for exploring and learning about various tech areas. Currently game development piques my interest.",
  "Always open to learn, collaborate and connect with others who share similar passions.",
]

export const HOBBIES = ["Unix Customization", "Gaming", "Playing Guitar", "Playing Chess", "Gym", "Reading Manga"]

export const MUSIC = ["Top Artist  : Periphery", "Top Track   : Reptile", "Top Genre   : Progressive Metal"]

export const PROJECT_COMMANDS = {}
for (const project of projects) {
  if (project.command) PROJECT_COMMANDS[project.command] = project
}

export const PROJECTS_LIST = ["type the command to open its page:", ""]
for (const project of projects) {
  if (project.command) PROJECTS_LIST.push("  " + project.command.padEnd(14) + "—  " + project.title)
}

export const GAMES = [
  "available games:",
  "  rps       — rock paper scissors (r/p/s keys)",
  "  guess     — guess the number (1-100)",
  "  dino      — dino jump game (space/↑ to jump)",
  "  snake     — snake (arrows or wasd)",
  "  mines     — minesweeper (arrows, space to dig, f to flag)",
  "  hangman   — hangman, One Piece edition",
  "  typing    — typing test against the clock",
  "  2048      — slide and merge (arrows or wasd)",
]

export const HELP = [
  "available commands:",
  "",
  "  help      ·  show this list",
  "  info      ·  show info about me",
  "  neofetch  ·  system info",
  "  quote     ·  random quote",
  "  windows   ·  list the windows (open <name> to jump to one)",
  "  ws 1|2    ·  switch workspace (or alt + 1 / 2)",
  "  socials   ·  lists my socials",
  "  hobbies   ·  my hobbies",
  "  music     ·  my music taste",
  "  anthem    ·  the anthem",
  "  games     ·  list available games",
  "  whoami    ·  who am I",
  "  ls        ·  list files",
  "  cat       ·  read a file",
  "  clear     ·  clear the screen",
  "  exit      ·  back to the site",
  "",
  "  hint: there might be hidden commands...",
]

export const FC_PORTO = [
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
  "",
  "  type 'anthem' to hear the hino.",
]

export const ANTHEM = [
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
]

export const QUOTES = [
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

export const SOCIALS = {
  instagram: "https://www.instagram.com/diogof146/",
  github: "https://github.com/diogof146/",
  linkedin: "https://linkedin.com/in/diogof146/",
}

export const COMPLETABLE = [
  "help",
  "info",
  "neofetch",
  "quote",
  "windows",
  "open",
  "ws",
  "socials",
  "hobbies",
  "music",
  "anthem",
  "games",
  "rps",
  "guess",
  "dino",
  "snake",
  "mines",
  "hangman",
  "typing",
  "2048",
  "whoami",
  "ls",
  "cat",
  "clear",
  "exit",
  "pwd",
  "date",
  "echo",
  "uname",
  "ping",
  "github",
  "linkedin",
  "instagram",
]
