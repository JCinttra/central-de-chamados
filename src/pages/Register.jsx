import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { registerUser } from "../services/auth";

export default function Register() {
  const [form, setForm] = useState({name:"", email:"", department:"", password:"", confirm:""});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function change(key, value) { setForm(f => ({...f, [key]: value})); }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (form.password !== form.confirm) return setError("As senhas não conferem.");
    setBusy(true);
    try {
      await registerUser(form);
      navigate("/");
    } catch (err) {
      setError(err?.code === "auth/email-already-in-use" ? "Este e-mail já está cadastrado." : "Não foi possível realizar o cadastro.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register">
        <div className="auth-brand">
          <div className="brand-icon large"><UserPlus size={30}/></div>
          <h1>Primeiro acesso</h1>
          <p>Cadastre-se para abrir e acompanhar chamados.</p>
        </div>

        <form onSubmit={submit} className="form">
          <label>Nome completo</label>
          <input value={form.name} onChange={e=>change("name",e.target.value)} required placeholder="Seu nome"/>

          <label>E-mail</label>
          <input type="email" value={form.email} onChange={e=>change("email",e.target.value)} required placeholder="seu.email@empresa.com"/>

          <label>Setor</label>
          <input value={form.department} onChange={e=>change("department",e.target.value)} required placeholder="Ex.: PCP"/>

          <div className="form-grid">
            <div><label>Senha</label><input type="password" value={form.password} onChange={e=>change("password",e.target.value)} required/></div>
            <div><label>Confirmar</label><input type="password" value={form.confirm} onChange={e=>change("confirm",e.target.value)} required/></div>
          </div>

          {error && <div className="alert error">{error}</div>}
          <button className="primary full" disabled={busy}>{busy ? "Cadastrando..." : "Criar conta"}</button>
        </form>

        <div className="auth-footer">
          Já possui conta? <Link to="/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}