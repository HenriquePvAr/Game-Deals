const EPIC_URL =
  "http://localhost:3333/api/epic" // seu backend Node

export async function getEpicFreeGames() {
  try {
    const res = await fetch(EPIC_URL)
    if (!res.ok) throw new Error("Epic API falhou")
    const data = await res.json()

    // Navegar pelo JSON do Epic e extrair os jogos gratuitos
    if (!data || !data.data || !data.data.Catalog || !data.data.Catalog.searchStore) {
      return []
    }

    const elements = data.data.Catalog.searchStore.elements || []

    const games = elements
      .filter(el => el.promotions?.promotionalOffers?.length > 0 || el.price?.discountPrice === 0)
      .map(el => ({
        id: el.id,
        title: el.title,
        description: el.description || "",
        image: el.keyImages?.[0]?.url || "",
        store: "Epic",
        price: el.price?.fmtPrice?.discountPrice || "Grátis",
        url: el.urlSlug ? `https://www.epicgames.com/store/pt-BR/p/${el.urlSlug}` : null
      }))

    return games
  } catch (err) {
    console.error("❌ getEpicFreeGames erro:", err)
    return []
  }
}
