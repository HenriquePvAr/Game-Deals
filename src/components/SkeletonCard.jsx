export default function SkeletonCard() {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 h-[340px] rounded-sm overflow-hidden relative">
      {/* Efeito de Pulso (Piscada) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>

      {/* Imagem Fake */}
      <div className="h-48 bg-white/5 w-full"></div>

      {/* Conteúdo Fake */}
      <div className="p-4 flex flex-col justify-between flex-1 h-[calc(100%-12rem)]">
        {/* Título Fake */}
        <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>

        {/* Preço Fake */}
        <div className="mt-auto flex justify-between items-end">
             <div className="h-8 bg-white/10 rounded w-1/3"></div>
             <div className="h-5 bg-white/5 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}