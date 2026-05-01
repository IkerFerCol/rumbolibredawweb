import React, { useState, useEffect, useMemo } from "react";
import fondo from "../assets/fondoavionloginregister.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── Mapa estático de aeropuertos (fallback si la API falla) ─────────────────
const AEROPUERTOS_ESTATICOS = [
  { id: 1, nombre: "Adolfo Suárez Madrid-Barajas", codigoIata: "MAD", ciudad: "Madrid", pais: "España" },
  { id: 2, nombre: "El Prat", codigoIata: "BCN", ciudad: "Barcelona", pais: "España" },
  { id: 3, nombre: "Palma de Mallorca", codigoIata: "PMI", ciudad: "Palma de Mallorca", pais: "España" },
  { id: 4, nombre: "Málaga-Costa del Sol", codigoIata: "AGP", ciudad: "Málaga", pais: "España" },
  { id: 5, nombre: "Valencia", codigoIata: "VLC", ciudad: "Valencia", pais: "España" },
  { id: 6, nombre: "Sevilla", codigoIata: "SVQ", ciudad: "Sevilla", pais: "España" },
  { id: 7, nombre: "Bilbao", codigoIata: "BIO", ciudad: "Bilbao", pais: "España" },
  { id: 8, nombre: "Alicante-Elche", codigoIata: "ALC", ciudad: "Alicante", pais: "España" },
];

// ─── Iconos ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const PlaneIcon = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const SwapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// ─── Select de aeropuerto ────────────────────────────────────────────────────
const AirportSelect = ({ placeholder, value, onChange, aeropuertos, disabled }) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-[rgba(150,95,33,0.7)] dark:text-gray-400">
        <LocationIcon />
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-9 pr-3 py-3 text-sm rounded-lg outline-none border border-[rgba(150,95,33,0.2)] dark:border-gray-600 bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 transition-colors duration-200 cursor-pointer appearance-none"
      >
        <option value="">{placeholder}</option>
        {aeropuertos.map((a) => (
          <option key={a.id} value={a.codigoIata}>
            {a.codigoIata} – {a.ciudad}
          </option>
        ))}
      </select>
    </div>
  );
};

