import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

function onScreen(el, start) {
  return { trigger: el, start: start, once: true }
}

function delayOf(el) {
  return Number(el.dataset.delay || 0)
}

function revealUp(el) {
  gsap.from(el, {
    y: 28,
    autoAlpha: 0,
    duration: 1,
    ease: "power3.out",
    delay: delayOf(el),
    scrollTrigger: onScreen(el, "top 94%"),
  })
}

function revealRule(el) {
  gsap.from(el, {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 1.3,
    ease: "expo.out",
    scrollTrigger: onScreen(el, "top 94%"),
  })
}

function revealLines(el) {
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: onScreen(el, "top 88%"),
      })
    },
  })
}

function revealChars(el) {
  SplitText.create(el, {
    type: "lines,words,chars",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.chars, {
        yPercent: 120,
        rotate: 6,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.025,
        delay: delayOf(el),
        scrollTrigger: onScreen(el, "top 88%"),
      })
    },
  })
}

function revealFade(el) {
  SplitText.create(el, {
    type: "lines",
    aria: "none",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        y: 18,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        delay: delayOf(el),
        scrollTrigger: onScreen(el, "top 92%"),
      })
    },
  })
}

function revealFill(el) {
  SplitText.create(el, {
    type: "words",
    aria: "none",
    autoSplit: true,
    onSplit(self) {
      return gsap.fromTo(
        self.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      )
    },
  })
}

function buildTitleTimeline(chars, stretch) {
  gsap.set(chars, { transformPerspective: 700, transformOrigin: "50% 100%" })
  for (const char of chars) {
    char.style.setProperty("color", "color-mix(in srgb, var(--cyan) calc(var(--k, 0) * 100%), currentColor)")
  }

  const from = { yPercent: 110, rotationX: -75, duration: 1.1, ease: "expo.out", stagger: 0.035 }
  if (stretch) {
    from.fontVariationSettings = '"wdth" 62'
  }

  const timeline = gsap.timeline({ paused: true })
  timeline.from(chars, from)
  timeline.fromTo(chars, { "--k": 1 }, { "--k": 0, duration: 1.3, ease: "power2.out", stagger: 0.035 }, 0.1)
  timeline.progress(0)
  return timeline
}

function watchTitle(el, timeline) {
  let played = false

  const play = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && !played) {
        played = true
        timeline.restart()
      }
    },
    { rootMargin: "-12% 0px -12% 0px" },
  )

  const rewind = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting && played) {
      played = false
      timeline.pause(0)
    }
  })

  play.observe(el)
  rewind.observe(el)
  return [play, rewind]
}

function stopWatching(watchers) {
  for (const watcher of watchers) {
    watcher.disconnect()
  }
}

function revealTitle(el, context, stretch) {
  let watchers = []
  SplitText.create(el, {
    type: "lines,words,chars",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      stopWatching(watchers)
      let timeline = null
      context.add(function () {
        timeline = buildTitleTimeline(self.chars, stretch)
        watchers = watchTitle(el, timeline)
        return function () {
          stopWatching(watchers)
        }
      })
      return timeline
    },
  })
}

const REVEALS = {
  title: revealTitle,
  lines: revealLines,
  chars: revealChars,
  fade: revealFade,
  up: revealUp,
  rule: revealRule,
  fill: revealFill,
}

export function setupReveals(root) {
  const media = gsap.matchMedia()
  media.add("(prefers-reduced-motion: no-preference)", function (context) {
    const stretch = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    for (const el of root.querySelectorAll("[data-reveal]")) {
      const reveal = REVEALS[el.dataset.reveal]
      if (reveal) {
        reveal(el, context, stretch)
      }
    }
  })
  return media
}
