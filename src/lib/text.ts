// 🔥 TYPES
type Lang = "en" | "de"

// 🔥 GLOBAL LANG (SSR SAFE)
let currentLang: Lang = "en"

// 🔥 TEXT DICTIONARY
export const TEXT: Record<string, Record<Lang, string>> = {

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
trackButton: {
  en: "Track Repair",
  de: "Verfolgen"
},
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
  viewRepairs: { en: "View All Repairs", de: "Alle Reparaturen" },
  viewRepairsDesc: { en: "Manage current repair queue", de: "Reparaturliste verwalten" },
  trackDevice: { en: "Track a Device", de: "Gerät verfolgen" },
  trackDeviceDesc: { en: "Quickly look up by IMEI or Order", de: "Suche per IMEI oder Auftrag" },

  // table
  recentRepairs: { en: "Recent Repairs", de: "Letzte Reparaturen" },
  searchRepair: { en: "Search repair...", de: "Reparatur suchen..." },
  customer: { en: "Customer", de: "Kunde" },
  device: { en: "Device", de: "Gerät" },
  status: { en: "Status", de: "Status" },
  date: { en: "Date", de: "Datum" },

  

  // pipeline
  repairPipeline: { en: "Repair Pipeline", de: "Reparaturprozess" },

  // charts
  statusDistribution: { en: "Repair Status Distribution", de: "Reparaturstatus-Verteilung" },
  repairsPerMonth: { en: "Repairs per Month", de: "Reparaturen pro Monat" },
  enterPin: {
  en: "Enter PIN",
  de: "PIN eingeben"
},
tooManyAttempts: {
  en: "Too many attempts",
  de: "Zu viele Versuche",
 
},

usedDevices: {
  en: "Used Devices",
  de: "Gebrauchte Geräte"
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

model: {
  en: "Model",
  de: "Modell"
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




// 🔥 SET LANGUAGE
export const setLang = (lang: Lang) => {
  currentLang = lang

  if (typeof window !== "undefined") {
    localStorage.setItem("lang", lang)
  }
}


// 🔥 GET LANGUAGE (SSR SAFE)
export const getLang = (): Lang => {

  // SSR
  if (typeof window === "undefined") return currentLang

  // CLIENT
  const stored = localStorage.getItem("lang") as Lang | null

  if (stored) {
    currentLang = stored
    return stored
  }

  return currentLang
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