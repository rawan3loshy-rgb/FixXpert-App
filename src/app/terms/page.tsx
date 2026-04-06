"use client"

import MarketingLayout from "@/components/MarketingLayout"

export default function TermsPage(){

  return (
    <MarketingLayout
      title="Allgemeine Geschäftsbedingungen (AGB)"
      subtitle="Nutzungsbedingungen für FixXpert"
    >

      <div className="max-w-3xl mx-auto text-slate-400 space-y-6 text-sm leading-relaxed">

        <h3 className="text-white font-semibold">1. Geltungsbereich</h3>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der
          Softwareplattform FixXpert. Mit der Nutzung akzeptieren Sie diese Bedingungen.
        </p>

        <h3 className="text-white font-semibold">2. Leistungen</h3>
        <p>
          FixXpert stellt eine SaaS-Lösung zur Verwaltung von Reparaturprozessen,
          Kunden und Lagerbeständen bereit. Der Funktionsumfang kann jederzeit erweitert oder angepasst werden.
        </p>

        <h3 className="text-white font-semibold">3. Registrierung</h3>
        <p>
          Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich.
          Sie sind verpflichtet, wahrheitsgemäße Angaben zu machen und Ihre Zugangsdaten sicher aufzubewahren.
        </p>

        <h3 className="text-white font-semibold">4. Preise und Zahlung</h3>
        <p>
          Die Nutzung kann kostenpflichtig sein. Alle Preise werden transparent dargestellt.
          Zahlungen erfolgen über externe Zahlungsanbieter.
        </p>

        <h3 className="text-white font-semibold">5. Haftung</h3>
        <p>
          Wir haften nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen.
        </p>

        <h3 className="text-white font-semibold">6. Verfügbarkeit</h3>
        <p>
          Wir bemühen uns um eine möglichst unterbrechungsfreie Verfügbarkeit,
          können jedoch keine Garantie übernehmen.
        </p>

        <h3 className="text-white font-semibold">7. Kündigung</h3>
        <p>
          Sie können Ihren Account jederzeit kündigen. Wir behalten uns das Recht vor,
          Accounts bei Verstößen zu sperren.
        </p>

        <h3 className="text-white font-semibold">8. Änderungen</h3>
        <p>
          Wir behalten uns vor, diese AGB jederzeit anzupassen.
        </p>

        <h3 className="text-white font-semibold">9. Schlussbestimmungen</h3>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland.
        </p>

      </div>

    </MarketingLayout>
  )
}