import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, AlertTriangle, CheckCircle2, Clock3, Search, Users } from "lucide-react";
import { getAllTickets, STATUSES } from "../services/tickets";

function statusClass(status) { return "status " + status.toLowerCase().replaceAll(" ", "-"); }

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setTickets(await getAllTickets()); } finally { setLoading(false); }
  }
  useEffect(()=>{load();},[]);

  const filtered = useMemo(() => tickets.filter(t => {
    const matchesStatus = status === "Todos" || t.status === status;
    const q = search.toLowerCase();
    const matchesSearch = !q || [t.subject,t.requesterName,t.department,t.category,t.id].some(v => String(v||"").toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  }), [tickets,status,search]);

  const open = tickets.filter(t=>t.status==="Aberto").length;
  const progress = tickets.filter(t=>["Em atendimento","Aguardando usuário"].includes(t.status)).length;
  const resolved = tickets.filter(t=>["Resolvido","Fechado"].includes(t.status)).length;
  const critical = tickets.filter(t=>t.priority==="Crítica" && !["Resolvido","Fechado"].includes(t.status)).length;

  return (
    <>
      <header className="topbar">
        <div><span className="eyebrow">ADMINISTRAÇÃO</span><h2>Painel de atendimento</h2><p>Visão geral e gestão dos chamados.</p></div>
      </header>

      <section className="stats">
        <div className="stat-card"><div className="stat-icon"><Activity/></div><div><span>Total</span><strong>{tickets.length}</strong></div></div>
        <div className="stat-card"><div className="stat-icon"><Clock3/></div><div><span>Em andamento</span><strong>{progress}</strong></div></div>
        <div className="stat-card"><div className="stat-icon"><CheckCircle2/></div><div><span>Resolvidos</span><strong>{resolved}</strong></div></div>
        <div className="stat-card"><div className="stat-icon"><AlertTriangle/></div><div><span>Críticos</span><strong>{critical}</strong></div></div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h3>Todos os chamados</h3><p>Gerencie as solicitações recebidas.</p></div>
          <div className="filters">
            <div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..."/></div>
            <select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
          </div>
        </div>
        {loading ? <div className="empty">Carregando chamados...</div> : (
          <div className="ticket-list">
            {filtered.map(t => (
              <Link className="ticket-row" to={`/chamado/${t.id}`} key={t.id}>
                <div className="ticket-id">#{t.id.slice(0,6).toUpperCase()}</div>
                <div className="ticket-main"><strong>{t.subject}</strong><span>{t.requesterName} · {t.department || "Sem setor"} · {t.category}</span></div>
                <span className={statusClass(t.status)}>{t.status}</span>
                <span className={"priority " + t.priority.toLowerCase()}>{t.priority}</span>
              </Link>
            ))}
            {filtered.length === 0 && <div className="empty"><Users size={34}/><strong>Nenhum resultado</strong></div>}
          </div>
        )}
      </section>
    </>
  );
}