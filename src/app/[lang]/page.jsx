import { getDictionary } from "@/content/lang"

export default async function Home({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <main>
      <h1>{dict.home.title}</h1>
    </main>
  )
}
