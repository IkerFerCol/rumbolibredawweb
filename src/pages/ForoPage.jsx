import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useSettings } from "../context/SettingsContext";

const AVATAR_COLORS = ["rgba(150,95,33,1)", "rgba(110,68,18,1)", "rgba(180,130,60,1)", "rgba(90,120,80,1)", "rgba(70,100,150,1)"];

function avatarColor(id) { return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length]; }
function formatDate(str) { if (!str) return ""; const d = new Date(str), diff = Math.floor((Date.now() - d) / 1000); if (diff < 60) return "ahora mismo"; if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`; if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`; return `hace ${Math.floor(diff / 86400)} días`; }

const Spinner = () => (
  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(150,95,33,1)" }}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

function RespuestasPanel({ temaId, user }) {
  const { t } = useSettings();
  const [respuestas, setRespuestas] = useState([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const cargar = useCallback(async () => {
    try { const { data } = await api.get(`/foro/respuestas/tema/${temaId}`); setRespuestas(data); }
    catch { } finally { setLoading(false); }
  }, [temaId]);

  useEffect(() => { cargar(); }, [cargar]);

  async function enviar() { if (!texto.trim() || !user) return; setSending(true); try { await api.post(`/foro/respuestas/tema/${temaId}`, { contenido: texto.trim(), usuarioId: user.id }); setTexto(""); cargar(); } catch { } finally { setSending(false); } }
  async function toggleLike(id) { if (!user) return; try { await api.post(`/foro/likes/respuesta/${id}?usuarioId=${user.id}`); cargar(); } catch { } }

  if (loading) return <div className="flex justify-center py-4"><Spinner /></div>;

  return (
    <div className="mt-4 pt-4" style={{ borderTop: "0.5px solid rgba(150,95,33,0.12)" }}>
      <div className="flex flex-col gap-3 mb-4">
        {respuestas.length === 0 && <p className="text-[12px] text-center py-2 text-[#9c8060]">{t.foro_first}</p>}
        {respuestas.map(r => (
          <div key={r.id} className="flex gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: avatarColor(r.usuarioId), color: "rgba(255,249,242,1)" }}>
              {r.usuarioId?.toString().charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <div className="rounded-xl px-3 py-2.5 mb-1" style={{ background: "rgba(150,95,33,0.06)", borderRadius: "0 12px 12px 12px" }}>
                <p className="text-[11px] font-semibold mb-0.5 text-[#1a1208] dark:text-gray-100">{t.foro_user_num}{r.usuarioId}</p>
                <p className="text-[12px] leading-relaxed text-[#5c4a2a]">{r.contenido}</p>
              </div>
              <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] text-[#9c8060]">{formatDate(r.fechaCreacion)}</span>
                <button onClick={() => toggleLike(r.id)} className="text-[11px] px-2 py-0.5 rounded-lg text-[#9c8060] hover:bg-[rgba(150,95,33,0.07)] border-none cursor-pointer bg-transparent">
                  🤍 {r.likes || 0}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {user ? (
        <div className="flex gap-2">
          <input value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && enviar()}
            placeholder={t.foro_write}
            className="flex-1 h-9 px-3 rounded-xl text-[13px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)]" />
          <button onClick={enviar} disabled={sending || !texto.trim()}
            className="px-4 h-9 rounded-xl text-[13px] font-medium transition-all flex items-center gap-2 text-white border-none cursor-pointer"
            style={{ background: sending || !texto.trim() ? "rgba(150,95,33,0.4)" : "rgba(150,95,33,1)" }}>
            {sending ? <Spinner /> : t.foro_send}
          </button>
        </div>
      ) : (
        <p className="text-[12px] text-center text-[#9c8060]">
          <a href="/login" className="font-semibold" style={{ color: "rgba(150,95,33,1)" }}>Inicia sesión</a> {t.foro_login_rep}
        </p>
      )}
    </div>
  );
}

function PostCard({ tema, user, onLike, onDelete }) {
  const { t } = useSettings();
  const [showReplies, setShowReplies] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLikeClick = async () => {
    setLiking(true);
    await onLike(tema.id);
    setLiking(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800"
      style={{ border: "0.5px solid rgba(150,95,33,0.18)", boxShadow: "0 2px 16px rgba(150,95,33,0.06)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 28px rgba(150,95,33,0.13)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(150,95,33,0.06)")}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
            style={{ background: avatarColor(tema.usuarioId), color: "rgba(255,249,242,1)" }}>
            {tema.usuarioId?.toString().charAt(0) || "?"}
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1a1208] dark:text-gray-100">{t.foro_user_num}{tema.usuarioId}</p>
            <p className="text-[11px] text-[#9c8060]">{formatDate(tema.fechaCreacion)}</p>
          </div>
          {user?.id === tema.usuarioId && (
            <button onClick={() => onDelete(tema.id)} className="text-[12px] px-2 py-1 rounded-lg transition-all text-[#b43232] hover:bg-[rgba(180,50,50,0.08)] border-none cursor-pointer bg-transparent">🗑</button>
          )}
        </div>
        <h3 className="text-[17px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>{tema.titulo}</h3>
        <p className="text-[13px] leading-relaxed mb-4 text-[#5c4a2a]">{tema.contenido}</p>
        <div className="flex items-center gap-3 pt-3" style={{ borderTop: "0.5px solid rgba(150,95,33,0.1)" }}>
          <button
            onClick={handleLikeClick}
            disabled={liking}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all border-none cursor-pointer bg-transparent"
            style={{
              color: tema.likedByUser ? "rgba(180,50,50,1)" : "rgba(156,128,96,1)",
              background: liking ? "rgba(150,95,33,0.08)" : "transparent"
            }}>
            {tema.likedByUser ? "❤️" : "🤍"} {tema.likes || 0} {t.foro_like}
          </button>
          <button onClick={() => setShowReplies(p => !p)}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all border-none cursor-pointer"
            style={{ color: showReplies ? "rgba(150,95,33,1)" : "rgba(156,128,96,1)", background: showReplies ? "rgba(150,95,33,0.08)" : "transparent" }}>
            💬 {showReplies ? t.foro_hide : t.foro_reply}
          </button>
        </div>
        {showReplies && <RespuestasPanel temaId={tema.id} user={user} />}
      </div>
    </div>
  );
}

export default function ForoPage() {
  const navigate = useNavigate();
  const { t } = useSettings();
  const user = (() => { try { return JSON.parse(localStorage.getItem("rl_user")); } catch { return null; } })();

  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newTema, setNewTema] = useState({ titulo: "", contenido: "" });

  const cargarTemas = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get("/foro/temas"); setTemas(data); }
    catch { setError("No se pudieron cargar los temas."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { cargarTemas(); }, [cargarTemas]);

  async function handleLike(id) {
    if (!user) { navigate("/login"); return; }
    try {
      const temaActual = temas.find(t => t.id === id);
      const yaDioLike = temaActual?.likedByUser || false;

      await api.post(`/foro/likes/tema/${id}?usuarioId=${user.id}`);

      setTemas(prev => prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            likedByUser: !yaDioLike,
            likes: yaDioLike ? (t.likes || 1) - 1 : (t.likes || 0) + 1
          };
        }
        return t;
      }));
    } catch {
      cargarTemas();
    }
  }

  async function handleDelete(id) {
    if (!confirm(t.foro_delete)) return;
    try { await api.delete(`/foro/temas/${id}`); setTemas(prev => prev.filter(t => t.id !== id)); }
    catch { alert(t.foro_del_err); }
  }

  async function handleSubmit() {
    if (!newTema.titulo.trim() || !newTema.contenido.trim()) return;
    setSubmitting(true);
    try { await api.post("/foro/temas", { titulo: newTema.titulo.trim(), contenido: newTema.contenido.trim(), usuarioId: user.id }); setNewTema({ titulo: "", contenido: "" }); setShowForm(false); cargarTemas(); }
    catch { setError("Error al publicar el tema."); }
    finally { setSubmitting(false); }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Header />
        <div className="py-12 px-6 text-center" style={{ background: "linear-gradient(135deg,rgba(150,95,33,0.1) 0%,rgba(200,160,100,0.06) 100%)", borderBottom: "0.5px solid rgba(150,95,33,0.12)" }}>
          <h1 className="text-[32px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>{t.foro_title}</h1>
          <p className="text-[14px] font-light mb-6 text-[#9c8060]">{t.foro_sub}</p>
          {user && (
            <button onClick={() => setShowForm(p => !p)}
              className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 text-white border-none cursor-pointer"
              style={{ background: "rgba(150,95,33,1)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(110,68,18,1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(150,95,33,1)")}>
              {showForm ? t.foro_cancel : t.foro_new}
            </button>
          )}
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-10">
          {error && <div className="rounded-xl px-4 py-3 mb-6 text-[13px]" style={{ background: "rgba(180,50,50,0.08)", border: "0.5px solid rgba(180,50,50,0.3)", color: "rgba(180,50,50,1)" }}>⚠️ {error}</div>}

          {showForm && (
            <div className="rounded-2xl p-6 mb-8 bg-white dark:bg-gray-800" style={{ border: "0.5px solid rgba(150,95,33,0.22)", boxShadow: "0 4px 24px rgba(150,95,33,0.1)" }}>
              <h2 className="text-[18px] font-semibold mb-4 text-[#1a1208] dark:text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>{t.foro_new_title}</h2>
              <div className="flex flex-col gap-3">
                <input value={newTema.titulo} onChange={e => setNewTema(p => ({ ...p, titulo: e.target.value }))} placeholder={t.foro_placeholder_title}
                  className="w-full h-11 px-4 rounded-xl text-[14px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)]" />
                <textarea value={newTema.contenido} onChange={e => setNewTema(p => ({ ...p, contenido: e.target.value }))} placeholder={t.foro_placeholder_content}
                  rows={5} className="w-full px-4 py-3 rounded-xl text-[14px] outline-none resize-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)]" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-[13px] border border-[rgba(150,95,33,0.3)] text-[#5c4a2a] cursor-pointer bg-transparent">{t.foro_cancel_btn}</button>
                  <button onClick={handleSubmit} disabled={submitting || !newTema.titulo || !newTema.contenido}
                    className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all flex items-center gap-2 text-white border-none cursor-pointer"
                    style={{ background: submitting || !newTema.titulo || !newTema.contenido ? "rgba(150,95,33,0.4)" : "rgba(150,95,33,1)" }}>
                    {submitting ? <><Spinner /> {t.foro_publishing}</> : t.foro_publish}
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? <div className="flex justify-center py-20"><Spinner /></div> :
            temas.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">💬</span>
                <p className="text-[16px] font-medium mb-1 text-[#5c4a2a]">{t.foro_empty}</p>
                <p className="text-[13px] text-[#9c8060]">{user ? t.foro_empty_user : t.foro_empty_guest}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {temas.map((tema, i) => (
                  <div key={tema.id} style={{ animation: `fadeInUp 0.5s ease-out ${Math.min(i * 100, 300)}ms both` }}>
                    <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
                    <PostCard tema={tema} user={user} onLike={handleLike} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            )}
        </div>
        <Footer />
      </div>
    </>
  );
}