import { useEffect, useState } from "react";
import useCountdown from "../hooks/useCountdown";

export default function GameCard({ title, imageUrl, originalPrice, currentPrice, expiryDate, storeIcon, isFree, store }) {
  const timeLeft = useCountdown(expiryDate);
  const discount = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 100;

  return (
    // CARD COM EFEITO GLASSMORPHISM
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Imagem com gradiente no hover */}
      <div className="relative h-40 w-full overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
        
        {/* Badge da Loja */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
          <img src={storeIcon} alt={store} className="w-5 h-5" />
        </div>

        {/* Badge de Desconto */}
        {discount > 0 && (
           <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold shadow-lg ${isFree ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}`}>
             {isFree ? 'GRÁTIS' : `-${discount}%`}
           </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-gray-100 line-clamp-2 leading-tight mb-1 group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mb-3">{store}</p>
        </div>

        <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
                {originalPrice > 0 && (
                    <span className="text-xs text-gray-500 line-through">
                        {store === "Steam" || store === "Epic" ? `$${originalPrice}` : `R$ ${originalPrice}`}
                    </span>
                )}
                <span className={`font-bold text-lg ${isFree ? 'text-purple-400' : 'text-green-400'}`}>
                    {isFree ? "R$ 0,00" : `$${currentPrice}`}
                </span>
            </div>
            
            <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
                ➜
            </button>
        </div>
        
        {/* Tempo Restante (se houver) */}
        {expiryDate && (
          <div className="mt-2 text-[10px] text-center bg-black/30 py-1 rounded text-gray-400">
            ⏳ {timeLeft}
          </div>
        )}
      </div>
    </div>
  );
}