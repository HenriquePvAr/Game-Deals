import { useEffect, useState, useRef } from "react";
import GameCard from "./components/GameCard";
import GameModal from "./components/GameModal";
import SkeletonCard from "./components/SkeletonCard";

// URL back
const API_URL = "https://game-deals-wy16.onrender.com";

// Ícones (Imagens PNG/SVG externas)
const ICONS = {
  Steam: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
  Epic: "https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg", 
  PlayStation: "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
  Xbox: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
  Todos: null,
  Favoritos: null
};

// Ícones SVG (Vetores internos)
const SvgIcons = {
  Fire: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  Money: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sort: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Heart: ({ filled }) => <svg className={`w-4 h-4 ${filled ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Refresh: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Gamepad: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  Github: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
};

// === COMPONENTE: DROPDOWN DE LOJAS COM CORES NEON ===
function CyberStoreDropdown({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const stores = [
        { id: "Todos", label: "Todas as Lojas", icon: <SvgIcons.Gamepad /> },
        { id: "Favoritos", label: "Favoritos", icon: <SvgIcons.Heart filled={true} /> },
        { id: "Steam", label: "Steam", img: ICONS.Steam },
        { id: "Epic", label: "Epic Games", img: ICONS.Epic },
        { id: "PlayStation", label: "PlayStation", img: ICONS.PlayStation },
        { id: "Xbox", label: "Xbox", img: ICONS.Xbox },
    ];

    const selected = stores.find(s => s.id === value) || stores[0];

    const getStoreColors = (storeId, isActive) => {
        const base = "w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 text-xs font-bold uppercase border-b border-white/5 last:border-0";
        const themes = {
            Steam: { active: "bg-[#171a21] text-[#66c0f4] border-l-4 border-l-[#66c0f4]", hover: "hover:bg-[#66c0f4]/10 hover:text-[#66c0f4] text-gray-400" },
            Xbox: { active: "bg-[#107C10]/20 text-[#107C10] border-l-4 border-l-[#107C10]", hover: "hover:bg-[#107C10]/10 hover:text-[#107C10] text-gray-400" },
            PlayStation: { active: "bg-[#00439C]/20 text-[#00439C] border-l-4 border-l-[#00439C]", hover: "hover:bg-[#00439C]/10 hover:text-[#00439C] text-gray-400" },
            Epic: { active: "bg-white/20 text-white border-l-4 border-l-white", hover: "hover:bg-white/10 hover:text-white text-gray-400" },
            Favoritos: { active: "bg-pink-500/20 text-pink-500 border-l-4 border-l-pink-500", hover: "hover:bg-pink-500/10 hover:text-pink-500 text-gray-400" },
            Todos: { active: "bg-purple-500/20 text-purple-400 border-l-4 border-l-purple-500", hover: "hover:bg-purple-500/10 hover:text-purple-400 text-gray-400" }
        };
        const theme = themes[storeId] || themes.Todos;
        return `${base} ${isActive ? theme.active : theme.hover}`;
    };

    const getMainButtonStyle = () => {
        if (value === 'Todos') return 'border-purple-500/50 text-purple-400 hover:border-purple-400 hover:text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]';
        if (value === 'Steam') return 'border-[#66c0f4] text-[#66c0f4] shadow-[0_0_15px_rgba(102,192,244,0.3)] bg-[#171a21]/80';
        if (value === 'Xbox') return 'border-[#107C10] text-[#107C10] shadow-[0_0_15px_rgba(16,124,16,0.3)] bg-[#107C10]/10';
        if (value === 'Favoritos') return 'border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] bg-pink-500/10';
        if (value === 'PlayStation') return 'border-[#00439C] text-[#00439C] shadow-[0_0_15px_rgba(0,67,156,0.3)] bg-[#00439C]/10';
        return 'border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]';
    };

    useEffect(() => {
        function handleClickOutside(event) { if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-50 min-w-[200px]" ref={containerRef}>
            <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between px-4 py-3 bg-black/80 border backdrop-blur-md transition-all duration-300 uppercase font-bold tracking-wider text-sm ${getMainButtonStyle()}`}>
                <div className="flex items-center gap-3">
                    {selected.img ? (<img src={selected.img} className={`w-4 h-4 ${value === 'PlayStation' ? '' : (value === 'Steam' ? '' : 'invert')}`} style={{ filter: value === 'Todos' ? 'invert(1) opacity(0.5)' : 'none' }} alt="" />) : (<span className={value === 'Favoritos' ? 'text-pink-500' : ''}>{selected.icon}</span>)}
                    <span className="truncate">{selected.label}</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`absolute top-full left-0 right-0 mt-2 bg-[#050505] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.9)] transition-all duration-200 origin-top z-50 overflow-hidden rounded-sm ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {stores.map((store) => (
                    <button key={store.id} onClick={() => { onChange(store.id); setIsOpen(false); }} className={getStoreColors(store.id, value === store.id)}>
                        <div className="flex items-center gap-3">
                            {store.img ? (<img src={store.img} className={`w-4 h-4 ${store.id === 'PlayStation' ? '' : (store.id === 'Steam' ? '' : 'invert')}`} alt="" />) : (<span className={store.id === 'Favoritos' ? 'text-pink-500' : ''}>{store.icon}</span>)}
                            {store.label}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// === COMPONENTE: DROPDOWN ORDENAÇÃO ===
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
    function handleClickOutside(event) { if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 min-w-[180px]" ref={containerRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between px-4 py-3 bg-black/60 border ${isOpen ? 'border-purple-500 text-purple-400' : 'border-purple-500/30 text-gray-400 hover:border-purple-400 hover:text-white'} backdrop-blur-md transition-all duration-300 uppercase font-bold tracking-wider text-sm`}>
        <div className="flex items-center gap-2"><span>{selectedOption?.icon}</span><span>{selectedOption?.label}</span></div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className={`absolute top-full left-0 right-0 mt-2 bg-[#050505] border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {options.map((option) => (
            <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all text-xs font-bold uppercase border-b border-white/5 last:border-0 ${value === option.value ? 'bg-purple-900/30 text-purple-300 border-l-4 border-l-purple-500' : 'text-gray-400 hover:bg-white/10 hover:text-purple-300'}`}>
                {option.icon} {option.label}
            </button>
          ))}
      </div>
    </div>
  );
}

