const transitions: Record<string, string[]> = {
  received: ["pending-parts", "pending-answer", "in-repair"],

  "pending-parts": ["pending-answer", "in-repair"],

  "pending-answer": ["pending-parts", "in-repair"],

  "in-repair": ["ready","pending-parts", "pending-answer"],

  ready: ["delivered"],

  delivered: []
}

export function validateStatus(from: string, to: string) {
  if (from === to) return true

  const allowed = transitions[from] || []

  if (!allowed.includes(to)) {
    throw new Error("Invalid status transition")
  }

  return true
}