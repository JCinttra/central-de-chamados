import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, FilePlus2, CheckCircle2, CircleDot } from "lucide-react";
import { getMyTickets } from "../services/tickets";

function statusClass(status) {
  return "status " + status.toLowerCase().replaceAll(" ", "-");
}

export default function Dashboard({ user, profile }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setTickets(await getMyTickets(user.uid)); }
    catch { setTickets([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [user.uid]);

  const open = tickets.filter(t => t.status === "Aberto").length;
  const progress = tickets.filter(t => ["Em atendimento","Aguardando usuário"].includes(t.status)).length;
  const resolved = tickets.filter(t => ["Resolvido","Fechado"].includes(t.status)).length;

  return (
    <>
      <header className="topbar">
        <div><span className="eyebrow">VISÃO GERAL</span><h2>Olá, {profile?.name?.split(" ")[0] || "usuário"} 👋</h2><p>Acompanhe suas solicitações por aqui.</p></div>
        <Link className="primary" to="/novo-chamado"><FilePlus2 size={18}/> Abrir chamado</Link>
      </header>

      <section className="stats">
        <div className="stat-card"><div className="stat-icon"><CircleDot/></div><div><span>Chamados abertos</span><strong>{open}</strong></div></div>
        <div className="stat-card"><div className="stat-icon"><Clock3/></div><div><span>Em andamento</span><strong>{progress}</strong></div></div>
        <div className="stat-card"><div className="stat-icon"><CheckCircle2/></div><div><span>Resolvidos</span><strong>{resolved}</strong></div></div>
      </section>

      <section className="panel">
        <div className="panel-head"><div><h3>Meus chamados</h3><p>Últimas solicitações registradas.</p></div><span className="counter">{tickets.length}</span></div>
        {loading ? <div className="empty">Carregando...</div> : tickets.length === 0 ? (
          <div className="empty"><FilePlus2 size={34}/><strong>Nenhum chamado ainda</strong><span>Abra seu primeiro chamado para começar.</span><Link to="/novo-chamado">Abrir chamado</Link></div>
        ) : (
          <div className="ticket-list">
            {tickets.map(t => (
              <Link className="ticket-row" to={`/chamado/${t.id}`} key={t.id}>
                <div className="ticket-id">#{t.id.slice(0,6).toUpperCase()}</div>
                <div className="ticket-main"><strong>{t.subject}</strong><span>{t.category} · {t.priority}</span></div>
                <span className={statusClass(t.status)}>{t.status}</span>
                <ArrowRight size={18}/>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}