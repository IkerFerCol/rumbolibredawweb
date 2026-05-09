import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../context/SettingsContext"; // ← Añadir esta línea
import logo from "../assets/logorumbolibre.png";

const animationStyles = `
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeDown { animation: fadeDown 0.2s ease-out forwards; }
`;

const NAV_LINKS = [
  { label: "Inicio", path: "/", key: "nav_home" },
  { label: "Ciudades", path: "/ciudades", key: "nav_cities" },
  { label: "Foro", path: "/foro", key: "nav_forum" },
  { label: "Reservas", path: "/reservas", key: "nav_bookings" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // ─── Obtener traducciones ─────────────────────────────────────────────────
  const { t } = useSettings(); // ← Añadir esta línea

  const raw = localStorage.getItem("token");
  const user = localStorage.getItem("rl_user")
    ? JSON.parse(localStorage.getItem("rl_user"))
    : raw
      ? { nombre: "Usuario" }
      : null;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rl_user");
    setOpen(false);
    navigate("/login");
    window.location.reload(); // ← Fuerza la recarga de la página
  }

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  // Obtener nombre de usuario (compatible con nombre o name)
  const userName = user?.nombre || user?.name || "Usuario";
  const userEmail = user?.email || "";

  return (
    <>
      <style>{animationStyles}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 bg-[rgba(255,249,242,0.92)] dark:bg-[rgba(17,24,39,0.92)] backdrop-blur-[12px] border-b border-[rgba(150,95,33,0.18)] dark:border-gray-700 transition-colors duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="RumboLibre" className="w-9 h-9 object-cover rounded-lg" />
          <span
            className="text-[17px] font-semibold hidden sm:block text-[#1a1208] dark:text-gray-100"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            RumboLibre
          </span>
        </div>

        {/* Links centrales */}
        <div className="flex items-center gap-1 mx-auto">
          {NAV_LINKS.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border border-transparent"
              style={{
                color: isActive(l.path)
                  ? "rgba(150, 95, 33, 1)"
                  : "rgba(92, 74, 42, 0.75)",
                background: isActive(l.path)
                  ? "rgba(150, 95, 33, 0.1)"
                  : "transparent",
                borderColor: isActive(l.path)
                  ? "rgba(150, 95, 33, 0.3)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive(l.path)) {
                  e.currentTarget.style.color = "rgba(150, 95, 33, 1)";
                  e.currentTarget.style.background = "rgba(150, 95, 33, 0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(l.path)) {
                  e.currentTarget.style.color = "rgba(92, 74, 42, 0.75)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {/* Usar traducción si existe la clave, si no usar el label por defecto */}
              {t[l.key] || l.label}
            </button>
          ))}
        </div>

        {/* Auth */}
        <div className="shrink-0">
          {!user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border border-[rgba(150,95,33,0.4)] dark:border-[#b8753b] text-[#965f21] dark:text-[#b8753b] bg-transparent hover:bg-[rgba(150,95,33,0.07)] dark:hover:bg-[rgba(184,117,59,0.1)]"
              >
                {t.nav_login}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 bg-[#965f21] hover:bg-[#6e4412] dark:bg-[#b8753b] dark:hover:bg-[#965f21] text-white border-none"
              >
                {t.nav_register}
              </button>
            </div>
          ) : (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 border border-[rgba(150,95,33,0.3)] dark:border-gray-600"
                style={{
                  background: open ? "rgba(150, 95, 33, 0.1)" : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(150, 95, 33, 0.08)")
                }
                onMouseLeave={(e) =>
                (e.currentTarget.style.background = open
                  ? "rgba(150, 95, 33, 0.1)"
                  : "transparent")
                }
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold bg-[#965f21] dark:bg-[#b8753b] text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium hidden sm:block text-[#1a1208] dark:text-gray-100">
                  {userName}
                </span>
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200 text-[rgba(150,95,33,0.6)] dark:text-gray-400"
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden animate-fadeDown bg-[#fff9f2] dark:bg-gray-800 border border-[rgba(150,95,33,0.22)] dark:border-gray-600 shadow-lg">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-[rgba(150,95,33,0.12)] dark:border-gray-600">
                    <p className="text-[13px] font-semibold truncate text-[#1a1208] dark:text-gray-100">
                      {userName}
                    </p>
                    <p className="text-[11px] truncate text-[#9c8060] dark:text-gray-400">
                      {userEmail}
                    </p>
                  </div>

                  {[
                    {
                      icon: "⚙️",
                      label: t.nav_config,
                      path: "/configuracion",
                    },
                    {
                      icon: "📬",
                      label: t.nav_contact,
                      path: "/contacto",
                    },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-left transition-all duration-150 text-[#5c4a2a] dark:text-gray-300 hover:bg-[rgba(150,95,33,0.07)] dark:hover:bg-gray-700"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <div className="border-t border-[rgba(150,95,33,0.12)] dark:border-gray-600" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-left transition-all duration-150 text-[#b43232] dark:text-red-400 hover:bg-[rgba(180,50,50,0.06)] dark:hover:bg-red-900/20"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span>🚪</span>
                    {t.nav_logout}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}