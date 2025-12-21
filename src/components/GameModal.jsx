import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export default function GameModal({ game, onClose }) {
  const [specs, setSpecs] = useState(null);
  const [realPrice, setRealPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fecha o modal com a tecla ESC
  useEffect(() => {
    if (!game) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, game]);

  // Busca detalhes (Specs e Preço Real)
  useEffect(() => {
    if (!game) return;

    setSpecs(null);
    setRealPrice(null);
    setLoading(true);

    // Consoles não têm specs de PC, então não buscamos
    if (game.store === "PlayStation" || game.store === "Xbox") {
        setLoading(false);
        return;
    }

    const fetchDetails = async () => {
        try {
            let url = `${API_URL}/api/specs?`;
            // Tenta buscar por ID da Steam se tiver, senão vai pelo nome
            url += game.steamAppID ? `steamAppID=${game.steamAppID}` : `name=${encodeURIComponent(game.title)}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                if (data.specs) setSpecs(data.specs);
                if (data.realPrice) {
                    setRealPrice({
                        final: data.realPrice.final_formatted,
                        initial: data.realPrice.initial_formatted,
                        discount: data.realPrice.discount_percent
                    });
                }
            }
        } catch (error) {
            console.error("Erro na busca de detalhes:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDetails();
  }, [game]);

  if (!game) return null;

  // --- LÓGICA DE PREÇOS ---
  // Prioridade: Preço Real (Steam BR) > Preço Convertido (CheapShark) > Texto Padrão
  const finalPrice = realPrice 
      ? realPrice.final 
      : (game.isFree ? "GRÁTIS" : game.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
      
  const originalPrice = realPrice 
      ? realPrice.initial 
      : (game.originalPrice > 0 ? game.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null);
      
  const discountPercent = realPrice ? realPrice.discount : game.discount;

  // Preço Histórico (Menor de todos os tempos)
  const cheapestPrice = game.cheapest 
    ? `R$ ${game.cheapest.price.toFixed(2).replace('.', ',')}` 
    : null;

  const isConsole = game.store === "PlayStation" || game.store === "Xbox";
  const showSpecs = !loading && specs;

  // --- MENSAGEM DE ERRO/AVISO INTELIGENTE ---
  const renderNoSpecsMessage = () => {
      if (isConsole) return ">> INCOMPATÍVEL: PLATAFORMA CONSOLE";
      
      return (
          <div className="flex flex-col gap-2 animate-pulse">
              <span className="text-yellow-500 font-bold tracking-wider text-[10px]" >  DADOS RESTRITOS OU INDISPONÍVEIS</span>
              <p className="text-gray-500 text-[10px] leading-relaxed">
                  Os requisitos não foram carregados automaticamente. 
                  Isso é comum em jogos <strong>Adult Only (+18)</strong>, 
                  títulos muito antigos ou pacotes exclusivos.
              </p>
              <a 
                href={game.dealLink} 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline mt-1 text-[10px]"
              >
                  Verificar requisitos na Loja Oficial &rarr;
              </a>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Overlay Escuro */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Janela Principal */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-cyan-900/50 shadow-[0_0_60px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh] overflow-hidden rounded-sm">
        
        {/* === HEADER (IMAGEM) === */}
        <div className="relative h-60 w-full shrink-0 group">
          <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/60 text-white border border-white/20 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all w-8 h-8 flex items-center justify-center rounded-full z-20"
          >
            ✕
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
             <div className="inline-flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-cyan-950/90 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">
                    {game.store} SYSTEM
                </span>
                {realPrice && (
                    <span className="px-2 py-0.5 bg-green-900/80 border border-green-500/30 text-green-300 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        PREÇO OFICIAL BR
                    </span>
                )}
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl leading-none">
                {game.title}
             </h2>
          </div>
        </div>

        {/* === CORPO DO MODAL === */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-[#0a0a0a] relative">
            {/* Efeito de luz ambiente */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* --- COLUNA ESQUERDA: PREÇO E AÇÃO --- */}
                <div className="flex-1 space-y-6 shrink-0 min-w-[240px]">
                    <div className="border border-white/10 p-5 bg-white/5 relative hover:border-cyan-500/30 transition-all duration-300">
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
                                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500" style={{ width: `${Math.min(discountPercent, 100)}%` }}></div>
                                </div>
                                <span className="text-cyan-400 font-mono text-xs font-bold whitespace-nowrap">-{discountPercent}%</span>
                            </div>
                        )}

                        {/* MENOR PREÇO HISTÓRICO */}
                        {cheapestPrice && (
                            <div className="mt-5 pt-4 border-t border-white/10">
                                <p className="text-[9px] text-purple-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    Menor Valor Histórico
                                </p>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-purple-100">{cheapestPrice}</span>
                                    <span className="text-[10px] text-gray-500 font-mono">{game.cheapest.date}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <a href={game.dealLink} target="_blank" rel="noopener noreferrer"
                        className="group relative block w-full text-center py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-[0.15em] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                    >
                        <span className="relative z-10">ACESSAR OFERTA</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </a>
                    
                    {game.expiryDate && (
                        <p className="text-center text-[10px] text-gray-600 font-mono uppercase">
                            Expira em: {new Date(game.expiryDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* --- COLUNA DIREITA: REQUISITOS --- */}
                <div className="flex-1 text-sm text-gray-400 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                    <h3 className="text-white font-bold mb-4 uppercase tracking-[0.1em] text-xs border-b border-white/10 pb-2 flex items-center justify-between">
                        <span>DADOS DO SISTEMA</span>
                        {loading && <span className="text-cyan-500 animate-pulse text-[10px]">BUSCANDO DADOS...</span>}
                    </h3>

                    {showSpecs ? (
                        <div className="space-y-5 font-mono text-xs leading-relaxed animate-in fade-in duration-500">
                             {/* Estilos para formatar o HTML que vem da Steam */}
                             <style>{`
                                .specs-content strong { color: #a5f3fc; font-weight: 700; text-transform: uppercase; } 
                                .specs-content ul { list-style: none; padding: 0; margin: 0; } 
                                .specs-content li { margin-bottom: 4px; } 
                                .specs-content br { display: none; }
                             `}</style>

                             {specs.minimum && (
                                <div className="specs-content">
                                    <span className="block text-[10px] text-gray-600 mb-2 font-bold tracking-widest">// MÍNIMO</span>
                                    <div dangerouslySetInnerHTML={{ __html: specs.minimum }} />
                                </div>
                             )}
                             {specs.recommended && (
                                <div className="specs-content border-t border-white/10 pt-4">
                                    <span className="block text-[10px] text-gray-600 mb-2 font-bold tracking-widest">// RECOMENDADO</span>
                                    <div dangerouslySetInnerHTML={{ __html: specs.recommended }} />
                                </div>
                             )}
                        </div>
                    ) : !loading && (
                        <div className="text-gray-600 italic text-xs font-mono border-l-2 border-yellow-900/50 pl-3 bg-yellow-900/5 p-3 rounded">
                            {renderNoSpecsMessage()}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}