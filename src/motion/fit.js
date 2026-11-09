const COPIED = ["fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariationSettings", "letterSpacing", "textTransform"]

function widestWord(el, words) {
  const style = getComputedStyle(el)
  const probe = document.createElement("span")
  for (const property of COPIED) {
    probe.style[property] = style[property]
  }
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.whiteSpace = "nowrap"
  probe.style.fontKerning = "none"
  document.body.append(probe)

  let widest = 0
  for (const word of words) {
    probe.textContent = word
    const width = probe.getBoundingClientRect().width
    if (width > widest) widest = width
  }
  probe.remove()
  return widest
}

function roomIn(el) {
  const style = getComputedStyle(el)
  return el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
}

function fit(title) {
  const el = title.el
  el.style.fontSize = ""
  const room = roomIn(el)
  const widest = widestWord(el, title.words)
  if (widest <= room) return
  const size = parseFloat(getComputedStyle(el).fontSize)
  el.style.fontSize = Math.floor((size * room) / widest) + "px"
}

export function fitTitles(root) {
  const titles = []
  for (const el of root.querySelectorAll(".display[data-reveal], .display[data-fit]")) {
    titles.push({ el: el, words: el.innerText.split(/\s+/) })
  }

  function fitAll() {
    for (const title of titles) {
      fit(title)
    }
  }

  fitAll()
  document.fonts.addEventListener("loadingdone", fitAll)
  window.addEventListener("resize", fitAll)
  return function () {
    document.fonts.removeEventListener("loadingdone", fitAll)
    window.removeEventListener("resize", fitAll)
  }
}
