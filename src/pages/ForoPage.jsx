import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
  .animate-spin { animation: spin 0.8s linear infinite; }
  .opacity-0 { opacity: 0; }
`;

const AVATAR_COLORS = [
  "rgba(150, 95, 33, 1)",
  "rgba(110, 68, 18, 1)",
  "rgba(180, 130, 60, 1)",
  "rgba(90, 120, 80, 1)",
  "rgba(70, 100, 150, 1)",
];

const inputBaseLight = {
  background: "rgba(250, 247, 242, 1)",
  border: "0.5px solid rgba(150, 95, 33, 0.25)",
  color: "rgba(26, 18, 8, 1)",
  fontFamily: "'DM Sans', sans-serif",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avatarColor(id) {
  return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return "ahora mismo";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)} días`;
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    className="animate-spin w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    style={{ color: "rgba(150, 95, 33, 1)" }}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// ─── RespuestasPanel ─────────────────────────────────────────────────────────
function RespuestasPanel({ temaId, user }) {
  const [respuestas, setRespuestas] = useState([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const cargarRespuestas = useCallback(async () => {
    try {
      const { data } = await api.get(`/foro/respuestas/tema/${temaId}`);
      setRespuestas(data);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [temaId]);

  useEffect(() => {
    cargarRespuestas();
  }, [cargarRespuestas]);

  async function enviarRespuesta() {
    if (!texto.trim() || !user) return;
    setSending(true);
    try {
      await api.post(`/foro/respuestas/tema/${temaId}`, {
        contenido: texto.trim(),
        usuarioId: user.id,
      });
      setTexto("");
      cargarRespuestas();
    } catch {
      // manejar error
    } finally {
      setSending(false);
    }
  }

  async function toggleLikeRespuesta(respuestaId) {
    if (!user) return;
    try {
      await api.post(`/foro/likes/respuesta/${respuestaId}?usuarioId=${user.id}`);
      cargarRespuestas();
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="mt-4 pt-4"
      style={{ borderTop: "0.5px solid rgba(150, 95, 33, 0.12)" }}
    >
      {/* Lista respuestas */}
      <div className="flex flex-col gap-3 mb-4">
        {respuestas.length === 0 && (
          <p
            className="text-[12px] text-center py-2 text-[#9c8060] dark:text-gray-400"
          >
            Sé el primero en responder
          </p>
        )}
        {respuestas.map((r) => (
          <div key={r.id} className="flex gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{
                background: avatarColor(r.usuarioId),
                color: "rgba(255,249,242,1)",
              }}
            >
              {r.usuarioId?.toString().charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <div
                className="rounded-xl px-3 py-2.5 mb-1"
                style={{
                  background: "rgba(150, 95, 33, 0.06)",
                  borderRadius: "0 12px 12px 12px",
                }}
              >
                <p
                  className="text-[11px] font-semibold mb-0.5 text-[#1a1208] dark:text-gray-100"
                >
                  Usuario #{r.usuarioId}
                </p>
                <p
                  className="text-[12px] leading-relaxed text-[#5c4a2a]/90 dark:text-gray-300"
                >
                  {r.contenido}
                </p>
              </div>
              <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] text-[#9c8060] dark:text-gray-400">
                  {formatDate(r.fechaCreacion)}
                </span>
                <button
                  onClick={() => toggleLikeRespuesta(r.id)}
                  className="text-[11px] transition-all px-2 py-0.5 rounded-lg text-[#9c8060] dark:text-gray-400 hover:bg-[rgba(150,95,33,0.07)]"
                >
                  🤍 {r.likes || 0}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input nueva respuesta */}
      {user ? (
        <div className="flex gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviarRespuesta()}
            placeholder="Escribe una respuesta..."
            className="flex-1 h-9 px-3 rounded-xl text-[13px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] dark:border-gray-600 focus:border-[rgba(150,95,33,1)] focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)]"
          />
          <button
            onClick={enviarRespuesta}
            disabled={sending || !texto.trim()}
            className="px-4 h-9 rounded-xl text-[13px] font-medium transition-all flex items-center gap-2 text-white"
            style={{
              background:
                sending || !texto.trim()
                  ? "rgba(150,95,33,0.4)"
                  : "rgba(150,95,33,1)",
            }}
          >
            {sending ? <Spinner /> : "Enviar"}
          </button>
        </div>
      ) : (
        <p className="text-[12px] text-center text-[#9c8060] dark:text-gray-400">
          <a
            href="/login"
            className="font-semibold"
            style={{ color: "rgba(150,95,33,1)" }}
          >
            Inicia sesión
          </a>{" "}
          para responder
        </p>
      )}
    </div>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({ tema, user, onLike, onDelete }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800"
      style={{
        border: "0.5px solid rgba(150,95,33,0.18)",
        boxShadow: "0 2px 16px rgba(150,95,33,0.06)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 6px 28px rgba(150,95,33,0.13)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 16px rgba(150,95,33,0.06)")
      }
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
            style={{
              background: avatarColor(tema.usuarioId),
              color: "rgba(255,249,242,1)",
            }}
          >
            {tema.usuarioId?.toString().charAt(0) || "?"}
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1a1208] dark:text-gray-100">
              Usuario #{tema.usuarioId}
            </p>
            <p className="text-[11px] text-[#9c8060] dark:text-gray-400">
              {formatDate(tema.fechaCreacion)}
            </p>
          </div>
          {/* Borrar si es el autor */}
          {user?.id === tema.usuarioId && (
            <button
              onClick={() => onDelete(tema.id)}
              className="text-[12px] px-2 py-1 rounded-lg transition-all text-[#b43232] hover:bg-[rgba(180,50,50,0.08)]"
            >
              🗑
            </button>
          )}
        </div>

        {/* Título */}
        <h3
          className="text-[17px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {tema.titulo}
        </h3>

        {/* Contenido */}
        <p className="text-[13px] leading-relaxed mb-4 text-[#5c4a2a]/90 dark:text-gray-300">
          {tema.contenido}
        </p>

        {/* Acciones */}
        <div
          className="flex items-center gap-3 pt-3"
          style={{ borderTop: "0.5px solid rgba(150,95,33,0.1)" }}
        >
          <button
            onClick={() => onLike(tema.id)}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all text-[#9c8060] dark:text-gray-400 hover:bg-[rgba(150,95,33,0.07)]"
          >
            🤍 {tema.likes || 0} me gusta
          </button>

          <button
            onClick={() => setShowReplies((p) => !p)}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: showReplies
                ? "rgba(150,95,33,1)"
                : "rgba(156,128,96,1)",
              background: showReplies
                ? "rgba(150,95,33,0.08)"
                : "transparent",
            }}
          >
            💬 {showReplies ? "Ocultar" : "Responder"}
          </button>
        </div>

        {/* Panel respuestas */}
        {showReplies && <RespuestasPanel temaId={tema.id} user={user} />}
      </div>
    </div>
  );
}

// ─── ForoPage ─────────────────────────────────────────────────────────────────
export default function ForoPage() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("rl_user"));
    } catch {
      return null;
    }
  })();

  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newTema, setNewTema] = useState({ titulo: "", contenido: "" });

  // ── Cargar temas ──────────────────────────────────────────────────────────
  const cargarTemas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/foro/temas");
      setTemas(data);
    } catch {
      setError("No se pudieron cargar los temas del foro.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarTemas();
  }, [cargarTemas]);

  // ── Like tema ─────────────────────────────────────────────────────────────
  async function handleLike(temaId) {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post(`/foro/likes/tema/${temaId}?usuarioId=${user.id}`);
      setTemas((prev) =>
        prev.map((t) =>
          t.id === temaId ? { ...t, likes: (t.likes || 0) + 1 } : t
        )
      );
    } catch {
      cargarTemas();
    }
  }

  // ── Eliminar tema ─────────────────────────────────────────────────────────
  async function handleDelete(temaId) {
    if (!confirm("¿Eliminar este tema?")) return;
    try {
      await api.delete(`/foro/temas/${temaId}`);
      setTemas((prev) => prev.filter((t) => t.id !== temaId));
    } catch {
      alert("No se pudo eliminar el tema.");
    }
  }

  // ── Crear tema ────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!newTema.titulo.trim() || !newTema.contenido.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/foro/temas", {
        titulo: newTema.titulo.trim(),
        contenido: newTema.contenido.trim(),
        usuarioId: user.id,
      });
      setNewTema({ titulo: "", contenido: "" });
      setShowForm(false);
      cargarTemas();
    } catch {
      setError("Error al publicar el tema.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{animationStyles}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <Header />

        {/* Hero */}
        <div
          className="py-12 px-6 text-center transition-colors duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(150,95,33,0.1) 0%, rgba(200,160,100,0.06) 100%)",
            borderBottom: "0.5px solid rgba(150,95,33,0.12)",
          }}
        >
          <h1
            className="text-[32px] font-semibold mb-2 animate-fadeInUp opacity-0 text-[#1a1208] dark:text-gray-100"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Foro de viajeros
          </h1>
          <p
            className="text-[14px] font-light mb-6 animate-fadeInUp opacity-0 text-[#9c8060] dark:text-gray-400"
            style={{ animationDelay: "100ms" }}
          >
            Comparte tu experiencia y descubre los consejos de otros viajeros
          </p>

          {user && (
            <button
              onClick={() => setShowForm((p) => !p)}
              className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 animate-fadeInUp opacity-0 text-white"
              style={{
                background: "rgba(150,95,33,1)",
                animationDelay: "200ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(110,68,18,1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(150,95,33,1)")
              }
            >
              {showForm ? "✕ Cancelar" : "✍️ Nuevo tema"}
            </button>
          )}
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-10">
          {/* Error global */}
          {error && (
            <div
              className="rounded-xl px-4 py-3 mb-6 text-[13px]"
              style={{
                background: "rgba(180,50,50,0.08)",
                border: "0.5px solid rgba(180,50,50,0.3)",
                color: "rgba(180,50,50,1)",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Formulario nuevo tema */}
          {showForm && (
            <div
              className="rounded-2xl p-6 mb-8 animate-fadeInUp opacity-0 bg-white dark:bg-gray-800"
              style={{
                border: "0.5px solid rgba(150,95,33,0.22)",
                boxShadow: "0 4px 24px rgba(150,95,33,0.1)",
              }}
            >
              <h2
                className="text-[18px] font-semibold mb-4 text-[#1a1208] dark:text-gray-100"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Nuevo tema
              </h2>

              <div className="flex flex-col gap-3">
                <input
                  value={newTema.titulo}
                  onChange={(e) =>
                    setNewTema((p) => ({ ...p, titulo: e.target.value }))
                  }
                  placeholder="Título del tema"
                  className="w-full h-11 px-4 rounded-xl text-[14px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] dark:border-gray-600 focus:border-[rgba(150,95,33,1)] focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)]"
                />
                <textarea
                  value={newTema.contenido}
                  onChange={(e) =>
                    setNewTema((p) => ({ ...p, contenido: e.target.value }))
                  }
                  placeholder="Cuéntanos tu experiencia, opinión o duda..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none resize-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] dark:border-gray-600 focus:border-[rgba(150,95,33,1)] focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)]"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl text-[13px] transition-all border border-[rgba(150,95,33,0.3)] dark:border-gray-600 text-[#5c4a2a] dark:text-gray-300 hover:bg-[rgba(150,95,33,0.05)] dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      submitting || !newTema.titulo || !newTema.contenido
                    }
                    className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all flex items-center gap-2 text-white"
                    style={{
                      background:
                        submitting || !newTema.titulo || !newTema.contenido
                          ? "rgba(150,95,33,0.4)"
                          : "rgba(150,95,33,1)",
                    }}
                  >
                    {submitting ? (
                      <>
                        <Spinner /> Publicando...
                      </>
                    ) : (
                      "Publicar tema"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista temas */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : temas.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">💬</span>
              <p className="text-[16px] font-medium mb-1 text-[#5c4a2a] dark:text-gray-300">
                No hay temas aún
              </p>
              <p className="text-[13px] text-[#9c8060] dark:text-gray-400">
                {user
                  ? "¡Sé el primero en abrir un tema!"
                  : "Inicia sesión para participar."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {temas.map((tema, i) => (
                <div
                  key={tema.id}
                  className="animate-fadeInUp opacity-0"
                  style={{
                    animationDelay: `${Math.min((i + 1) * 100, 300)}ms`,
                  }}
                >
                  <PostCard
                    tema={tema}
                    user={user}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
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