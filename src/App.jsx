import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import StoreFilter from "./components/StoreFilter";

export default function App() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("🔄 Buscando dados...");
        
        // Buscando dados das duas rotas
        const [epicRes, steamRes] = await Promise.all([
          fetch("http://localhost:3333/api/epic"),
          fetch("http://localhost:3333/api/steam")
        ]);

        const epicList = await epicRes.json();
        const steamList = await steamRes.json();

        console.log("📦 Dados Epic recebidos:", epicList);
        console.log("📦 Dados Steam recebidos:", steamList);

        // --- Mapeamento da Epic ---
        const epicGames = epicList.map(g => ({
          id: `epic-${g.id}`, // Prefixo para evitar IDs duplicados
          title: g.title,
          imageUrl: g.image,
          originalPrice: g.worth, 
          currentPrice: g.price,   
          link: g.link,
          expiryDate: g.end_date,
          store: "Epic",
          storeIcon: "https://cdn.simpleicons.org/epicgames/white",
          isFree: true, 
        }));

        // --- Mapeamento da Steam ---
        const steamGames = steamList.map(g => {
            // O Backend já manda "Grátis" ou o valor. 
            // Vamos garantir que a flag isFree seja verdadeira se o texto for Grátis ou R$ 0,00
            const priceText = g.price || "";
            const isFreeGame = priceText.includes("Grátis") || priceText === "R$ 0,00";

            return {
                id: `steam-${g.id}`, // Prefixo para evitar IDs duplicados
                title: g.title,
                // O backend manda 'image', o componente quer 'imageUrl'
                imageUrl: g.image, 
                originalPrice: g.worth,
                currentPrice: g.price, 
                link: g.link,
                expiryDate: null,
                store: "Steam",
                storeIcon: "https://cdn.simpleicons.org/steam/white",
                isFree: isFreeGame, 
            };
        });

        // Junta tudo
        const allGames = [...epicGames, ...steamGames];
        console.log("✅ Lista final processada:", allGames);
        
        setGames(allGames);
      } catch (err) {
        console.error("❌ Erro ao carregar jogos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filtered =
    filter === "Todos" ? games : games.filter(g => g.store === filter);

  // Separação visual
  const freeGames = filtered.filter(g => g.isFree);
  const promoGames = filtered.filter(g => !g.isFree);

  return (
    <div className="fixed inset-0 bg-zinc-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">🎮 Game Deals</h1>

      <StoreFilter value={filter} onChange={setFilter} />

      {loading ? (
        <div className="flex justify-center mt-20 text-zinc-500 animate-pulse">
           Carregando ofertas...
        </div>
      ) : (
        <div className="overflow-y-auto h-[calc(100%-6rem)] pb-10">
          
          {/* --- SEÇÃO ROXA: JOGOS GRÁTIS --- */}
          {freeGames.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2 mt-2 flex items-center gap-2 text-purple-300">
                🟣 Jogos Grátis 
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
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

          {/* --- SEÇÃO AZUL: PROMOÇÕES PAGAS --- */}
          {promoGames.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2 mt-2 flex items-center gap-2 text-blue-300">
                🔵 Melhores Ofertas
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
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

          {/* MENSAGEM SE NÃO TIVER NADA */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
              <p className="text-lg">Nenhum jogo encontrado...</p>
              <p className="text-sm">Tente atualizar a página.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}