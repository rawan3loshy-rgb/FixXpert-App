// 🔥 TYPES
type Lang = "en" | "de" 

// 🔥 GLOBAL LANG (SSR SAFE)


// 🔥 TEXT DICTIONARY
export const TEXT: Record<string, Record<Lang, string>> = {


   // Hero stats
  hero_stat_1: { en: "12k+", de: "12k+" },
hero_stat_1_label: { en: "Repairs", de: "Reparaturen" },
 

hero_stat_2: { en: "4.9★", de: "4.9★" },
hero_stat_2_label: { en: "Rating", de: "Bewertung" },

hero_stat_3: { en: "24h", de: "24h" },
hero_stat_3_label: { en: "Turnaround", de: "Bearbeitung" },
hero_stat_4: { en: "90 Day Warranty", de: "90 Tage Garantie" },
   // WEBSITE

nav_services: { en: "Services", de: "Services" },
nav_shop: { en: "Shop", de: "Shop" },
nav_mailin: { en: "Mail-In", de: "Einsenden" },
nav_reviews: { en: "Reviews", de: "Bewertungen" },
nav_faq: { en: "FAQ", de: "FAQ" },
nav_contact: { en: "Contact", de: "Kontakt" },
nav_cta: { en: "Book Repair", de: "Reparatur buchen" },

hero_eyebrow: { en: "Professional Device Repair", de: "Professionelle Reparatur" },
hero_headline_1: { en: "Your Device,", de: "Dein Gerät," },
hero_headline_2: { en: "Restored.", de: "Wie neu." },
hero_sub: { en: "Fast, reliable repairs for phones, tablets & laptops.", de: "Schnelle & zuverlässige Reparaturen." },
hero_cta_primary: { en: "Start Repair", de: "Reparatur starten" },
hero_cta_secondary: { en: "View Shop", de: "Shop ansehen" },

devices_title: { en: "Select Your Device", de: "Gerät auswählen" },
devices_sub: { en: "Choose your device category", de: "Gerätekategorie wählen" },
devices_phone: { en: "Smartphone", de: "Smartphone" },
devices_tablet: { en: "Tablet", de: "Tablet" },
devices_laptop: { en: "Laptop", de: "Laptop" },
devices_other: { en: "Other", de: "Andere" },
devices_brand_label: { en: "Select Brand", de: "Marke wählen" },
devices_model_label: { en: "Select Model", de: "Modell wählen" },
devices_cta: { en: "See Repair Options", de: "Reparatur anzeigen" },

services_eyebrow: { en: "Repair Services", de: "Reparaturservices" },
services_title: { en: "What We Fix", de: "Was wir reparieren" },
services_sub: { en: "We fix everything from screens to water damage.", de: "Von Display bis Wasserschaden." },

pricing_eyebrow: { en: "Transparent Pricing", de: "Transparente Preise" },
pricing_title: { en: "No Hidden Fees", de: "Keine versteckten Kosten" },
pricing_sub: { en: "All repairs include warranty.", de: "Alle Reparaturen mit Garantie." },

mailin_eyebrow: { en: "Mail-In Service", de: "Einsendeservice" },
mailin_title: { en: "Send Us Your Device", de: "Gerät einsenden" },
mailin_sub: { en: "We repair and send it back.", de: "Wir reparieren & senden zurück." },

reviews_eyebrow: { en: "Customer Reviews", de: "Bewertungen" },
reviews_title: { en: "Trusted by Thousands", de: "Tausende vertrauen uns" },

faq_eyebrow: { en: "FAQ", de: "FAQ" },
faq_title: { en: "Common Questions", de: "Häufige Fragen" },

footer_tagline: { en: "Premium repair service.", de: "Premium Reparaturservice." },
footer_privacy: { en: "Privacy", de: "Datenschutz" },
footer_terms: { en: "Terms", de: "AGB" },
footer_imprint: { en: "Imprint", de: "Impressum" },


  // SERVICES

service_screen_title: { en: "Screen Repair", de: "Display Reparatur" },
service_screen_desc: { en: "Cracked or broken screens replaced.", de: "Defekte Displays werden ersetzt." },

service_battery_title: { en: "Battery Replacement", de: "Akku Austausch" },
service_battery_desc: { en: "Battery issues fixed.", de: "Akkuprobleme werden behoben." },

service_motherboard_title: { en: "Motherboard Repair", de: "Mainboard Reparatur" },
service_motherboard_desc: { en: "Advanced board repairs.", de: "Komplexe Reparaturen." },

service_water_title: { en: "Water Damage", de: "Wasserschaden" },
service_water_desc: { en: "Liquid damage recovery.", de: "Wasserschaden Reparatur." },

service_charging_port_title: { en: "Charging Port", de: "Ladeanschluss" },
service_charging_port_desc: { en: "Fix charging problems.", de: "Ladeprobleme beheben." },

service_camera_title: { en: "Camera Repair", de: "Kamera Reparatur" },
service_camera_desc: { en: "Camera issues fixed.", de: "Kamera wird repariert." },

service_tag_popular: { en: "Most Popular", de: "Beliebt" },
service_tag_advanced: { en: "Advanced", de: "Fortgeschritten" },
service_tag_emergency: { en: "Emergency", de: "Notfall" },

service_details: { en: "Details", de: "Details" },

service_note: {
  en: "All repairs include free diagnostic and 90-day warranty.",
  de: "Alle Reparaturen inkl. Diagnose und Garantie."
},
// REVIEWS

review_1_name: {
  en: "Markus Bauer",
  de: "Markus Bauer"
},
review_1_location: {
  en: "Berlin, Germany",
  de: "Berlin, Deutschland"
},
review_1_device: {
  en: "iPhone 14 Pro — Screen Repair",
  de: "iPhone 14 Pro — Display Reparatur"
},
review_1_quote: {
  en: "Absolutely flawless service. My screen was replaced within 3 hours and it looks factory-new.",
  de: "Absolut perfekter Service. Display wurde in 3 Stunden ersetzt."
},
review_1_date: {
  en: "15 Mar 2026",
  de: "15.03.2026"
},
review_1_alt: {
  en: "German man",
  de: "Deutscher Mann"
},

// ===== 2

review_2_name: {
  en: "Lena Hoffmann",
  de: "Lena Hoffmann"
},
review_2_location: {
  en: "Munich, Germany",
  de: "München, Deutschland"
},
review_2_device: {
  en: "MacBook Pro — Battery Replacement",
  de: "MacBook Pro — Akku Austausch"
},
review_2_quote: {
  en: "Mail-in service was smooth. My MacBook now lasts a full day again.",
  de: "Versandservice war perfekt. Akku hält wieder den ganzen Tag."
},
review_2_date: {
  en: "28 Feb 2026",
  de: "28.02.2026"
},
review_2_alt: {
  en: "German woman",
  de: "Deutsche Frau"
},

// ===== 3

review_3_name: {
  en: "Ahmed Al-Rashid",
  de: "Ahmed Al-Rashid"
},
review_3_location: {
  en: "Hamburg, Germany",
  de: "Hamburg, Deutschland"
},
review_3_device: {
  en: "Samsung Galaxy — Water Damage",
  de: "Samsung Galaxy — Wasserschaden"
},
review_3_quote: {
  en: "They recovered all my data after water damage. Incredible work.",
  de: "Alle Daten wurden nach Wasserschaden gerettet. Unglaublich."
},
review_3_date: {
  en: "10 Apr 2026",
  de: "10.04.2026"
},
review_3_alt: {
  en: "Middle eastern man",
  de: "Mann"
},
  // dashboard
  dashboard: { en: "Dashboard", de: "Dashboard" },
  monitor: { en: "Monitor your repair business in real time", de: "Überwache dein Geschäft in Echtzeit" },

  totalRepairs: { en: "Total Repairs", de: "Gesamtreparaturen" },
  repairsToday: { en: "Repairs Today", de: "Heutige Reparaturen" },
  thisMonth: { en: "This Month", de: "Diesen Monat" },
  thisWeek: { en: "This Week", de: "Diese Woche" },
  total: { en: "Total", de: "Gesamt" },
  today: { en: "Today", de: "Heute" },
  profit: { en: "Profit €", de: "Gewinn €" },
  thisYear: { en: "This Year", de: "Dieses Jahr" },
  avgProfit: { en: "Average Profit", de: "Durchschnitt Gewinn" },
  successRate: { en: "Success Rate", de: "Erfolgsrate" },
  repairsOverview: { en: "Repairs Overview", de: "Reparaturen Übersicht" },
  monthlyStats: { en: "Monthly statistics", de: "Monatliche Statistik" },
  // view repair
  timeline: { en: "Timeline", de: "Verlauf" },
  noHistory: { en: "No history yet", de: "Keine Historie" },
  justNow: { en: "Just now", de: "Gerade eben" },
  loading: { en: "Loading...", de: "Lädt..." },
  repairNotFound: { en: "Repair not found", de: "Reparatur nicht gefunden" },
  // add repair / print
  repairReceipt: { en: "Repair Receipt", de: "Abholschein" },
  orderNumber: { en: "Order Number", de: "Auftragsnummer" },
  customerLabel: { en: "Customer", de: "Kunde" },
  customerName: { en: "Customer name", de: "Kundenname" },
  phone: { en: "Phone", de: "Telefon" },
  deviceLabel: { en: "Device", de: "Gerät" },
  imei: { en: "IMEI", de: "IMEI" },
  problemLabel: { en: "Problem", de: "Fehler" },
  description: { en: "Description", de: "Beschreibung" },
  priceLabel: { en: "Price", de: "Preis" },
  statusLabel: { en: "Status", de: "Status" },
  technicianLabel: { en: "Technician", de: "Techniker" },
  receiverLabel: { en: "Received By", de: "Angenommen von" },
  signatureCustomer: { en: "Customer Signature", de: "Unterschrift Kunde" },
  trackRepair: { en: "Track Repair", de: "Reparatur verfolgen" },
  pickupTime: { en: "Pickup Time", de: "Abholzeit" },
  selectProblem: { en: "Select problem", de: "Problem auswählen" },
  repairDetails: { en: "Repair details...", de: "Reparaturdetails..." },
  technicianName: { en: "Technician name", de: "Technikername" },
  deviceReturned: { en: "Device returned", de: "Zum Zweiten mal Repariert " },
  repairLocked: { en: "This repair is locked", de: "Diese Reparatur ist gesperrt" },
  current: { en: "current", de: "aktuell" },
  backToDatshboard: {en: "Back to Dashboard",de: "Zurück zu Dashboard"},
  trackTitle: {
  en: "Track Your Repair",
  de: "Reparatur verfolgen"
},
trackSubtitle: {
  en: "Enter your order number to check repair status",
  de: "Geben Sie Ihre Auftragsnummer ein"
},
orderPlaceholder: {
  en: "Order number...",
  de: "Auftragsnummer..."
},
device_title: {
  en: "Select Device",
  de: "Gerät auswählen"
},
trackButton: {
  en: "Track Repair",
  de: "Verfolgen"
},
// PRICING

pricing_screen_title: {
  en: "Screen Repair",
  de: "Display Reparatur"
},
pricing_complete_title: {
  en: "Complete Care",
  de: "Komplettservice"
},
pricing_motherboard_title: {
  en: "Motherboard Repair",
  de: "Mainboard Reparatur"
},

pricing_per_device: {
  en: "per device",
  de: "pro Gerät"
},

pricing_screen_cta: {
  en: "Book Screen Repair",
  de: "Display Reparatur buchen"
},
pricing_complete_cta: {
  en: "Get Complete Care",
  de: "Komplettservice wählen"
},
pricing_motherboard_cta: {
  en: "Book Advanced Repair",
  de: "Erweiterte Reparatur buchen"
},

pricing_most_popular: {
  en: "Most Popular",
  de: "Beliebt"
},

// FEATURES - SCREEN
pricing_screen_feat1: { en: "OEM-quality display panels", de: "OEM Display Qualität" },
pricing_screen_feat2: { en: "Same-day service available", de: "Reparatur am selben Tag" },
pricing_screen_feat3: { en: "Touch & color calibration", de: "Touch & Farbkalibrierung" },
pricing_screen_feat4: { en: "90-day warranty", de: "90 Tage Garantie" },
pricing_screen_feat5: { en: "Free diagnostic", de: "Kostenlose Diagnose" },

// FEATURES - COMPLETE
pricing_complete_feat1: { en: "Screen + battery + port", de: "Display + Akku + Anschluss" },
pricing_complete_feat2: { en: "Full hardware diagnostic", de: "Komplette Hardware Diagnose" },
pricing_complete_feat3: { en: "Software optimization", de: "Software Optimierung" },
pricing_complete_feat4: { en: "6-month warranty", de: "6 Monate Garantie" },
pricing_complete_feat5: { en: "Priority service queue", de: "Prioritätsservice" },
pricing_complete_feat6: { en: "Free return shipping", de: "Kostenloser Rückversand" },

// FEATURES - MOTHERBOARD
pricing_motherboard_feat1: { en: "Component-level soldering", de: "Komponentenlöten" },
pricing_motherboard_feat2: { en: "Chip-level diagnostics", de: "Chip Diagnose" },
pricing_motherboard_feat3: { en: "Data recovery attempt", de: "Datenrettung Versuch" },
pricing_motherboard_feat4: { en: "90-day warranty", de: "90 Tage Garantie" },
pricing_motherboard_feat5: { en: "Detailed repair report", de: "Detaillierter Bericht" },
  // employees
  employeeName: { en: "Employee name", de: "Mitarbeitername" },
  employeeAdded: { en: "Employee added", de: "Mitarbeiter hinzugefügt" },
  selectEmployee: { en: "Select employee", de: "Mitarbeiter wählen" },
  noRepairs: { en: "No repairs", de: "Keine Reparaturen" },
  delayed: { en: "Delayed", de: "Verspätet" },
  late: { en: "Late", de: "Verspätet" },
  alerts: { en: "Alerts", de: "Warnungen" },
  pickup: { en: "Pickup", de: "Abholung" },
  pending: { en: "Pending", de: "Ausstehend" },
  delivered: { en: "Delivered", de: "Abgeholt" },
 selectTechnician: {en: "Select technician",de: "Techniker auswählen"},
  createRepair: {en: "Create Repair" ,de: "Reparatur erstellen"},
 
  // system
  saving: { en: "Saving...", de: "Speichern..." },
  repairAdded: { en: "Repair added", de: "Reparatur erstellt" },
  checking: { en: "Checking...", de: "Wird geprüft..." },
  previousRepairs: { en: "Previous Repairs", de: "Frühere Reparaturen" },
  searchDevice: { en: "Search device...", de: "Gerät suchen..." },

  // repairs
  view: { en: "View", de: "Ansehen" },
  edit: { en: "Edit", de: "Bearbeiten" },
  deleteConfirm: { en: "Delete this repair?", de: "Reparatur löschen?" },
  updateFailed: { en: "Update failed", de: "Update fehlgeschlagen" },
  manageRepairs: { en: "Manage all repairs in one place", de: "Alle Reparaturen verwalten" },
  shopNotFound: { en: "Shop not found", de: "Shop nicht gefunden" },
  backToRepairs: {en: "Back to Repairs",de: "Zurück zu Reparaturen"},
// AI SYSTEM
  aiInsights: { en: "AI Insights", de: "KI Analyse" },
  bestDevice: { en: "Best Device", de: "Bestes Gerät" },
  worstDevice: { en: "Worst Device", de: "Schlechtestes Gerät" },
  topProblem: { en: "Top Problem", de: "Häufigstes Problem" },
  aiSuggestion: { en: "AI Suggestion", de: "KI Empfehlung" },
  aiBad: { en: "Improve repair success rate", de: "Reparaturquote verbessern" },
  aiMid: {en: "Optimize pricing and workflow",de: "Preise optimieren"},
  aiGood: {en: "Excellent! Scale your business",de: "Sehr gut! Skalieren"},
repairs: {
  en: "Repairs",
  de: "Reparaturen"
},
addRepair: {
  en: "Add Repair",
  de: "Reparatur hinzufügen"
},
pipeline: {
  en: "Pipeline",
  de: "Pipeline"
},
track: {
  en: "Track",
  de: "Verfolgen"

},
stock: {
  en: "Stock",
  de: "Lagerverwaltung"

},
orderparts: {
  en: "Order Parts",
  de: "Nachbestellung"
},
notice: {
  en: "Notice",
  de: "Notizen"
},

  // repairs
  saveChanges: { en: "Save Changes", de: "Änderungen speichern" },
  updatedSuccess: { en: "Updated successfully", de: "Erfolgreich aktualisiert" },
  cannotEditDelivered: { en: "Cannot edit delivered repair", de: "Gelieferte Reparatur kann nicht bearbeitet werden" },
  onlyDeliveredAllowed: { en: "Only delivered allowed", de: "Nur 'Abgeholt' erlaubt" },
  invalidStatus: { en: "Invalid status transition", de: "Ungültiger Statuswechsel" },

 

  // 🔥 track


statusReceivedMsg: { en: "We received your device", de: "Gerät wurde empfangen" },
statusPendingMsg: { en: "Waiting for your approval", de: "Warten auf Ihre Bestätigung" },
statusPartsMsg: { en: "Waiting for parts", de: "Warten auf Ersatzteile" },
statusReadyMsg: { en: "Your device is ready", de: "Ihr Gerät ist fertig" },
statusDeliveredMsg: { en: "Delivered successfully", de: "Erfolgreich abgeholt" },
statusProcessing: { en: "Processing...", de: "In Bearbeitung..." },

  // quick actions
  quickActions: { en: "Quick Actions", de: "Schnellaktionen" },
  addNewRepair: { en: "Add Repair", de: "Neue Reparatur" },
  addNewRepairDesc: { en: "Register a new customer device", de: "Neues Kundengerät registrieren" },
  viewRepairs: { en: "View All Repairs", de: "Alle Reparaturen Anzeigen" },
  viewRepairsDesc: { en: "Manage current repair queue", de: "Reparaturliste verwalten" },
  trackDevice: { en: "Track a Device", de: "Gerät verfolgen" },
  trackDeviceDesc: { en: "Quickly look up by IMEI or Order", de: "Suche per IMEI oder Auftrag" },

  // table
   hero_title: { en: "Premium Smartphone Repair", de: "Premium Smartphone Reparatur" },
  
  select_device: { en: "Select Device", de: "Gerät auswählen" },
  view_prices: { en: "View Prices", de: "Preise ansehen" },
  screen: { en: "Screen", de: "Bildschirm" },
  model: { en: "Model", de: "Modell" },
  battery: { en: "Battery", de: "Batterie" },
  camera: { en: "Camera", de: "Kamera" },
   why_us: { en: "Why Choose Us", de: "Warum uns wählen" },
  fast: { en: "Fast", de: "Schnell" },
  warranty: { en: "Warranty", de: "Garantie" },
  quality: { en: "Quality", de: "Qualität" },
  

  

  // pipeline
  repairPipeline: { en: "Repair Pipeline", de: "Reparaturprozess" },

  // charts
  statusDistribution: { en: "Repair Status Distribution", de: "Reparaturstatus-Verteilung" },
  repairsPerMonth: { en: "Repairs per Month", de: "Reparaturen pro Monat" },
  enterPin: {
  en: "Enter PIN",
  de: "PIN eingeben"
},
tooManyAttempts: {en: "Too many attempts", de: "Zu viele Versuche" },
selectRepairOutcome: { en: "Select Repair Outcome", de: "Reparaturergebnis auswählen" },
addmorePart: { en: "Add More Part", de: "Mehr Teile hinzufügen" },

usedDevices: {
  en: "Used Devices",
  de: "Gebrauchte Geräte"
},
suggest1h: {
  en: "+1 hour",
  de: "+1 Stunde"
},
suggest2h: {
  en: "+2 hours",
  de: "+2 Stunden"
},
suggest3h: {
  en: "+3 hours",
  de: "+3 Stunden"
},
suggest1d: {
  en: "+1 day",
  de: "+1 Tag"
},
usedDeviceAdded: {
  en: "Device added",
  de: "Gerät hinzugefügt"
},
usedDeviceDeleted: {
  en: "Device deleted",
  de: "Gerät Gelöscht"
},

unlock: {
  en: "Unlock",
  de: "Freischalten"
},
deviceStock: {
  en: "Phone Warehouse",
  de: "Telefon Lager"
},

editDevice: {
  en: "Edit Device",
  de: "Gerät bearbeiten"
},
ShowChangedParts: {
  en: "Show Changed Parts",
  de: "Geänderte Teile Anzeigen"
},
save: {
  en: "Save",
  de: "Speichern"
},

lock: {
  en: "Lock",
  de: "Sperren"
},

addDevice: {
  en: "Add Device",
  de: "Gerät hinzufügen"
},



type: {
  en: "Type",
  de: "Typ"
},




quantity: {
  en: "Quantity",
  de: "Menge"
},

search: {
  en: "Search...",
  de: "Suchen..."
},

fixed: {
  en: "Fixed",
  de: "Repariert"
},
notFixed: {
  en: "Not Fixed",
  de: "Nicht Repariert"
},
noWarranty: {
  en: "No Warranty",
  de: "Keine Garantie"
},
repairResult: {
  en: "Repair Result",
  de: "Reparatur Ergebnis"
},
confirm: {
  en: "Confirm",
  de: "Bestätigen"
},

show: {
  en: "Show",
  de: "Anzeigen"
},

hide: {
  en: "Hide",
  de: "Ausblenden"
},
exportPDF: {
  en: "Export PDF",
  de: "PDF exportieren"
  
},

enterPinPlaceholder: {
  en: "Enter 6-digit PIN",
  de: "6-stelligen PIN eingeben"
  
},

wrongPin: {
  en: "Wrong PIN",
  de: "Falscher PIN"
  
},

cancel: {
  en: "Cancel",
  de: "Abbrechen"
 
},
changedParts: {
  en: "Changed Parts",
  de: "Geänderte Teile"
 
},
noParts: {
  en: "No parts found",
  de: "Keine Teile gefunden"
 
},
totalCost: {
  en: "Total Cost",
  de: "Gesamtkosten"
 
},
close: {
  en: "Close",
  de: "Schließen"
 
},





}




// 🔥 STATUS TRANSLATION
export const STATUS_LABELS: Record<string, Record<Lang, string>> = {
  "received": { en: "Received", de: "Empfangen" },
  "in-repair": { en: "In Repair", de: "In Reparatur" },
  "pending-answer": { en: "Pending Answer", de: "Warten auf Antwort" },
  "pending-parts": { en: "Pending Parts", de: "Warten auf Teile" },
  "ready": { en: "Ready", de: "Bereit" },
  "delivered": { en: "Delivered", de: "Abgeholt" }
}

// 🔥 GET LANGUAGE (SSR SAFE)
export const setLang = (lang: Lang) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("lang", lang)
  }
}

export const getLang = (): Lang => {
  if (typeof window === "undefined") return "en"

  return (localStorage.getItem("lang") as Lang) || "en"
}





// 🔥 TRANSLATE
export const t = (key: string, forceLang?: Lang): string => {

  const lang = forceLang || getLang()

  return TEXT[key]?.[lang] || key
}


// 🔥 STATUS TRANSLATE
export const tStatus = (status: string, forceLang?: Lang): string => {

  const lang = forceLang || getLang()

  return STATUS_LABELS[status]?.[lang] || status
}