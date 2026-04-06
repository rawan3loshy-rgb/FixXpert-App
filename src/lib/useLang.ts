"use client"

import { useState } from "react"
import { translations } from "./i18n"

export function useLang() {

  const [lang, setLang] = useState<"de" | "en">("de")

  const t = (key: keyof typeof translations["de"]) => {
    return translations[lang][key]
  }

  return { lang, setLang, t }
}