import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Home, Upload, FileText, BarChart3, MapPin, Ruler,
  Calendar, Hash, Search, Plus, ChevronRight, ChevronLeft,
  Download, CheckCircle2, AlertCircle, XCircle, TrendingUp,
  LogOut, User, Settings, Filter, ArrowUpDown, FileCheck,
  Building2, Trees, Mountain, Eye, Lock, Mail, Layers,
  Shield, Activity, Zap, ArrowRight, Sparkles, AlertTriangle,
  CheckCircle, Info, ExternalLink, Bell, Loader2, RefreshCw
} from "lucide-react";
 
// ----------------- SUPABASE CLIENT -----------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
 
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[TerraCerta] Faltam variáveis de ambiente VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY."
  );
}
 
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
 
// ----------------- DATA LAYER -----------------
/**
 * Lê a tabela `propriedades` no Supabase.
 * Mapeia colunas snake_case → o shape camelCase usado pela UI,
 * para que possas evoluir o schema sem reescrever toda a aplicação.
 */
async function fetchPropriedades() {
  const { data, error } = await supabase
    .from("propriedades")
    .select(
      "id, designacao, concelho, freguesia, artigo, area, classificacao, score, status, data, pdm_ref"
    )
    .order("data", { ascending: false });
 
  if (error) throw error;
 
  return (data ?? []).map((row) => ({
    id: row.id,
    designacao: row.designacao,
    concelho: row.concelho,
    freguesia: row.freguesia,
    artigo: row.artigo,
    area: row.area,
    classificacao: row.classificacao,
    score: row.score,
    status: row.status,
    data: row.data,
    pdmRef: row.pdm_ref,
  }));
}
 
/** Health-check usado no login: verifica que conseguimos falar com o Supabase. */
async function pingSupabase() {
  const { error } = await supabase
    .from("propriedades")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return true;
}
 
// ----------------- HELPERS -----------------
const formatNumber = (n) =>
  n == null ? "—" : new Intl.NumberFormat("pt-PT").format(n);
 
const scoreColor = (s) => {
  if (s >= 80) return { text: "text-emerald-700", bg: "bg-emerald-50", ring: "stroke-emerald-500", border: "border-emerald-300" };
  if (s >= 60) return { text: "text-lime-700", bg: "bg-lime-50", ring: "stroke-lime-500", border: "border-lime-300" };
  if (s >= 40) return { text: "text-amber-700", bg: "bg-amber-50", ring: "stroke-amber-500", border: "border-amber-300" };
  return { text: "text-rose-700", bg: "bg-rose-50", ring: "stroke-rose-500", border: "border-rose-300" };
};
 
const statusBadge = (status) => {
  const map = {
    "Analisado": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Reservas": "bg-amber-50 text-amber-700 border-amber-200",
    "Inviável": "bg-rose-50 text-rose-700 border-rose-200",
    "Pendente": "bg-slate-50 text-slate-700 border-slate-200",
  };
  return map[status] || map["Pendente"];
};
 
