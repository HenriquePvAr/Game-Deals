export default function FreeCard({ title, store, until }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-3 border border-green-500/40">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-green-400">{store}</p>
      <p className="text-xs text-zinc-400">Disponível até {until}</p>
    </div>
  )
}
