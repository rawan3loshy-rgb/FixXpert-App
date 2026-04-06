export default function EmptyState({ title, desc }: any) {
  return (
    <div className="text-center py-20 text-slate-400">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm mt-2">{desc}</p>
    </div>
  )
}