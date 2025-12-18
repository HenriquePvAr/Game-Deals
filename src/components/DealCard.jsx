export default function DealCard({ title, store, discount, oldPrice, newPrice }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-3 hover:bg-zinc-800 transition">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-zinc-400">
        {store} • {discount}% OFF
      </p>
      <p className="text-sm text-zinc-300 line-through">{oldPrice}</p>
      <p className="text-green-400 font-bold">{newPrice}</p>
    </div>
  )
}
