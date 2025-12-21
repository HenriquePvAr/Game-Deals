import { Router } from "express";
import NodeCache from "node-cache";

const router = Router();
const cache = new NodeCache({ stdTTL: 600, deleteOnExpire: true });

let CURRENT_DOLLAR_RATE = 6.15;

// --- LISTA VIP (GARANTIA PARA JOGOS FAMOSOS BLOQUEADOS) ---
const VIP_DB = {
    "976310": { // MK11
        specs: {
            minimum: "<strong>SO:</strong> Windows 7 / 10<br><strong>Proc:</strong> Intel Core i5-750 / AMD Phenom II X4 965<br><strong>Mem:</strong> 8 GB RAM<br><strong>Vídeo:</strong> GTX 670 / Radeon HD 7950",
            recommended: "<strong>SO:</strong> Windows 10<br><strong>Proc:</strong> Intel Core i5-2300 / AMD FX-6300<br><strong>Mem:</strong> 8 GB RAM<br><strong>Vídeo:</strong> GTX 780 / Radeon R9 290"
        },
        price: { final_formatted: "R$ 22,99", initial_formatted: "R$ 229,99", discount_percent: 90 }
    },
    "271590": { // GTA V
        specs: {
            minimum: "<strong>SO:</strong> Windows 10<br><strong>Proc:</strong> Core 2 Quad Q6600<br><strong>Vídeo:</strong> 9800 GT 1GB", 
            recommended: "<strong>SO:</strong> Windows 10<br><strong>Proc:</strong> i5 3470<br><strong>Vídeo:</strong> GTX 660 2GB"
        },
        price: { final_formatted: "R$ 38,63", initial_formatted: "R$ 109,89", discount_percent: 63 }
    }
};

const STEAM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Cookie": "birthtime=283996801; lastagecheckage=1-0-1979; wants_mature_content=1; steamCountry=BR%7C00000000000000000000000000000000"
};

const updateExchangeRate = async () => {
    try {
        const res = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
        const data = await res.json();
        if (data.USDBRL?.bid) CURRENT_DOLLAR_RATE = parseFloat(data.USDBRL.bid);
    } catch (e) {}
};
updateExchangeRate();
setInterval(updateExchangeRate, 1000 * 60 * 30);

const idOverrides = {
    "mortal kombat 11": "976310",
    "mortal kombat 11 ultimate": "976310",
    "grand theft auto v": "271590",
    "gta v": "271590",
    "red dead redemption 2": "1174180",
    "cyberpunk 2077": "1091500"
};

// --- SCRAPER (FALLBACK) ---
const scrapeSteamPage = async (appID) => {
    try {
        const res = await fetch(`https://store.steampowered.com/app/${appID}/?cc=br&l=brazilian`, { headers: STEAM_HEADERS });
        const html = await res.text();

        let priceData = null;
        const priceMatch = html.match(/data-price-final="(\d+)"/);
        if (priceMatch) {
            const val = parseInt(priceMatch[1]);
            priceData = { final_formatted: `R$ ${(val/100).toFixed(2).replace('.', ',')}`, initial_formatted: null, discount_percent: 0 };
        }

        let minSpecs = "", recSpecs = "";
        const minMatch = html.match(/<div class="game_area_sys_req_leftCol"[^>]*>([\s\S]*?)<\/div>/) || html.match(/<div class="game_area_sys_req_full"[^>]*>([\s\S]*?)<\/div>/);
        const recMatch = html.match(/<div class="game_area_sys_req_rightCol"[^>]*>([\s\S]*?)<\/div>/);
        if (minMatch) minSpecs = minMatch[1];
        if (recMatch) recSpecs = recMatch[1];

        const clean = (s) => s.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");

        if (minSpecs || recSpecs || priceData) {
            return {
                success: true,
                specs: { minimum: clean(minSpecs), recommended: clean(recSpecs) },
                realPrice: priceData
            };
        }
        return null;
    } catch (e) { return null; }
};

// --- GET DATA MESTRE ---
const getSteamData = async (appID) => {
    // 1. VIP LIST (Instantâneo para MK11/GTA)
    if (VIP_DB[appID]) return { success: true, ...VIP_DB[appID] };

    // 2. API OFICIAL (Rápida para jogos normais)
    try {
        const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appID}&cc=br&l=brazilian`, { headers: STEAM_HEADERS });
        const data = await res.json();
        if (data[appID]?.success && data[appID].data.pc_requirements?.minimum) {
            return {
                success: true,
                specs: data[appID].data.pc_requirements,
                realPrice: data[appID].data.price_overview
            };
        }
    } catch (e) {}

    // 3. SCRAPER (Última chance para jogos bloqueados ou bugados)
    return await scrapeSteamPage(appID);
};

// --- BUSCAS (MELHORADAS) ---
const searchCheapShark = async (term) => {
    try {
        // Busca exata primeiro
        const res = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(term)}&limit=1`);
        const data = await res.json();
        return data?.[0]?.steamAppID || null;
    } catch (e) { return null; }
};

