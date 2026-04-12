"use client"

export default function Card({ children }: any) {
  return (
    <div
      className="
        w-full min-w-0 flex flex-col
        bg-slate-900/60
        border border-white/10
        rounded-xl p-5
      "
    >
      {children}
    </div>
  )
}