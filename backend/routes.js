import { Router } from "express";

const router = Router();

// Headers para fingir ser um navegador (evita bloqueio 403)
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
};

// --- ROTA 1: PC (Steam e Epic - Pagos e Grátis) ---
router.get("/api/pc", async (req, res) => {
  try {
    // Busca 3 coisas ao mesmo tempo na CheapShark
    const [steamDeals, steamFree, epicDeals] = await Promise.all([
      // Steam Promoções
      fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=Savings&pageSize=12", { headers: HEADERS }).then(r => r.json()),
      // Steam Jogos Grátis (upperPrice=0)
      fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=0&pageSize=12", { headers: HEADERS }).then(r => r.json()),
      // Epic Promoções (storeID 25)
      fetch("https://www.cheapshark.com/api/1.0/deals?storeID=25&sortBy=Savings&pageSize=12", { headers: HEADERS }).then(r => r.json())
    ]);

    const formatCheapShark = (game, storeName) => ({
      id: game.dealID,
      title: game.title,
      image: game.thumb, 
      worth: game.normalPrice,
      price: parseFloat(game.salePrice),
      store: storeName,
      end_date: game.lastChange ? new Date(game.lastChange * 1000).toISOString() : null
    });

    const formatted = [
      ...steamDeals.map(g => formatCheapShark(g, "Steam")),
      ...steamFree.map(g => formatCheapShark(g, "Steam")),
      ...epicDeals.map(g => formatCheapShark(g, "Epic"))
    ];

    res.json(formatted);
  } catch (error) {
    console.error("Erro PC:", error);
    res.json([]);
  }
});

// --- ROTA 2: EPIC FREE (Oficial da Semana) ---
router.get("/api/epic-free", async (req, res) => {
  try {
    const url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions";
    const response = await fetch(url, { headers: HEADERS });
    const data = await response.json();
    
    const games = data.data.Catalog.searchStore.elements.reduce((acc, game) => {
      const promo = game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0];
      if (promo && promo.discountSetting.discountPercentage === 0) {
        // Pega imagem thumbnail ou a primeira disponível
        const img = game.keyImages.find(i => i.type === 'Thumbnail')?.url || game.keyImages[0]?.url;
        acc.push({
          id: game.id,
          title: game.title,
          image: img,
          worth: game.price.totalPrice.fmtPrice.originalPrice,
          price: 0,
          store: "Epic",
          end_date: promo.endDate
        });
      }
      return acc;
    }, []);

    res.json(games);
  } catch (error) {
    console.error("Erro Epic Free:", error);
    res.json([]);
  }
});

// --- ROTA 3: CONSOLES (GamerPower) ---
router.get("/api/console", async (req, res) => {
  try {
    const response = await fetch("https://www.gamerpower.com/api/giveaways?platform=ps4.ps5.xbox-one.xbox-series-xs", { headers: HEADERS });
    const data = await response.json();

    const formatted = data.map(game => ({
      id: String(game.id),
      title: game.title,
      image: game.image,
      worth: game.worth === "N/A" ? "0" : game.worth,
      price: 0, 
      store: game.platforms.toLowerCase().includes("playstation") ? "PlayStation" : "Xbox",
      end_date: game.end_date === "N/A" ? null : game.end_date
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erro Console:", error);
    res.json([]);
  }
});

export default router;