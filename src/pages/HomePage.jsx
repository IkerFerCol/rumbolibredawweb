import { useState } from "react";
import fondo from "../assets/fondoavionloginregister.jpg";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

// ─── Iconos ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PlaneIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WifiIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const PoolIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M6 14h12M8 18h8M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
  </svg>
);

const BreakfastIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─── Destinos destacados ──────────────────────────────────────────────────────
const destinations = [
  { id: 1, name: "París", country: "Francia", price: 299, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", rating: 4.8 },
  { id: 2, name: "Roma", country: "Italia", price: 249, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400", rating: 4.7 },
  { id: 3, name: "Londres", country: "Reino Unido", price: 279, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", rating: 4.6 },
  { id: 4, name: "Nueva York", country: "EE.UU.", price: 399, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400", rating: 4.9 },
  { id: 5, name: "Tokio", country: "Japón", price: 449, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", rating: 4.9 },
  { id: 6, name: "Barcelona", country: "España", price: 199, image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400", rating: 4.7 },
];

// ─── Categorías de viaje ──────────────────────────────────────────────────────
const categories = [
  { id: 1, name: "Playas", icon: "🏖️", color: "#e3f2fd" },
  { id: 2, name: "Montañas", icon: "🏔️", color: "#e8f5e9" },
  { id: 3, name: "Ciudades", icon: "🌆", color: "#fff3e0" },
  { id: 4, name: "Aventura", icon: "🧗", color: "#fce4ec" },
  { id: 5, name: "Lujo", icon: "✨", color: "#f3e5f5" },
  { id: 6, name: "Familia", icon: "👨‍👩‍👧‍👦", color: "#e0f7fa" },
];

// ─── Testimonios ──────────────────────────────────────────────────────────────
const testimonials = [
  { id: 1, name: "María García", text: "Excelente plataforma, encontré vuelos increíbles a muy buen precio.", rating: 5, image: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 2, name: "Carlos López", text: "La atención al cliente es fantástica, me ayudaron en todo momento.", rating: 5, image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, name: "Ana Martínez", text: "Mi viaje a París fue inolvidable gracias a RumboLibre.", rating: 5, image: "https://randomuser.me/api/portraits/women/3.jpg" },
];

// ─── Card de destino ──────────────────────────────────────────────────────────
const DestinationCard = ({ destination }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="rounded-xl overflow-hidden cursor-pointer bg-white"
      style={{
        boxShadow: isHovered ? "0 12px 28px rgba(150,95,33,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
        />
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium"
          style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
        >
          ⭐ {destination.rating}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-base" style={{ color: "rgba(26, 18, 8, 1)" }}>
              {destination.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {destination.country}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color: "rgba(150, 95, 33, 1)" }}>
              ${destination.price}
            </p>
            <p className="text-xs" style={{ color: "rgba(156, 128, 96, 1)" }}>por noche</p>
          </div>
        </div>
        <button
          className="w-full mt-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: "rgba(150, 95, 33, 1)",
            color: "white",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110, 68, 18, 1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 1)")}
        >
          Ver oferta
        </button>
      </div>
    </motion.div>
  );
};

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-12">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)" }} />
      
      <div className="relative z-10 px-6 py-16 md:py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: "white" }}
        >
          Encuentra tu próximo destino
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg mb-8"
          style={{ color: "rgba(255,249,242,0.9)" }}
        >
          Vuelos y hoteles al mejor precio con RumboLibre
        </motion.p>

        {/* Barra de búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl p-4 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <LocationIcon />
              <input
                type="text"
                placeholder="¿Dónde vas?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-8 pr-3 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: "1px solid rgba(150,95,33,0.2)",
                  background: "#faf7f2",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(150,95,33,1)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(150,95,33,0.2)")}
              />
            </div>
            <div className="relative">
              <CalendarIcon />
              <input
                type="date"
                placeholder="Check-in"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-8 pr-3 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: "1px solid rgba(150,95,33,0.2)",
                  background: "#faf7f2",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(150,95,33,1)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(150,95,33,0.2)")}
              />
            </div>
            <div className="relative">
              <CalendarIcon />
              <input
                type="date"
                placeholder="Check-out"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-8 pr-3 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: "1px solid rgba(150,95,33,0.2)",
                  background: "#faf7f2",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(150,95,33,1)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(150,95,33,0.2)")}
              />
            </div>
            <div className="relative">
              <UserIcon />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-3 rounded-lg text-sm outline-none appearance-none cursor-pointer transition-all"
                style={{
                  border: "1px solid rgba(150,95,33,0.2)",
                  background: "#faf7f2",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(150,95,33,1)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(150,95,33,0.2)")}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? "huésped" : "huéspedes"}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="w-full mt-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: "rgba(150,95,33,1)", color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110,68,18,1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150,95,33,1)")}
          >
            <SearchIcon />
            Buscar vuelos y hoteles
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Componente principal: HomePage ───────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen flex flex-col relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Fondo fijo */}
        <div className="fixed inset-0 -z-10" style={{ background: "#fff9f2" }} />
        
        {/* Contenido principal */}
        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <HeroSection />

            {/* Categorías */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26,18,8,1)" }}>
                Explora por categoría
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-xl p-5 text-center cursor-pointer transition-all"
                    style={{ background: category.color }}
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <p className="font-medium text-sm" style={{ color: "rgba(26,18,8,1)" }}>{category.name}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Destinos destacados */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26,18,8,1)" }}>
                  Destinos destacados
                </h2>
                <button className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "rgba(150,95,33,1)" }}>
                  Ver todos →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <DestinationCard destination={destination} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Ofertas especiales */}
            <section className="mb-12">
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #965f21 0%, #6e4412 100%)" }}
              >
                <div className="absolute top-0 right-0 opacity-10">
                  <PlaneIcon className="w-48 h-48" />
                </div>
                <div className="relative z-10 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "white" }}>
                    Ofertas flash
                  </h2>
                  <p className="text-white/80 mb-6">Hasta 40% de descuento en vuelos seleccionados</p>
                  <button
                    className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 bg-white"
                    style={{ color: "rgba(150,95,33,1)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Ver ofertas
                  </button>
                </div>
              </div>
            </section>

            {/* Testimonios */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26,18,8,1)" }}>
                Lo que dicen nuestros viajeros
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="rounded-xl p-6 text-center"
                    style={{ background: "white", boxShadow: "0 2px 12px rgba(150,95,33,0.08)" }}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                    />
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} style={{ color: "#ffc107" }} />
                      ))}
                    </div>
                    <p className="text-sm mb-3" style={{ color: "rgba(92,74,42,1)" }}>"{testimonial.text}"</p>
                    <p className="font-semibold text-sm" style={{ color: "rgba(150,95,33,1)" }}>{testimonial.name}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Ventajas */}
            <section className="mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: "✈️", title: "Vuelos baratos", desc: "Compara y ahorra" },
                  { icon: "🏨", title: "Hoteles exclusivos", desc: "Las mejores ofertas" },
                  { icon: "🛡️", title: "Seguro incluido", desc: "Viaja tranquilo" },
                  { icon: "🎫", title: "Sin comisiones", desc: "Precios transparentes" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "rgba(26,18,8,1)" }}>{item.title}</h3>
                    <p className="text-xs" style={{ color: "rgba(156,128,96,1)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}