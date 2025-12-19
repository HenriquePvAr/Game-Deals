import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import StoreFilter from "./components/StoreFilter";

// Ícones atualizados
const ICONS = {
  Steam: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
  Epic: "https://upload.wikimedia.org/wikipedia/commons/3/33/Epic_Games_logo.svg",
  PlayStation: "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
  Xbox: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg"
};

export default function App() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Busca tudo em paralelo
        const [pcData, epicFreeData, consoleData] = await Promise.all([
          fetch("http://localhost:3333/api/pc").then(r => r.json()),
          fetch("http://localhost:3333/api/epic-free").then(r => r.json()),
          fetch("http://localhost:3333/api/console").then(r => r.json())
        ]);

        const cleanPrice = (val) => {
            if (typeof val === 'string') return val === "N/A" ? 0 : parseFloat(val.replace('$', '').replace('R$', '').replace(',', '.'));
            return val;
        };

        const allGames = [...pcData, ...epicFreeData, ...consoleData].map(game => ({
          ...game,
          id: game.id || Math.random().toString(),
          imageUrl: game.image,
          storeIcon: ICONS[game.store] || ICONS.Steam,
          originalPrice: cleanPrice(game.worth),
          currentPrice: cleanPrice(game.price),
          isFree: cleanPrice(game.price) === 0
        }));

        // Remove duplicatas pelo título
        const uniqueGames = allGames.filter((v, i, a) => a.findIndex(t => (t.title === v.title)) === i);
        setGames(uniqueGames);
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = filter === "Todos" ? games : games.filter(g => g.store === filter);
  const freeGames = filtered.filter(g => g.isFree);
  const promoGames = filtered.filter(g => !g.isFree);

  return (
    // NOVO FUNDO: Gradiente Radial Gamer (Roxo Escuro para Preto)
    <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black text-white p-4 overflow-hidden font-sans">
      
      {/* Efeito de Luz de Fundo (Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

      <header className="relative z-10 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
          🎮 Game Deals <span className="text-xs text-white bg-purple-600 px-2 py-0.5 rounded shadow-lg">Hub</span>
        </h1>
        <StoreFilter 
            value={filter} 
            onChange={setFilter} 
            stores={["Todos", "Steam", "Epic", "PlayStation", "Xbox"]}
        />
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-full pb-20 gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-purple-300 animate-pulse">Buscando melhores ofertas...</p>
        </div>
      ) : (
        <div className="relative z-10 overflow-y-auto h-[calc(100%-7rem)] pb-20 pr-2 custom-scrollbar">
          
          {freeGames.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-200">
                ✨ Grátis para Resgatar
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded-full">{freeGames.length}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {freeGames.map(game => <GameCard key={game.id} {...game} />)}
              </div>
            </section>
          )}

          {promoGames.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-200">
                🔥 Melhores Descontos
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/50 px-2 py-0.5 rounded-full">{promoGames.length}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {promoGames.map(game => <GameCard key={game.id} {...game} />)}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="text-zinc-500 text-center mt-20 text-lg">
              Nenhuma oferta encontrada para {filter}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}