import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, LayoutDashboard, ShieldCheck, Headphones } from "lucide-react";
import { logoutUser } from "../services/auth";

export default function Layout({ user, profile, admin }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Headphones size={23} /></div>
          <div>
            <strong>Central</strong>
            <span>de Chamados</span>
          </div>
        </div>

        <nav>
          <NavLink to="/" end><LayoutDashboard size={18}/> Dashboard</NavLink>
          <NavLink to="/novo-chamado"><PlusCircle size={18}/> Novo chamado</NavLink>
          {admin && <NavLink to="/admin"><ShieldCheck size={18}/> Administração</NavLink>}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{(profile?.name || user.email).slice(0,1).toUpperCase()}</div>
          <div className="user-mini">
            <strong>{profile?.name || "Usuário"}</strong>
            <span>{admin ? "Administrador" : profile?.department || user.email}</span>
          </div>
          <button className="icon-button" onClick={handleLogout} title="Sair"><LogOut size={18}/></button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}