import { FaClock } from "react-icons/fa";
import React from "react";

export default function GameCard({
  title,
  imageUrl,
  originalPrice,
  currentPrice,
  expiryDate,
  store,
  storeIcon,
  isRedeemed
}) {
  const timeLeft = () => {
    if (!expiryDate) return "";
    const diff = new Date(expiryDate) - new Date();
    if (diff <= 0) return "Expirado";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days > 0 ? days + "D " : ""}${hours}H ${minutes}M`;
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-neon-lg`}>
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      
      {/* Overlay superior */}
      <div className="absolute top-0 left-0 w-full flex justify-between p-2 bg-gradient-to-b from-black/60 to-transparent">
        <span className="flex items-center gap-1 text-sm">
          <FaClock /> {timeLeft()}
        </span>
        <img src={storeIcon} alt={store} className="w-6 h-6" />
      </div>

      {/* Overlay inferior */}
      <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-between items-center text-sm">
          <span className="line-through text-zinc-400">${originalPrice.toFixed(2)}</span>
          <span className="font-bold text-green-400">${currentPrice.toFixed(2)}</span>
        </div>
        <span className="mt-1 block font-semibold text-white">{title}</span>
      </div>

      {/* Estado Resgatado */}
      {isRedeemed && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xl font-bold">
          Resgatado
        </div>
      )}
    </div>
  );
}
