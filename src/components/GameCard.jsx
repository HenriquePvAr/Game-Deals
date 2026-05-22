import React from 'react';

// CORES NEON ESPECÍFICAS PARA CADA LOJA
const STORE_COLORS = {
    Steam: "group-hover:border-[#66c0f4] group-hover:shadow-[0_0_25px_rgba(102,192,244,0.3)]",
    Epic: "group-hover:border-white group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]",
    Xbox: "group-hover:border-[#107C10] group-hover:shadow-[0_0_25px_rgba(16,124,16,0.3)]",
    PlayStation: "group-hover:border-[#00439C] group-hover:shadow-[0_0_25px_rgba(0,67,156,0.3)]",
    default: "group-hover:border-cyan-500 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
};

export default function GameCard({ 
  title, 
  imageUrl, 
  currentPrice, 
  originalPrice, 
  discount, 
  storeIcon, 
  store,
  onClick, 
  isFree, 
  metacritic, 
  isWishlisted, 
  onToggleWishlist 
}) {
  
  const hoverStyle = STORE_COLORS[store] || STORE_COLORS.default;

  const getIconStyle = () => {
      if (store === 'Steam') return "filter drop-shadow-[0_0_5px_rgba(102,192,244,0.8)]"; 
      if (store === 'PlayStation') return "filter drop-shadow-[0_0_5px_rgba(0,67,156,0.8)] bg-white rounded-full p-0.5"; 
      if (store === 'Xbox') return "invert filter drop-shadow-[0_0_5px_rgba(16,124,16,0.8)]";
      return "invert opacity-90 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]";
  };

  const getMetacriticColor = (score) => {
      if (!score) return "text-gray-500 border-gray-600";
      if (score >= 80) return "text-green-400 border-green-500 shadow-[0_0_10px_rgba(74,222,128,0.3)] bg-green-500/10";
      if (score >= 50) return "text-yellow-400 border-yellow-500 bg-yellow-500/10";
      return "text-red-400 border-red-500 bg-red-500/10";
  };

  return (
    <div className={`group relative bg-[#0f0f13] border border-white/[0.08] transition-all duration-500 flex flex-col h-[360px] overflow-hidden hover:-translate-y-2 hover:border-white/[0.15] rounded-2xl ${hoverStyle}`}>
      
      {/* --- BOTÃO DE FAVORITOS --- */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
        className="absolute top-3 right-3 z-30 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 hover:border-pink-500 hover:bg-pink-500/20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        title="Adicionar aos favoritos"
      >
        <svg className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'text-pink-500 fill-current scale-110 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-gray-400 hover:text-pink-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* --- NOTA METACRITIC --- */}
      {metacritic && (
          <div className={`absolute top-3 left-3 z-30 px-2.5 py-1 bg-black/80 backdrop-blur-md border ${getMetacriticColor(metacritic)} text-xs font-bold font-mono rounded-lg shadow-lg`}>
              {metacritic}
          </div>
      )}

      {/* --- IMAGEM --- */}
      <div className="relative h-48 overflow-hidden cursor-pointer rounded-t-2xl" onClick={onClick}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-transparent opacity-90" />
        
        {/* Badge de Desconto */}
        {discount > 0 && !isFree && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black rounded-lg shadow-lg">
            -{discount}%
          </div>
        )}
        
        {/* ÍCONE DA LOJA */}
        <div className="absolute bottom-3 right-3 p-2 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg bg-black/40 group-hover:bg-black/60 transition-all">
            <img 
                src={storeIcon} 
                alt="Store" 
                className={`w-5 h-5 transition-all duration-300 ${getIconStyle()}`} 
            />
        </div>
      </div>

      {/* --- INFO --- */}
      <div className="p-4 flex flex-col justify-between flex-1 cursor-pointer bg-gradient-to-b from-transparent to-[#0a0a0f]" onClick={onClick}>
        
        <h3 className="text-gray-200 font-semibold leading-snug line-clamp-2 group-hover:text-white transition-colors text-sm tracking-wide mb-3 min-h-[2.75rem]">
            {title}
        </h3>
        
        <div className="mt-auto space-y-2">
            {originalPrice > 0 && !isFree && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs line-through font-medium">
                      {originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
            )}
            
            <div className="flex items-center justify-between">
                <span className={`text-xl font-black ${isFree || currentPrice === 0 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]' : 'text-white'}`}>
                    {isFree || currentPrice === 0 ? "GRÁTIS" : currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                
                {!discount && (
                  <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">Ver oferta</span>
                )}
            </div>
        </div>
      </div>
      
      {/* Overlay Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
    </div>
  );
}