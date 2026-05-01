import { useState } from "react";
import Navbar from "../components/Header";
import Footer from "../components/Footer";

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .opacity-0 { opacity: 0; }
`;

const AVATAR_COLORS = [
  "rgba(150, 95, 33, 1)",
  "rgba(110, 68, 18, 1)",
  "rgba(180, 130, 60, 1)",
  "rgba(90, 120, 80, 1)",
  "rgba(70, 100, 150, 1)",
];

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Carlos M.",
    avatarColor: AVATAR_COLORS[0],
    route: "Madrid → París",
    airline: "Iberia",
    title: "Vuelo increíble, lo recomiendo al 100%",
    body: "El servicio a bordo fue excelente, llegamos antes de tiempo y el personal fue muy amable. El desayuno estaba buenísimo. Sin duda repetiré con Iberia para mis próximos viajes.",
    stars: 5,
    likes: 24,
    liked: false,
    date: "hace 2 días",
    comments: [
      { id: 1, author: "Laura P.", avatarColor: AVATAR_COLORS[2], text: "Totalmente de acuerdo, yo también tuve una experiencia genial con Iberia.", date: "hace 1 día" },
      { id: 2, author: "Miguel R.", avatarColor: AVATAR_COLORS[4], text: "¿Qué asientos reservaste? Busco los mejores para ventana.", date: "hace 20h" },
    ],
  },
  {
    id: 2,
    author: "Ana G.",
    avatarColor: AVATAR_COLORS[1],
    route: "Barcelona → Londres",
    airline: "Vueling",
    title: "Vueling puntual y muy cómodo",
    body: "Me sorprendió gratamente la puntualidad. Salimos y llegamos en el horario exacto. El espacio era algo justo pero para 1h30m de vuelo es suficiente. Precio imbatible.",
    stars: 4,
    likes: 18,
    liked: false,
    date: "hace 3 días",
    comments: [
      { id: 1, author: "Pedro S.", avatarColor: AVATAR_COLORS[3], text: "¿Tuviste problemas con el equipaje de mano?", date: "hace 2 días" },
    ],
  },
  {
    id: 3,
    author: "Sofía L.",
    avatarColor: AVATAR_COLORS[2],
    route: "Madrid → Roma",
    airline: "Ryanair",
    title: "Ryanair cumple, aunque con lo justo",
    body: "El vuelo estuvo bien, sin incidencias. La puntualidad mejoró mucho. Eso sí, cuidado con las tasas adicionales por equipaje, que pueden disparar el precio.",
    stars: 3,
    likes: 9,
    liked: false,
    date: "hace 5 días",
    comments: [],
  },
];

const Stars = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange && onChange(s)}
        className="text-xl transition-transform hover:scale-110"
        style={{ color: s <= value ? "rgba(150, 95, 33, 1)" : "rgba(200, 180, 150, 1)" }}
      >
        ★
      </button>
    ))}
  </div>
);

function PostCard({ post, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");

  function submitComment() {
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255, 249, 242, 1)",
        border: "0.5px solid rgba(150, 95, 33, 0.18)",
        boxShadow: "0 2px 16px rgba(150, 95, 33, 0.06)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 6px 28px rgba(150, 95, 33, 0.13)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 16px rgba(150, 95, 33, 0.06)")
      }
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
            style={{ background: post.avatarColor, color: "rgba(255, 249, 242, 1)" }}
          >
            {post.author.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold" style={{ color: "rgba(26, 18, 8, 1)" }}>
              {post.author}
            </p>
            <p className="text-[11px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {post.date}
            </p>
          </div>
          <div
            className="px-3 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: "rgba(150, 95, 33, 0.1)",
              color: "rgba(110, 68, 18, 1)",
              border: "0.5px solid rgba(150, 95, 33, 0.2)",
            }}
          >
            ✈ {post.route}
          </div>
        </div>

        {/* Estrellas */}
        <Stars value={post.stars} />

        {/* Título */}
        <h3
          className="text-[16px] font-semibold mt-2 mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
        >
          {post.title}
        </h3>

        {/* Aerolínea badge */}
        <span
          className="inline-block mb-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
          style={{
            background: "rgba(150, 95, 33, 0.07)",
            color: "rgba(92, 74, 42, 1)",
            border: "0.5px solid rgba(150, 95, 33, 0.15)",
          }}
        >
          🏢 {post.airline}
        </span>

        {/* Cuerpo */}
        <p className="text-[13px] leading-relaxed" style={{ color: "rgba(92, 74, 42, 0.9)" }}>
          {post.body}
        </p>

        {/* Acciones */}
        <div
          className="flex items-center gap-4 mt-4 pt-4"
          style={{ borderTop: "0.5px solid rgba(150, 95, 33, 0.1)" }}
        >
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-all duration-200 px-3 py-1.5 rounded-lg"
            style={{
              color: post.liked ? "rgba(180, 50, 50, 1)" : "rgba(156, 128, 96, 1)",
              background: post.liked ? "rgba(180, 50, 50, 0.08)" : "transparent",
            }}
            onMouseEnter={(e) =>
              !post.liked &&
              (e.currentTarget.style.background = "rgba(150, 95, 33, 0.07)")
            }
            onMouseLeave={(e) =>
              !post.liked && (e.currentTarget.style.background = "transparent")
            }
          >
            {post.liked ? "❤️" : "🤍"} {post.likes}
          </button>

          <button
            onClick={() => setShowComments((p) => !p)}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-all duration-200 px-3 py-1.5 rounded-lg"
            style={{ color: "rgba(156, 128, 96, 1)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(150, 95, 33, 0.07)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            💬 {post.comments.length} comentarios
          </button>
        </div>

        {/* Comentarios */}
        {showComments && (
          <div className="mt-4">
            {post.comments.map((c) => (
              <div key={c.id} className="flex gap-3 mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: c.avatarColor, color: "rgba(255, 249, 242, 1)" }}
                >
                  {c.author.charAt(0)}
                </div>
                <div
                  className="flex-1 rounded-xl px-3 py-2.5"
                  style={{
                    background: "rgba(150, 95, 33, 0.06)",
                    borderRadius: "0 12px 12px 12px",
                  }}
                >
                  <p
                    className="text-[12px] font-semibold mb-0.5"
                    style={{ color: "rgba(26, 18, 8, 1)" }}
                  >
                    {c.author}
                  </p>
                  <p className="text-[12px]" style={{ color: "rgba(92, 74, 42, 0.85)" }}>
                    {c.text}
                  </p>
                </div>
              </div>
            ))}

            {/* Escribir comentario */}
            <div className="flex gap-2 mt-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                placeholder="Escribe un comentario..."
                className="flex-1 h-9 px-3 rounded-xl text-[13px] outline-none transition-all duration-200"
                style={{
                  background: "rgba(250, 247, 242, 1)",
                  border: "0.5px solid rgba(150, 95, 33, 0.25)",
                  color: "rgba(26, 18, 8, 1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 1)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 0.25)")}
              />
              <button
                onClick={submitComment}
                className="px-4 h-9 rounded-xl text-[13px] font-medium transition-all duration-200"
                style={{
                  background: "rgba(150, 95, 33, 1)",
                  color: "rgba(255, 249, 242, 1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110, 68, 18, 1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 1)")}
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForoPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState({
    route: "", airline: "", title: "", body: "", stars: 0,
  });
  const [showForm, setShowForm] = useState(false);

  const user = localStorage.getItem("rl_user")
    ? JSON.parse(localStorage.getItem("rl_user"))
    : null;

  function handleLike(id) {
    if (!user) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p
      )
    );
  }

  function handleComment(postId, text) {
    if (!user) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: Date.now(),
                  author: user.name,
                  avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
                  text,
                  date: "ahora mismo",
                },
              ],
            }
          : p
      )
    );
  }

  function handleSubmitPost() {
    if (!newPost.route || !newPost.title || !newPost.body || !newPost.stars) return;
    const post = {
      id: Date.now(),
      author: user?.name || "Anónimo",
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      route: newPost.route,
      airline: newPost.airline || "Sin especificar",
      title: newPost.title,
      body: newPost.body,
      stars: newPost.stars,
      likes: 0,
      liked: false,
      date: "ahora mismo",
      comments: [],
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost({ route: "", airline: "", title: "", body: "", stars: 0 });
    setShowForm(false);
  }

  return (
    <>
      <style>{animationStyles}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex flex-col"
        style={{ background: "rgba(250, 247, 242, 1)", fontFamily: "'DM Sans', sans-serif" }}
      >
        <Navbar />

        {/* Hero */}
        <div
          className="py-12 px-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(150,95,33,0.1) 0%, rgba(200,160,100,0.06) 100%)",
            borderBottom: "0.5px solid rgba(150, 95, 33, 0.12)",
          }}
        >
          <h1
            className="text-[32px] font-semibold mb-2 animate-fadeInUp opacity-0"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
          >
            Foro de viajeros
          </h1>
          <p
            className="text-[14px] font-light mb-6 animate-fadeInUp delay-100 opacity-0"
            style={{ color: "rgba(156, 128, 96, 1)" }}
          >
            Comparte tu experiencia y descubre los consejos de otros viajeros
          </p>

          {user && (
            <button
              onClick={() => setShowForm((p) => !p)}
              className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 animate-fadeInUp delay-200 opacity-0"
              style={{
                background: "rgba(150, 95, 33, 1)",
                color: "rgba(255, 249, 242, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110, 68, 18, 1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 1)")}
            >
              ✍️ Escribir reseña
            </button>
          )}
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-10">

          {/* Formulario nueva reseña */}
          {showForm && (
            <div
              className="rounded-2xl p-6 mb-8 animate-fadeInUp opacity-0"
              style={{
                background: "rgba(255, 249, 242, 1)",
                border: "0.5px solid rgba(150, 95, 33, 0.22)",
                boxShadow: "0 4px 24px rgba(150, 95, 33, 0.1)",
              }}
            >
              <h2
                className="text-[18px] font-semibold mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
              >
                Nueva reseña
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { placeholder: "Ruta (ej: Madrid → París)", key: "route" },
                  { placeholder: "Aerolínea", key: "airline" },
                ].map((f) => (
                  <input
                    key={f.key}
                    value={newPost[f.key]}
                    onChange={(e) => setNewPost((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="h-10 px-3 rounded-xl text-[13px] outline-none transition-all"
                    style={{
                      background: "rgba(250, 247, 242, 1)",
                      border: "0.5px solid rgba(150, 95, 33, 0.25)",
                      color: "rgba(26, 18, 8, 1)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 1)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 0.25)")}
                  />
                ))}
              </div>
              <input
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                placeholder="Título de tu reseña"
                className="w-full h-10 px-3 rounded-xl text-[13px] outline-none mb-3 transition-all"
                style={{
                  background: "rgba(250, 247, 242, 1)",
                  border: "0.5px solid rgba(150, 95, 33, 0.25)",
                  color: "rgba(26, 18, 8, 1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 1)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 0.25)")}
              />
              <textarea
                value={newPost.body}
                onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))}
                placeholder="Cuéntanos tu experiencia..."
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none mb-3 resize-none transition-all"
                style={{
                  background: "rgba(250, 247, 242, 1)",
                  border: "0.5px solid rgba(150, 95, 33, 0.25)",
                  color: "rgba(26, 18, 8, 1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 1)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 0.25)")}
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] mb-1" style={{ color: "rgba(156, 128, 96, 1)" }}>
                    Valoración
                  </p>
                  <Stars
                    value={newPost.stars}
                    onChange={(v) => setNewPost((p) => ({ ...p, stars: v }))}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl text-[13px] transition-all"
                    style={{
                      border: "0.5px solid rgba(150, 95, 33, 0.3)",
                      color: "rgba(92, 74, 42, 1)",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    className="px-5 py-2 rounded-xl text-[13px] font-medium transition-all"
                    style={{
                      background: "rgba(150, 95, 33, 1)",
                      color: "rgba(255, 249, 242, 1)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110, 68, 18, 1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 1)")}
                  >
                    Publicar reseña
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          <div className="flex flex-col gap-5">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className={`animate-fadeInUp opacity-0 delay-${Math.min((i + 1) * 100, 300)}`}
              >
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}