export function getTodayFormatted(lang: "en" | "de" = "en") {
  const date = new Date()

  return date.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
}