import { NextResponse } from "next/server"
import { defaultLanguage, hasLanguage, languageOf, addLanguage, stripLanguage } from "@/content/lang/languages"

const ONE_YEAR = 60 * 60 * 24 * 365

function browserLanguage(request) {
  const header = request.headers.get("accept-language") || ""
  for (const part of header.split(",")) {
    const lang = part.trim().slice(0, 2).toLowerCase()
    if (hasLanguage(lang)) return lang
  }
  return defaultLanguage
}

function chosenLanguage(request) {
  const saved = request.cookies.get("lang")
  if (saved && hasLanguage(saved.value)) return saved.value
  return browserLanguage(request)
}

function remember(response, lang) {
  response.cookies.set("lang", lang, { path: "/", maxAge: ONE_YEAR })
  return response
}

export function proxy(request) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  const inUrl = languageOf(path)

  if (inUrl === defaultLanguage) {
    url.pathname = stripLanguage(path)
    return remember(NextResponse.redirect(url), inUrl)
  }

  if (inUrl !== null) {
    return remember(NextResponse.next(), inUrl)
  }

  const lang = chosenLanguage(request)

  if (lang !== defaultLanguage) {
    url.pathname = addLanguage(lang, path)
    return NextResponse.redirect(url)
  }

  url.pathname = addLanguage(defaultLanguage, path)
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
