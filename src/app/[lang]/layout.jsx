import "lenis/dist/lenis.css"
import "@/styles/global.css"
import { Archivo, Martian_Mono } from "next/font/google"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { languages, hasLanguage } from "@/content/lang/languages"
import { getDictionary } from "@/content/lang"
import { siteUrl } from "@/content/site"
import SmoothScroll from "@/components/SmoothScroll"
import Cursor from "@/components/Cursor"
import ThemeWatcher from "@/components/ThemeWatcher"
import Exposure from "@/components/Exposure"
import FloatingHold from "@/components/FloatingHold"
import TerminalLauncher from "@/components/TerminalLauncher"

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display" })
const martianMono = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-data" })

export function generateStaticParams() {
  const params = []
  for (const lang of languages) {
    params.push({ lang: lang })
  }
  return params
}

export async function generateMetadata({ params }) {
  const { lang } = await params
  if (!hasLanguage(lang)) return {}
  const dict = await getDictionary(lang)
  return { metadataBase: new URL(siteUrl), title: dict.meta.title, description: dict.meta.description }
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  if (!hasLanguage(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <html lang={lang} className={archivo.variable + " " + martianMono.variable}>
      <body>
        <SmoothScroll>
          <Exposure lang={lang}>
            {children}
            <Suspense>
              <FloatingHold text={dict.hold} />
            </Suspense>
          </Exposure>
          <Suspense>
            <ThemeWatcher />
          </Suspense>
          <Cursor />
          <TerminalLauncher />
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  )
}
