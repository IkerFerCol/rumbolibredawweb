import React, { useState, useEffect, useMemo, useCallback } from "react";
import fondo from "../assets/fondoavionloginregister.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useSettings } from "../context/SettingsContext";

const AEROPUERTOS_ESTATICOS = [
  { id: 1, nombre: "Adolfo Suárez Madrid-Barajas", codigoIata: "MAD", ciudad: "Madrid", pais: "España" },
  { id: 2, nombre: "El Prat", codigoIata: "BCN", ciudad: "Barcelona", pais: "España" },
  { id: 3, nombre: "Palma de Mallorca", codigoIata: "PMI", ciudad: "Palma", pais: "España" },
  { id: 4, nombre: "Málaga-Costa del Sol", codigoIata: "AGP", ciudad: "Málaga", pais: "España" },
  { id: 5, nombre: "Valencia", codigoIata: "VLC", ciudad: "Valencia", pais: "España" },
  { id: 6, nombre: "Sevilla", codigoIata: "SVQ", ciudad: "Sevilla", pais: "España" },
  { id: 7, nombre: "Bilbao", codigoIata: "BIO", ciudad: "Bilbao", pais: "España" },
  { id: 8, nombre: "Alicante-Elche", codigoIata: "ALC", ciudad: "Alicante", pais: "España" },
];

const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const PlaneIcon = ({ className = "w-6 h-6", style }) => <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>;
const LocationIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SwapIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;

