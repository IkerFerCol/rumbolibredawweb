import { useCookies } from "../hooks/useCookies";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PoliticaCookiesPage() {
  const { revokeConsent, getAllConsent } = useCookies();
  const consent = getAllConsent();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf6f0", fontFamily: "'DM Sans', sans-serif" }}>
      <Header />
      <div className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-[#1a1208]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Política de Cookies
        </h1>

        <div className="prose max-w-none space-y-6 text-[#5c4a2a]">
          <section>
            <h2 className="text-xl font-semibold mb-3">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo 
              cuando los visitas. Sirven para recordar tus preferencias, mejorar tu experiencia y proporcionar 
              información a los propietarios del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">¿Qué tipos de cookies utilizamos?</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Cookies necesarias</h3>
                <p>Esenciales para el funcionamiento básico del sitio. Incluyen cookies de sesión y seguridad.</p>
                <p className="text-sm text-[#9c8060]">Estado: <span className="text-green-600 font-semibold">Siempre activas</span></p>
              </div>

              <div>
                <h3 className="font-semibold">Cookies analíticas</h3>
                <p>Nos permiten contar las visitas y fuentes de tráfico para medir y mejorar el rendimiento.</p>
                <p className="text-sm text-[#9c8060]">Estado: {consent.analytics ? "✅ Aceptadas" : "❌ Rechazadas"}</p>
              </div>

              <div>
                <h3 className="font-semibold">Cookies de marketing</h3>
                <p>Utilizadas para mostrarte anuncios relevantes y medir la efectividad de campañas.</p>
                <p className="text-sm text-[#9c8060]">Estado: {consent.marketing ? "✅ Aceptadas" : "❌ Rechazadas"}</p>
              </div>

              <div>
                <h3 className="font-semibold">Cookies funcionales</h3>
                <p>Permiten recordar tus preferencias y personalizar tu experiencia en el sitio.</p>
                <p className="text-sm text-[#9c8060]">Estado: {consent.functional ? "✅ Aceptadas" : "❌ Rechazadas"}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">¿Cómo gestionar las cookies?</h2>
            <p>
              Puedes cambiar tus preferencias en cualquier momento haciendo clic en el botón de abajo. 
              También puedes configurar tu navegador para bloquear o eliminar cookies.
            </p>
            
            <button
              onClick={revokeConsent}
              className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all border-none cursor-pointer"
              style={{ background: "rgba(150, 95, 33, 1)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110, 68, 18, 1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 1)")}
            >
              Cambiar preferencias de cookies
            </button>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Actualizaciones</h2>
            <p>
              Esta política puede actualizarse periódicamente. Te recomendamos revisarla regularmente.
              Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}