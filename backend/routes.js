import { Router } from "express";

const router = Router();

// Cabeçalhos para "fingir" que somos um navegador e não um script
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/json,application/xhtml+xml,application/xml",
  "Accept-Language": "en-US,en;q=0.9",
};

// --- ROTA EPIC GAMES ---
router.get("/api/epic", async (req, res) => {
  try {
    const url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions";
    
    const response = await fetch(url, { headers: HEADERS });
    
    // DEBUG: Se der erro, mostra o motivo exato
    if (!response.ok) {
        console.log(`❌ Erro Epic: Status ${response.status} (${response.statusText})`);
        const text = await response.text(); // Lê o que o firewall respondeu
        console.log(`   Resposta: ${text.substring(0, 100)}...`); 
        throw new Error(`Status ${response.status}`);
    }
    
    const data = await response.json();
    const games = data.data.Catalog.searchStore.elements;

    const formattedGames = games.reduce((acc, game) => {
      const promotions = game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0];
      if (promotions && promotions.discountSetting.discountPercentage === 0) {
        const imageObj = game.keyImages.find(img => img.type === 'Thumbnail') || game.keyImages[0];
        acc.push({
          id: game.id,
          title: game.title,
          image: imageObj ? imageObj.url : "",
          worth: game.price.totalPrice.fmtPrice.originalPrice, 
          price: 0,
          end_date: promotions.endDate
        });
      }
      return acc;
    }, []);

    res.json(formattedGames);

  } catch (error) {
    console.error("Erro fatal na rota Epic:", error.message);
    res.status(500).json({ error: "Falha na Epic", details: error.message });
  }
});

// --- ROTA STEAM (CheapShark) ---
router.get("/api/steam", async (req, res) => {
  try {
    const url = "https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=Savings&pageSize=12";
    
    const response = await fetch(url, { headers: HEADERS });

    if (!response.ok) {
        console.log(`❌ Erro Steam: Status ${response.status} (${response.statusText})`);
        const text = await response.text();
        console.log(`   Resposta: ${text.substring(0, 100)}...`);
        throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();

    const formattedGames = data.map(game => ({
      id: game.dealID,
      title: game.title,
      image: `https://capsuleusercontent.com/apps/${game.steamAppID}/header.jpg`,
      worth: game.normalPrice, 
      price: game.salePrice,   
      end_date: new Date(game.lastChange * 1000).toISOString() 
    }));

    res.json(formattedGames);

  } catch (error) {
    console.error("Erro fatal na rota Steam:", error.message);
    res.status(500).json({ error: "Falha na Steam", details: error.message });
  }
});

export default router;