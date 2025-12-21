import { useEffect, useState, useRef } from "react";
import GameCard from "./components/GameCard";
import GameModal from "./components/GameModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

const ICONS = {
  Steam: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
  Epic: "https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg", 
  PlayStation: "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
  Xbox: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
  Todos: null
};

// --- CORES OFICIAIS DAS MARCAS (TEMAS) ---
const STORE_THEMES = {
    Todos: { 
        color: "text-white", 
        bg: "bg-purple-600", 
        border: "border-purple-400", 
        shadowColor: "#a855f7" 
    },
    Steam: { 
        color: "text-[#66c0f4]", 
        bg: "bg-[#171a21]", 
        border: "border-[#66c0f4]", 
        shadowColor: "#66c0f4" 
    },
    Xbox: { 
        color: "text-[#107C10]", 
        bg: "bg-black", 
        border: "border-[#107C10]", 
        shadowColor: "#107C10" 
    },
    PlayStation: { 
        color: "text-[#00439C]", // Azul Escuro para contraste no fundo branco
        bg: "bg-[#f0f0f0]",      // Fundo quase branco
        border: "border-[#00439C]", 
        shadowColor: "#00439C" 
    },
    Epic: { 
        color: "text-white", 
        bg: "bg-[#2a2a2a]", 
        border: "border-white", 
        shadowColor: "#ffffff" 
    }
};

// --- ÍCONES SVG ---
const SvgIcons = {
  Fire: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  Money: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sort: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>,
  Refresh: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Gamepad: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
};

// --- FILTRO DE LOJAS (CORRIGIDO E ANIMADO) ---
function CyberStoreFilter({ value, onChange, stores }) {
  return (
    <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-none border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] overflow-x-auto custom-scrollbar-hide clip-path-slant">
      {stores.map((store) => {
        const isActive = value === store;
        const theme = STORE_THEMES[store] || STORE_THEMES.Todos;

        return (
          <button
            key={store}
            onClick={() => onChange(store)}
            className={`
              relative flex items-center gap-2 px-5 py-2 text-sm font-bold transition-all duration-300 whitespace-nowrap uppercase tracking-wider overflow-hidden group
              ${isActive 
                ? `${theme.bg} ${theme.color} border-l-2 ${theme.border}` 
                : 'text-cyan-500 hover:text-white hover:bg-cyan-900/30'}
            `}
            style={isActive ? { boxShadow: `0 0 20px ${theme.shadowColor}` } : {}}
          >
            {/* EFEITO SHIMMER (O Brilho passando) */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
            )}

            {ICONS[store] ? (
              <img 
                src={ICONS[store]} 
                alt={store} 
                className={`w-4 h-4 z-10 transition-all 
                    ${isActive 
                        ? (store === 'PlayStation' ? 'filter-none' : 'brightness-200 drop-shadow-md') 
                        : 'opacity-50 invert group-hover:opacity-100 group-hover:invert-0'
                    }`} 
              />
            ) : ( <SvgIcons.Gamepad /> )}
            
            <span className="relative z-10">{store}</span>
          </button>
        );
      })}
    </div>
  );
}

