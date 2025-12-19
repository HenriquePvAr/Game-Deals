import { Router } from "express";

const router = Router();

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/json,application/xhtml+xml,application/xml",
};

// --- ROTA EPIC (Não mexemos, está ok) ---
router.get("/api/epic", async (req, res) => {
  try {
    const url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=pt-BR&country=BR&allowCountries=BR";
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    const games = data.data.Catalog.searchStore.elements;

    const formattedGames = games.reduce((acc, game) => {
      const promotions = game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0];
      if (promotions && promotions.discountSetting.discountPercentage === 0) {
        let imageObj = game.keyImages.find(img => img.type === 'OfferImageWide') || game.keyImages.find(img => img.type === 'Thumbnail');
        const slug = game.productSlug || game.urlSlug; 
        
        acc.push({
          id: `epic-${game.id}`,
          title: game.title,
          image: imageObj ? imageObj.url : "", 
          worth: game.price.totalPrice.fmtPrice.originalPrice || "R$ 0,00", 
          price: "Grátis", 
          link: `https://store.epicgames.com/pt-BR/p/${slug}`,
          end_date: promotions.endDate
        });
      }
      return acc;
    }, []);
    res.json(formattedGames);
  } catch (error) {
    console.error("Erro Epic:", error.message);
    res.json([]); 
  }
});

// --- ROTA STEAM (Modo "Mostre o que tiver") ---
router.get("/api/steam", async (req, res) => {
  try {
    console.log("🔍 Buscando Steam...");

    // 1. URL UNIFICADA PARA GRÁTIS
    // upperPrice=0: Traz tudo que é grátis.
    // sortBy=Savings: Traz primeiro o que tem desconto (Giveaways), depois os F2P.
    const freeUrl = "https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=0&sortBy=Savings&pageSize=10";
    
    // 2. URL PARA PAGOS (Mantendo os 24 que você pediu)
    const paidUrl = "https://www.cheapshark.com/api/1.0/deals?storeID=1&lowerPrice=1&sortBy=Savings&pageSize=24";

    const [freeRes, paidRes] = await Promise.all([
        fetch(freeUrl),
        fetch(paidUrl)
    ]);

    const freeData = await freeRes.json(); // Aqui virão 10 jogos grátis (Mistos)
    const paidData = await paidRes.json(); // Aqui virão 24 jogos pagos

    console.log(`✅ Grátis encontrados: ${freeData.length}`);
    console.log(`✅ Pagos encontrados: ${paidData.length}`);

    // Junta tudo
    const allDeals = [...freeData, ...paidData];

    // Busca detalhes na Steam (Imagens e Preço Original BR)
    // Filtramos IDs duplicados e vazios
    const steamAppIDs = [...new Set(allDeals.map(g => g.steamAppID).filter(id => id))].join(',');
    
    // URL da Steam
    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${steamAppIDs}&cc=br&filters=price_overview,basic`;
    
    let steamPrices = {};
    try {
        const steamRes = await fetch(steamUrl);
        if (steamRes.ok) steamPrices = await steamRes.json();
    } catch (err) { console.warn("Aviso: Steam Rate Limit (usando dados básicos)"); }

    const formattedGames = allDeals.map(game => {
      const appId = game.steamAppID;
      const details = steamPrices?.[appId]?.data;
      
      // Lógica Simples e Direta
      let finalPrice = "R$ ???";
      let originalPrice = "";

      // Se veio da lista 'freeData' OU o preço de venda é 0
      if (parseFloat(game.salePrice) === 0) {
          finalPrice = "Grátis";
          
          // Tenta descobrir se era pago
          if (details && details.price_overview && details.price_overview.initial > 0) {
             // A Steam diz que custava algo
             originalPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(details.price_overview.initial / 100);
          } else if (parseFloat(game.normalPrice) > 0) {
             // A CheapShark diz que custava algo
             const normBRL = (parseFloat(game.normalPrice) * 6).toFixed(2).replace('.', ',');
             originalPrice = `R$ ${normBRL}*`;
          } else {
             // É F2P
             originalPrice = "Grátis p/ Jogar";
          }
      } 
      // Se é jogo PAGO
      else {
          if (details && details.price_overview) {
             const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val / 100);
             finalPrice = formatBRL(details.price_overview.final);
             originalPrice = formatBRL(details.price_overview.initial);
          } else {
             // Fallback CheapShark
             const priceBRL = (parseFloat(game.salePrice) * 6).toFixed(2).replace('.', ',');
             finalPrice = `R$ ${priceBRL}*`;
          }
      }

      return {
        id: `steam-${game.dealID}`,
        title: game.title,
        image: appId ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg` : game.thumb,
        worth: originalPrice, 
        price: finalPrice,   
        link: `https://store.steampowered.com/app/${appId}`,
        end_date: null 
      };
    });

    res.json(formattedGames);

  } catch (error) {
    console.error("Erro Fatal Steam:", error.message);
    res.json([]);
  }
});

export default router;