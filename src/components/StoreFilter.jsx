// src/components/StoreFilter.jsx
export default function StoreFilter({ value, onChange, stores }) {
  // Se não passar stores, usa o padrão antigo
  const options = stores || ["Todos", "Steam", "Epic"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {options.map((store) => (
        <button
          key={store}
          onClick={() => onChange(store)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${
              value === store
                ? "bg-white text-black shadow-lg shadow-white/10"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
        >
          {store}
        </button>
      ))}
    </div>
  );
}