const searchSteamDirect = async (term) => {
    try {
        const res = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&l=english&cc=BR`, { headers: STEAM_HEADERS });
        const data = await res.json();
        return data.items?.[0]?.id || null;
    } catch (e) { return null; }
};

// --- ROTA SPECS ---
router.get("/api/specs", async (req, res) => {
    const { name, steamAppID } = req.query;
    let targetID = steamAppID;

    try {
        const lowerName = (name || "").toLowerCase();

        // 1. Overrides
        for (const [key, id] of Object.entries(idOverrides)) {
            if (lowerName.includes(key)) {
                targetID = id;
                break;
            }
        }

        // 2. Busca ID se não tiver (LÓGICA CORRIGIDA PARA INDIES)
        if (!targetID && name) {
            // Remove apenas tags como (Steam), mas MANTÉM OS ESPAÇOS e PONTUAÇÃO
            const cleanName = lowerName
                .replace(/giveaway|\(steam\)|\(pc\)|\(epic\)|ultimate|deluxe|gold|goty|edition/gi, "")
                .trim();
            
            targetID = await searchCheapShark(cleanName);
            if (!targetID) targetID = await searchSteamDirect(cleanName);
        }

        // 3. Pega dados
        if (targetID) {
            const result = await getSteamData(targetID);
            if (result) return res.json(result);
        }
        res.json({ success: false });
    } catch (error) { res.json({ success: false }); }
});

// --- LISTAGEM (CÓDIGO PADRÃO - AUMENTADO) ---
const parsePriceFallback = (price, isUsd = false) => {
  if (!price || price === "N/A" || price === "0") return 0;
  if (typeof price === "number") return isUsd ? price * CURRENT_DOLLAR_RATE : price;
  let clean = String(price).replace(/[R$\s]/g, "").replace(",", "."); 
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : (isUsd ? val * CURRENT_DOLLAR_RATE : val);
};

const extractSteamID = (url) => url?.match(/\/app\/(\d+)/)?.[1] || null;

const mapCheapSharkDeal = (game, storeName) => ({
    id: game.dealID,
    steamAppID: game.steamAppID,
    title: game.title,
    image: game.thumb,
    worth: parsePriceFallback(game.normalPrice, true),
    price: parsePriceFallback(game.salePrice, true),
    store: storeName,
    link: `https://www.cheapshark.com/redirect?dealID=${game.dealID}`,
    expiryDate: game.lastChange ? new Date(game.lastChange * 1000).toISOString() : null
});

router.get("/api/pc", async (req, res) => {
  try {
    const cachedData = cache.get("pc_deals_v21_final");
    if (cachedData) return res.json(cachedData);

    const [steam, epic, xbox, giveaways] = await Promise.all([
      fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=DealRating&metacritic=50&onSale=1&pageSize=600").then(r => r.json()),
      fetch("https://www.cheapshark.com/api/1.0/deals?storeID=25&sortBy=Savings&pageSize=200").then(r => r.json()),
      fetch("https://www.cheapshark.com/api/1.0/deals?storeID=30&sortBy=Savings&pageSize=100").then(r => r.json()),
      fetch("https://www.gamerpower.com/api/giveaways?platform=pc&type=game").then(r => r.json())
    ]);

    const finalData = [
        ...steam.map(g => mapCheapSharkDeal(g, "Steam")),
        ...epic.map(g => mapCheapSharkDeal(g, "Epic")),
        ...xbox.map(g => mapCheapSharkDeal(g, "Xbox")),
        ...(Array.isArray(giveaways) ? giveaways.filter(g => g.platforms.toLowerCase().includes("steam")).slice(0, 15).map(g => ({
            id: String(g.id), steamAppID: extractSteamID(g.open_giveaway_url), title: g.title, image: g.image,
            worth: parsePriceFallback(g.worth, true), price: 0, store: "Steam", link: g.open_giveaway_url, expiryDate: g.end_date === "N/A" ? null : g.end_date
        })) : [])
    ];

    cache.set("pc_deals_v21_final", finalData, 300);
    res.json(finalData);
  } catch (e) { res.json([]); }
});

router.get("/api/epic-free", async (req, res) => {
     try {
        const cached = cache.get("epic_free"); if (cached) return res.json(cached);
        const url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=pt-BR&country=BR";
        const response = await fetch(url).then(r => r.json());
        const games = response.data.Catalog.searchStore.elements.reduce((acc, game) => {
          const promo = game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0];
          if (promo && game.price?.totalPrice?.discountPrice === 0) {
              acc.push({
                id: game.id, title: game.title,
                image: game.keyImages.find(i => i.type === 'OfferImageWide')?.url || game.keyImages[0]?.url,
                worth: parsePriceFallback(game.price?.totalPrice?.fmtPrice?.originalPrice, false),
                price: 0, store: "Epic", link: `https://store.epicgames.com/pt-BR/p/${game.productSlug}`, expiryDate: promo.endDate
              });
          }
          return acc;
        }, []);
        cache.set("epic_free", games); res.json(games);
      } catch (e) { res.json([]); }
});

router.get("/api/console", async (req, res) => {
    try {
        const cached = cache.get("console_deals"); if (cached) return res.json(cached);
        const data = await fetch("https://www.gamerpower.com/api/giveaways").then(r => r.json());
        const games = [];
        data.forEach(game => {
            const p = game.platforms.toLowerCase();
            const base = { id: String(game.id), title: game.title, image: game.image, worth: parsePriceFallback(game.worth, true), price: 0, link: game.open_giveaway_url, expiryDate: game.end_date === "N/A" ? null : game.end_date };
            if (p.includes("ps4") || p.includes("ps5") || p.includes("playstation")) games.push({ ...base, store: "PlayStation", id: base.id + "_ps" });
            if (p.includes("xbox")) games.push({ ...base, store: "Xbox", id: base.id + "_xb" });
        });
        cache.set("console_deals", games); res.json(games);
    } catch (e) { res.json([]); }
});

export default router;