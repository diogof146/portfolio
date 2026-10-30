export async function getDictionary(lang) {
  const file = await import(`./${lang}.json`)
  return file.default
}
