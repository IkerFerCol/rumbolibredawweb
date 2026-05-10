import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function CookieConsent() {
  const location = useLocation();
  const [showConsent, setShowConsent] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, 
    analytics: true,
    marketing: false,
    functional: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch {
        setShowConsent(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    saveConsent(allAccepted);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    saveConsent(onlyNecessary);
  };

  const saveConsent = (consentPreferences) => {
    localStorage.setItem("cookieConsent", JSON.stringify(consentPreferences));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setShowConsent(false);
    setShowPreferences(false);

    applyConsent(consentPreferences);
  };

  const applyConsent = (prefs) => {
    if (prefs.analytics) {
      console.log("Analytics activados");
    } else {
      console.log("Analytics desactivados");
    }

    if (prefs.marketing) {
      console.log("Marketing activado");
    }

    if (prefs.functional) {
      console.log("Cookies funcionales activadas");
    }
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div
            className="max-w-4xl mx-auto rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden"
            style={{
              background: "rgba(26, 18, 8, 0.95)",
              border: "1px solid rgba(150, 95, 33, 0.3)",
              boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            {!showPreferences ? (
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🍪</span>
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Usamos cookies
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 249, 242, 0.8)" }}>
                      Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación,
                      analizar el tráfico y personalizar el contenido. Puedes aceptar todas las cookies,
                      rechazarlas o configurar tus preferencias.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
                      style={{
                        background: "transparent",
                        color: "rgba(255, 249, 242, 0.9)",
                        borderColor: "rgba(255, 249, 242, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 249, 242, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      Configurar
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
                      style={{
                        background: "transparent",
                        color: "rgba(255, 249, 242, 0.9)",
                        borderColor: "rgba(255, 249, 242, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 249, 242, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border-none text-white"
                      style={{ background: "rgba(150, 95, 33, 1)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(110, 68, 18, 1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(150, 95, 33, 1)";
                      }}
                    >
                      Aceptar todas
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 text-xs" style={{ color: "rgba(255, 249, 242, 0.6)" }}>
                  <a href="/politica-cookies" className="hover:text-white transition-colors underline">
                    Política de cookies
                  </a>
                  <a href="/politica-privacidad" className="hover:text-white transition-colors underline">
                    Política de privacidad
                  </a>
                  <a href="/aviso-legal" className="hover:text-white transition-colors underline">
                    Aviso legal
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚙️</span>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Configurar cookies
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="text-white/60 hover:text-white text-2xl leading-none transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Cookies necesarias */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl" style={{ background: "rgba(255, 249, 242, 0.05)" }}>
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Cookies necesarias</p>
                      <p className="text-xs" style={{ color: "rgba(255, 249, 242, 0.6)" }}>
                        Esenciales para el funcionamiento del sitio. No se pueden desactivar.
                      </p>
                    </div>
                    <div className="w-10 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(180, 50, 50, 0.2)", color: "#b43232" }}>
                      ON
                    </div>
                  </div>

                  {/* Cookies analíticas */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl" style={{ background: "rgba(255, 249, 242, 0.05)" }}>
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Cookies analíticas</p>
                      <p className="text-xs" style={{ color: "rgba(255, 249, 242, 0.6)" }}>
                        Nos ayudan a entender cómo usas el sitio y mejorar tu experiencia.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                      className="w-10 h-6 rounded-full transition-all relative"
                      style={{ background: preferences.analytics ? "rgba(150, 95, 33, 0.5)" : "rgba(255, 249, 242, 0.2)" }}
                    >
                      <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-md"
                        style={{ left: preferences.analytics ? "22px" : "2px" }}
                      />
                    </button>
                  </div>

                  {/* Cookies de marketing */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl" style={{ background: "rgba(255, 249, 242, 0.05)" }}>
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Cookies de marketing</p>
                      <p className="text-xs" style={{ color: "rgba(255, 249, 242, 0.6)" }}>
                        Se utilizan para mostrarte anuncios relevantes según tus intereses.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                      className="w-10 h-6 rounded-full transition-all relative"
                      style={{ background: preferences.marketing ? "rgba(150, 95, 33, 0.5)" : "rgba(255, 249, 242, 0.2)" }}
                    >
                      <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-md"
                        style={{ left: preferences.marketing ? "22px" : "2px" }}
                      />
                    </button>
                  </div>

                  {/* Cookies funcionales */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl" style={{ background: "rgba(255, 249, 242, 0.05)" }}>
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Cookies funcionales</p>
                      <p className="text-xs" style={{ color: "rgba(255, 249, 242, 0.6)" }}>
                        Permiten recordar tus preferencias y personalizar el contenido.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                      className="w-10 h-6 rounded-full transition-all relative"
                      style={{ background: preferences.functional ? "rgba(150, 95, 33, 0.5)" : "rgba(255, 249, 242, 0.2)" }}
                    >
                      <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-md"
                        style={{ left: preferences.functional ? "22px" : "2px" }}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="px-4 py-2 rounded-xl text-sm transition-all"
                    style={{ background: "transparent", color: "rgba(255, 249, 242, 0.7)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all border-none"
                    style={{ background: "rgba(150, 95, 33, 1)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(110, 68, 18, 1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(150, 95, 33, 1)";
                    }}
                  >
                    Guardar preferencias
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}