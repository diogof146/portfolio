import Image from "next/image"

export default function Track({ label, track }) {
  if (track === null) return null

  return (
    <p>
      {label}:{" "}
      <a href={track.url} target="_blank" rel="noreferrer">
        {track.image && <Image src={track.image} alt="" width={64} height={64} />}
        {track.title} · {track.artist}
      </a>
    </p>
  )
}
