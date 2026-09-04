import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Headphones, LockKeyhole, Mail } from "lucide-react";
import { loginUser } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginUser(email, password);
      navigate("/");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon large"><Headphones size={30}/></div>
          <h1>Central de Chamados</h1>
          <p>Acesse sua conta para acompanhar seus atendimentos.</p>
        </div>

        <form onSubmit={submit} className="form">
          <label>E-mail</label>
          <div className="input-icon"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu.email@empresa.com"/></div>

          <label>Senha</label>
          <div className="input-icon"><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/></div>

          {error && <div className="alert error">{error}</div>}
          <button className="primary full" disabled={busy}>{busy ? "Entrando..." : "Entrar"}</button>
        </form>

        <div className="auth-footer">
          Primeiro acesso? <Link to="/cadastro">Criar minha conta</Link>
        </div>
      </div>
    </div>
  );
}