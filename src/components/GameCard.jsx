import { FaClock, FaExternalLinkAlt } from "react-icons/fa";
import React from "react";

export default function GameCard({
  title,
  imageUrl,
  originalPrice,
  currentPrice,
  expiryDate,
  store,
  storeIcon,
  link,
  isRedeemed
}) {
  const timeLeft = () => {
    if (!expiryDate) return null; // Se não tem data, retorna null
    const diff = new Date(expiryDate) - new Date();
    if (diff <= 0) return "Expirado";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    // Formatação mais limpa
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const timeString = timeLeft();

  return (
    <div className="relative rounded-xl overflow-hidden shadow-neon-lg group h-72 bg-zinc-800 flex flex-col">
      {/* Container da Imagem (fixo) */}
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* Overlay Superior */}
        <div className="absolute top-0 left-0 w-full flex justify-between p-2 bg-gradient-to-b from-black/80 to-transparent">
          {/* Só mostra o relógio se tiver tempo válido (Epic) */}
          {timeString && (
            <span className="flex items-center gap-1 text-xs font-mono bg-black/60 text-yellow-400 px-2 py-1 rounded backdrop-blur-sm border border-yellow-400/30">
              <FaClock className="text-[10px]"/> {timeString}
            </span>
          )}
          {/* Se não tiver tempo (Steam), mostra só o ícone da loja à direita */}
          {!timeString && <div />} 
          
          <img src={storeIcon} alt={store} className="w-6 h-6 drop-shadow-md" />
        </div>
      </div>

      {/* Conteúdo Inferior */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-zinc-800">
        <div>
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2" title={title}>
            {title}
          </h3>
        </div>

        <div className="mt-2">
          {/* Preços */}
          <div className="flex items-end justify-between mb-3">
             <div className="flex flex-col">
                {originalPrice && (
                  <span className="text-zinc-500 text-xs line-through decoration-red-500/50">
                    {originalPrice}
                  </span>
                )}
             </div>
             <span className="font-bold text-green-400 text-lg shadow-green-glow">
               {currentPrice}
             </span>
          </div>

          {/* Botão */}
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
          >
            Ver Oferta <FaExternalLinkAlt size={10} />
          </a>
        </div>
      </div>

      {/* Overlay de Resgatado */}
      {isRedeemed && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-green-500 font-bold z-20 backdrop-blur-sm">
          <span>✅</span>
          <span>Resgatado</span>
        </div>
      )}
    </div>
  );
}