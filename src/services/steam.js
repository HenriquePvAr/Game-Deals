const STEAM_URL =
  "http://localhost:3333/api/steam" // seu backend Node

export async function getSteamDeals() {
  try {
    const res = await fetch(STEAM_URL)
    if (!res.ok) throw new Error("Steam API falhou")
    const data = await res.json()

    if (!Array.isArray(data)) return []

    const games = data.map(game => ({
      id: game.cheapestDealID || game.gameID,
      title: game.title,
      description: game.dealRating || "",
      image: game.thumb || "",
      store: "Steam",
      price: game.normalPrice ? `R$ ${game.normalPrice}` : "Desconhecido",
      url: `https://store.steampowered.com/app/${game.gameID}`
    }))

    return games
  } catch (err) {
    console.error("❌ getSteamDeals erro:", err)
    return []
  }
}
