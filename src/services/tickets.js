import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "./firebase";

export const CATEGORIES = [
  "TI / Sistemas",
  "Equipamentos",
  "Acesso / Permissões",
  "Impressoras",
  "Rede / Internet",
  "SAP",
  "Outros"
];

export const PRIORITIES = ["Baixa", "Média", "Alta", "Crítica"];
export const STATUSES = ["Aberto", "Em atendimento", "Aguardando usuário", "Resolvido", "Fechado"];

export async function createTicket({ user, profile, subject, category, priority, description }) {
  const ref = await addDoc(collection(db, "tickets"), {
    createdBy: user.uid,
    requesterName: profile?.name || user.email,
    requesterEmail: user.email,
    department: profile?.department || "",
    subject,
    category,
    priority,
    description,
    status: "Aberto",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function getMyTickets(uid) {
  const q = query(
    collection(db, "tickets"),
    where("createdBy", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllTickets() {
  const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTicket(id) {
  const snap = await getDoc(doc(db, "tickets", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateTicket(id, data) {
  await updateDoc(doc(db, "tickets", id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function getMessages(ticketId) {
  const q = query(
    collection(db, "tickets", ticketId, "messages"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addMessage(ticketId, { authorId, authorName, text, isAdmin }) {
  await addDoc(collection(db, "tickets", ticketId, "messages"), {
    authorId,
    authorName,
    text,
    isAdmin,
    createdAt: serverTimestamp()
  });
}