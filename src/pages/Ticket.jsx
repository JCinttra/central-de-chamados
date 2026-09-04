import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, UserRound, ShieldCheck } from "lucide-react";
import { addMessage, getMessages, getTicket, STATUSES, updateTicket } from "../services/tickets";
import { auth } from "../services/firebase";

function statusClass(status) { return "status " + status.toLowerCase().replaceAll(" ", "-"); }

export default function Ticket({ user, admin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const t = await getTicket(id);
      setTicket(t);
      if (t) setMessages(await getMessages(id));
    } finally { setLoading(false); }
  }
  useEffect(()=>{ load(); },[id]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await addMessage(id, {
      authorId: user.uid,
      authorName: admin ? "Administrador" : (ticket?.requesterName || user.email),
      text: text.trim(),
      isAdmin: admin
    });
    setText("");
    await load();
  }

  async function changeStatus(status) {
    await updateTicket(id, {status});
    await load();
  }

  if (loading) return <div className="loading-screen">Carregando chamado...</div>;
  if (!ticket) return <div className="empty">Chamado não encontrado.</div>;

  return (
    <>
      <header className="topbar">
        <div><Link className="back" to={admin ? "/admin" : "/"}><ArrowLeft size={17}/> Voltar</Link><h2>#{id.slice(0,6).toUpperCase()} — {ticket.subject}</h2><p>{ticket.category} · {ticket.priority} · {ticket.department}</p></div>
        <span className={statusClass(ticket.status)}>{ticket.status}</span>
      </header>

      <div className="ticket-layout">
        <section className="panel">
          <div className="detail-block"><span className="label">Descrição</span><p className="description">{ticket.description}</p></div>

          <div className="detail-block">
            <span className="label">Conversa</span>
            <div className="messages">
              {messages.length === 0 && <div className="empty small">Nenhuma mensagem ainda.</div>}
              {messages.map(m => (
                <div className={"message " + (m.isAdmin ? "admin-message" : "")} key={m.id}>
                  <div className="message-avatar">{m.isAdmin ? <ShieldCheck size={17}/> : <UserRound size={17}/>}</div>
                  <div><strong>{m.authorName}</strong><p>{m.text}</p></div>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="message-form"><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Digite uma mensagem..." rows="3"/><button className="primary"><Send size={17}/> Enviar</button></form>
          </div>
        </section>

        <aside className="panel side-panel">
          <span className="label">Detalhes</span>
          <div className="detail-line"><span>Solicitante</span><strong>{ticket.requesterName}</strong></div>
          <div className="detail-line"><span>E-mail</span><strong>{ticket.requesterEmail}</strong></div>
          <div className="detail-line"><span>Setor</span><strong>{ticket.department || "-"}</strong></div>
          <div className="detail-line"><span>Prioridade</span><strong>{ticket.priority}</strong></div>

          {admin && (
            <div className="admin-status">
              <span className="label">Alterar status</span>
              <select value={ticket.status} onChange={e=>changeStatus(e.target.value)}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}