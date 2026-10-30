import { getDictionary } from "@/content/lang"

export default async function Projects({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <main>
      <h1>{dict.projects.title}</h1>
    </main>
  )
}
