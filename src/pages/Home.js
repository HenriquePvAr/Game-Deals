import Section from "../components/Section"
import DealCard from "../components/DealCard"
import FreeCard from "../components/FreeCard"

export default function Home() {
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">

      <Section title="🔥 Promoções">
        <DealCard
          title="Cyberpunk 2077"
          store="Steam"
          discount={70}
          oldPrice="R$ 199,90"
          newPrice="R$ 59,90"
        />
      </Section>

      <div className="w-px bg-zinc-700" />

      <Section title="🎁 Grátis da Semana">
        <FreeCard
          title="Death Stranding"
          store="Epic Games"
          until="21/12"
        />
      </Section>

    </div>
  )
}
