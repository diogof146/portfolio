"use client"

import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { feature } from "topojson-client"

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false })

export default function StatusCard() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [countries, setCountries] = useState({ features: [] })

  useEffect(() => {
    fetch("//unpkg.com/world-atlas/countries-110m.json")
      .then((r) => r.json())
      .then((data) => setCountries(feature(data, data.objects.countries)))
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm">Porto, Portugal</span>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Globe
          width={300}
          height={300}
          backgroundColor="rgba(0,0,0,0)"
          showAtmosphere={true}
          atmosphereColor={isDark ? "#22ffcc" : "#0e9090"}
          atmosphereAltitude={0.15}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          polygonsData={countries.features}
          polygonCapColor={() => isDark ? "rgba(100,100,100,0.6)" : "rgba(180,220,220,0.8)"}
          polygonSideColor={() => "rgba(0,0,0,0)"}
          polygonStrokeColor={() => isDark ? "#22ffcc" : "#0e9090"}
          polygonAltitude={0.01}
          pointsData={[{ lat: 41.1579, lng: -8.6291, size: 0.5, color: "#22ffcc" }]}
          pointAltitude="size"
          pointColor="color"
          pointRadius={0.5}
        />
      </div>
    </div>
  )
}
