import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket, CATEGORIES, PRIORITIES } from "../services/tickets";
import { ArrowLeft, Send } from "lucide-react";

export default function NewTicket({ user, profile }) {
  const [form, setForm] = useState({subject:"", category:CATEGORIES[0], priority:"Média", description:""});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function change(k,v){ setForm(f=>({...f,[k]:v})); }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (form.description.trim().length < 10) return setError("Descreva o problema com pelo menos 10 caracteres.");
    setBusy(true);
    try {
      const id = await createTicket({user, profile, ...form});
      navigate(`/chamado/${id}`);
    } catch {
      setError("Não foi possível abrir o chamado. Verifique sua conexão e tente novamente.");
    } finally { setBusy(false); }
  }

  return (
    <>
      <header className="topbar">
        <div><span className="eyebrow">ATENDIMENTO</span><h2>Novo chamado</h2><p>Informe os detalhes para que sua solicitação seja atendida.</p></div>
      </header>

      <section className="panel form-panel">
        <form onSubmit={submit} className="form">
          <label>Assunto</label>
          <input value={form.subject} onChange={e=>change("subject",e.target.value)} required placeholder="Ex.: Não consigo acessar o SAP"/>

          <div className="form-grid three">
            <div><label>Categoria</label><select value={form.category} onChange={e=>change("category",e.target.value)}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></div>
            <div><label>Prioridade</label><select value={form.priority} onChange={e=>change("priority",e.target.value)}>{PRIORITIES.map(x=><option key={x}>{x}</option>)}</select></div>
            <div><label>Solicitante</label><input value={profile?.name || user.email} disabled/></div>
          </div>

          <label>Descrição</label>
          <textarea rows="8" value={form.description} onChange={e=>change("description",e.target.value)} required placeholder="Explique o que aconteceu, quando começou e o impacto no trabalho."/>

          {error && <div className="alert error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="secondary" onClick={()=>navigate("/")}><ArrowLeft size={18}/> Cancelar</button>
            <button className="primary" disabled={busy}><Send size={18}/> {busy ? "Enviando..." : "Abrir chamado"}</button>
          </div>
        </form>
      </section>
    </>
  );
}