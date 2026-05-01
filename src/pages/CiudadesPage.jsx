import { useState } from "react";
import Navbar from "../components/Header";
import Footer from "../components/Footer";

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .opacity-0 { opacity: 0; }
`;

const CITIES = [
  {
    id: 1, name: "París", country: "Francia", code: "CDG", emoji: "🗼",
    bg: "linear-gradient(135deg, #e8d5b0 0%, #c9a96e 100%)",
    tags: ["Arte", "Gastronomía", "Moda"],
    fact: "París tiene más de 1.800 panaderías y consume unos 6 millones de baguettes al día.",
    pop: "2,16 M", museums: 130, airports: 3,
    temp: "12°C", currency: "Euro",
  },
  {
    id: 2, name: "Londres", country: "Reino Unido", code: "LHR", emoji: "🎡",
    bg: "linear-gradient(135deg, #d4c5a9 0%, #a08060 100%)",
    tags: ["Historia", "Cultura", "Negocios"],
    fact: "El metro de Londres, inaugurado en 1863, es el más antiguo del mundo en funcionamiento.",
    pop: "8,98 M", museums: 240, airports: 6,
    temp: "10°C", currency: "Libra",
  },
  {
    id: 3, name: "Roma", country: "Italia", code: "FCO", emoji: "🏛",
    bg: "linear-gradient(135deg, #e2c9a0 0%, #b8935a 100%)",
    tags: ["Historia", "Arqueología", "Gastronomía"],
    fact: "Roma tiene más de 2.500 fuentes, más que cualquier otra ciudad del mundo.",
    pop: "2,87 M", museums: 80, airports: 2,
    temp: "15°C", currency: "Euro",
  },
  {
    id: 4, name: "Lisboa", country: "Portugal", code: "LIS", emoji: "🌊",
    bg: "linear-gradient(135deg, #ccd5ae 0%, #8fa06a 100%)",
    tags: ["Cultura", "Fado", "Gastronomía"],
    fact: "Lisboa es una de las ciudades más antiguas de Europa occidental, más antigua que Roma.",
    pop: "547 K", museums: 37, airports: 1,
    temp: "17°C", currency: "Euro",
  },
  {
    id: 5, name: "Berlín", country: "Alemania", code: "TXL", emoji: "🏙",
    bg: "linear-gradient(135deg, #b5c4b1 0%, #7a9e7e 100%)",
    tags: ["Arte", "Música", "Historia"],
    fact: "Berlín tiene más de 1.700 puentes, más que Venecia con sus 400.",
    pop: "3,64 M", museums: 170, airports: 1,
    temp: "8°C", currency: "Euro",
  },
  {
    id: 6, name: "Ámsterdam", country: "Países Bajos", code: "AMS", emoji: "🌷",
    bg: "linear-gradient(135deg, #d4b896 0%, #a07850 100%)",
    tags: ["Canales", "Cultura", "Diseño"],
    fact: "Ámsterdam tiene más bicicletas (880.000) que habitantes (821.000).",
    pop: "821 K", museums: 75, airports: 1,
    temp: "9°C", currency: "Euro",
  },
  {
    id: 7, name: "Atenas", country: "Grecia", code: "ATH", emoji: "⛩",
    bg: "linear-gradient(135deg, #e8d5a3 0%, #c4a256 100%)",
    tags: ["Historia", "Arqueología", "Mar"],
    fact: "La Acrópolis ha sido habitada continuamente durante más de 5.000 años.",
    pop: "664 K", museums: 60, airports: 1,
    temp: "18°C", currency: "Euro",
  },
  {
    id: 8, name: "Dublín", country: "Irlanda", code: "DUB", emoji: "🍀",
    bg: "linear-gradient(135deg, #c8d8b0 0%, #7a9e5a 100%)",
    tags: ["Literatura", "Pubs", "Naturaleza"],
    fact: "La Biblioteca del Trinity College, fundada en 1592, alberga el Book of Kells, uno de los manuscritos medievales más bellos del mundo.",
    pop: "553 K", museums: 25, airports: 1,
    temp: "11°C", currency: "Euro",
  },
  {
    id: 9, name: "Copenhague", country: "Dinamarca", code: "CPH", emoji: "🧜",
    bg: "linear-gradient(135deg, #b8c8d8 0%, #6890a8 100%)",
    tags: ["Diseño", "Sostenible", "Gastronomía"],
    fact: "Copenhague aspira a ser la primera capital neutra en carbono del mundo.",
    pop: "794 K", museums: 100, airports: 1,
    temp: "7°C", currency: "Corona",
  },
  {
    id: 10, name: "Viena", country: "Austria", code: "VIE", emoji: "🎻",
    bg: "linear-gradient(135deg, #e0cdb8 0%, #b89878 100%)",
    tags: ["Música", "Arte", "Arquitectura"],
    fact: "Viena fue durante siglos la capital musical del mundo, hogar de Mozart, Beethoven y Schubert.",
    pop: "1,89 M", museums: 100, airports: 1,
    temp: "10°C", currency: "Euro",
  },
  {
    id: 11, name: "Praga", country: "República Checa", code: "PRG", emoji: "🏰",
    bg: "linear-gradient(135deg, #d8c8b0 0%, #a08860 100%)",
    tags: ["Historia", "Arquitectura", "Cerveza"],
    fact: "Praga conserva uno de los centros históricos medievales mejor preservados de Europa.",
    pop: "1,30 M", museums: 60, airports: 1,
    temp: "9°C", currency: "Corona",
  },
  {
    id: 12, name: "Budapest", country: "Hungría", code: "BUD", emoji: "🌉",
    bg: "linear-gradient(135deg, #e8d0a8 0%, #c09858 100%)",
    tags: ["Termas", "Historia", "Gastronomía"],
    fact: "Budapest tiene más de 100 fuentes termales naturales y es conocida como la ciudad de los balnearios.",
    pop: "1,75 M", museums: 80, airports: 1,
    temp: "11°C", currency: "Forinto",
  },
];

function CityCard({ city, delay }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`animate-fadeInUp opacity-0 delay-${delay}`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "rgba(255, 249, 242, 1)",
          border: "0.5px solid rgba(150, 95, 33, 0.18)",
          boxShadow: "0 2px 16px rgba(150, 95, 33, 0.07)",
          minHeight: "340px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(150, 95, 33, 0.18)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 16px rgba(150, 95, 33, 0.07)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Header con gradiente */}
        <div
          className="h-36 flex items-center justify-center relative"
          style={{ background: city.bg }}
        >
          <span className="text-6xl drop-shadow-md">{city.emoji}</span>
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: "rgba(0,0,0,0.35)",
              color: "rgba(255, 249, 242, 1)",
              backdropFilter: "blur(6px)",
            }}
          >
            {city.code}
          </div>
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: "rgba(0,0,0,0.35)",
              color: "rgba(255, 249, 242, 1)",
              backdropFilter: "blur(6px)",
            }}
          >
            {city.temp}
          </div>
        </div>

        {/* Body */}
        <div className="p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3
                className="text-[18px] font-semibold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "rgba(26, 18, 8, 1)",
                }}
              >
                {city.name}
              </h3>
              <p className="text-[12px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
                {city.country}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
                Divisa
              </p>
              <p className="text-[12px] font-medium" style={{ color: "rgba(92, 74, 42, 1)" }}>
                {city.currency}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
            {city.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  background: "rgba(150, 95, 33, 0.1)",
                  color: "rgba(110, 68, 18, 1)",
                  border: "0.5px solid rgba(150, 95, 33, 0.2)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Curiosidad */}
          <p
            className="text-[12px] leading-relaxed mb-4"
            style={{
              color: "rgba(92, 74, 42, 0.85)",
              borderLeft: "2px solid rgba(150, 95, 33, 0.35)",
              paddingLeft: "10px",
            }}
          >
            {city.fact}
          </p>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-2 pt-3"
            style={{ borderTop: "0.5px solid rgba(150, 95, 33, 0.12)" }}
          >
            {[
              { label: "Habitantes", val: city.pop },
              { label: "Museos",     val: city.museums },
              { label: "Aeropuertos",val: city.airports },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-[15px] font-bold"
                  style={{ color: "rgba(150, 95, 33, 1)" }}
                >
                  {s.val}
                </div>
                <div className="text-[10px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CiudadesPage() {
  const [search, setSearch] = useState("");

  const filtered = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

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
          className="py-14 px-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(150,95,33,0.12) 0%, rgba(200,160,100,0.08) 100%)",
            borderBottom: "0.5px solid rgba(150, 95, 33, 0.12)",
          }}
        >
          <h1
            className="text-[34px] font-semibold mb-2 animate-fadeInUp opacity-0"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
          >
            Destinos del mundo
          </h1>
          <p
            className="text-[15px] font-light mb-8 animate-fadeInUp delay-100 opacity-0"
            style={{ color: "rgba(156, 128, 96, 1)" }}
          >
            Descubre datos, curiosidades y vuelos hacia cada destino
          </p>

          {/* Buscador */}
          <div className="flex justify-center animate-fadeInUp delay-200 opacity-0">
            <div className="relative w-full max-w-md">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-lg"
                style={{ color: "rgba(150, 95, 33, 0.5)" }}
              >
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ciudad, país o categoría..."
                className="w-full h-12 pl-11 pr-4 rounded-xl text-[14px] outline-none transition-all duration-200"
                style={{
                  background: "rgba(255, 249, 242, 1)",
                  border: "0.5px solid rgba(150, 95, 33, 0.3)",
                  color: "rgba(26, 18, 8, 1)",
                  boxShadow: "0 2px 12px rgba(150, 95, 33, 0.08)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(150, 95, 33, 1)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(150, 95, 33, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(150, 95, 33, 0.3)";
                  e.target.style.boxShadow = "0 2px 12px rgba(150, 95, 33, 0.08)";
                }}
              />
            </div>
          </div>

          {/* Contador */}
          <p
            className="text-[12px] mt-3 animate-fadeInUp delay-200 opacity-0"
            style={{ color: "rgba(156, 128, 96, 1)" }}
          >
            {filtered.length} destino{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Grid */}
        <div className="flex-grow px-6 py-10 max-w-7xl mx-auto w-full">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🌍</span>
              <p
                className="text-[16px] font-medium mb-1"
                style={{ color: "rgba(92, 74, 42, 1)" }}
              >
                No encontramos ese destino
              </p>
              <p className="text-[13px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
                Prueba con otro nombre o categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((city, i) => (
                <CityCard
                  key={city.id}
                  city={city}
                  delay={((i % 4) + 1) * 100}
                />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}