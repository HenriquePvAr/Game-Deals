export default function StoreFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {["Todos", "Epic", "Steam"].map(store => (
        <button
          key={store}
          className={`px-3 py-1 rounded-full font-semibold ${
            value === store ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-300"
          }`}
          onClick={() => onChange(store)}
        >
          {store}
        </button>
      ))}
    </div>
  );
}
