import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Users, Save, History, PieChart, TrendingUp, 
  CheckCircle, XCircle, Clock, Activity, Target, Zap, 
  BarChart2, Menu, ChevronRight, AlertCircle, RefreshCw, Check, X, Calendar, Layers, Trophy, Flame 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart as RechartsPieChart, Pie, Legend
} from 'recharts';

// --- COMPONENTES UI AUXILIARES ---

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className={`bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-slate-500 transition-all duration-300`}>
    <div className={`absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon size={40} />
    </div>
    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">{title}</div>
    <div className={`text-2xl md:text-3xl font-bold text-white`}>
      {value}
    </div>
    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
      {subtext}
    </div>
  </div>
);

// --- APP PRINCIPAL ---

export default function PortfolioManager() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CONFIGURACIÓN DE TIPSTERS
  const [tipsters] = useState([
    { name: 'Zona Tipster (Alta)', defaultStake: 50 },
    { name: 'Club Vip (Media)', defaultStake: 10 },
    { name: 'Club Remates (Media)', defaultStake: 10 },
    { name: 'Elitebets', defaultStake: 5 },
    { name: 'Stakazo', defaultStake: 5 },
    { name: 'Copete', defaultStake: 5 },
    { name: 'Torete', defaultStake: 5 },
    { name: 'Zona Tenis', defaultStake: 5 },
    { name: 'Mezcla-Tips', defaultStake: 5 },
    { name: 'Combis (Apuesta D)', defaultStake: 5 }
  ]);

  // HISTORIAL DE APUESTAS (BASE DE DATOS COMPLETA - CORREGIDA V29)
  const fullHistory = [
     // --- DÍA 2 (16 Dic) ---
     {
        id: 15, date: '2025-12-16', tipster: 'Club Remates (Media)', stake: 10.00, odds: 2.00, result: 'loss', description: 'Joel Colwill (1+ Remates) + Chelsea Gana', profit: -10.00, subPicks: []
     },
     {
        id: 14, date: '2025-12-16', tipster: 'Copete', stake: 5.00, odds: 1.90, result: 'loss', description: 'Bolívar Gana y +2.5 Goles', profit: -5.00, subPicks: []
     },
     {
        id: 13, date: '2025-12-16', tipster: 'Club Vip (Media)', stake: 10.00, odds: 2.37, result: 'win', description: 'Tyrique George (+1.5 Remates a Puerta)', profit: 13.70, subPicks: []
     },
     {
        id: 12, date: '2025-12-16', tipster: 'Combis (Apuesta D)', stake: 5.00, odds: 11.56, result: 'loss', description: 'Copa: Real Sociedad + Mallorca X2 (Fallo) + Elche Clasif + Barça a 0 + Valencia Clasif', profit: -5.00, subPicks: []
     },
     {
        id: 11, date: '2025-12-16', tipster: 'Zona Tipster (Alta)', stake: 50.00, odds: 1.61, result: 'win', description: 'Cardiff (+7.5 Remates) vs Chelsea', profit: 30.50, subPicks: []
     },
     {
        id: 10, date: '2025-12-16', tipster: 'Elitebets', stake: 5.00, odds: 1.50, result: 'loss', description: 'Peter Goldsteinier Gana', profit: -5.00, subPicks: []
     },
     {
        id: 9, date: '2025-12-16', tipster: 'Torete', stake: 5.00, odds: 1.66, result: 'loss', description: 'Sporting de Gijón Gana o Empata', profit: -5.00, subPicks: []
     },
     {
        id: 8, date: '2025-12-16', tipster: 'Copete', stake: 5.00, odds: 1.57, result: 'win', description: 'Hapoel Tel Aviv Gana + Barça Gana y +1.5 Goles', profit: 2.85, subPicks: []
     },
  
      // --- DÍA 1 (15 Dic) ---
      { 
        id: 1, date: '2025-12-15', tipster: 'Mezcla-Tips', stake: 5.00, odds: 2.42, result: 'win', description: 'Combinada Mixta Día 1', profit: 7.10,
        subPicks: [
          { id: 's1', tipster: 'Torete', status: 'win', detail: 'CD Castellón' },
          { id: 's2', tipster: 'Elitebets', status: 'win', detail: 'Jakub Prachar' },
          { id: 's3', tipster: 'Copete', status: 'win', detail: 'Rayo Vallecano' }
        ]
      },
      {
        id: 2, date: '2025-12-15', tipster: 'Stakazo', stake: 5.00, odds: 1.92, result: 'win', description: 'Combinada Doble Tenis (Axel + John)', profit: 4.60, subPicks: []
      },
      {
        id: 3, date: '2025-12-15', tipster: 'Combis (Apuesta D)', stake: 5.00, odds: 13.01, result: 'win', description: 'Remates: Serrano, Athletic, Mbappé...', profit: 60.05, subPicks: []
      },
      {
        id: 4, date: '2025-12-15', tipster: 'Club Remates (Media)', stake: 10.00, odds: 1.50, result: 'loss', description: 'Bournemouth (Menos 13.5) + Senne', profit: -10.00, subPicks: []
      },
      {
        id: 5, date: '2025-12-15', tipster: 'Zona Tipster (Alta)', stake: 50.00, odds: 1.70, result: 'win', description: 'Rayo Vallecano (+11.5 Remates) + No Roja', profit: 35.00, subPicks: []
      },
      {
        id: 6, date: '2025-12-15', tipster: 'Club Vip (Media)', stake: 10.00, odds: 1.53, result: 'win', description: 'Samuel Aghehowa (1.5+ Tiros Puerta)', profit: 5.30, subPicks: []
      },
      {
        id: 7, date: '2025-12-15', tipster: 'Combis (Apuesta D)', stake: 5.00, odds: 5.57, result: 'loss', description: 'Triple Combinada Remates', profit: -5.00, subPicks: []
      }
  ];

  // ESTADO APUESTAS PORTFOLIO
  const [bets, setBets] = useState([]);
  
  // ESTADO RETOS
  const initialChallenges = [
    {
        id: 1,
        title: 'Escalera iPhone (Copete)',
        subtitle: 'Objetivo 1.000€ (Navidad)',
        initialBank: 30,
        currentBank: 54.00,
        targetBank: 1000,
        color: 'emerald',
        history: [
            {
                id: 1001,
                date: '2025-12-16',
                stake: 30.00,
                odds: 1.80,
                description: 'Paso 1: Hapoel Tel Aviv Gana + Paris Under 96.5pts',
                result: 'win',
                profit: 24.00
            }
        ]
    },
    {
        id: 2,
        title: 'Reto Torete ITF',
        subtitle: 'Objetivo 10.000€',
        initialBank: 100,
        currentBank: 570,
        targetBank: 10000,
        color: 'blue',
        history: [
            {
                id: 1002,
                date: '2025-12-16',
                stake: 471.00,
                odds: 1.45,
                description: 'Paso Fuerte: Becroft + K.Smith + Kuhar + Sach',
                result: 'pending',
                profit: 0
            },
            {
                id: 999,
                date: '2025-12-15',
                stake: 100,
                odds: 5.70,
                description: 'Ganancias Acumuladas Previas (Ajuste Inicial)',
                result: 'win',
                profit: 470
            }
        ]
    },
    {
        id: 3,
        title: 'Reto Torete NextGen',
        subtitle: 'Objetivo 11.000€',
        initialBank: 100,
        currentBank: 100,
        targetBank: 11000,
        color: 'purple',
        history: [
            {
                id: 1003,
                date: '2025-12-16',
                stake: 100.00,
                odds: 2.00,
                description: 'Dino Prizmic vs Nishesh (Más de 1.5 Tie Breaks)',
                result: 'pending',
                profit: 0
            }
        ]
    },
    {
        id: 4,
        title: 'Reto Elitebets NextGen',
        subtitle: 'Objetivo 1.000€',
        initialBank: 50,
        currentBank: 50,
        targetBank: 1000,
        color: 'orange',
        history: [
            {
                id: 1004,
                date: '2025-12-16',
                stake: 50.00,
                odds: 1.57,
                description: 'Dino Prizmic Gana',
                result: 'pending',
                profit: 0
            }
        ]
    }
  ];

  const [challenges, setChallenges] = useState([]);
  
  // ESTADO FORMULARIO RETO
  const [challengeForm, setChallengeForm] = useState({ id: null, stake: '', odds: '', desc: '' });

  // --- CARGA Y PERSISTENCIA ---
  useEffect(() => {
    // Para asegurar que se ve la corrección, forzamos la carga de fullHistory si no hay datos más recientes
    // Opcional: limpiar localStorage para ver cambios inmediatos
    const savedBets = localStorage.getItem('betPortfolioV29_bets');
    if (savedBets) setBets(JSON.parse(savedBets));
    else setBets(fullHistory);

    const savedChallenges = localStorage.getItem('betPortfolioV29_challenges');
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
    else setChallenges(initialChallenges);
  }, []);

  useEffect(() => {
    if (bets.length > 0) localStorage.setItem('betPortfolioV29_bets', JSON.stringify(bets));
  }, [bets]);

  useEffect(() => {
    if (challenges.length > 0) localStorage.setItem('betPortfolioV29_challenges', JSON.stringify(challenges));
  }, [challenges]);

  // --- LÓGICA PORTFOLIO ---
  const updateSimpleStatus = (id, newStatus) => {
    const updatedBets = bets.map(b => {
      if (b.id === id) {
        let newProfit = 0;
        if (newStatus === 'win') newProfit = (b.stake * b.odds) - b.stake;
        if (newStatus === 'loss') newProfit = -b.stake;
        if (newStatus === 'void') newProfit = 0;
        return { ...b, result: newStatus, profit: parseFloat(newProfit.toFixed(2)) };
      }
      return b;
    });
    setBets(updatedBets);
  };

  const updateSubPickStatus = (betId, subPickIndex, newStatus) => {
    const updatedBets = bets.map(b => {
      if (b.id === betId) {
        const newSubPicks = [...b.subPicks];
        newSubPicks[subPickIndex].status = newStatus;
        const anyLoss = newSubPicks.some(sp => sp.status === 'loss');
        const anyPending = newSubPicks.some(sp => sp.status === 'pending');
        let parentResult = 'pending';
        let parentProfit = 0;
        if (anyLoss) { parentResult = 'loss'; parentProfit = -b.stake; } 
        else if (!anyPending) { parentResult = 'win'; parentProfit = (b.stake * b.odds) - b.stake; }
        return { ...b, subPicks: newSubPicks, result: parentResult, profit: parseFloat(parentProfit.toFixed(2)) };
      }
      return b;
    });
    setBets(updatedBets);
  };

  const deleteBet = (id) => {
    if(window.confirm("¿Borrar registro permanentemente?")) setBets(bets.filter(b => b.id !== id));
  };

  // --- LÓGICA RETOS ---
  const addChallengeBet = (e, challengeId) => {
      e.preventDefault();
      const updatedChallenges = challenges.map(c => {
          if (c.id === challengeId) {
              const stake = parseFloat(challengeForm.stake);
              const odds = parseFloat(challengeForm.odds);
              const newBet = {
                  id: Date.now(),
                  date: new Date().toISOString().split('T')[0],
                  stake: stake,
                  odds: odds,
                  description: challengeForm.desc,
                  result: 'pending',
                  profit: 0
              };
              return { ...c, history: [newBet, ...c.history] };
          }
          return c;
      });
      setChallenges(updatedChallenges);
      setChallengeForm({ id: null, stake: '', odds: '', desc: '' });
  };

  const resolveChallengeBet = (challengeId, betId, result) => {
      const updatedChallenges = challenges.map(c => {
          if (c.id === challengeId) {
              let bankChange = 0;
              const updatedHistory = c.history.map(b => {
                  if (b.id === betId && b.result === 'pending') {
                      let profit = 0;
                      if (result === 'win') profit = (b.stake * b.odds) - b.stake;
                      if (result === 'loss') profit = -b.stake;
                      if (result === 'void') profit = 0;
                      bankChange = profit;
                      return { ...b, result, profit };
                  }
                  return b;
              });
              const newBank = c.currentBank + bankChange;
              return { ...c, currentBank: parseFloat(newBank.toFixed(2)), history: updatedHistory };
          }
          return c;
      });
      setChallenges(updatedChallenges);
  };

  const deleteChallengeBet = (challengeId, betId) => {
      if(!window.confirm("¿Eliminar apuesta del reto? Se recalculará el saldo.")) return;
      const updatedChallenges = challenges.map(c => {
        if (c.id === challengeId) {
            const betToDelete = c.history.find(b => b.id === betId);
            let bankCorrection = 0;
            if (betToDelete.result !== 'pending') bankCorrection = -betToDelete.profit;
            return {
                ...c,
                currentBank: parseFloat((c.currentBank + bankCorrection).toFixed(2)),
                history: c.history.filter(b => b.id !== betId)
            };
        }
        return c;
      });
      setChallenges(updatedChallenges);
  };

  // --- STATS GLOBALES ---
  const financialStats = useMemo(() => {
    const valid = bets.filter(b => b.result !== 'void' && b.result !== 'pending');
    const staked = valid.reduce((acc, b) => acc + b.stake, 0);
    const profit = valid.reduce((acc, b) => acc + b.profit, 0);
    const yield_val = staked > 0 ? ((profit / staked) * 100).toFixed(2) : 0;
    
    // Gráfico acumulativo
    let runningProfit = 0;
    const chartData = [...bets]
      .filter(b => b.result !== 'pending')
      .sort((a,b) => new Date(a.date) - new Date(b.date) || a.id - b.id)
      .map(b => {
        runningProfit += b.profit;
        return { name: b.date.slice(5), fullDate: b.date, profit: runningProfit };
      });

    return { staked, profit, yield_val, chartData };
  }, [bets]);

  const strategyStats = useMemo(() => {
    const stats = {};
    tipsters.forEach(t => { stats[t.name] = { name: t.name, staked: 0, profit: 0, bets: 0, wins: 0, losses: 0, voids: 0, oddsSum: 0, validOddsCount: 0 }; });
    bets.forEach(b => {
        if (b.result !== 'pending') {
            if (!stats[b.tipster]) stats[b.tipster] = { name: b.tipster, staked: 0, profit: 0, bets: 0, wins: 0, losses: 0, voids: 0, oddsSum: 0, validOddsCount: 0 };
            if (b.result === 'win') stats[b.tipster].wins += 1;
            if (b.result === 'loss') stats[b.tipster].losses += 1;
            if (b.result === 'void') stats[b.tipster].voids += 1;
            if (b.result !== 'void') {
                stats[b.tipster].staked += b.stake;
                stats[b.tipster].profit += b.profit;
                stats[b.tipster].bets += 1;
                stats[b.tipster].oddsSum += b.odds;
                stats[b.tipster].validOddsCount += 1;
            }
        }
    });
    return Object.values(stats).filter(s => (s.bets > 0 || s.voids > 0)).map(s => ({
            ...s,
            yield: s.staked > 0 ? ((s.profit / s.staked) * 100).toFixed(2) : 0,
            winRate: s.bets > 0 ? ((s.wins / s.bets) * 100).toFixed(0) : 0,
            avgOdds: s.validOddsCount > 0 ? (s.oddsSum / s.validOddsCount).toFixed(2) : '0.00'
        })).sort((a,b) => b.profit - a.profit);
  }, [bets, tipsters]);

  const scoutStats = useMemo(() => {
    const stats = {};
    tipsters.forEach(t => {
      if (t.name === 'Mezcla-Tips' || t.name.includes('Combis')) return;
      const cleanName = t.name.split(' (')[0]; 
      stats[cleanName] = { name: cleanName, picks: 0, wins: 0, losses: 0, voids: 0, pending: 0 };
    });
    bets.forEach(bet => {
        if (bet.tipster !== 'Mezcla-Tips' && bet.tipster !== 'Combis (Apuesta D)') {
             const cleanName = bet.tipster.split(' (')[0];
             if (stats[cleanName]) {
                 if (bet.result === 'win') { stats[cleanName].wins++; stats[cleanName].picks++; }
                 if (bet.result === 'loss') { stats[cleanName].losses++; stats[cleanName].picks++; }
                 if (bet.result === 'void') { stats[cleanName].voids++; }
                 if (bet.result === 'pending') { stats[cleanName].pending++; }
             }
        }
        if (bet.subPicks && bet.subPicks.length > 0) {
            bet.subPicks.forEach(sub => {
                const cleanName = sub.tipster.split(' (')[0];
                if (stats[cleanName]) {
                    if (sub.status === 'win') { stats[cleanName].wins++; stats[cleanName].picks++; }
                    if (sub.status === 'loss') { stats[cleanName].losses++; stats[cleanName].picks++; }
                    if (sub.status === 'void') { stats[cleanName].voids++; }
                    if (sub.status === 'pending') { stats[cleanName].pending++; }
                }
            });
        }
    });
    return Object.values(stats).filter(s => s.picks > 0 || s.pending > 0).map(s => ({ ...s, winRate: s.picks > 0 ? ((s.wins / s.picks) * 100).toFixed(1) : 0 })).sort((a,b) => parseFloat(b.winRate) - parseFloat(a.winRate));
  }, [bets, tipsters]);

  const oddsStats = useMemo(() => {
    const ranges = [
        { label: 'Seguras (1.0-1.5)', min: 1.0, max: 1.5, bets: 0, profit: 0, staked: 0 },
        { label: 'Valor (1.51-2.0)', min: 1.51, max: 2.0, bets: 0, profit: 0, staked: 0 },
        { label: 'Riesgo (2.01-5.0)', min: 2.01, max: 5.0, bets: 0, profit: 0, staked: 0 },
        { label: 'Lotería (5.0+)', min: 5.01, max: 999, bets: 0, profit: 0, staked: 0 },
    ];
    bets.forEach(b => {
        if (b.result !== 'pending' && b.result !== 'void') {
            const range = ranges.find(r => b.odds >= r.min && b.odds <= r.max);
            if (range) { range.bets++; range.profit += b.profit; range.staked += b.stake; }
        }
    });
    return ranges.filter(r => r.bets > 0).map(r => ({ ...r, yield: r.staked > 0 ? ((r.profit / r.staked) * 100).toFixed(2) : 0 }));
  }, [bets]);

  // --- FORM STATE ---
  const [formTipster, setFormTipster] = useState(tipsters[0].name);
  const [formStake, setFormStake] = useState(tipsters[0].defaultStake);
  const [formOdds, setFormOdds] = useState(1.50);
  const [formDesc, setFormDesc] = useState('');
  const [subPicks, setSubPicks] = useState([]); 
  const [subTipster, setSubTipster] = useState('');
  const [subDetail, setSubDetail] = useState('');

  const handleAddBet = (e) => {
    e.preventDefault();
    if (formTipster === 'Mezcla-Tips' && subPicks.length === 0) { alert("¡Añade al menos una línea!"); return; }
    const newBet = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      tipster: formTipster,
      stake: parseFloat(formStake),
      odds: parseFloat(formOdds),
      result: 'pending',
      description: formDesc,
      profit: 0,
      subPicks: formTipster === 'Mezcla-Tips' ? subPicks : []
    };
    setBets([newBet, ...bets]);
    setFormDesc('');
    setSubPicks([]);
    setSubDetail('');
    setActiveSection('dashboard');
  };

  const addSubPickToForm = () => {
    if(!subTipster || !subDetail) return;
    setSubPicks([...subPicks, { id: Date.now() + Math.random(), tipster: subTipster, detail: subDetail, status: 'pending' }]);
    setSubDetail('');
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];
  const pendingBetsList = bets.filter(b => b.result === 'pending');

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all mb-2 ${
        activeSection === id 
        ? 'bg-emerald-600 text-white shadow-lg' 
        : 'text-slate-400 hover:bg-slate-800'
      }`}
    >
      <Icon size={24} />
      <span className="font-medium text-lg">{label}</span>
      {activeSection === id && <ChevronRight size={20} className="ml-auto opacity-50"/>}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* HEADER MOBILE */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-50 sticky top-0 shadow-lg">
          <div className="font-bold text-xl text-emerald-400 tracking-tight">BET<span className="text-white">MANAGER</span></div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white"><Menu size={28}/></button>
      </div>

      {/* SIDEBAR */}
      <div className={`fixed inset-0 bg-slate-950/95 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:w-72 md:bg-slate-900 md:border-r md:border-slate-800 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex p-6 border-b border-slate-800 items-center justify-between">
            <h1 className="font-bold text-2xl text-emerald-400 tracking-tight">BET<span className="text-white">MANAGER</span></h1>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">Navegación</div>
            <NavItem id="dashboard" icon={Activity} label="Dashboard" />
            <NavItem id="add" icon={Plus} label="Añadir Apuesta" />
            <NavItem id="challenges" icon={Trophy} label="Retos y Escaler" />
            <NavItem id="stats" icon={BarChart2} label="Estadísticas" />
            <NavItem id="history" icon={History} label="Historial" />
        </div>
        <div className="p-6 border-t border-slate-800 text-center text-xs text-slate-600">v29.0 - Stakazo Fix</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 pb-20">
        
        {/* 1. DASHBOARD */}
        {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Beneficio Neto" value={`${financialStats.profit >= 0 ? '+' : ''}${financialStats.profit.toFixed(2)}€`} icon={PieChart} colorClass="text-emerald-500" />
                    <StatCard title="Yield / ROI" value={`${financialStats.yield_val}%`} icon={TrendingUp} colorClass="text-blue-500" />
                    <StatCard title="Win Rate Scout" value={`${scoutStats.length > 0 ? (scoutStats.reduce((acc,s)=>acc+parseFloat(s.winRate),0)/scoutStats.length).toFixed(1) : 0}%`} subtext="Efectividad Media" icon={Target} colorClass="text-purple-500" />
                    <StatCard title="Riesgo Activo" value={`${pendingBetsList.reduce((a,b)=>a+b.stake,0).toFixed(2)}€`} subtext="En juego" icon={Clock} colorClass="text-yellow-500" />
                </div>

                {pendingBetsList.length > 0 && (
                    <div className="bg-slate-900 rounded-xl border-l-4 border-yellow-500 p-4 shadow-xl">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-white"><AlertCircle className="text-yellow-500"/> Apuestas Activas ({pendingBetsList.length})</h3>
                        </div>
                        <div className="space-y-4">
                            {pendingBetsList.map(bet => (
                                <div key={bet.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-sm">
                                    <div className="mb-2">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-emerald-400">{bet.tipster}</span>
                                            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">@{bet.odds.toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-slate-300">{bet.description}</p>
                                    </div>
                                    {!bet.subPicks || bet.subPicks.length === 0 ? (
                                        <div className="flex gap-2 w-full mt-3">
                                            <button onClick={() => updateSimpleStatus(bet.id, 'win')} className="flex-1 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 rounded hover:bg-emerald-600 hover:text-white font-bold text-sm">Ganada</button>
                                            <button onClick={() => updateSimpleStatus(bet.id, 'loss')} className="flex-1 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded hover:bg-red-600 hover:text-white font-bold text-sm">Perdida</button>
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-xs bg-blue-900/20 text-blue-400 p-2 rounded text-center border border-blue-900/50">Combinada Mixta: Resolver en sección Historial o detalle</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl col-span-1 lg:col-span-2">
                        <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider"><Activity size={16}/> Curva de Ganancias</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={financialStats.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val)=>`${val}€`} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} formatter={(value) => [`${value.toFixed(2)}€`, 'Beneficio']} />
                                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{r: 6, fill: '#10b981'}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
                        <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider"><PieChart size={16}/> Distribución del Riesgo (Stake)</h3>
                        <div className="h-[250px] w-full flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie data={strategyStats} dataKey="staked" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({percent}) => `${(percent * 100).toFixed(0)}%`}>
                                        {strategyStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '10px'}}/>
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
                         <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider"><BarChart2 size={16}/> Rentabilidad Neta (€)</h3>
                         <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={strategyStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60}/>
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                                        {strategyStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* 2. CHALLENGES */}
        {activeSection === 'challenges' && (
             <div className="space-y-6 animate-fade-in">
                 <header>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Trophy className="text-yellow-500"/> Retos Activos</h2>
                    <p className="text-sm text-slate-400">Seguimiento independiente de retos de capitalización compuesta.</p>
                 </header>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {challenges.map(challenge => {
                         const percent = Math.min(100, (challenge.currentBank / challenge.targetBank) * 100).toFixed(1);
                         const isAdding = challengeForm.id === challenge.id;
                         
                         let headerColor = "from-slate-900 to-slate-800";
                         let barColor = "bg-emerald-500";
                         if(challenge.color === 'purple') { headerColor = "from-slate-900 to-purple-900/30"; barColor = "bg-purple-500"; }
                         if(challenge.color === 'blue') { headerColor = "from-slate-900 to-blue-900/30"; barColor = "bg-blue-500"; }
                         if(challenge.color === 'orange') { headerColor = "from-slate-900 to-orange-900/30"; barColor = "bg-orange-500"; }

                         return (
                            <div key={challenge.id} className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                                <div className={`p-6 border-b border-slate-800 bg-gradient-to-r ${headerColor}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                {challenge.title}
                                            </h3>
                                            <div className="text-slate-400 text-sm mt-1">{challenge.subtitle}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold font-mono ${challenge.currentBank >= challenge.initialBank ? 'text-emerald-400' : 'text-red-400'}`}>{challenge.currentBank.toFixed(2)}€</div>
                                            <div className="text-xs text-slate-500">Saldo Actual</div>
                                        </div>
                                    </div>
                                    <div className="relative h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                        <div className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-1000`} style={{width: `${percent}%`}}></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
                                        <span>Inicio: {challenge.initialBank}€</span>
                                        <span>{percent}% Completado</span>
                                    </div>
                                </div>

                                {isAdding ? (
                                    <div className="p-4 bg-slate-950 border-b border-slate-800 animate-fade-in">
                                        <h4 className="text-sm font-bold text-emerald-400 mb-3 uppercase">Registrar paso del reto</h4>
                                        <form onSubmit={(e) => addChallengeBet(e, challenge.id)} className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="number" placeholder="Stake" step="0.01" value={challengeForm.stake} onChange={e=>setChallengeForm({...challengeForm, stake: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" required/>
                                                <input type="number" placeholder="Cuota" step="0.01" value={challengeForm.odds} onChange={e=>setChallengeForm({...challengeForm, odds: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" required/>
                                            </div>
                                            <input type="text" placeholder="Descripción (ej: Paso 1 - Madrid)" value={challengeForm.desc} onChange={e=>setChallengeForm({...challengeForm, desc: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" required/>
                                            <div className="flex gap-2">
                                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded font-bold text-sm hover:bg-emerald-500">Guardar Apuesta</button>
                                                <button type="button" onClick={() => setChallengeForm({ id: null, stake: '', odds: '', desc: '' })} className="px-4 bg-slate-800 text-slate-400 py-2 rounded font-bold text-sm hover:bg-slate-700">Cancelar</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-end">
                                        <button onClick={() => setChallengeForm({ id: challenge.id, stake: '', odds: '', desc: '' })} className="flex items-center gap-2 text-emerald-400 text-sm font-bold hover:text-emerald-300 bg-emerald-900/20 px-3 py-2 rounded border border-emerald-900/50"><Plus size={16}/> Añadir Apuesta al Reto</button>
                                    </div>
                                )}

                                <div className="max-h-[300px] overflow-y-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-950 text-slate-500 text-xs uppercase sticky top-0">
                                            <tr><th className="p-3">Detalle</th><th className="p-3 text-center">Stake/Cuota</th><th className="p-3 text-right">Resultado</th><th className="p-3 text-center">Acción</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {challenge.history.length === 0 ? (
                                                <tr><td colSpan="4" className="p-6 text-center text-slate-500 text-xs italic">Aún no hay movimientos en este reto.</td></tr>
                                            ) : (
                                                challenge.history.map(bet => (
                                                    <tr key={bet.id} className="hover:bg-slate-800/50">
                                                        <td className="p-3"><div className="font-bold text-white text-xs">{bet.description}</div><div className="text-[10px] text-slate-500">{bet.date}</div></td>
                                                        <td className="p-3 text-center text-xs text-slate-300"><div>{bet.stake}€</div><div className="text-slate-500">@{bet.odds}</div></td>
                                                        <td className="p-3 text-right">
                                                            {bet.result === 'pending' ? (
                                                                <div className="flex justify-end gap-1">
                                                                    <button onClick={()=>resolveChallengeBet(challenge.id, bet.id, 'win')} className="p-1 bg-emerald-600/20 text-emerald-400 rounded"><Check size={14}/></button>
                                                                    <button onClick={()=>resolveChallengeBet(challenge.id, bet.id, 'loss')} className="p-1 bg-red-600/20 text-red-400 rounded"><X size={14}/></button>
                                                                </div>
                                                            ) : (
                                                                <span className={`font-bold text-xs ${bet.result === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>{bet.result === 'win' ? `+${bet.profit.toFixed(2)}€` : `-${bet.stake}€`}</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-center"><button onClick={()=>deleteChallengeBet(challenge.id, bet.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={14}/></button></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                         );
                     })}
                 </div>
             </div>
        )}

        {/* 3. STATS (CON CUOTA MEDIA Y W/L/V) */}
        {activeSection === 'stats' && (
             <div className="space-y-8 animate-fade-in">
                <section>
                    <header className="mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Layers className="text-blue-500"/> Rendimiento Financiero Global</h2>
                        <p className="text-sm text-slate-400">Resultados reales por estrategia. Desglose W-L-V (Win-Loss-Void).</p>
                    </header>
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[700px]">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4">Estrategia</th>
                                        <th className="p-4 text-center">Bets (W-L-V)</th>
                                        <th className="p-4 text-center">Cuota Media</th>
                                        <th className="p-4 text-right">Inversión</th>
                                        <th className="p-4 text-right">Beneficio</th>
                                        <th className="p-4 text-center">Yield</th>
                                        <th className="p-4 text-center">Win %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {strategyStats.map((s) => (
                                        <tr key={s.name} className="hover:bg-slate-800/50">
                                            <td className="p-4 font-bold text-white">{s.name}</td>
                                            <td className="p-4 text-center text-slate-300">
                                                <span className="text-emerald-400 font-bold">{s.wins}</span>-<span className="text-red-400 font-bold">{s.losses}</span>-<span className="text-slate-500 font-bold">{s.voids}</span>
                                            </td>
                                            <td className="p-4 text-center text-slate-300 font-mono">@{s.avgOdds}</td>
                                            <td className="p-4 text-right text-slate-300">{s.staked.toFixed(2)}€</td>
                                            <td className={`p-4 text-right font-bold font-mono ${s.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {s.profit >= 0 ? '+' : ''}{s.profit.toFixed(2)}€
                                            </td>
                                            <td className={`p-4 text-center font-bold ${parseFloat(s.yield) > 0 ? 'text-blue-400' : 'text-slate-500'}`}>{s.yield}%</td>
                                            <td className="p-4 text-center text-slate-400">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${parseFloat(s.winRate) > 50 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${s.winRate}%` }}></div>
                                                    </div>
                                                    <span>{s.winRate}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
                <section>
                    <header className="mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Target className="text-purple-500"/> Rendimiento por Rango de Cuota</h2>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                             <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold">
                                    <tr><th className="p-3">Rango</th><th className="p-3 text-center">Bets</th><th className="p-3 text-right">Profit</th><th className="p-3 text-center">Yield</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {oddsStats.map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-800/50">
                                            <td className="p-3 font-bold text-white">{r.label}</td>
                                            <td className="p-3 text-center text-slate-400">{r.bets}</td>
                                            <td className={`p-3 text-right font-bold ${r.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{r.profit.toFixed(2)}€</td>
                                            <td className={`p-3 text-center font-bold ${parseFloat(r.yield) > 0 ? 'text-blue-400' : 'text-slate-500'}`}>{r.yield}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-lg">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={oddsStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false}/><XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} interval={0}/><YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}/><Bar dataKey="profit" radius={[4, 4, 0, 0]}>{oddsStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#8b5cf6' : '#ef4444'} />)}</Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
                <section>
                    <header className="mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="text-yellow-500"/> Scout Predictivo Individual</h2>
                    </header>
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[600px]">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold tracking-wider">
                                    <tr><th className="p-4">Tipster</th><th className="p-4 text-center">Picks Totales</th><th className="p-4 text-center">W - L - V</th><th className="p-4 text-center">Efectividad %</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {scoutStats.map((s) => (
                                        <tr key={s.name} className="hover:bg-slate-800/50">
                                            <td className="p-4 font-bold text-white">{s.name}</td>
                                            <td className="p-4 text-center text-slate-300">{s.picks}</td>
                                            <td className="p-4 text-center text-slate-300"><span className="text-emerald-400 font-bold">{s.wins}</span> - <span className="text-red-400 font-bold">{s.losses}</span> - {s.voids}</td>
                                            <td className="p-4 text-center"><div className="flex items-center justify-center gap-2"><div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${parseFloat(s.winRate) > 60 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${s.winRate}%` }}></div></div><span className="font-mono font-bold">{s.winRate}%</span></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
             </div>
        )}

        {/* 4. ADD BET (Sin cambios) */}
        {activeSection === 'add' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white">Nuevo Registro</h2>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl">
                    <form onSubmit={handleAddBet} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tipster</label><select value={formTipster} onChange={e=>{setFormTipster(e.target.value); const t = tipsters.find(ti=>ti.name===e.target.value); if(t) setFormStake(t.defaultStake)}} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500">{tipsters.map(t=><option key={t.name} value={t.name}>{t.name}</option>)}</select></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Stake Total (€)</label><input type="number" step="0.01" value={formStake} onChange={e=>setFormStake(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"/></div>
                        </div>
                        {formTipster === 'Mezcla-Tips' && (<div className="bg-blue-900/10 border border-blue-900/50 p-4 rounded-lg space-y-3"><h4 className="text-sm font-bold text-blue-400 flex items-center gap-2"><Zap size={16}/> Configurar Líneas</h4><div className="space-y-2"><select value={subTipster} onChange={e=>setSubTipster(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"><option value="">1. Elige Tipster...</option>{tipsters.filter(t => t.name !== 'Mezcla-Tips').map(t => <option key={t.name} value={t.name}>{t.name}</option>)}</select><div className="flex gap-2"><input type="text" value={subDetail} onChange={e=>setSubDetail(e.target.value)} placeholder="2. Detalle (ej: Madrid gana)" className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" /><button type="button" onClick={addSubPickToForm} className="bg-blue-600 hover:bg-blue-500 px-4 rounded text-white font-bold"><Plus size={20}/></button></div></div>{subPicks.length > 0 && (<div className="mt-3 space-y-2">{subPicks.map((sub, idx) => (<div key={idx} className="flex justify-between items-center text-xs bg-slate-800 p-2 rounded border border-slate-700"><span className="text-blue-200 font-bold mr-2">{sub.tipster}:</span><span className="text-slate-400 truncate flex-1">{sub.detail}</span><button type="button" onClick={()=>setSubPicks(subPicks.filter((_,i)=>i!==idx))} className="text-red-400 p-1"><Trash2 size={14}/></button></div>))}</div>)}</div>)}
                        <div><label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Cuota Total</label><input type="number" step="0.01" value={formOdds} onChange={e=>setFormOdds(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-lg font-mono focus:outline-none focus:border-emerald-500"/></div>
                        <div><label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Descripción</label><input type="text" value={formDesc} onChange={e=>setFormDesc(e.target.value)} placeholder="Ej: Combi Fin de Semana" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"/></div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-lg font-bold text-white shadow-lg text-lg">Guardar Apuesta</button>
                    </form>
                </div>
            </div>
        )}

        {/* 5. HISTORY */}
        {activeSection === 'history' && (
            <div className="space-y-6 animate-fade-in">
                 <h2 className="text-2xl font-bold text-white">Historial</h2>
                 <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[600px]">
                            <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold">
                                <tr><th className="p-4">Fecha</th><th className="p-4">Tipster</th><th className="p-4 text-right">P&L</th><th className="p-4 text-center">Acción</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {bets.sort((a,b) => b.id - a.id).map((bet) => (
                                    <tr key={bet.id} className="hover:bg-slate-800/50">
                                        <td className="p-4 text-slate-400 text-xs">{bet.date}</td>
                                        <td className="p-4"><div className="font-bold text-white">{bet.tipster}</div><div className="text-xs text-slate-500 truncate max-w-[200px]">{bet.description}</div>{bet.subPicks && bet.subPicks.length > 0 && (<div className="mt-2 text-[10px] space-y-1">{bet.subPicks.map((s, i) => (<div key={i} className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${s.status === 'win' ? 'bg-emerald-500' : s.status === 'loss' ? 'bg-red-500' : 'bg-slate-500'}`}></span><span className="text-slate-300">{s.tipster}</span></div>))}</div>)}</td>
                                        <td className={`p-4 text-right font-bold font-mono ${bet.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{bet.result === 'pending' ? '...' : (bet.profit >= 0 ? '+' : '') + bet.profit.toFixed(2) + '€'}</td>
                                        <td className="p-4 text-center"><button onClick={() => deleteBet(bet.id)} className="text-slate-600 hover:text-red-400 p-2"><Trash2 size={18}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}


