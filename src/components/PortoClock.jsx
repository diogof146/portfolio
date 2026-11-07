"use client"

import { useEffect, useState } from "react"

const format = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Lisbon", hour: "2-digit", minute: "2-digit" })

export default function PortoClock() {
  const [time, setTime] = useState("--:--")

  useEffect(function () {
    function tick() {
      setTime(format.format(new Date()))
    }
    tick()
    const timer = setInterval(tick, 15000)
    return function () {
      clearInterval(timer)
    }
  }, [])

  return <time>{time}</time>
}
