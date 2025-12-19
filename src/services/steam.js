const STEAM_URL = "http://localhost:3333/api/steam"; 

export async function getSteamDeals() {
  try {
    const res = await fetch(STEAM_URL);
    if (!res.ok) throw new Error("Steam API falhou");
    
    const data = await res.json();

    if (!Array.isArray(data)) return [];

    // Mapeamento Atualizado para combinar com o novo Backend
    const games = data.map(game => {
      // Lógica para definir se é visualmente "Grátis"
      const isFreeGame = game.price === "Grátis" || game.price === "R$ 0,00";

      return {
        id: game.id,
        title: game.title,
        // O Backend agora manda 'image', mas o componente espera 'imageUrl'
        imageUrl: game.image, 
        
        // O Backend já manda formatado (ex: "R$ 100,00" ou "Grátis p/ Jogar")
        originalPrice: game.worth, 
        
        // O Backend já manda formatado (ex: "R$ 20,00" ou "Grátis")
        currentPrice: game.price, 
        
        // O Backend agora manda o link correto
        link: game.link, 
        
        expiryDate: null, // Steam geralmente não tem data de fim óbvia na API
        store: "Steam",
        storeIcon: "https://cdn.simpleicons.org/steam/white",
        isFree: isFreeGame
      };
    });

    return games;
  } catch (err) {
    console.error("❌ getSteamDeals erro:", err);
    return [];
  }
}