const SpinnerLight = () => (
  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(255,249,242,1)" }}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);
const SpinnerDark = () => (
  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(150,95,33,1)" }}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const inputStyle = {
  background: "rgba(250,247,242,1)",
  border: "0.5px solid rgba(150,95,33,0.25)",
  color: "rgba(26,18,8,1)",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
};

function Campo({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(92,74,42,1)" }}>
        {label}{required && <span style={{ color: "rgba(180,50,50,1)" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", maxLength, ...rest }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
      className="h-10 px-3 rounded-xl text-[13px] w-full transition-all" style={inputStyle}
      onFocus={e => { e.target.style.borderColor = "rgba(150,95,33,1)"; e.target.style.boxShadow = "0 0 0 3px rgba(150,95,33,0.1)"; }}
      onBlur={e => { e.target.style.borderColor = "rgba(150,95,33,0.25)"; e.target.style.boxShadow = "none"; }}
      {...rest}
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange}
      className="h-10 px-3 rounded-xl text-[13px] w-full cursor-pointer transition-all" style={inputStyle}
      onFocus={e => (e.target.style.borderColor = "rgba(150,95,33,1)")}
      onBlur={e => (e.target.style.borderColor = "rgba(150,95,33,0.25)")}>
      {children}
    </select>
  );
}

const AirportSelect = ({ placeholder, value, onChange, aeropuertos, disabled }) => (
  <div style={{ position: "relative", width: "100%" }}>
    <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" style={{ color: "rgba(150,95,33,0.7)" }}>
      <LocationIcon />
    </span>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      className="w-full pl-9 pr-3 py-3 text-sm rounded-lg outline-none border bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 transition-colors duration-200 cursor-pointer appearance-none border-[rgba(150,95,33,0.2)] dark:border-gray-600">
      <option value="">{placeholder}</option>
      {aeropuertos.map(a => <option key={a.id} value={a.codigoIata}>{a.codigoIata} – {a.ciudad}</option>)}
    </select>
  </div>
);

const VueloCard = ({ vuelo, onSelect, aeropuertoMap }) => {
  const [hovered, setHovered] = useState(false);
  const { formatPrice, t } = useSettings();

  const fmt = s => s ? new Date(s).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "--:--";
  const fmtFecha = s => s ? new Date(s).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
  const dur = (s, l) => { if (!s || !l) return "N/A"; const d = new Date(l) - new Date(s); return `${Math.floor(d / 3600000)}h ${Math.floor((d % 3600000) / 60000)}min`; };

  const resolve = key => { const num = Number(key); return aeropuertoMap[num] || Object.values(aeropuertoMap).find(a => a.codigoIata === key); };
  const orig = resolve(vuelo.origenId || vuelo.origen);
  const dest = resolve(vuelo.destinoId || vuelo.destino);

  return (
    <motion.div whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="rounded-xl overflow-hidden cursor-pointer bg-white dark:bg-gray-800 transition-colors duration-300"
      style={{ boxShadow: hovered ? "0 12px 28px rgba(150,95,33,0.18)" : "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-bold text-[15px] text-[#1a1208] dark:text-gray-100">{vuelo.aerolineaNombre || "Aerolínea"}</p>
            <p className="text-[11px] text-[#9c8060]">{vuelo.numeroVuelo}</p>
          </div>
          <div className="text-right">
            <p className="text-[20px] font-bold" style={{ color: "rgba(150,95,33,1)" }}>{formatPrice(vuelo.precio)}</p>
            <p className="text-[11px] text-[#9c8060]">{t.home_per_person}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="text-center flex-1">
            <p className="font-bold text-[18px] text-[#1a1208] dark:text-gray-100">{fmt(vuelo.fechaSalida)}</p>
            <p className="text-[11px] text-[#9c8060]">{orig?.codigoIata || vuelo.origen || "—"}</p>
          </div>
          <div className="flex-1 px-1 text-center">
            <div className="relative flex items-center justify-center mb-1">
              <div className="border-t border-gray-200 dark:border-gray-600 w-full absolute" />
              <span className="relative bg-white dark:bg-gray-800 px-1"><PlaneIcon className="w-3.5 h-3.5" style={{ color: "rgba(150,95,33,0.5)" }} /></span>
            </div>
            <p className="text-[10px] text-[#9c8060]">{dur(vuelo.fechaSalida, vuelo.fechaLlegada)}</p>
          </div>
          <div className="text-center flex-1">
            <p className="font-bold text-[18px] text-[#1a1208] dark:text-gray-100">{fmt(vuelo.fechaLlegada)}</p>
            <p className="text-[11px] text-[#9c8060]">{dest?.codigoIata || vuelo.destino || "—"}</p>
          </div>
        </div>
        <p className="text-[12px] text-center text-[#9c8060] mb-1">{orig?.ciudad || ""} → {dest?.ciudad || ""}</p>
        <div className="flex justify-between text-[11px] mb-4">
          <span className="text-[#9c8060]">📅 {fmtFecha(vuelo.fechaSalida)}</span>
          <span style={{ color: vuelo.plazasDisponibles > 10 ? "#4caf50" : "#ff9800", fontWeight: 600 }}>
            {vuelo.plazasDisponibles} {t.home_seats}
          </span>
        </div>
        <button onClick={() => onSelect(vuelo)}
          className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 border-none cursor-pointer text-white"
          style={{ background: "rgba(150,95,33,1)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(110,68,18,1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(150,95,33,1)")}>
          {t.home_select}
        </button>
      </div>
    </motion.div>
  );
};

const HeroSection = ({ onSearch, aeropuertos, cargandoAeropuertos }) => {
  const { t } = useSettings();
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [swapping, setSwapping] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const swap = () => {
    setSwapping(true); setTimeout(() => setSwapping(false), 400);
    const tmp = origen; setOrigen(destino); setDestino(tmp);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden mb-10" style={{ minHeight: "420px" }}>

      {/* Imagen de fondo */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          transform: "scale(1.04)",
          filter: "brightness(0.75)",
        }}
      />

      {/* Overlay degradado multicapa */}
      <div className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,0.15) 0%,
              rgba(20,10,5,0.45) 40%,
              rgba(10,5,0,0.78) 100%
            )
          `,
        }}
      />

      {/* Velo dorado sutil en los bordes */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at 15% 50%,
              rgba(150,95,33,0.18) 0%,
              transparent 60%
            ),
            radial-gradient(
              ellipse at 85% 50%,
              rgba(150,95,33,0.12) 0%,
              transparent 60%
            )
          `,
        }}
      />

      {/* Línea brillante inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(150,95,33,0.6), transparent)" }}
      />

      {/* Contenido */}
      <div className="relative z-10 px-6 py-20 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium mb-5"
          style={{
            background: "rgba(150,95,33,0.25)",
            border: "0.5px solid rgba(150,95,33,0.5)",
            color: "rgba(255,235,180,1)",
            backdropFilter: "blur(8px)",
          }}
        >
          ✈ RumboLibre · Mejores precios garantizados
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-white"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            lineHeight: 1.15,
          }}
        >
          {t.home_title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg mb-10"
          style={{ color: "rgba(255,235,200,0.85)", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
        >
          {t.home_subtitle}
        </motion.p>

        {/* Buscador con glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto rounded-2xl p-4"
          style={{
            background: "rgba(255,249,242,0.97)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(150,95,33,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <AirportSelect
              placeholder={t.home_origin}
              value={origen} onChange={setOrigen}
              aeropuertos={aeropuertos} disabled={cargandoAeropuertos}
            />
            <div className="flex justify-center">
              <button onClick={swap}
                className="p-2.5 rounded-full border-none cursor-pointer transition-all"
                style={{
                  background: "rgba(150,95,33,0.1)",
                  transform: swapping ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.4s ease",
                }}
              >
                <SwapIcon />
              </button>
            </div>
            <AirportSelect
              placeholder={t.home_destination}
              value={destino} onChange={setDestino}
              aeropuertos={aeropuertos} disabled={cargandoAeropuertos}
            />
            <div className="relative flex items-center">
              <span className="absolute left-3 z-10 pointer-events-none" style={{ color: "rgba(150,95,33,0.7)" }}>
                <CalendarIcon />
              </span>
              <input type="date" value={fecha} min={today}
                onChange={e => setFecha(e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-sm rounded-lg outline-none border bg-[#faf7f2] text-[#1a1208] dark:bg-gray-700 dark:text-gray-100 border-[rgba(150,95,33,0.2)]"
              />
            </div>
          </div>

          <button onClick={() => onSearch({ origen, destino, fecha })}
            className="w-full mt-3 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-none cursor-pointer text-white transition-all"
            style={{ background: "linear-gradient(135deg, rgba(150,95,33,1) 0%, rgba(110,68,18,1) 100%)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(135deg, rgba(130,80,20,1) 0%, rgba(90,50,10,1) 100%)")}
            onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(135deg, rgba(150,95,33,1) 0%, rgba(110,68,18,1) 100%)")}
          >
            <SearchIcon /> {t.home_search}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

function ModalReserva({ vuelo, aeropuertoMap, user, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { t, formatPrice } = useSettings();

  const [paso, setPaso] = useState(1);
  const [numPax, setNumPax] = useState(1);
  const [pasajeros, setPasajeros] = useState([pasajeroVacio(user)]);
  const [pago, setPago] = useState({ metodoPago: "TARJETA_CREDITO", numeroTarjeta: "", titular: "", caducidad: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function pasajeroVacio(u) {
    return { nombre: u?.name?.split(" ")[0] || "", apellidos: u?.name?.split(" ").slice(1).join(" ") || "", tipoDocumento: "DNI", numeroDocumento: "", fechaNacimiento: "", nacionalidad: "" };
  }

  function ajustarPax(n) {
    const num = Math.max(1, Math.min(9, n)); setNumPax(num);
    setPasajeros(prev => num > prev.length ? [...prev, ...Array.from({ length: num - prev.length }, () => pasajeroVacio(null))] : prev.slice(0, num));
  }
  function updatePax(i, f, v) { setPasajeros(prev => { const c = [...prev]; c[i] = { ...c[i], [f]: v }; return c; }); }
  function updatePago(f, v) { setPago(p => ({ ...p, [f]: v })); }

  const fmtCard = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExpiry = v => { const c = v.replace(/\D/g, "").slice(0, 4); return c.length >= 3 ? c.slice(0, 2) + "/" + c.slice(2) : c; };

  function validarPaso1() {
    for (let i = 0; i < pasajeros.length; i++) {
      const p = pasajeros[i];
      if (!p.nombre.trim()) return `${t.booking_passenger} ${i + 1}: ${t.booking_name.toLowerCase()}`;
      if (!p.apellidos.trim()) return `${t.booking_passenger} ${i + 1}: ${t.booking_lastname.toLowerCase()}`;
      if (!p.numeroDocumento.trim()) return `${t.booking_passenger} ${i + 1}: ${t.booking_doc_num.toLowerCase()}`;
    }
    return null;
  }
  function validarPaso2() {
    if (pago.metodoPago !== "PAYPAL") {
      if (!pago.numeroTarjeta || pago.numeroTarjeta.replace(/\s/g, "").length < 16) return `${t.booking_card_num}`;
      if (!pago.titular.trim()) return t.booking_holder;
      if (!pago.caducidad || pago.caducidad.length < 5) return t.booking_expiry;
      if (!pago.cvv || pago.cvv.length < 3) return "CVV";
    }
    return null;
  }
  function irPaso2() { const err = validarPaso1(); if (err) { setError(err); return; } setError(""); setPaso(2); }

  const resolve = key => { const num = Number(key); return aeropuertoMap[num] || Object.values(aeropuertoMap).find(a => a.codigoIata === key); };
  const orig = resolve(vuelo.origenId || vuelo.origen);
  const dest = resolve(vuelo.destinoId || vuelo.destino);
  const origenCodigo = orig?.codigoIata || vuelo.origen || "—";
  const destinoCodigo = dest?.codigoIata || vuelo.destino || "—";
  const fmt = s => s ? new Date(s).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "--:--";
  const dur = (s, l) => { if (!s || !l) return "—"; const d = new Date(l) - new Date(s); return `${Math.floor(d / 3600000)}h ${Math.floor((d % 3600000) / 60000)}min`; };
  const total = (vuelo.precio || 0) * numPax;

  async function confirmar() {
    if (!user) { navigate("/login"); return; }
    const err = validarPaso2(); if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const resReserva = await api.post(`/reservas?usuarioId=${user.id}`, {
        vueloId: vuelo.id, numeroPasajeros: numPax,
        pasajeros: pasajeros.map(p => ({ nombre: p.nombre, apellidos: p.apellidos, tipoDocumento: p.tipoDocumento, numeroDocumento: p.numeroDocumento, fechaNacimiento: p.fechaNacimiento || null, nacionalidad: p.nacionalidad || null })),
      });
      const reservaId = resReserva.data.id;
      const payloadPago = { reservaId, metodoPago: pago.metodoPago };
      if (pago.metodoPago !== "PAYPAL") { payloadPago.numeroTarjeta = pago.numeroTarjeta?.replace(/\s/g, "") || null; payloadPago.titular = pago.titular || null; payloadPago.caducidad = pago.caducidad || null; payloadPago.cvv = pago.cvv || null; }
      await api.post("/pagos", payloadPago);
      const resFinal = await api.get(`/reservas/${reservaId}`);
      onSuccess(resFinal.data);
    } catch (e) { setError(e?.response?.data?.message || e?.response?.data?.error || "Error al procesar la reserva."); }
    finally { setLoading(false); }
  }

  return (
    <AnimatePresence>
      <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div key="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg flex flex-col overflow-hidden"
        style={{ background: "rgba(255,249,242,1)", borderLeft: "0.5px solid rgba(150,95,33,0.18)", boxShadow: "-8px 0 40px rgba(150,95,33,0.15)", fontFamily: "'DM Sans', sans-serif" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between shrink-0"
          style={{ background: "linear-gradient(135deg,rgba(150,95,33,0.12) 0%,rgba(200,160,100,0.06) 100%)", borderBottom: "0.5px solid rgba(150,95,33,0.14)" }}>
          <div>
            <h2 className="text-[17px] font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26,18,8,1)" }}>{t.booking_title}</h2>
            <p className="text-[12px]" style={{ color: "rgba(156,128,96,1)" }}>{origenCodigo} → {destinoCodigo} · {formatPrice(total)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[20px] transition-all border-none cursor-pointer"
            style={{ color: "rgba(156,128,96,1)", background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(150,95,33,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>×</button>
        </div>

        {/* Resumen vuelo */}
        <div className="px-6 py-4 shrink-0" style={{ borderBottom: "0.5px solid rgba(150,95,33,0.1)" }}>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-[22px] font-bold" style={{ color: "rgba(150,95,33,1)" }}>{origenCodigo}</p>
              <p className="text-[11px]" style={{ color: "rgba(156,128,96,1)" }}>{orig?.ciudad || ""}</p>
              <p className="text-[14px] font-bold" style={{ color: "rgba(26,18,8,1)" }}>{fmt(vuelo.fechaSalida)}</p>
            </div>
            <div className="flex flex-col items-center gap-0.5 flex-1 px-3">
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 h-px" style={{ background: "rgba(150,95,33,0.25)" }} />
                <span className="text-[18px]">✈</span>
                <div className="flex-1 h-px" style={{ background: "rgba(150,95,33,0.25)" }} />
              </div>
              <p className="text-[10px]" style={{ color: "rgba(156,128,96,1)" }}>{dur(vuelo.fechaSalida, vuelo.fechaLlegada)}</p>
              <p className="text-[10px] font-semibold" style={{ color: "rgba(26,18,8,1)" }}>{vuelo.aerolineaNombre}</p>
            </div>
            <div className="text-center">
              <p className="text-[22px] font-bold" style={{ color: "rgba(150,95,33,1)" }}>{destinoCodigo}</p>
              <p className="text-[11px]" style={{ color: "rgba(156,128,96,1)" }}>{dest?.ciudad || ""}</p>
              <p className="text-[14px] font-bold" style={{ color: "rgba(26,18,8,1)" }}>{fmt(vuelo.fechaLlegada)}</p>
            </div>
          </div>
        </div>

        {/* Pasos */}
        <div className="px-6 py-3 flex items-center gap-3 shrink-0" style={{ borderBottom: "0.5px solid rgba(150,95,33,0.08)" }}>
          {[{ n: 1, label: t.booking_passengers.split(" ")[0] }, { n: 2, label: t.booking_payment }].map(({ n, label }) => (
            <React.Fragment key={n}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={{ background: paso >= n ? "rgba(150,95,33,1)" : "rgba(150,95,33,0.12)", color: paso >= n ? "rgba(255,249,242,1)" : "rgba(150,95,33,0.5)" }}>
                  {n}
                </div>
                <span className="text-[12px] font-medium" style={{ color: paso >= n ? "rgba(26,18,8,1)" : "rgba(156,128,96,1)" }}>{label}</span>
              </div>
              {n < 2 && <div className="flex-1 h-px" style={{ background: "rgba(150,95,33,0.15)" }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {paso === 1 && (
            <div>
              <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: "0.5px solid rgba(150,95,33,0.1)" }}>
                <p className="text-[14px] font-semibold" style={{ color: "rgba(26,18,8,1)" }}>{t.booking_passengers}</p>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => ajustarPax(numPax - 1)} disabled={numPax <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold border-none cursor-pointer transition-all"
                    style={{ background: numPax <= 1 ? "rgba(150,95,33,0.08)" : "rgba(150,95,33,1)", color: numPax <= 1 ? "rgba(150,95,33,0.3)" : "rgba(255,249,242,1)" }}>−</button>
                  <span className="text-[18px] font-bold w-6 text-center" style={{ color: "rgba(150,95,33,1)" }}>{numPax}</span>
                  <button type="button" onClick={() => ajustarPax(numPax + 1)} disabled={numPax >= 9}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold border-none cursor-pointer transition-all"
                    style={{ background: numPax >= 9 ? "rgba(150,95,33,0.08)" : "rgba(150,95,33,1)", color: numPax >= 9 ? "rgba(150,95,33,0.3)" : "rgba(255,249,242,1)" }}>+</button>
                </div>
              </div>
              {pasajeros.map((p, i) => (
                <div key={i} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "rgba(150,95,33,1)", color: "rgba(255,249,242,1)" }}>{i + 1}</div>
                    <p className="text-[13px] font-semibold" style={{ color: "rgba(26,18,8,1)" }}>{t.booking_passenger} {i + 1}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Campo label={t.booking_name} required><Input value={p.nombre} onChange={e => updatePax(i, "nombre", e.target.value)} placeholder="Ana" /></Campo>
                    <Campo label={t.booking_lastname} required><Input value={p.apellidos} onChange={e => updatePax(i, "apellidos", e.target.value)} placeholder="García" /></Campo>
                    <Campo label={t.booking_doc_type} required>
                      <SelectInput value={p.tipoDocumento} onChange={e => updatePax(i, "tipoDocumento", e.target.value)}>
                        <option value="DNI">DNI</option>
                        <option value="PASAPORTE">Pasaporte</option>
                        <option value="NIE">NIE</option>
                      </SelectInput>
                    </Campo>
                    <Campo label={t.booking_doc_num} required><Input value={p.numeroDocumento} onChange={e => updatePax(i, "numeroDocumento", e.target.value)} placeholder="12345678A" /></Campo>
                    <Campo label={t.booking_birthdate}><Input type="date" value={p.fechaNacimiento} onChange={e => updatePax(i, "fechaNacimiento", e.target.value)} /></Campo>
                    <Campo label={t.booking_nationality}><Input value={p.nacionalidad} onChange={e => updatePax(i, "nacionalidad", e.target.value)} placeholder="Española" /></Campo>
                  </div>
                  {i < pasajeros.length - 1 && <div className="mt-4" style={{ borderBottom: "0.5px solid rgba(150,95,33,0.1)" }} />}
                </div>
              ))}
            </div>
          )}

          {paso === 2 && (
            <div>
              <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(150,95,33,0.06)", border: "0.5px solid rgba(150,95,33,0.15)" }}>
                {[
                  { label: `${t.booking_flight_x} ${numPax}`, val: `${formatPrice(vuelo.precio || 0)} × ${numPax}` },
                  { label: t.booking_taxes, val: "✓" },
                  { label: t.booking_luggage, val: "✓" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-1.5 text-[12px]" style={{ borderBottom: "0.5px solid rgba(150,95,33,0.08)" }}>
                    <span style={{ color: "rgba(156,128,96,1)" }}>{row.label}</span>
                    <span style={{ color: "rgba(92,74,42,1)", fontWeight: 500 }}>{row.val}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-2 pt-1">
                  <span className="text-[14px] font-bold" style={{ color: "rgba(26,18,8,1)" }}>{t.booking_total}</span>
                  <span className="text-[20px] font-bold" style={{ color: "rgba(150,95,33,1)" }}>{formatPrice(total)}</span>
                </div>
              </div>

              <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: "rgba(92,74,42,1)" }}>{t.booking_payment}</p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { val: "TARJETA_CREDITO", label: t.booking_credit, icon: "💳" },
                  { val: "TARJETA_DEBITO", label: t.booking_debit, icon: "🏦" },
                  { val: "PAYPAL", label: "PayPal", icon: "🅿" },
                ].map(m => (
                  <button key={m.val} type="button" onClick={() => updatePago("metodoPago", m.val)}
                    className="py-3 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all border-none"
                    style={{
                      background: pago.metodoPago === m.val ? "rgba(150,95,33,0.12)" : "rgba(250,247,242,1)",
                      border: pago.metodoPago === m.val ? "1.5px solid rgba(150,95,33,0.7)" : "0.5px solid rgba(150,95,33,0.2)",
                      color: pago.metodoPago === m.val ? "rgba(110,68,18,1)" : "rgba(92,74,42,0.7)",
                    }}>
                    <span className="text-xl">{m.icon}</span>{m.label}
                  </button>
                ))}
              </div>

              {(pago.metodoPago === "TARJETA_CREDITO" || pago.metodoPago === "TARJETA_DEBITO") && (
                <div className="flex flex-col gap-3">
                  <Campo label={t.booking_card_num} required><Input value={pago.numeroTarjeta} onChange={e => updatePago("numeroTarjeta", fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} /></Campo>
                  <Campo label={t.booking_holder} required><Input value={pago.titular} onChange={e => updatePago("titular", e.target.value.toUpperCase())} placeholder="ANA GARCÍA LÓPEZ" /></Campo>
                  <div className="grid grid-cols-2 gap-3">
                    <Campo label={t.booking_expiry} required><Input value={pago.caducidad} onChange={e => updatePago("caducidad", fmtExpiry(e.target.value))} placeholder="MM/AA" maxLength={5} /></Campo>
                    <Campo label="CVV" required><Input type="password" value={pago.cvv} onChange={e => updatePago("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" maxLength={4} /></Campo>
                  </div>
                </div>
              )}
              {pago.metodoPago === "PAYPAL" && (
                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(150,95,33,0.05)", border: "0.5px solid rgba(150,95,33,0.15)" }}>
                  <p className="text-[13px] font-medium mb-1" style={{ color: "rgba(26,18,8,1)" }}>🅿 PayPal</p>
                  <p className="text-[12px]" style={{ color: "rgba(156,128,96,1)" }}>{t.booking_paypal_msg}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 shrink-0" style={{ borderTop: "0.5px solid rgba(150,95,33,0.12)", background: "rgba(255,249,242,1)" }}>
          {error && (
            <div className="rounded-xl px-3 py-2 mb-3 text-[12px]" style={{ background: "rgba(180,50,50,0.08)", border: "0.5px solid rgba(180,50,50,0.25)", color: "rgba(180,50,50,1)" }}>
              ⚠️ {error}
            </div>
          )}
          <div className="flex gap-3">
            {paso === 2 && (
              <button onClick={() => { setPaso(1); setError(""); }}
                className="flex-1 h-11 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none"
                style={{ background: "rgba(150,95,33,0.08)", color: "rgba(92,74,42,1)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(150,95,33,0.14)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(150,95,33,0.08)")}>
                {t.booking_back}
              </button>
            )}
            {paso === 1 ? (
              <button onClick={irPaso2}
                className="flex-1 h-11 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none text-white"
                style={{ background: "rgba(150,95,33,1)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(110,68,18,1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(150,95,33,1)")}>
                {t.booking_continue}
              </button>
            ) : (
              <button onClick={confirmar} disabled={loading}
                className="flex-1 h-11 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none text-white flex items-center justify-center gap-2"
                style={{ background: loading ? "rgba(150,95,33,0.5)" : "rgba(150,95,33,1)" }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = "rgba(110,68,18,1)")}
                onMouseLeave={e => !loading && (e.currentTarget.style.background = "rgba(150,95,33,1)")}>
                {loading ? <><SpinnerLight /> {t.booking_processing}</> : `✈ ${t.booking_pay} ${formatPrice(total)}`}
              </button>
            )}
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: "rgba(156,128,96,1)" }}>{t.booking_secure}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ModalExito({ reserva, onClose }) {
  const navigate = useNavigate();
  const { t, formatPrice } = useSettings();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,249,242,1)", border: "0.5px solid rgba(150,95,33,0.22)", boxShadow: "0 20px 60px rgba(150,95,33,0.22)" }}>
        <div className="px-8 py-8 text-center"
          style={{ background: "linear-gradient(135deg,rgba(34,120,60,0.1) 0%,rgba(34,120,60,0.04) 100%)", borderBottom: "0.5px solid rgba(34,120,60,0.15)" }}>
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-[22px] font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26,18,8,1)" }}>{t.booking_success}</h2>
          <p className="text-[13px]" style={{ color: "rgba(156,128,96,1)" }}>{t.booking_success_sub}</p>
        </div>
        <div className="px-8 py-6">
          {[
            { label: t.booking_code, val: reserva?.codigoReserva || "—", hl: true },
            { label: t.booking_status, val: t.booking_confirmed },
            { label: t.booking_paid, val: formatPrice(reserva?.precioTotal) },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2.5" style={{ borderBottom: "0.5px solid rgba(150,95,33,0.1)" }}>
              <span className="text-[13px]" style={{ color: "rgba(156,128,96,1)" }}>{r.label}</span>
              <span className="text-[13px] font-bold" style={{ color: r.hl ? "rgba(150,95,33,1)" : "rgba(26,18,8,1)" }}>{r.val}</span>
            </div>
          ))}
          <div className="flex gap-3 mt-5">
            <button onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-all"
              style={{ background: "rgba(150,95,33,0.08)", color: "rgba(92,74,42,1)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(150,95,33,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(150,95,33,0.08)")}>
              {t.booking_keep}
            </button>
            <button onClick={() => navigate("/reservas")}
              className="flex-1 h-11 rounded-xl text-[13px] font-semibold border-none cursor-pointer text-white transition-all"
              style={{ background: "rgba(150,95,33,1)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(110,68,18,1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(150,95,33,1)")}>
              {t.booking_view}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useSettings();
  const user = (() => { try { return JSON.parse(localStorage.getItem("rl_user")); } catch { return null; } })();

  const [aeropuertos, setAeropuertos] = useState(AEROPUERTOS_ESTATICOS);
  const [cargandoAeropuertos, setCargandoAeropuertos] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState("");
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [reservaExitosa, setReservaExitosa] = useState(null);

  // Estados para el Vuelo Sorpresa
  const [origenSorpresa, setOrigenSorpresa] = useState("");
  const [cargandoSorpresa, setCargandoSorpresa] = useState(false);

  const aeropuertoMap = useMemo(() => { const m = {}; aeropuertos.forEach(a => { m[a.id] = a; }); return m; }, [aeropuertos]);

  useEffect(() => {
    (async () => {
      setCargandoAeropuertos(true);
      try { const r = await axios.get("http://localhost:8080/api/aeropuertos"); if (r.data?.length) setAeropuertos(r.data); }
      catch { /* usa estáticos */ }
      finally { setCargandoAeropuertos(false); }
    })();
  }, []);

  const buscarVuelos = useCallback(async ({ origen, destino, fecha }) => {
    setBuscando(true); setError(""); setResultados(null);
    try {
      const p = new URLSearchParams();
      if (origen) p.append("origen", origen);
      if (destino) p.append("destino", destino);
      if (fecha) p.append("fecha", fecha);
      p.append("pasajeros", "1");
      const { data } = await axios.get(`http://localhost:8080/api/vuelos/disponibles?${p}`);
      setResultados(data);
      if (!data.length) setError(t.home_no_flights);
    } catch { setError("Error al buscar vuelos. Comprueba tu conexión."); setResultados([]); }
    finally { setBuscando(false); }
  }, [t]);

  // Función para buscar vuelo sorpresa
  const buscarVueloSorpresa = async () => {
    if (!origenSorpresa) return;

    setCargandoSorpresa(true);
    setError("");

    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/vuelos/sorpresa?origen=${origenSorpresa}`
      );

      seleccionarVuelo(data);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "No se encontró ningún vuelo sorpresa."
      );
    } finally {
      setCargandoSorpresa(false);
    }
  };

  function seleccionarVuelo(vuelo) { if (!user) { navigate("/login"); return; } setVueloSeleccionado(vuelo); }
  function onReservaExitosa(reserva) { setVueloSeleccionado(null); setReservaExitosa(reserva); }

  const features = [
    { icon: "✈️", title: t.home_cheap, desc: t.home_cheap_desc },
    { icon: "🛡️", title: t.home_secure, desc: t.home_secure_desc },
    { icon: "🎫", title: t.home_no_fees, desc: t.home_no_fees_desc },
    { icon: "💳", title: t.home_methods, desc: t.home_methods_desc },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Header />
        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <HeroSection onSearch={buscarVuelos} aeropuertos={aeropuertos} cargandoAeropuertos={cargandoAeropuertos} />

            <AnimatePresence>
              {buscando && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[rgba(150,95,33,0.2)] border-t-[#965f21]" />
                  <p className="mt-3 text-[#9c8060]">{t.home_searching}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && !buscando && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-center py-5 px-4 rounded-xl mb-6 bg-[#fff5f5] border border-[#fecaca]">
                  <p className="text-[#dc2626] font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!buscando && resultados && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#1a1208] dark:text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t.home_results}
                    <span className="text-[14px] font-normal ml-2 text-[#9c8060]">({resultados.length})</span>
                  </h2>
                  <button onClick={() => { setResultados(null); setError(""); }}
                    className="text-sm font-medium hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                    style={{ color: "rgba(150,95,33,1)" }}>
                    {t.home_show_all}
                  </button>
                </div>
                {resultados.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                    <PlaneIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-[#9c8060]">{t.home_no_flights}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resultados.map((v, i) => (
                      <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.4) }}>
                        <VueloCard vuelo={v} onSelect={seleccionarVuelo} aeropuertoMap={aeropuertoMap} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SECCIÓN VUELO SORPRESA */}
            {!resultados && !buscando && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 rounded-2xl overflow-hidden relative"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(150,95,33,1) 0%, rgba(110,68,18,1) 100%)",
                  boxShadow: "0 12px 30px rgba(150,95,33,0.25)"
                }}
              >
                <div className="px-6 py-10 text-center">
                  <div className="text-5xl mb-4">🎲✈️</div>

                  <h2
                    className="text-3xl md:text-4xl font-bold mb-3 text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t.home_surprise_title || "Vuelo Sorpresa"}
                  </h2>

                  <p
                    className="max-w-2xl mx-auto text-sm md:text-base mb-8"
                    style={{ color: "rgba(255,249,242,0.85)" }}
                  >
                    {t.home_surprise_desc || "¿No sabes dónde viajar? Selecciona tu aeropuerto de origen y RumboLibre elegirá aleatoriamente un destino para ti. Descubre ciudades inesperadas y vive una experiencia diferente."}
                  </p>

                  <div className="max-w-md mx-auto flex flex-col gap-4">
                    <AirportSelect
                      placeholder={t.home_surprise_placeholder || "Selecciona aeropuerto de origen"}
                      value={origenSorpresa}
                      onChange={setOrigenSorpresa}
                      aeropuertos={aeropuertos}
                    />

                    <button
                      onClick={buscarVueloSorpresa}
                      disabled={cargandoSorpresa}
                      className="w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(255,249,242,1)",
                        color: "rgba(150,95,33,1)"
                      }}
                    >
                      {cargandoSorpresa ? (
                        <>
                          <SpinnerDark />
                          {t.home_surprise_searching || "Buscando aventura..."}
                        </>
                      ) : (
                        <>
                          🎲 {t.home_surprise_button || "Buscar Vuelo Sorpresa"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {!resultados && !buscando && (
              <section className="mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {features.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="text-center p-4">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-sm mb-1 text-[#1a1208] dark:text-gray-100">{item.title}</h3>
                      <p className="text-xs text-[#9c8060]">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
        <Footer />
        {vueloSeleccionado && <ModalReserva vuelo={vueloSeleccionado} aeropuertoMap={aeropuertoMap} user={user} onClose={() => setVueloSeleccionado(null)} onSuccess={onReservaExitosa} />}
        {reservaExitosa && <ModalExito reserva={reservaExitosa} onClose={() => setReservaExitosa(null)} />}
      </div>
    </>
  );
}