export const experience = [
  { id: "degree", kind: "education", start: "2024-09", end: "2027-07" },
  { id: "erasmus", kind: "erasmus", start: "2026-03", end: "2026-04" },
  { id: "scholarship", kind: "award", start: "2024-09", end: "2025-07" },
  { id: "pepe", kind: "freelance", start: "2025-03", end: "2025-06" },
  { id: "summer-school", kind: "summerSchool", start: "2025-07" },
]

export const scholarshipPhoto = {
  image: "/images/me.png",
}

export function yearsOf(item) {
  const startYear = item.start.slice(0, 4)
  if (!item.end) return startYear

  const endYear = item.end.slice(0, 4)
  if (endYear === startYear) return startYear
  return startYear + "–" + endYear
}
