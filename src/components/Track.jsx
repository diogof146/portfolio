export default function Track({ label, track }) {
  if (track === null) return null

  return (
    <p>
      {label}:{" "}
      <a href={track.url} target="_blank" rel="noreferrer">
        {track.title} · {track.artist}
      </a>
    </p>
  )
}