// --- DROPDOWN ---
function CyberSortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const options = [
    { value: "savings", label: "Maior Desconto", icon: <SvgIcons.Fire /> },
    { value: "price_asc", label: "Menor Preço", icon: <SvgIcons.Money /> },
    { value: "title", label: "Nome (A-Z)", icon: <SvgIcons.Sort /> },
  ];
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 min-w-[220px]" ref={containerRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between px-4 py-3 bg-black/60 border ${isOpen ? 'border-purple-500 text-purple-400' : 'border-purple-500/30 text-gray-400 hover:border-purple-400 hover:text-white'} backdrop-blur-md transition-all duration-300 uppercase font-bold tracking-wider text-sm`}>
        <div className="flex items-center gap-2">
            <span>{selectedOption.icon}</span>
            <span>{selectedOption.label}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>

      <div className={`absolute top-full left-0 right-0 mt-1 bg-black border border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {options.map((option) => (
            <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all text-sm font-bold uppercase ${value === option.value ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-purple-300'}`}>
                {option.icon} {option.label}
            </button>
          ))}
      </div>
    </div>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("savings");
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- ESTILOS VISUAIS E ANIMAÇÕES ---
  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

    .font-cyber { font-family: 'Orbitron', sans-serif; }
    
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #06b6d4; border: 1px solid #000; }
    .custom-scrollbar-hide::-webkit-scrollbar { display: none; }

    /* EFEITO GLITCH NO TÍTULO */
    .glitch {
      position: relative;
      color: white;
      text-shadow: 2px 2px 0px #06b6d4, -2px -2px 0px #9333ea;
      animation: glitch-anim 2s infinite linear alternate-reverse;
    }
    @keyframes glitch-anim {
      0% { text-shadow: 2px 2px 0px #06b6d4, -2px -2px 0px #9333ea; }
      25% { text-shadow: -2px 2px 0px #06b6d4, 2px -2px 0px #9333ea; }
      50% { text-shadow: 2px -2px 0px #06b6d4, -2px 2px 0px #9333ea; }
      75% { text-shadow: -2px -2px 0px #06b6d4, 2px 2px 0px #9333ea; }
      100% { text-shadow: 2px 2px 0px #06b6d4, -2px -2px 0px #9333ea; }
    }

    /* GRID DE FUNDO EM PERSPECTIVA */
    .cyber-grid {
      background-size: 40px 40px;
      background-image:
        linear-gradient(to right, rgba(147, 51, 234, 0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(147, 51, 234, 0.15) 1px, transparent 1px);
      transform: perspective(500px) rotateX(60deg);
      transform-origin: center top;
      animation: grid-move 20s linear infinite;
    }
    @keyframes grid-move {
      0% { background-position: 0 0; }
      100% { background-position: 0 1000px; }
    }

    /* ANIMAÇÃO SHIMMER (O Brilho Passando) */
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    .animate-shimmer {
        animation: shimmer 1.5s infinite linear;
    }
  `;

  async function loadData() {
    try {
      setLoading(true); setError(false);
      const [pcData, epicFreeData, consoleData] = await Promise.all([
        fetch(`${API_URL}/api/pc`).then(r => r.json()),
        fetch(`${API_URL}/api/epic-free`).then(r => r.json()),
        fetch(`${API_URL}/api/console`).then(r => r.json())
      ]);
      const cleanPrice = (val) => { if (!val) return 0; if (typeof val === 'number') return val; const cleanString = String(val).replace(/[R$\s]/g, '').replace(',', '.').trim(); return parseFloat(cleanString) || 0; };
      const cleanTitle = (rawTitle) => rawTitle.replace(/Giveaway/gi, "").replace(/\(Steam\)/gi, "").replace(/\(Epic\)/gi, "").replace(/\(PC\)/gi, "").replace(/-/g, "").replace(/\s\s+/g, " ").trim();
      const allGames = [...pcData, ...epicFreeData, ...consoleData].map(game => {
        const original = cleanPrice(game.worth); const current = cleanPrice(game.price);
        const discount = original > 0 ? Math.round(((original - current) / original) * 100) : 0;
        return { ...game, title: cleanTitle(game.title), id: game.id || Math.random().toString(), imageUrl: game.image, storeIcon: ICONS[game.store] || ICONS.Steam, dealLink: game.link, originalPrice: original, currentPrice: current, isFree: current === 0, discount: discount, expiryDate: game.expiryDate, specs: game.specs || null };
      });
      setGames(allGames.filter((v, i, a) => a.findIndex(t => (t.title === v.title)) === i));
    } catch (err) { console.error(err); setError(true); } finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  let processedGames = filter === "Todos" ? games : games.filter(g => g.store === filter);
  processedGames = [...processedGames].sort((a, b) => {
      if (sortBy === "price_asc") return a.currentPrice - b.currentPrice;
      if (sortBy === "savings") return b.discount - a.discount;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
  });
  const freeGames = processedGames.filter(g => g.isFree);
  const promoGames = processedGames.filter(g => !g.isFree);

  // --- TELA DE ERRO (Com Refresh Real) ---
  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-4 font-cyber">
        <div className="text-center relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl animate-pulse"></div>
            <h2 className="text-5xl font-black text-red-500 mb-4 relative z-10 glitch">SYSTEM FAILURE</h2>
            <p className="text-red-300 mb-8 tracking-widest uppercase">Falha na conexão com o servidor</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-3 border border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-black transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            >
                REBOOT SYSTEM
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white p-4 overflow-hidden font-sans selection:bg-cyan-500/30">
      <style>{customStyles}</style>
      
      {/* FUNDO CYBERPUNK (Grade e Estrelas) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#1a0b2e] z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[60%] cyber-grid opacity-30 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay z-0"></div>

      {/* HEADER */}
      <header className="relative z-40 mb-8 flex flex-col xl:flex-row items-center justify-between gap-6 p-4">
        <div className="flex items-center gap-6">
            
            {/* TÍTULO GLITCH */}
            <h1 className="text-4xl md:text-5xl font-black font-cyber italic tracking-wider glitch select-none cursor-default">
              DEALS HUB
            </h1>
            
            <button onClick={loadData} disabled={loading} className="group p-2 border border-white/20 hover:border-cyan-400 rounded-none transition-all" title="Atualizar">
              <SvgIcons.Refresh className={`w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto z-50">
            <CyberSortDropdown value={sortBy} onChange={setSortBy} />
            <CyberStoreFilter value={filter} onChange={setFilter} stores={["Todos", "Steam", "Epic", "PlayStation", "Xbox"]} />
        </div>
      </header>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-full pb-20 gap-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-purple-500 rounded-none animate-spin"></div>
          <p className="font-cyber text-cyan-500 tracking-[0.5em] animate-pulse text-xs">LOADING_DATA</p>
        </div>
      ) : (
        <div className="relative z-10 overflow-y-auto h-[calc(100%-8rem)] pb-20 pr-2 custom-scrollbar">
          
          <div className="mb-4 text-xs font-cyber text-gray-500 tracking-widest text-right px-2">
            SCAN COMPLETE: {processedGames.length} UNITS FOUND
          </div>

          {/* JOGOS GRÁTIS */}
          {freeGames.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6 border-b border-purple-500/30 pb-2">
                <h2 className="text-2xl font-bold font-cyber text-purple-400 tracking-widest">FREE ACCESS</h2>
                <div className="px-2 py-0.5 bg-purple-600 text-black font-bold text-xs">{freeGames.length}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {freeGames.map(game => (<GameCard key={game.id} {...game} onClick={() => setSelectedGame(game)} />))}
              </div>
            </section>
          )}

          {/* DESCONTOS */}
          {promoGames.length > 0 && (
            <section>
               <div className="flex items-center gap-4 mb-6 border-b border-cyan-500/30 pb-2">
                <h2 className="text-2xl font-bold font-cyber text-cyan-400 tracking-widest">DISCOUNTS</h2>
                <div className="px-2 py-0.5 bg-cyan-600 text-black font-bold text-xs">{promoGames.length}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {promoGames.map(game => (<GameCard key={game.id} {...game} onClick={() => setSelectedGame(game)} />))}
              </div>
            </section>
          )}
          
          {processedGames.length === 0 && (
             <div className="flex flex-col items-center justify-center mt-32 text-gray-500 font-cyber space-y-4">
                 <p className="text-xl tracking-widest border border-gray-700 px-6 py-4 bg-black/50">NO SIGNAL DETECTED</p>
                 {filter === "Xbox" && (
                    <p className="text-xs font-sans max-w-xs text-center text-gray-600">
                        Nenhum jogo 100% grátis encontrado para Xbox no momento.
                    </p>
                 )}
             </div>
          )}
        </div>
      )}
    </div>
  );
}