// ----------------- LOGO -----------------
const Logo = ({ size = "md" }) => {
  const dims = size === "lg" ? "h-9" : size === "sm" ? "h-6" : "h-7";
  return (
    <div className="flex items-center gap-2">
      <div className={`${dims} aspect-square rounded-md bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-sm`}>
        <Mountain className="text-white" size={size === "lg" ? 20 : size === "sm" ? 14 : 16} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-semibold tracking-tight text-slate-900 ${size === "lg" ? "text-xl" : "text-base"}`}>
          Terra<span className="text-emerald-700">Certa</span>
        </span>
        {size === "lg" && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">
            Land Viability Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
 
// ----------------- LOGIN PAGE -----------------
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("consultor@imobiliaria.pt");
  const [password, setPassword] = useState("••••••••••");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
 
  const handleLogin = async () => {
    setChecking(true);
    setError(null);
    try {
      await pingSupabase();
      onLogin();
    } catch (e) {
      setError(
        e?.message?.includes("fetch")
          ? "Não foi possível contactar o Supabase. Verifica o URL e a ligação à internet."
          : `Ligação ao Supabase falhou: ${e?.message ?? "erro desconhecido"}`
      );
    } finally {
      setChecking(false);
    }
  };
 
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Landscape */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <svg viewBox="0 0 800 1000" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde9c9" />
              <stop offset="40%" stopColor="#f5d6a3" />
              <stop offset="100%" stopColor="#e8b87a" />
            </linearGradient>
            <linearGradient id="hill1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3d6b3a" />
              <stop offset="100%" stopColor="#2a4d28" />
            </linearGradient>
            <linearGradient id="hill2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5a8a4f" />
              <stop offset="100%" stopColor="#4a7440" />
            </linearGradient>
            <linearGradient id="hill3" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8eb573" />
              <stop offset="100%" stopColor="#7aa15e" />
            </linearGradient>
            <linearGradient id="field" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#c9c47a" />
              <stop offset="100%" stopColor="#a89c5a" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#sky)" />
          <circle cx="600" cy="280" r="55" fill="#fff5dc" opacity="0.9" />
          <circle cx="600" cy="280" r="80" fill="#fff5dc" opacity="0.3" />
          <path d="M0,520 Q150,440 320,470 T620,440 T800,460 L800,600 L0,600 Z" fill="url(#hill3)" opacity="0.7" />
          <path d="M0,580 Q200,500 400,540 T800,520 L800,700 L0,700 Z" fill="url(#hill2)" />
          <path d="M0,680 Q250,620 500,660 T800,640 L800,1000 L0,1000 Z" fill="url(#hill1)" />
          <path d="M0,720 Q400,690 800,710 L800,1000 L0,1000 Z" fill="url(#field)" opacity="0.85" />
          {[750, 780, 810, 840, 870, 900, 930, 960].map((y, i) => (
            <path key={i} d={`M0,${y} Q400,${y - 8} 800,${y}`} stroke="#8a7a3e" strokeWidth="1.5" fill="none" opacity="0.4" />
          ))}
          <ellipse cx="120" cy="640" rx="12" ry="38" fill="#1f3d1d" />
          <ellipse cx="155" cy="650" rx="10" ry="32" fill="#1f3d1d" />
          <ellipse cx="680" cy="610" rx="14" ry="42" fill="#1f3d1d" />
          <ellipse cx="710" cy="620" rx="11" ry="35" fill="#1f3d1d" />
          <rect x="0" y="690" width="800" height="3" fill="#6b5d40" opacity="0.5" />
        </svg>
 
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Logo size="lg" />
          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-medium tracking-wide">
              <Sparkles size={12} />
              MVP · Versão 0.5.0 · Supabase live
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}>
              A análise de viabilidade<br />de terrenos, redefinida.
            </h1>
            <p className="text-white/85 text-sm leading-relaxed" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
              Interpretação automática de PDM, IGT e regulamentos do SNIT.
              Para os profissionais que avaliam o solo português com rigor.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/80" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center gap-1.5"><Shield size={14} /> RGPD compliant</div>
            <div className="flex items-center gap-1.5"><FileCheck size={14} /> Dados oficiais DGT</div>
            <div className="flex items-center gap-1.5"><Activity size={14} /> Atualização contínua</div>
          </div>
        </div>
      </div>
 
      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo size="lg" /></div>
 
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Iniciar sessão</h2>
            <p className="text-sm text-slate-500 mt-1.5">Aceda à sua plataforma de análise.</p>
          </div>
 
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Email profissional</label>
              <div className="mt-1.5 relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>
            </div>
 
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Palavra-passe</label>
                <button className="text-xs text-emerald-700 hover:text-emerald-800 font-medium">Esqueci-me</button>
              </div>
              <div className="mt-1.5 relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>
            </div>
 
            <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              Manter sessão iniciada neste dispositivo
            </label>
 
            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
 
            <button
              onClick={handleLogin}
              disabled={checking}
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-medium py-2.5 rounded-md transition-all flex items-center justify-center gap-2 group"
            >
              {checking ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> A verificar ligação…
                </>
              ) : (
                <>
                  Entrar na plataforma
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition" />
                </>
              )}
            </button>
 
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">ou</span></div>
            </div>
 
            <button className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-md transition flex items-center justify-center gap-2">
              <span className="text-base">🇵🇹</span> Autenticação Chave Móvel Digital
            </button>
 
            <p className="text-xs text-slate-500 text-center pt-4">
              Sem conta? <button className="text-emerald-700 hover:text-emerald-800 font-medium">Solicitar acesso piloto</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
// ----------------- TOP BAR (shared) -----------------
const TopBar = ({ onLogout, onHome }) => (
  <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
    <div className="px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <button onClick={onHome} className="hover:opacity-80 transition"><Logo /></button>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <button onClick={onHome} className="px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-100 font-medium">Imóveis</button>
          <button className="px-3 py-1.5 rounded-md text-slate-500 hover:bg-slate-100">Análises</button>
          <button className="px-3 py-1.5 rounded-md text-slate-500 hover:bg-slate-100">Relatórios</button>
          <button className="px-3 py-1.5 rounded-md text-slate-500 hover:bg-slate-100">Camadas SIG</button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md text-xs text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Supabase online
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-md text-slate-500"><Bell size={16} /></button>
        <button className="p-2 hover:bg-slate-100 rounded-md text-slate-500"><Settings size={16} /></button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button className="flex items-center gap-2 pl-1 pr-2 py-1 hover:bg-slate-100 rounded-md">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-xs font-semibold">JL</div>
          <span className="text-xs text-slate-700 font-medium hidden md:block">João L.</span>
        </button>
        <button onClick={onLogout} className="p-2 hover:bg-slate-100 rounded-md text-slate-500" title="Sair"><LogOut size={16} /></button>
      </div>
    </div>
  </header>
);
 
// ----------------- DASHBOARD -----------------
const Dashboard = ({ properties, loading, error, onRefresh, onNew, onSelect, onLogout }) => {
  const [filter, setFilter] = useState("");
  const filtered = properties.filter(p =>
    p.designacao?.toLowerCase().includes(filter.toLowerCase()) ||
    p.concelho?.toLowerCase().includes(filter.toLowerCase()) ||
    p.id?.toLowerCase().includes(filter.toLowerCase())
  );
 
  const totalArea = properties.reduce((s, p) => s + (p.area || 0), 0);
  const avgScore = properties.length
    ? Math.round(properties.reduce((s, p) => s + (p.score || 0), 0) / properties.length)
    : 0;
  const viable = properties.filter(p => (p.score || 0) >= 60).length;
 
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar onLogout={onLogout} onHome={() => {}} />
 
      <main className="px-6 py-6 max-w-[1500px] mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">Carteira</div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard de Imóveis</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Atualizar
            </button>
            <button
              onClick={onNew}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition shadow-sm"
            >
              <Plus size={15} /> Novo Imóvel
            </button>
          </div>
        </div>
 
        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-md text-sm text-rose-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Erro ao carregar dados do Supabase</div>
              <div className="text-xs mt-0.5">{error}</div>
            </div>
          </div>
        )}
 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-md overflow-hidden mb-6">
          {[
            { label: "Imóveis em carteira", value: loading ? "…" : properties.length, sub: "live", icon: Layers, accent: "text-slate-900" },
            { label: "Área total agregada", value: loading ? "…" : `${formatNumber(Math.round(totalArea / 10000))} ha`, sub: `${formatNumber(totalArea)} m²`, icon: Ruler, accent: "text-slate-900" },
            { label: "Health Score médio", value: loading ? "…" : avgScore, sub: "/100", icon: Activity, accent: "text-emerald-700" },
            { label: "Viabilidade ≥ 60", value: loading ? "…" : `${viable}/${properties.length}`, sub: properties.length ? `${Math.round(viable / properties.length * 100)}% do portefólio` : "—", icon: TrendingUp, accent: "text-emerald-700" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{s.label}</span>
                <s.icon size={14} className="text-slate-400" />
              </div>
              <div className={`text-2xl font-semibold tabular-nums ${s.accent}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
 
        <div className="bg-white border border-slate-200 rounded-t-md px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Pesquisar por designação, concelho, ID..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50">
              <Filter size={13} /> Filtros
            </button>
          </div>
          <div className="text-xs text-slate-500">
            {filtered.length} de {properties.length} imóveis
          </div>
        </div>
 
        <div className="bg-white border border-slate-200 border-t-0 rounded-b-md overflow-hidden">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={28} className="animate-spin mb-3" />
              <div className="text-sm">A carregar imóveis do Supabase…</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400">
              <Layers size={32} className="mb-3" />
              <div className="text-sm font-medium text-slate-600">Nenhum imóvel encontrado</div>
              <div className="text-xs mt-1 max-w-sm">
                A tabela <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">propriedades</code> está vazia,
                ou as policies de RLS não permitem leitura à role <code className="font-mono">anon</code>.
              </div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-4 py-2.5 font-medium">
                    <button className="flex items-center gap-1 hover:text-slate-700">ID <ArrowUpDown size={11} /></button>
                  </th>
                  <th className="text-left px-4 py-2.5 font-medium">Designação</th>
                  <th className="text-left px-4 py-2.5 font-medium">Concelho / Freguesia</th>
                  <th className="text-left px-4 py-2.5 font-medium">Artigo Matricial</th>
                  <th className="text-right px-4 py-2.5 font-medium">Área (m²)</th>
                  <th className="text-left px-4 py-2.5 font-medium">Classificação</th>
                  <th className="text-center px-4 py-2.5 font-medium">Score</th>
                  <th className="text-left px-4 py-2.5 font-medium">Estado</th>
                  <th className="text-left px-4 py-2.5 font-medium">Data</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const c = scoreColor(p.score || 0);
                  return (
                    <tr key={p.id} onClick={() => onSelect(p)} className="hover:bg-emerald-50/40 cursor-pointer transition">
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{p.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{p.designacao}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{p.concelho}</div>
                        <div className="text-xs text-slate-400">{p.freguesia}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">{p.artigo}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-900">{formatNumber(p.area)}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{p.classificacao}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${c.text.replace('text-', 'bg-')}`} style={{ width: `${p.score || 0}%` }}></div>
                          </div>
                          <span className={`text-xs font-semibold tabular-nums ${c.text} w-7 text-right`}>{p.score ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${statusBadge(p.status)}`}>
                          {p.status || "Pendente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 tabular-nums">{p.data}</td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight size={15} className="text-slate-400 inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Fonte: Supabase · tabela <code className="font-mono">propriedades</code></span>
            <div className="flex items-center gap-3">
              <button className="hover:text-slate-700">Exportar CSV</button>
              <button className="hover:text-slate-700 flex items-center gap-1">Ver tudo <ChevronRight size={11} /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
 
// ----------------- UPLOAD PAGE -----------------
const UploadPage = ({ onCancel, onAnalyse }) => {
  const [files, setFiles] = useState({ caderneta: null, planta: null, certidao: null });
 
  const setFile = (key) => setFiles(f => ({ ...f, [key]: { name: `${key}_TC-2026-0143.pdf`, size: "2.4 MB" } }));
 
  const allUploaded = files.caderneta && files.planta && files.certidao;
 
  const docs = [
    { key: "caderneta", title: "Caderneta Predial", subtitle: "Documento das Finanças (Modelo 1)", icon: FileText, hint: "PDF · até 10MB" },
    { key: "planta", title: "Planta de Localização", subtitle: "Câmara Municipal · escala 1:2000 ou superior", icon: MapPin, hint: "PDF / DWG / DXF" },
    { key: "certidao", title: "Certidão Permanente", subtitle: "Conservatória do Registo Predial", icon: FileCheck, hint: "PDF · código de acesso aceite" },
  ];
 
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar onLogout={() => {}} onHome={onCancel} />
 
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={onCancel} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-3">
            <ChevronLeft size={13} /> Voltar ao dashboard
          </button>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">Novo imóvel · Passo 1 de 2</div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Submissão de documentação</h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Carregue os três documentos abaixo. O TerraCerta extrai automaticamente os dados matriciais,
            cruza com as camadas do SNIT e devolve uma análise de viabilidade em ~30 segundos.
          </p>
        </div>
 
        <div className="space-y-3">
          {docs.map((d) => {
            const file = files[d.key];
            return (
              <div
                key={d.key}
                onClick={() => !file && setFile(d.key)}
                className={`group bg-white border rounded-md p-5 transition-all cursor-pointer ${
                  file ? "border-emerald-300 bg-emerald-50/30" : "border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-md flex items-center justify-center shrink-0 ${
                    file ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                  }`}>
                    {file ? <CheckCircle2 size={20} /> : <d.icon size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{d.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">{d.hint}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{d.subtitle}</div>
                    {file && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <FileText size={12} className="text-emerald-700" />
                        <span className="font-mono text-slate-700">{file.name}</span>
                        <span className="text-slate-400">· {file.size}</span>
                      </div>
                    )}
                  </div>
                  {!file ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md group-hover:border-emerald-400 group-hover:text-emerald-700">
                      <Upload size={12} /> Carregar
                    </div>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); setFiles(f => ({ ...f, [d.key]: null })); }}
                      className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1">
                      Remover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
 
        <div className="mt-6 bg-white border border-slate-200 rounded-md p-4">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-3">Parâmetros de análise</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded text-emerald-600" /> Cruzamento com REN / RAN</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded text-emerald-600" /> Servidões e restrições de utilidade pública</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded text-emerald-600" /> Análise de viabilidade urbanística</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-emerald-600" /> Estimativa de valor de mercado (β)</label>
          </div>
        </div>
 
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Shield size={12} /> Documentos cifrados em repouso · removidos após 90 dias
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
            <button
              disabled={!allUploaded}
              onClick={onAnalyse}
              className={`px-5 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition ${
                allUploaded ? "bg-slate-900 hover:bg-slate-800 text-white shadow-sm" : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Zap size={14} /> Analisar terreno
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
 
// ----------------- HEALTH SCORE GAUGE -----------------
const HealthGauge = ({ score }) => {
  const c = scoreColor(score);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
 
  return (
    <div className="relative w-44 h-44">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} stroke="#f1f5f9" strokeWidth="10" fill="none" />
        <circle
          cx="80" cy="80" r={r}
          strokeWidth="10" fill="none"
          className={c.ring}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-5xl font-semibold tabular-nums ${c.text}`}>{score}</div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Health Score</div>
        <div className="text-xs text-slate-400">/ 100</div>
      </div>
    </div>
  );
};
 
// ----------------- ANALYSIS PAGE -----------------
const AnalysisPage = ({ property, page, setPage, onBack, onLogout }) => {
  const c = scoreColor(property.score || 0);
 
  const pdmFindings = [
    { label: "Classificação do solo", value: property.classificacao, status: "ok", source: "PDM Art. 14º" },
    { label: "Categoria de espaço", value: "Espaço Agrícola de Produção (Tipo II)", status: (property.score || 0) >= 60 ? "ok" : "warn", source: "Planta de Ordenamento" },
    { label: "Subcategoria", value: "Áreas agrícolas complementares", status: "ok", source: "PDM Art. 27º nº2" },
    { label: "Índice de utilização (Iu)", value: "0,15", status: "warn", source: "PDM Art. 30º" },
    { label: "Cércea máxima", value: "6,5 m (2 pisos)", status: "ok", source: "PDM Art. 31º" },
    { label: "REN — Reserva Ecológica", value: "Parcialmente abrangido (≈18%)", status: "warn", source: "Planta de Condicionantes" },
    { label: "RAN — Reserva Agrícola", value: "Não abrangido", status: "ok", source: "DRAP-Centro" },
    { label: "Servidão rodoviária", value: "Faixa non aedificandi 12m (EN229)", status: "warn", source: "DL 13/94" },
    { label: "Risco de incêndio rural", value: "Classe Média", status: "ok", source: "ICNF · Carta 2025" },
  ];
 
  const conversionScore = Math.max(15, (property.score || 0) - 22);
 
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar onLogout={onLogout} onHome={onBack} />
 
      <main className="px-6 py-6 max-w-[1400px] mx-auto">
        <div className="mb-5">
          <button onClick={onBack} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-3">
            <ChevronLeft size={13} /> Imóveis · {property.id}
          </button>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">Análise de viabilidade</div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{property.designacao}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                <MapPin size={12} /> {property.freguesia}, {property.concelho}
                <span className="text-slate-300">·</span>
                <Hash size={12} /> {property.artigo}
                <span className="text-slate-300">·</span>
                <Calendar size={12} /> Emitido {property.data}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white">
                <button
                  onClick={() => setPage(1)}
                  className={`px-4 py-1.5 text-xs font-medium transition ${page === 1 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  1 · Análise PDM
                </button>
                <button
                  onClick={() => setPage(2)}
                  className={`px-4 py-1.5 text-xs font-medium transition ${page === 2 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  2 · Conversão Urbano
                </button>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 flex items-center gap-1.5">
                <ExternalLink size={12} /> Abrir no SNIT
              </button>
            </div>
          </div>
        </div>
 
        {page === 1 ? (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-md p-6 flex flex-col items-center text-center">
                <HealthGauge score={property.score || 0} />
                <div className={`mt-4 px-3 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
                  {(property.score || 0) >= 80 ? "Viabilidade elevada" : (property.score || 0) >= 60 ? "Viabilidade boa com reservas" : (property.score || 0) >= 40 ? "Viabilidade condicionada" : "Inviável nas condições atuais"}
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  Score calculado com base em 14 indicadores do PDM, condicionantes legais e camadas do SNIT.
                </p>
              </div>
 
              <div className="bg-white border border-slate-200 rounded-md">
                <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Dados extraídos</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">OCR ✓</span>
                </div>
                <dl className="divide-y divide-slate-100">
                  {[
                    ["Concelho", property.concelho, MapPin],
                    ["Freguesia", property.freguesia, MapPin],
                    ["Artigo matricial", property.artigo, Hash],
                    ["Área total", `${formatNumber(property.area)} m²`, Ruler],
                    ["Confrontações", "N: caminho público", Building2],
                    ["Inscrição", "Definitiva 2018-04-12", FileCheck],
                    ["PDM aplicável", property.pdmRef, Layers],
                  ].map(([k, v, Icon], i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center justify-between text-sm">
                      <span className="text-slate-500 text-xs flex items-center gap-2"><Icon size={11} /> {k}</span>
                      <span className="text-slate-900 font-medium text-xs text-right">{v}</span>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
 
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <div className="bg-white border border-slate-200 rounded-md">
                <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-slate-900 text-sm">Análise PDM (via SNIT)</h2>
                      <span className="text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">Tempo real</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Interpretação automática do regulamento <span className="font-mono text-slate-700">{property.pdmRef}</span> e cruzamento com 9 camadas oficiais.
                    </p>
                  </div>
                  <div className="text-xs text-slate-400">
                    Fonte: <a className="text-emerald-700 hover:underline">snit.dgterritorio.gov.pt</a>
                  </div>
                </div>
 
                <div className="divide-y divide-slate-100">
                  {pdmFindings.map((f, i) => {
                    const Icon = f.status === "ok" ? CheckCircle : f.status === "warn" ? AlertTriangle : XCircle;
                    const color = f.status === "ok" ? "text-emerald-600" : f.status === "warn" ? "text-amber-600" : "text-rose-600";
                    return (
                      <div key={i} className="px-5 py-3 flex items-start gap-4 text-sm hover:bg-slate-50/50">
                        <Icon size={16} className={`${color} mt-0.5 shrink-0`} />
                        <div className="flex-1 grid grid-cols-12 gap-3 items-baseline">
                          <div className="col-span-4 text-slate-600 text-xs">{f.label}</div>
                          <div className="col-span-6 text-slate-900 font-medium">{f.value}</div>
                          <div className="col-span-2 text-right text-[11px] text-slate-400 font-mono">{f.source}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
 
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-600" /> 5 conformes</span>
                    <span className="flex items-center gap-1"><AlertTriangle size={11} className="text-amber-600" /> 4 condicionantes</span>
                    <span className="flex items-center gap-1"><XCircle size={11} className="text-rose-600" /> 0 inviáveis</span>
                  </div>
                  <button className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1">
                    Ver regulamento integral <ChevronRight size={11} />
                  </button>
                </div>
              </div>
 
              <div className="bg-white border border-slate-200 rounded-md p-5">
                <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-700" />
                  Recomendações do TerraCerta
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex gap-3"><span className="text-emerald-700 font-mono text-xs mt-0.5">01</span><span>Solicitar <strong>delimitação</strong> da área REN ao ICNF antes de qualquer pedido de informação prévia.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-700 font-mono text-xs mt-0.5">02</span><span>A faixa non aedificandi da EN229 reduz a área útil edificável em ~9%. Considerar no estudo prévio.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-700 font-mono text-xs mt-0.5">03</span><span>Iu de 0,15 permite até <strong>{formatNumber(Math.round((property.area || 0) * 0.15))} m²</strong> de construção. Avaliar PIP para confirmar.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-700 font-mono text-xs mt-0.5">04</span><span>O PDM tem <strong>3ª Alteração por Adaptação</strong> em vigor desde 12/03/2025 — recomenda-se confirmar versão.</span></li>
                </ul>
              </div>
 
              <div className="flex justify-end">
                <button
                  onClick={() => setPage(2)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md shadow-sm"
                >
                  Próxima · Conversão para Urbano <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <div className="bg-white border border-slate-200 rounded-md">
                <div className="px-5 py-3 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900 text-sm">Viabilidade de conversão para solo Urbano</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simulação baseada nos critérios do RJIGT (DL 80/2015) e nas dinâmicas territoriais do concelho.
                  </p>
                </div>
 
                <div className="p-5 grid grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-md overflow-hidden">
                  {[
                    { label: "Probabilidade conversão", value: `${conversionScore}%`, sub: "horizonte 5-7 anos", color: scoreColor(conversionScore).text },
                    { label: "Custo estimado processo", value: "€ 8.400", sub: "taxas + assessoria", color: "text-slate-900" },
                    { label: "Prazo médio CM", value: "14-22 meses", sub: "incl. discussão pública", color: "text-slate-900" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-4">
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-1">{s.label}</div>
                      <div className={`text-2xl font-semibold tabular-nums ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
 
                <div className="px-5 pb-5">
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-5 mb-3">Análise dos requisitos legais (RJIGT)</h3>
                  <div className="border border-slate-200 rounded-md divide-y divide-slate-100">
                    {[
                      { req: "Contiguidade ao perímetro urbano existente", status: "ok", note: "Distância 280m ao limite" },
                      { req: "Infraestruturas básicas (água, eletricidade, saneamento)", status: "warn", note: "Saneamento a 420m — extensão necessária" },
                      { req: "Acessibilidade rodoviária estruturante", status: "ok", note: "EN229 + caminho municipal" },
                      { req: "Não sobreposição com REN crítica", status: "warn", note: "18% da parcela em REN" },
                      { req: "Compatibilidade com PROT-Centro", status: "ok", note: "Categoria mista compatível" },
                      { req: "Equilíbrio áreas urbanizadas/rústicas no concelho", status: "warn", note: "Concelho próximo do limite legal" },
                      { req: "Justificação demográfica/económica", status: "warn", note: "Crescimento populacional negativo (-1,2% / ano)" },
                    ].map((r, i) => {
                      const Icon = r.status === "ok" ? CheckCircle : AlertTriangle;
                      const color = r.status === "ok" ? "text-emerald-600" : "text-amber-600";
                      return (
                        <div key={i} className="px-4 py-2.5 flex items-center gap-3 text-sm">
                          <Icon size={15} className={color} />
                          <span className="flex-1 text-slate-700">{r.req}</span>
                          <span className="text-xs text-slate-500">{r.note}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
 
              <div className="bg-white border border-slate-200 rounded-md p-5">
                <h3 className="font-semibold text-slate-900 text-sm mb-1">Impacto no valor (cenário comparativo)</h3>
                <p className="text-xs text-slate-500 mb-4">Estimativa baseada em transações comparáveis na região (DGRMI 2024-2026).</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {[
                    { tag: "Atual (rústico)", v: "€ 24.900", sub: "≈ €2,00/m²", color: "border-slate-200" },
                    { tag: "Pós-conversão (urbano BD)", v: "€ 186.750", sub: "≈ €15,00/m²", color: "border-emerald-300 bg-emerald-50/40" },
                    { tag: "Delta potencial", v: "+€ 161.850", sub: "+650% · após líquidos €127k", color: "border-emerald-300 bg-emerald-50/40" },
                  ].map((s, i) => (
                    <div key={i} className={`p-3 border rounded-md ${s.color}`}>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">{s.tag}</div>
                      <div className="text-xl font-semibold text-slate-900 tabular-nums">{s.v}</div>
                      <div className="text-xs text-slate-500">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-md p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Score de conversão</span>
                  <Activity size={13} className="text-slate-400" />
                </div>
                <div className={`text-5xl font-semibold tabular-nums ${scoreColor(conversionScore).text}`}>{conversionScore}</div>
                <div className="text-xs text-slate-500 mt-1">Probabilidade ponderada</div>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${scoreColor(conversionScore).text.replace('text-', 'bg-')}`} style={{ width: `${conversionScore}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0</span><span>50</span><span>100</span>
                </div>
              </div>
 
              <div className="bg-white border border-slate-200 rounded-md p-5">
                <h3 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-3">Próximos passos sugeridos</h3>
                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3"><span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center shrink-0">1</span><span>Solicitar Pedido de Informação Prévia (PIP) à CM de {property.concelho}.</span></li>
                  <li className="flex gap-3"><span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center shrink-0">2</span><span>Encomendar levantamento topográfico georreferenciado.</span></li>
                  <li className="flex gap-3"><span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center shrink-0">3</span><span>Acompanhar próxima revisão do PDM (período sondagem prevista 2027).</span></li>
                </ol>
              </div>
 
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-3 rounded-md flex items-center justify-center gap-2 shadow-sm transition">
                <Download size={15} /> Exportar PDF com Logótipo
              </button>
              <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition">
                <FileText size={14} /> Partilhar com cliente
              </button>
 
              <div className="text-[11px] text-slate-400 leading-relaxed px-1">
                <Info size={11} className="inline mr-1" />
                Análise gerada automaticamente. Não substitui parecer técnico
                de arquiteto, engenheiro ou advogado especializado.
              </div>
            </div>
 
            <div className="col-span-12 flex justify-between">
              <button
                onClick={() => setPage(1)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <ChevronLeft size={14} /> Voltar à Análise PDM
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md shadow-sm"
              >
                Concluir e voltar ao dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
 
// ----------------- ROOT -----------------
export default function App() {
  const [page, setPage] = useState("login");
  const [selected, setSelected] = useState(null);
  const [analysisPage, setAnalysisPage] = useState(1);
 
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropriedades();
      setProperties(data);
    } catch (e) {
      setError(e?.message ?? "Erro desconhecido");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };
 
  // Carrega da DB sempre que entramos no dashboard.
  useEffect(() => {
    if (page === "dashboard") loadProperties();
  }, [page]);
 
  if (page === "login") return <LoginPage onLogin={() => setPage("dashboard")} />;
  if (page === "dashboard") return (
    <Dashboard
      properties={properties}
      loading={loading}
      error={error}
      onRefresh={loadProperties}
      onNew={() => setPage("upload")}
      onSelect={(p) => { setSelected(p); setAnalysisPage(1); setPage("analysis"); }}
      onLogout={() => setPage("login")}
    />
  );
  if (page === "upload") return <UploadPage onCancel={() => setPage("dashboard")} onAnalyse={() => { setAnalysisPage(1); setPage("analysis"); }} />;
  if (page === "analysis" && selected) return (
    <AnalysisPage
      property={selected}
      page={analysisPage}
      setPage={setAnalysisPage}
      onBack={() => setPage("dashboard")}
      onLogout={() => setPage("login")}
    />
  );
  return null;
}