// === APP PRINCIPAL ===
export default function App() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("savings");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // PAGINAÇÃO
  const [visibleCount, setVisibleCount] = useState(24);

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    .font-cyber { font-family: 'Orbitron', sans-serif; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #06b6d4; border: 1px solid #000; }
    .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
    .glitch { position: relative; color: white; text-shadow: 2px 2px 0px #06b6d4, -2px -2px 0px #9333ea; animation: glitch-anim 2s infinite linear alternate-reverse; }
    @keyframes glitch-anim { 0% { text-shadow: 2px 2px 0px #06b6d4, -2px -2px 0px #9333ea; } 25% { text-shadow: -2px 2px 0px #06b6d4, 2px -2px 0px #9333ea; } 50% { text-shadow: 2px -2px 0px #06b6d4, -2px 2px 0px #9333ea; } 75% { text-shadow: -2px -2px 0px #06b6d4, 2px 2px 0px #9333ea; } 100% { text-shadow: 2px 2px 0px #06b6d4, -2px -2px 0px #9333ea; } }
    .cyber-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(147, 51, 234, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(147, 51, 234, 0.15) 1px, transparent 1px); transform: perspective(500px) rotateX(60deg); transform-origin: center top; animation: grid-move 20s linear infinite; }
    @keyframes grid-move { 0% { background-position: 0 0; } 100% { background-position: 0 1000px; } }
  `;

  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  const toggleWishlist = (id) => { setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]); };

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
        const original = cleanPrice(game.worth); 
        const current = cleanPrice(game.price);
        const discount = original > 0 ? Math.round(((original - current) / original) * 100) : 0;
        return { 
          ...game, 
          title: cleanTitle(game.title), 
          id: game.id || Math.random().toString(), 
          imageUrl: game.image, 
          storeIcon: ICONS[game.store] || ICONS.Steam, 
          dealLink: game.link, 
          originalPrice: original, 
          currentPrice: current, 
          isFree: current === 0, 
          discount: discount, 
          expiryDate: game.expiryDate, 
          specs: game.specs || null,
          metacritic: game.metacritic,
          cheapest: game.cheapest,
          store: game.store
        };
      });

      setGames(allGames.filter((v, i, a) => a.findIndex(t => (t.title === v.title)) === i));
    } catch (err) { console.error(err); setError(true); } finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  // Lógica de Filtro
  let processedGames = games;
  if (searchTerm && searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase().trim();
    processedGames = processedGames.filter(g => g.title.toLowerCase().includes(term));
  }
  if (filter === "Favoritos") {
      processedGames = processedGames.filter(g => wishlist.includes(g.id));
  } else if (filter !== "Todos") {
      processedGames = processedGames.filter(g => g.store === filter);
  }
  processedGames = [...processedGames].sort((a, b) => {
      if (sortBy === "price_asc") return a.currentPrice - b.currentPrice;
      if (sortBy === "savings") return b.discount - a.discount;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
  });

  const freeGames = processedGames.filter(g => g.isFree);
  const promoGames = processedGames.filter(g => !g.isFree);
  const visiblePromoGames = promoGames.slice(0, visibleCount);

  if (error) return ( <div className="fixed inset-0 bg-black flex items-center justify-center p-4 font-cyber"><div className="text-center"><h2 className="text-5xl font-black text-red-500 mb-4 glitch">SYSTEM FAILURE</h2><button onClick={() => window.location.reload()} className="px-8 py-3 border border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-black transition-all">REBOOT</button></div></div> );

  return (
    <div className="fixed inset-0 bg-black text-white p-4 overflow-hidden font-sans selection:bg-cyan-500/30">
      <style>{customStyles}</style>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#1a0b2e] z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[60%] cyber-grid opacity-30 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay z-0"></div>

      <header className="relative z-40 mb-6 flex flex-col xl:flex-row items-center justify-between gap-6 p-4">
        <div className="flex items-center gap-6 w-full xl:w-auto justify-between xl:justify-start">
            <h1 className="text-3xl md:text-5xl font-black font-cyber italic tracking-wider glitch select-none cursor-default truncate">DEALS HUB</h1>
            <button onClick={loadData} disabled={loading} className="group p-2 border border-white/20 hover:border-cyan-400 rounded-none transition-all"><SvgIcons.Refresh className={`w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
        <div className="w-full max-w-lg relative group z-50">
            <input type="text" placeholder="BUSCAR JOGO..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/60 border border-purple-500/30 text-cyan-400 p-3 pl-10 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all font-mono placeholder-gray-600 uppercase text-sm" />
            <div className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cyan-400"><SvgIcons.Search /></div>
            {searchTerm && (<button onClick={() => setSearchTerm("")} className="absolute right-3 top-3 text-gray-600 hover:text-white">✕</button>)}
        </div>
        <div className="flex gap-4 w-full xl:w-auto z-40 justify-end">
            <CyberSortDropdown value={sortBy} onChange={setSortBy} />
            <CyberStoreDropdown value={filter} onChange={setFilter} />
        </div>
      </header>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />

      {loading ? (
        // === SKELETON LOADING (NOVO) ===
        <div className="relative z-10 h-[calc(100%-8rem)] pb-20 pr-2 custom-scrollbar overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
                {Array.from({ length: 15 }).map((_, i) => (<SkeletonCard key={i} />))}
            </div>
            <p className="font-cyber text-cyan-900 tracking-[0.5em] animate-pulse text-xs text-center mt-8">ESTABELECENDO CONEXÃO...</p>
        </div>
      ) : (
        <div className="relative z-10 overflow-y-auto h-[calc(100%-8rem)] pb-20 pr-2 custom-scrollbar">
          <div className="mb-4 text-xs font-cyber text-gray-500 tracking-widest text-right px-2">SCAN COMPLETE: {processedGames.length} UNITS FOUND</div>

          {freeGames.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6 border-b border-purple-500/30 pb-2"><h2 className="text-2xl font-bold font-cyber text-purple-400 tracking-widest">FREE ACCESS</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {freeGames.map(game => (<GameCard key={game.id} {...game} store={game.store} onClick={() => setSelectedGame(game)} isWishlisted={wishlist.includes(game.id)} onToggleWishlist={() => toggleWishlist(game.id)} />))}
              </div>
            </section>
          )}

          {promoGames.length > 0 && (
            <section className="mb-8">
               <div className="flex items-center gap-4 mb-6 border-b border-cyan-500/30 pb-2"><h2 className="text-2xl font-bold font-cyber text-cyan-400 tracking-widest">DISCOUNTS</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {visiblePromoGames.map(game => (<GameCard key={game.id} {...game} store={game.store} onClick={() => setSelectedGame(game)} isWishlisted={wishlist.includes(game.id)} onToggleWishlist={() => toggleWishlist(game.id)} />))}
              </div>
              
              {/* BOTÃO CARREGAR MAIS */}
              {visibleCount < promoGames.length && (
                  <div className="flex justify-center mt-12 mb-8">
                      <button onClick={() => setVisibleCount(prev => prev + 24)} className="group relative px-8 py-3 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 font-bold font-cyber tracking-widest hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all duration-300">
                          <span className="relative z-10 flex items-center gap-2">CARREGAR MAIS (+24) <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></span>
                      </button>
                  </div>
              )}
            </section>
          )}
          
          <footer className="border-t border-white/10 mt-12 pt-8 pb-8 text-center">
              <p className="text-gray-500 text-xs font-mono mb-2">PROJECT: GAME_DEALS_HUB // V.2.0.4</p>
              <div className="flex justify-center items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <span className="text-sm font-bold">DEVELOPED BY HENRIQUE</span>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors"><SvgIcons.Github /></a>
              </div>
          </footer>

          {processedGames.length === 0 && (
             <div className="flex flex-col items-center justify-center mt-32 text-gray-600 font-cyber space-y-4">
                 <p className="text-xl tracking-widest border border-gray-700 px-6 py-4 bg-black/50">NO SIGNAL DETECTED</p>
                 {searchTerm && <p className="text-sm text-cyan-600">Nenhum resultado para "{searchTerm}"</p>}
             </div>
          )}
        </div>
      )}
    </div>
  );
}