import { notFound } from "next/navigation"
import { languages, hasLanguage } from "@/content/lang/languages"
import { getDictionary } from "@/content/lang"
import SiteNav from "@/components/SiteNav"

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

  return (
    <html lang={lang}>
      <body>
        <SiteNav lang={lang} dict={dict.nav} />
        {children}
      </body>
    </html>
  )
}
