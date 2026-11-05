export default function Weather({ weather, kinds }) {
  if (weather === null) return null

  let text = weather.temperature + " °C"
  if (weather.kind !== null) {
    text = text + " · " + kinds[weather.kind]
  }

  return <p>{text}</p>
}
