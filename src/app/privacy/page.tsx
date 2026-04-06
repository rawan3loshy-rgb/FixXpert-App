"use client"

import MarketingLayout from "@/components/MarketingLayout"

export default function PrivacyPage(){

  return (
    <MarketingLayout
      title="Datenschutzerklärung"
      subtitle="Informationen zum Umgang mit Ihren Daten"
    >

      <div className="max-w-3xl mx-auto text-slate-400 space-y-6 text-sm leading-relaxed">

        <h3 className="text-white font-semibold">1. Datenschutz auf einen Blick</h3>
        <p>
          Die folgenden Hinweise geben einen Überblick darüber,
          was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.
        </p>

        <h3 className="text-white font-semibold">2. Datenerfassung</h3>
        <p>
          Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können.
          Diese Daten werden erhoben, wenn Sie uns diese freiwillig mitteilen.
        </p>

        <h3 className="text-white font-semibold">3. Kontaktformular</h3>
        <p>
          Wenn Sie uns per Kontaktformular Anfragen senden, werden Ihre Angaben inklusive
          Kontaktdaten gespeichert, um Ihre Anfrage zu bearbeiten.
          Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
        </p>

        <h3 className="text-white font-semibold">4. Speicherung und Verarbeitung</h3>
        <p>
          Ihre Daten werden nur so lange gespeichert, wie es für die Erfüllung des Zwecks erforderlich ist.
        </p>

        <h3 className="text-white font-semibold">5. Ihre Rechte</h3>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten.
          Sie können eine erteilte Einwilligung jederzeit widerrufen.
        </p>

        <h3 className="text-white font-semibold">6. Sicherheit</h3>
        <p>
          Wir verwenden technische und organisatorische Maßnahmen,
          um Ihre Daten vor Verlust oder Missbrauch zu schützen.
        </p>

        <h3 className="text-white font-semibold">7. Kontakt</h3>
        <p>
          Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden.
        </p>

      </div>

    </MarketingLayout>
  )
}