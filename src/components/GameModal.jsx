import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export default function GameModal({ game, onClose }) {
  const [specs, setSpecs] = useState(null);
  const [realPrice, setRealPrice] = useState(null); // Preço vindo da Steam
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!game) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, game]);

  useEffect(() => {
    if (!game) return;

    setSpecs(null);
    setRealPrice(null); // Reseta
    setLoading(true);

    if (game.store === "PlayStation" || game.store === "Xbox") {
        setLoading(false);
        return;
    }

    const fetchDetails = async () => {
        try {
            let url = `${API_URL}/api/specs?`;
            url += game.steamAppID ? `steamAppID=${game.steamAppID}` : `name=${encodeURIComponent(game.title)}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                // Se tiver specs, usa
                if (data.specs) setSpecs(data.specs);
                
                // Se tiver preço real da Steam, usa. Se não, mantemos null para usar o fallback
                if (data.realPrice) {
                    setRealPrice({
                        final: data.realPrice.final_formatted,
                        initial: data.realPrice.initial_formatted,
                        discount: data.realPrice.discount_percent
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDetails();
  }, [game]);

  if (!game) return null;

  // --- LÓGICA DE PREÇO HÍBRIDA ---
  // 1. Tenta usar o preço Real da Steam (R$ Oficial)
  // 2. Se não tiver (Steam bloqueou), usa o preço calculado do Dólar que veio no 'game'
  const finalPrice = realPrice 
      ? realPrice.final 
      : (game.isFree ? "GRÁTIS" : game.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
      
  const originalPrice = realPrice 
      ? realPrice.initial 
      : (game.originalPrice > 0 ? game.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null);
      
  const discountPercent = realPrice ? realPrice.discount : game.discount;

  const isConsole = game.store === "PlayStation" || game.store === "Xbox";
  const showSpecs = !loading && specs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-cyan-900/50 shadow-[0_0_60px_rgba(6,182,212,0.1)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* HEADER */}
        <div className="relative h-60 w-full shrink-0">
          <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/60 text-cyan-500 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all p-2 z-20">✕</button>
          
          <div className="absolute bottom-6 left-6 right-6">
             <div className="inline-block px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-2 shadow-lg backdrop-blur-md">{game.store} SYSTEM</div>
             <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl leading-none">{game.title}</h2>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-[#0a0a0a] relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* PREÇO */}
                <div className="flex-1 space-y-6 shrink-0">
                    <div className="border border-white/10 p-5 bg-white/5 relative group hover:border-cyan-500/30 transition-colors">
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">VALOR ATUAL</p>
                        
                        <div className="flex flex-col">
                             {originalPrice && !game.isFree && (
                                <span className="text-gray-600 line-through font-mono text-xs mb-1 decoration-red-500/40">{originalPrice}</span>
                            )}
                            <span className={`text-4xl font-black italic tracking-tighter ${game.isFree || finalPrice === "GRÁTIS" ? 'text-green-400' : 'text-white'}`}>
                                {finalPrice}
                            </span>
                        </div>

                        {discountPercent > 0 && (
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-px flex-1 bg-cyan-900/50"></div>
                                <span className="text-cyan-400 font-mono text-xs font-bold">-{discountPercent}% OFF</span>
                            </div>
                        )}
                    </div>

                    <a href={game.dealLink} target="_blank" rel="noopener noreferrer"
                        className="block w-full text-center py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.15em] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-95"
                    >
                        ACESSAR OFERTA
                    </a>
                    
                    {game.expiryDate && (
                        <p className="text-center text-[10px] text-gray-600 font-mono uppercase">Válido até: {new Date(game.expiryDate).toLocaleDateString()}</p>
                    )}
                </div>

                {/* SPECS */}
                <div className="flex-1 text-sm text-gray-400 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                    <h3 className="text-white font-bold mb-4 uppercase tracking-[0.1em] text-xs border-b border-white/10 pb-2 flex items-center justify-between">
                        <span>DADOS DO SISTEMA</span>
                        {loading && <span className="text-cyan-500 animate-pulse text-[10px]">BUSCANDO...</span>}
                    </h3>

                    {showSpecs ? (
                        <div className="space-y-5 font-mono text-xs leading-relaxed">
                             <style>{`.specs-content strong { color: #a5f3fc; font-weight: 700; text-transform: uppercase; } .specs-content ul { list-style: none; padding: 0; margin: 0; } .specs-content li { margin-bottom: 4px; } .specs-content br { display: none; }`}</style>

                             {specs.minimum && (
                                <div className="specs-content">
                                    <span className="block text-[10px] text-gray-600 mb-2">// MÍNIMO</span>
                                    <div dangerouslySetInnerHTML={{ __html: specs.minimum }} />
                                </div>
                             )}
                             {specs.recommended && (
                                <div className="specs-content border-t border-white/5 pt-4">
                                    <span className="block text-[10px] text-gray-600 mb-2">// RECOMENDADO</span>
                                    <div dangerouslySetInnerHTML={{ __html: specs.recommended }} />
                                </div>
                             )}
                        </div>
                    ) : !loading && (
                        <div className="text-gray-600 italic text-xs font-mono border-l-2 border-red-900/50 pl-3">
                            {isConsole ? ">> INCOMPATÍVEL: PLATAFORMA CONSOLE" : ">> DADOS OFICIAIS OCULTOS (RESTRIÇÃO DE IDADE). CONFIRA NA LOJA."}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}