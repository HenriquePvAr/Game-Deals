export default function GameCard({ title, imageUrl, storeIcon, discount, currentPrice, isFree, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#121217] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] border border-white/5 hover:border-purple-500/50"
    >
      {/* Imagem */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Sutil (Brilho no topo) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Conteúdo */}
      <div className="p-4 relative">
        {/* Ícone da Loja */}
        <div className="absolute -top-3 right-3 bg-[#18181b] p-1.5 rounded-lg border border-white/10 shadow-lg group-hover:border-purple-500/30 transition-colors z-10">
            <img src={storeIcon} alt="Store" className="w-5 h-5 opacity-80 group-hover:opacity-100" />
        </div>

        {/* Título */}
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 mb-3 pr-8 group-hover:text-purple-300 transition-colors">
            {title}
        </h3>

        {/* Informações de Preço */}
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Preço</span>
                <span className={`text-xl font-black ${isFree ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]' : 'text-white'}`}>
                    {isFree ? "GRÁTIS" : currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>

            {discount > 0 && (
                <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300 text-xs font-bold shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                    -{discount}%
                </div>
            )}
        </div>
      </div>
    </div>
  );
}