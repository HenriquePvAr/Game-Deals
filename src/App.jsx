import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import StoreFilter from "./components/StoreFilter";

export default function App() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    async function loadData() {
      try {
        const [epicList, steamList] = await Promise.all([
          fetch("http://localhost:3333/api/epic").then(r => r.json()),
          fetch("http://localhost:3333/api/steam").then(r => r.json())
        ]);

        // Mapeamento da Epic (Geralmente são Grátis)
        const epicGames = epicList.map(g => ({
          id: g.id,
          title: g.title,
          imageUrl: g.image,
          // O backend pode mandar "R$ 100,00" ou numero, o parseFloat tenta resolver
          originalPrice: parseFloat(g.worth) || 0, 
          currentPrice: parseFloat(g.price) || 0, // Deve ser 0
          expiryDate: g.end_date,
          store: "Epic",
          storeIcon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Epic_Games_logo.svg",
          isFree: true, // Na rota que fizemos, filtramos só os grátis
          isRedeemed: false
        }));

        // Mapeamento da Steam (Geralmente são Promoções Pagas)
        const steamGames = steamList.map(g => {
            const price = parseFloat(g.price) || 0;
            return {
                id: g.id,
                title: g.title,
                imageUrl: g.image,
                originalPrice: parseFloat(g.worth) || 0,
                currentPrice: price, // AQUI ESTAVA O ERRO: Agora pega o preço real
                expiryDate: g.end_date,
                store: "Steam",
                storeIcon: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
                isFree: price === 0, // Só marca como grátis se for realmente 0
                isRedeemed: false
            };
        });

        setGames([...epicGames, ...steamGames]);
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);
      }
    }

    loadData();
  }, []);

  const filtered =
    filter === "Todos" ? games : games.filter(g => g.store === filter);

  // Separação automática baseada no preço
  const freeGames = filtered.filter(g => g.currentPrice === 0);
  const promoGames = filtered.filter(g => g.currentPrice > 0);

  return (
    <div className="fixed inset-0 bg-zinc-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">🎮 Game Deals</h1>

      <StoreFilter value={filter} onChange={setFilter} />

      <div className="overflow-y-auto h-[calc(100%-6rem)] pb-10">
        
        {/* Seção de Jogos Grátis */}
        {freeGames.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2 mt-2 flex items-center gap-2">
              🟣 Jogos Grátis 
              <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full text-white">
                {freeGames.length}
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {freeGames.map(game => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </>
        )}

        {/* Seção de Promoções (Steam) */}
        {promoGames.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2 mt-2 flex items-center gap-2">
              🔵 Melhores Ofertas
              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full text-white">
                {promoGames.length}
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {promoGames.map(game => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
            <p className="text-lg">Nenhum jogo encontrado...</p>
            <p className="text-sm">Verifique se o backend (porta 3333) está rodando.</p>
          </div>
        )}
      </div>
    </div>
  );
}