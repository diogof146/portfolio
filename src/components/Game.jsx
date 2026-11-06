import Image from "next/image"

export default function Game({ label, game }) {
  if (game === null) return null

  let details = game.title
  if (game.hours !== null) {
    details = details + " · " + game.hours + " h"
  }

  return (
    <p>
      {label}:{" "}
      <a href={game.url} target="_blank" rel="noreferrer">
        <Image src={game.image} alt="" width={230} height={108} />
        {details}
      </a>
    </p>
  )
}
