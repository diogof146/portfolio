import "lenis/dist/lenis.css"
import "@/styles/global.css"
import { Archivo, Martian_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { languages, hasLanguage } from "@/content/lang/languages"
import { getDictionary } from "@/content/lang"
import { getLikeCount } from "@/lib/likes"
import SiteNav from "@/components/SiteNav"
import LikeButton from "@/components/LikeButton"
import SmoothScroll from "@/components/SmoothScroll"
import Reveals from "@/components/Reveals"
import Cursor from "@/components/Cursor"

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
  return { title: dict.meta.title, description: dict.meta.description }
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  if (!hasLanguage(lang)) notFound()
  const dict = await getDictionary(lang)
  const likes = await getLikeCount()

  return (
    <html lang={lang} className={archivo.variable + " " + martianMono.variable}>
      <body>
        <SmoothScroll>
          <SiteNav lang={lang} dict={dict.nav} />
          {children}
          <footer>
            {likes !== null && <LikeButton initialCount={likes} label={dict.footer.like} />}
          </footer>
          <Reveals />
          <Cursor />
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  )
}
