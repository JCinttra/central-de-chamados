import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { getUserProfile, isAdmin } from "./services/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewTicket from "./pages/NewTicket";
import Ticket from "./pages/Ticket";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";

function Protected({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ user, admin, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (!admin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const [p, a] = await Promise.all([
          getUserProfile(currentUser.uid),
          isAdmin(currentUser.uid)
        ]);
        setProfile(p);
        setAdmin(a);
      } else {
        setProfile(null);
        setAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading-screen">Carregando Central de Chamados...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/cadastro" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route element={<Protected user={user}><Layout user={user} profile={profile} admin={admin} /></Protected>}>
        <Route path="/" element={<Dashboard user={user} profile={profile} />} />
        <Route path="/novo-chamado" element={<NewTicket user={user} profile={profile} />} />
        <Route path="/chamado/:id" element={<Ticket user={user} admin={admin} />} />
        <Route path="/admin" element={<AdminOnly user={user} admin={admin}><Admin /></AdminOnly>} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}