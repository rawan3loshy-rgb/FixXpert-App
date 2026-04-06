"use client"

export default function Input(props: any) {
  return (
    <input
      {...props}
      className="
        w-full h-12 px-4 rounded-xl
        bg-slate-800 border border-white/10
        text-white placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        transition
      "
    />
  )
}