// ─── Card de vuelo ───────────────────────────────────────────────────────────
const VueloCard = ({ vuelo, onSelect, aeropuertoMap }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "Fecha no disponible";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatHora = (fechaStr) => {
    if (!fechaStr) return "--:--";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const calcularDuracion = (salida, llegada) => {
    if (!salida || !llegada) return "N/A";
    const diff = new Date(llegada) - new Date(salida);
    const horas = Math.floor(diff / 3600000);
    const minutos = Math.floor((diff % 3600000) / 60000);
    return `${horas}h ${minutos}min`;
  };

  const getCiudad = () => {
    const origenKey = vuelo.origenId || vuelo.origen;
    const destinoKey = vuelo.destinoId || vuelo.destino;

    const origen = Object.values(aeropuertoMap).find(
      a => a.id === origenKey || a.codigoIata === origenKey
    );

    const destino = Object.values(aeropuertoMap).find(
      a => a.id === destinoKey || a.codigoIata === destinoKey
    );

    return {
      origenCiudad: origen?.ciudad || origenKey || "Origen",
      destinoCiudad: destino?.ciudad || destinoKey || "Destino",
      origenCodigo: origen?.codigoIata || origenKey || "???",
      destinoCodigo: destino?.codigoIata || destinoKey || "???"
    };
  };

  const { origenCiudad, destinoCiudad, origenCodigo, destinoCodigo } = getCiudad();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="rounded-xl overflow-hidden cursor-pointer bg-white dark:bg-gray-800 transition-colors duration-300"
      style={{ boxShadow: isHovered ? "0 12px 28px rgba(150,95,33,0.15)" : "0 2px 8px rgba(0,0,0,0.08)", transition: "box-shadow 0.3s ease" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-base text-[#1a1208] dark:text-gray-100">
              {vuelo.aerolineaNombre || "Aerolínea"}
            </h3>
            <p className="text-xs text-[#9c8060] dark:text-gray-400">{vuelo.numeroVuelo || "Vuelo"}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#965f21] dark:text-[#b8753b]">${vuelo.precio?.toFixed(2) || "0"}</p>
            <p className="text-xs text-[#9c8060] dark:text-gray-400">por persona</p>
          </div>
        </div>

        <div className="text-center mb-3">
          <p className="text-sm font-medium text-[#1a1208] dark:text-gray-100">
            {origenCiudad} → {destinoCiudad}
          </p>
          <p className="text-xs text-[#9c8060] dark:text-gray-400">
            {origenCodigo} → {destinoCodigo}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-center flex-1">
            <p className="font-bold text-lg text-[#1a1208] dark:text-gray-100">{formatHora(vuelo.fechaSalida)}</p>
          </div>
          <div className="flex-1 px-2">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 dark:border-gray-600 w-full absolute"></div>
              <span className="relative bg-white dark:bg-gray-800 px-1">
                <PlaneIcon className="w-4 h-4" style={{ color: "rgba(150,95,33,0.6)" }} />
              </span>
            </div>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-1">
              {calcularDuracion(vuelo.fechaSalida, vuelo.fechaLlegada)}
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="font-bold text-lg text-[#1a1208] dark:text-gray-100">{formatHora(vuelo.fechaLlegada)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs mb-3">
          <span className="text-[#9c8060] dark:text-gray-400">📅 {formatFecha(vuelo.fechaSalida)}</span>
          <span style={{ color: vuelo.plazasDisponibles > 10 ? "#4caf50" : "#ff9800", fontWeight: 500 }}>
            {vuelo.plazasDisponibles} plazas
          </span>
        </div>

        <button
          onClick={() => onSelect(vuelo)}
          className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-[#965f21] hover:bg-[#6e4412] dark:bg-[#b8753b] dark:hover:bg-[#965f21] text-white border-none cursor-pointer"
        >
          Seleccionar vuelo
        </button>
      </div>
    </motion.div>
  );
};

// ─── Hero / Buscador ─────────────────────────────────────────────────────────
const HeroSection = ({ onSearch, aeropuertos, cargandoAeropuertos }) => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [swapping, setSwapping] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const intercambiar = () => {
    setSwapping(true);
    setTimeout(() => setSwapping(false), 400);
    const tmp = origen;
    setOrigen(destino);
    setDestino(tmp);
  };

  const handleSearch = () => {
    onSearch({ origen, destino, fecha });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-12">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${fondo})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)" }} />

      <div className="relative z-10 px-6 py-16 md:py-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Encuentra tu próximo vuelo
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg mb-8 text-[rgba(255,249,242,0.9)]">
          Los mejores precios en vuelos con RumboLibre
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <AirportSelect placeholder="Origen" value={origen}
                onChange={(val) => setOrigen(val)}
                aeropuertos={aeropuertos} disabled={cargandoAeropuertos} />
            </div>
            <div className="flex justify-center items-center">
              <button onClick={intercambiar} title="Intercambiar"
                className="bg-[rgba(150,95,33,0.1)] dark:bg-gray-700 border-none cursor-pointer p-2 rounded-full transition-all duration-200"
                style={{ transform: swapping ? "rotate(180deg)" : "rotate(0deg)" }}>
                <SwapIcon />
              </button>
            </div>
            <div>
              <AirportSelect placeholder="Destino" value={destino}
                onChange={(val) => setDestino(val)}
                aeropuertos={aeropuertos} disabled={cargandoAeropuertos} />
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 z-10 pointer-events-none text-[rgba(150,95,33,0.7)] dark:text-gray-400">
                <CalendarIcon />
              </span>
              <input type="date" value={fecha} min={today}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-sm rounded-lg outline-none border border-[rgba(150,95,33,0.2)] dark:border-gray-600 bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 transition-colors duration-200" />
            </div>
          </div>

          <button onClick={handleSearch}
            className="w-full mt-3 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-[#965f21] hover:bg-[#6e4412] dark:bg-[#b8753b] dark:hover:bg-[#965f21] text-white border-none cursor-pointer transition-all duration-200">
            <SearchIcon /> Buscar vuelos
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [aeropuertos, setAeropuertos] = useState(AEROPUERTOS_ESTATICOS);
  const [cargandoAeropuertos, setCargandoAeropuertos] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null);
  const [error, setError] = useState("");

  const aeropuertoMap = useMemo(() => {
    const map = {};
    aeropuertos.forEach((a) => { map[a.id] = a; });
    return map;
  }, [aeropuertos]);

  useEffect(() => {
    cargarAeropuertos();
  }, []);

  const cargarAeropuertos = async () => {
    setCargandoAeropuertos(true);
    try {
      const res = await axios.get("http://localhost:8080/api/aeropuertos");
      if (res.data && res.data.length > 0) setAeropuertos(res.data);
    } catch (err) {
      console.warn("Usando aeropuertos estáticos (API no disponible):", err.message);
    } finally {
      setCargandoAeropuertos(false);
    }
  };

  const buscarVuelos = async ({ origen, destino, fecha }) => {
    setBuscando(true);
    setError("");
    setResultadosBusqueda(null);

    try {
      const params = new URLSearchParams();
      if (origen) params.append("origen", origen);
      if (destino) params.append("destino", destino);
      if (fecha) params.append("fecha", fecha);
      params.append("pasajeros", "1");

      const url = `http://localhost:8080/api/vuelos/disponibles?${params.toString()}`;
      const res = await axios.get(url);
      setResultadosBusqueda(res.data);

      if (res.data.length === 0) {
        if (origen || destino || fecha) {
          let mensaje = "No hay vuelos disponibles";
          if (origen && destino && fecha) {
            mensaje = `No hay vuelos disponibles de ${origen} a ${destino} el ${fecha}`;
          } else if (origen && destino) {
            mensaje = `No hay vuelos disponibles de ${origen} a ${destino}`;
          } else if (origen) {
            mensaje = `No hay vuelos disponibles desde ${origen}`;
          } else if (destino) {
            mensaje = `No hay vuelos disponibles hacia ${destino}`;
          } else if (fecha) {
            mensaje = `No hay vuelos disponibles el ${fecha}`;
          }
          setError(mensaje);
        } else {
          setError("No hay vuelos disponibles en este momento.");
        }
      }
    } catch (err) {
      console.error("Error buscando vuelos:", err);
      setError("Error al buscar vuelos. Comprueba tu conexión e inténtalo de nuevo.");
      setResultadosBusqueda([]);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarVuelo = (vuelo) => {
    const origenId = Number(vuelo.origenId || vuelo.origen);
    const destinoId = Number(vuelo.destinoId || vuelo.destino);
    const vueloEnriquecido = {
      ...vuelo,
      origenNombre: aeropuertoMap[origenId]?.codigoIata || vuelo.origen,
      destinoNombre: aeropuertoMap[destinoId]?.codigoIata || vuelo.destino,
      origenCiudad: aeropuertoMap[origenId]?.ciudad || "",
      destinoCiudad: aeropuertoMap[destinoId]?.ciudad || "",
    };
    localStorage.setItem("vueloSeleccionado", JSON.stringify(vueloEnriquecido));
    navigate("/reserva");
  };

  const limpiarBusqueda = () => { setResultadosBusqueda(null); setError(""); };
  const esBusqueda = resultadosBusqueda !== null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div className="min-h-screen flex flex-col relative bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Header />

        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <HeroSection onSearch={buscarVuelos} aeropuertos={aeropuertos} cargandoAeropuertos={cargandoAeropuertos} />

            <AnimatePresence>
              {buscando && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[rgba(150,95,33,0.2)] dark:border-gray-600 border-t-[#965f21] dark:border-t-[#b8753b]" />
                  <p className="mt-3 text-[#9c8060] dark:text-gray-400">Buscando vuelos…</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && !buscando && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-center py-6 px-4 rounded-xl mb-6 bg-[#fff5f5] dark:bg-red-900/20 border border-[#fecaca] dark:border-red-800">
                  <p className="text-[#dc2626] dark:text-red-400 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!buscando && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#1a1208] dark:text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {esBusqueda ? "Resultados de búsqueda" : "Vuelos disponibles"}
                  </h2>
                  {esBusqueda && (
                    <button onClick={limpiarBusqueda} className="text-sm font-medium text-[#965f21] dark:text-[#b8753b] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer">
                      ← Mostrar todos
                    </button>
                  )}
                </div>

                {resultadosBusqueda && resultadosBusqueda.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl transition-colors duration-300">
                    <PlaneIcon className="w-16 h-16 mx-auto mb-4 opacity-20 dark:opacity-10" />
                    <p className="text-[#9c8060] dark:text-gray-400">No hay vuelos disponibles en este momento.</p>
                  </div>
                ) : resultadosBusqueda && resultadosBusqueda.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resultadosBusqueda.map((vuelo, index) => (
                      <motion.div key={vuelo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}>
                        <VueloCard vuelo={vuelo} onSelect={seleccionarVuelo} aeropuertoMap={aeropuertoMap} />
                      </motion.div>
                    ))}
                  </div>
                ) : null}
              </>
            )}

            <section className="mt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: "✈️", title: "Vuelos baratos", desc: "Compara y ahorra" },
                  { icon: "🛡️", title: "Pago seguro", desc: "Transacciones protegidas" },
                  { icon: "🎫", title: "Sin comisiones", desc: "Precios transparentes" },
                  { icon: "💳", title: "Múltiples métodos", desc: "Paga como quieras" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }} className="text-center p-4">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-sm mb-1 text-[#1a1208] dark:text-gray-100">{item.title}</h3>
                    <p className="text-xs text-[#9c8060] dark:text-gray-400">{item.desc}</p>
                  </motion.div>
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