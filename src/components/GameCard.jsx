import React from 'react';

// CORES NEON ESPECÍFICAS PARA CADA LOJA
// Define a cor da borda e da sombra quando passa o mouse
const STORE_COLORS = {
    Steam: "group-hover:border-[#66c0f4] group-hover:shadow-[0_0_20px_rgba(102,192,244,0.4)]",
    Epic: "group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]",
    Xbox: "group-hover:border-[#107C10] group-hover:shadow-[0_0_20px_rgba(16,124,16,0.4)]",
    PlayStation: "group-hover:border-[#00439C] group-hover:shadow-[0_0_20px_rgba(0,67,156,0.5)]",
    default: "group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
};

export default function GameCard({ 
  title, 
  imageUrl, 
  currentPrice, 
  originalPrice, 
  discount, 
  storeIcon, 
  store, // Recebe "Steam", "Epic", etc.
  onClick, 
  isFree, 
  metacritic, 
  isWishlisted, 
  onToggleWishlist 
}) {
  
  // Seleciona o estilo baseado na loja
  const hoverStyle = STORE_COLORS[store] || STORE_COLORS.default;

  // LÓGICA DE COR DOS ÍCONES (Correção Visual)
  const getIconStyle = () => {
      // Steam: Azul original + Brilho Azul
      if (store === 'Steam') return "filter drop-shadow-[0_0_5px_rgba(102,192,244,0.8)]"; 
      
      // PlayStation: Azul escuro original + Fundo branco suave para destaque
      if (store === 'PlayStation') return "filter drop-shadow-[0_0_5px_rgba(0,67,156,0.8)] bg-white rounded-full p-0.5"; 
      
      // Xbox: Verde original + Brilho Verde (inverte se o ícone for preto nativo)
      if (store === 'Xbox') return "invert filter drop-shadow-[0_0_5px_rgba(16,124,16,0.8)]";
      
      // Epic e outros: Geralmente são pretos/brancos, então inverte para ficar branco neon
      return "invert opacity-90 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]";
  };

  // Cor da Nota do Metacritic
  const getMetacriticColor = (score) => {
      if (!score) return "text-gray-500 border-gray-600";
      if (score >= 80) return "text-green-400 border-green-500 shadow-[0_0_10px_rgba(74,222,128,0.3)]";
      if (score >= 50) return "text-yellow-400 border-yellow-500";
      return "text-red-400 border-red-500";
  };

  return (
    <div className={`group relative bg-[#0a0a0a] border border-white/10 transition-all duration-300 flex flex-col h-[340px] overflow-hidden hover:-translate-y-1 rounded-sm ${hoverStyle}`}>
      
      {/* --- BOTÃO DE FAVORITOS --- */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
        className="absolute top-2 right-2 z-30 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-pink-500 hover:bg-pink-500/10 transition-all group-hover:opacity-100"
        title="Favoritar"
      >
        <svg className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'text-pink-500 fill-current scale-110 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-gray-400 hover:text-pink-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* --- NOTA METACRITIC --- */}
      {metacritic && (
          <div className={`absolute top-2 left-2 z-30 px-2 py-0.5 bg-black/80 backdrop-blur-md border ${getMetacriticColor(metacritic)} text-xs font-bold font-mono rounded shadow-lg`}>
              {metacritic}
          </div>
      )}

      {/* --- IMAGEM --- */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={onClick}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" loading="lazy"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
        
        {/* ÍCONE DA LOJA (CORRIGIDO) */}
        <div className="absolute bottom-2 right-2 p-1.5 backdrop-blur-sm border border-white/10 rounded-md shadow-lg bg-black/40 group-hover:bg-black/80 transition-all">
            <img 
                src={storeIcon} 
                alt="Store" 
                className={`w-5 h-5 transition-all duration-300 ${getIconStyle()}`} 
            />
        </div>
      </div>

      {/* --- INFO --- */}
      <div className="p-4 flex flex-col justify-between flex-1 cursor-pointer bg-gradient-to-b from-transparent to-[#050505]" onClick={onClick}>
        
        <h3 className="text-gray-200 font-bold leading-tight line-clamp-2 group-hover:text-white transition-colors uppercase text-sm tracking-wide font-sans mb-2">
            {title}
        </h3>
        
        <div className="mt-auto">
            {originalPrice > 0 && !isFree && (
                <div className="text-gray-500 text-xs line-through font-mono mb-1 decoration-red-500/50">
                    {originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
            )}
            
            <div className="flex items-center justify-between">
                <span className={`text-xl font-black italic tracking-tighter ${isFree || currentPrice === 0 ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.3)]' : 'text-white'}`}>
                    {isFree || currentPrice === 0 ? "GRÁTIS" : currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                
                {discount > 0 && (
                    <span className={`text-xs font-bold px-2 py-1 border rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.05)] ${store === 'Steam' ? 'text-blue-300 border-blue-500/30 bg-blue-900/20' : 'text-cyan-400 border-cyan-500/30 bg-cyan-900/30'}`}>
                        -{discount}%
                    </span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}