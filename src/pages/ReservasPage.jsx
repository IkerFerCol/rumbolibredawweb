import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useSettings } from "../context/SettingsContext";

const PlaneIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const UsersIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>;
const Spinner = () => <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color:"rgba(255,249,242,1)" }}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>;

function formatDate(str) {
  if(!str) return "—";
  return new Date(str).toLocaleDateString("es-ES",{ weekday:"long",day:"numeric",month:"long",year:"numeric" });
}
function formatTime(str) {
  if(!str) return "--:--";
  return new Date(str).toLocaleTimeString("es-ES",{ hour:"2-digit",minute:"2-digit" });
}
function formatDateTime(str) {
  if(!str) return "—";
  return new Date(str).toLocaleString("es-ES",{ day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit" });
}
function formatDuracion(minutos) {
  if(!minutos&&minutos!==0) return "—";
  return `${Math.floor(minutos/60)}h ${minutos%60}min`;
}

function CancelModal({ reserva, onClose, onConfirm, loading }) {
  const { t } = useSettings();
  const vuelo = reserva?.vuelo||{};
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
        onClick={e=>e.stopPropagation()}
        className="w-full max-w-md rounded-2xl overflow-hidden bg-[#fff9f2] dark:bg-gray-800"
        style={{ border:"0.5px solid rgba(150,95,33,0.22)", boxShadow:"0 20px 60px rgba(150,95,33,0.22)" }}>
        <div className="px-6 py-5 text-center" style={{ background:"linear-gradient(135deg,rgba(180,50,50,0.08) 0%,rgba(200,80,80,0.03) 100%)", borderBottom:"0.5px solid rgba(180,50,50,0.15)" }}>
          <div className="text-4xl mb-2">⚠️</div>
          <h2 className="text-[18px] font-semibold mb-1 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.res_confirm_cancel}</h2>
          <p className="text-[13px] text-[#9c8060]">{t.res_confirm_sub}</p>
        </div>
        <div className="px-6 py-4">
          {[
            { label:t.res_code_label,   val:reserva?.codigoReserva||"—", highlight:true },
            { label:t.res_date_label,   val:formatDate(reserva?.fechaReserva) },
            { label:t.res_flight_label, val:`${vuelo.origenCodigo||"—"} → ${vuelo.destinoCodigo||"—"}` },
            { label:t.res_dep_label,    val:formatTime(vuelo.fechaSalida) },
            { label:t.res_pax_label,    val:reserva?.numeroPasajeros||"—" },
          ].map(row=>(
            <div key={row.label} className="flex justify-between py-2.5" style={{ borderBottom:"0.5px solid rgba(150,95,33,0.1)" }}>
              <span className="text-[13px] text-[#9c8060]">{row.label}</span>
              <span className="text-[13px] font-bold" style={{ color:row.highlight?"rgba(150,95,33,1)":"rgba(26,18,8,1)" }}>{row.val}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex gap-3" style={{ borderTop:"0.5px solid rgba(150,95,33,0.12)" }}>
          <button onClick={onClose} disabled={loading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer"
            style={{ background:"rgba(150,95,33,0.08)", color:"rgba(92,74,42,1)" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(150,95,33,0.14)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(150,95,33,0.08)")}>
            {t.res_go_back}
          </button>
          <button onClick={()=>onConfirm(reserva.id)} disabled={loading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer text-white flex items-center justify-center gap-2"
            style={{ background:loading?"rgba(180,50,50,0.5)":"rgba(180,50,50,1)" }}>
            {loading?<><Spinner/> {t.res_cancelling}</>:t.res_yes_cancel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailModal({ reserva, onClose }) {
  const { t, formatPrice } = useSettings();
  const vuelo    = reserva?.vuelo||{};
  const pago     = reserva?.pago||{};
  const pasajeros= reserva?.pasajeros||[];

  const estadoPagoMap = { COMPLETADO:"✅ Completado", PENDIENTE:"⏳ Pendiente", RECHAZADO:"❌ Rechazado", REEMBOLSADO:"↩️ Reembolsado" };
  const metodoPagoMap = { TARJETA_CREDITO:"💳 Tarjeta crédito", TARJETA_DEBITO:"🏦 Tarjeta débito", PAYPAL:"🅿️ PayPal" };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
        onClick={e=>e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl overflow-hidden bg-[#fff9f2] dark:bg-gray-800"
        style={{ border:"0.5px solid rgba(150,95,33,0.22)", boxShadow:"0 20px 60px rgba(150,95,33,0.22)" }}>
        <div className="px-6 py-5" style={{ background:"linear-gradient(135deg,rgba(150,95,33,0.1) 0%,rgba(200,160,100,0.05) 100%)", borderBottom:"0.5px solid rgba(150,95,33,0.15)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.res_detail_title}</h2>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold"
              style={{ background:reserva?.estado==="CONFIRMADA"?"rgba(34,120,60,0.12)":"rgba(180,50,50,0.12)", color:reserva?.estado==="CONFIRMADA"?"rgba(22,101,52,1)":"rgba(180,50,50,1)" }}>
              {reserva?.estado==="CONFIRMADA"?t.res_active:reserva?.estado||"—"}
            </span>
          </div>
          <p className="text-[22px] font-bold mt-2" style={{ color:"rgba(150,95,33,1)" }}>{reserva?.codigoReserva||"—"}</p>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-3 text-[#5c4a2a]">{t.res_info_flight}</h3>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label:t.res_origin,      val:`${vuelo.origenNombre||"—"} (${vuelo.origenCodigo||"—"})` },
              { label:t.res_destination, val:`${vuelo.destinoNombre||"—"} (${vuelo.destinoCodigo||"—"})` },
              { label:t.res_dep_label,   val:formatDateTime(vuelo.fechaSalida) },
              { label:t.res_arrival,     val:formatDateTime(vuelo.fechaLlegada) },
              { label:t.res_duration,    val:formatDuracion(vuelo.duracion) },
              { label:t.res_airline,     val:vuelo.aerolineaNombre||"—" },
              { label:t.res_flight_num,  val:vuelo.numeroVuelo||"—" },
              { label:t.res_price_each,  val:formatPrice(vuelo.precio) },
            ].map(row=>(
              <div key={row.label}>
                <p className="text-[11px] uppercase tracking-wider mb-0.5 text-[#9c8060]">{row.label}</p>
                <p className="text-[13px] font-medium text-[#1a1208] dark:text-gray-100">{row.val}</p>
              </div>
            ))}
          </div>

          <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-3 text-[#5c4a2a]">{t.res_info_booking}</h3>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label:t.res_booking_date, val:formatDate(reserva?.fechaReserva) },
              { label:t.res_passengers,   val:reserva?.numeroPasajeros||"—" },
              { label:t.res_total_price,  val:formatPrice(reserva?.precioTotal), highlight:true },
              { label:t.res_method,       val:metodoPagoMap[pago?.metodoPago]||pago?.metodoPago||"—" },
            ].map(row=>(
              <div key={row.label}>
                <p className="text-[11px] uppercase tracking-wider mb-0.5 text-[#9c8060]">{row.label}</p>
                <p className="text-[13px] font-bold" style={{ color:row.highlight?"rgba(150,95,33,1)":"rgba(26,18,8,1)" }}>{row.val}</p>
              </div>
            ))}
          </div>

          {pago?.metodoPago&&(
            <>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-3 text-[#5c4a2a]">{t.res_info_payment}</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label:t.res_status_pay, val:estadoPagoMap[pago?.estado]||pago?.estado||"—" },
                  { label:t.res_amount,     val:formatPrice(pago?.monto) },
                  { label:t.res_reference,  val:pago?.referenciaTransaccion||"—" },
                ].map(row=>(
                  <div key={row.label}>
                    <p className="text-[11px] uppercase tracking-wider mb-0.5 text-[#9c8060]">{row.label}</p>
                    <p className="text-[13px] font-medium text-[#1a1208] dark:text-gray-100">{row.val}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {pasajeros.length>0&&(
            <>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-3 text-[#5c4a2a]">{t.res_info_pax}</h3>
              {pasajeros.map((p,idx)=>(
                <div key={p.id||idx} className="flex items-center gap-3 py-2.5" style={{ borderBottom:"0.5px solid rgba(150,95,33,0.1)" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background:"rgba(150,95,33,0.12)", color:"rgba(150,95,33,1)" }}>{idx+1}</div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1a1208] dark:text-gray-100">{p.nombre} {p.apellidos}</p>
                    <p className="text-[11px] text-[#9c8060]">{p.tipoDocumento}: {p.numeroDocumento}{p.nacionalidad?` · ${p.nacionalidad}`:""}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="px-6 py-4" style={{ borderTop:"0.5px solid rgba(150,95,33,0.12)" }}>
          <button onClick={onClose}
            className="w-full h-11 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer text-white"
            style={{ background:"rgba(150,95,33,1)" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(110,68,18,1)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(150,95,33,1)")}>
            {t.res_close}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ReservasPage() {
  const navigate = useNavigate();
  const { t, formatPrice } = useSettings();

  const [reservas,      setReservas]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [cancelTarget,  setCancelTarget]  = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [detailTarget,  setDetailTarget]  = useState(null);

  const user = (() => { try { return JSON.parse(localStorage.getItem("rl_user")); } catch { return null; } })();

  useEffect(() => { if(!user){navigate("/login");return;} cargarReservas(); }, []);

  async function cargarReservas() {
    setLoading(true); setError("");
    try { const res=await api.get(`/reservas/usuario/${user.id}`); setReservas(res.data||[]); }
    catch { setError("Error al cargar las reservas."); }
    finally { setLoading(false); }
  }

  async function confirmarCancelacion(reservaId) {
    setCancelLoading(true);
    try { await api.put(`/reservas/${reservaId}/cancelar`,null,{params:{usuarioId:user.id}}); await cargarReservas(); setCancelTarget(null); }
    catch { setError("Error al cancelar la reserva."); }
    finally { setCancelLoading(false); }
  }

  function ReservaCard({ reserva }) {
    const vuelo=reserva?.vuelo||{};
    const isConfirmada=reserva?.estado==="CONFIRMADA";
    return (
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
        className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300"
        style={{ boxShadow:"0 2px 12px rgba(150,95,33,0.08)", border:"0.5px solid rgba(150,95,33,0.12)" }}>
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ background:isConfirmada?"linear-gradient(135deg,rgba(34,120,60,0.08) 0%,rgba(150,95,33,0.04) 100%)":"linear-gradient(135deg,rgba(180,50,50,0.06) 0%,rgba(150,95,33,0.03) 100%)", borderBottom:"0.5px solid rgba(150,95,33,0.1)" }}>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#9c8060]">{t.res_code_label}</p>
            <p className="text-[16px] font-bold" style={{ color:"rgba(150,95,33,1)" }}>{reserva?.codigoReserva||"—"}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{ background:isConfirmada?"rgba(34,120,60,0.12)":"rgba(180,50,50,0.12)", color:isConfirmada?"rgba(22,101,52,1)":"rgba(180,50,50,1)" }}>
            {isConfirmada?t.res_active:t.res_cancelled_st}
          </span>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <p className="text-[20px] font-bold" style={{ color:"rgba(150,95,33,1)" }}>{vuelo.origenCodigo||"—"}</p>
              <p className="text-[10px] text-[#9c8060]">{vuelo.origenNombre||t.res_origin}</p>
            </div>
            <div className="flex flex-1 items-center justify-center px-3">
              <div className="flex-1 h-px" style={{ background:"rgba(150,95,33,0.2)" }}/>
              <PlaneIcon/>
              <div className="flex-1 h-px" style={{ background:"rgba(150,95,33,0.2)" }}/>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold" style={{ color:"rgba(150,95,33,1)" }}>{vuelo.destinoCodigo||"—"}</p>
              <p className="text-[10px] text-[#9c8060]">{vuelo.destinoNombre||t.res_destination}</p>
            </div>
          </div>
          <div className="flex justify-between text-[11px] mb-3">
            <div className="flex items-center gap-1 text-[#9c8060]">
              <CalendarIcon/>
              <span>{formatDate(vuelo.fechaSalida)} · {formatTime(vuelo.fechaSalida)}</span>
            </div>
            <div className="flex items-center gap-1 text-[#9c8060]">
              <UsersIcon/>
              <span>{reserva?.numeroPasajeros||0} {t.res_passengers?.toLowerCase()||"pasajeros"}</span>
            </div>
          </div>
          <p className="text-[18px] font-bold text-[#1a1208] dark:text-gray-100">{formatPrice(reserva?.precioTotal)}</p>
        </div>
        <div className="px-5 py-3 flex gap-2" style={{ borderTop:"0.5px solid rgba(150,95,33,0.1)" }}>
          <button onClick={()=>setDetailTarget(reserva)}
            className="flex-1 h-9 rounded-lg text-[12px] font-medium transition-all border-none cursor-pointer"
            style={{ background:"rgba(150,95,33,0.08)", color:"rgba(92,74,42,1)" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(150,95,33,0.14)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(150,95,33,0.08)")}>
            {t.res_detail}
          </button>
          {isConfirmada&&(
            <button onClick={()=>setCancelTarget(reserva)}
              className="flex-1 h-9 rounded-lg text-[12px] font-medium transition-all border-none cursor-pointer text-white"
              style={{ background:"rgba(180,50,50,1)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(160,40,40,1)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(180,50,50,1)")}>
              {t.res_cancel}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily:"'DM Sans', sans-serif" }}>
        <Header/>
        <div className="py-10 px-6 text-center" style={{ background:"linear-gradient(135deg,rgba(150,95,33,0.08) 0%,rgba(200,160,100,0.04) 100%)", borderBottom:"0.5px solid rgba(150,95,33,0.1)" }}>
          <h1 className="text-[28px] font-semibold mb-1 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.res_title}</h1>
          <p className="text-[14px] text-[#9c8060]">{t.res_subtitle}</p>
        </div>
        <div className="flex-grow max-w-6xl mx-auto w-full px-4 py-10">
          {loading&&(
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[rgba(150,95,33,0.2)] border-t-[#965f21] mb-4"/>
              <p className="text-[#9c8060]">{t.res_loading}</p>
            </div>
          )}
          {!loading&&error&&(
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
              className="text-center py-5 px-4 rounded-xl mb-6 mx-auto max-w-lg"
              style={{ background:"rgba(180,50,50,0.06)", border:"0.5px solid rgba(180,50,50,0.25)" }}>
              <p className="text-[#b43232] font-medium mb-3">{error}</p>
              <button onClick={cargarReservas}
                className="px-5 py-2 rounded-lg text-[13px] font-medium transition-all border-none cursor-pointer text-white"
                style={{ background:"rgba(150,95,33,1)" }}>{t.res_retry}</button>
            </motion.div>
          )}
          {!loading&&!error&&reservas.length===0&&(
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center py-20">
              <div className="text-6xl mb-4 opacity-20">🛫</div>
              <h2 className="text-[20px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.res_empty}</h2>
              <p className="text-[14px] mb-6 text-[#9c8060]">{t.res_empty_sub}</p>
              <button onClick={()=>navigate("/")}
                className="px-6 py-3 rounded-xl text-[14px] font-medium transition-all border-none cursor-pointer text-white"
                style={{ background:"rgba(150,95,33,1)" }}>{t.res_search}</button>
            </motion.div>
          )}
          {!loading&&reservas.length>0&&(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservas.map(r=><ReservaCard key={r.id} reserva={r}/>)}
            </div>
          )}
        </div>
        <Footer/>
        <AnimatePresence>
          {cancelTarget&&<CancelModal reserva={cancelTarget} onClose={()=>!cancelLoading&&setCancelTarget(null)} onConfirm={confirmarCancelacion} loading={cancelLoading}/>}
        </AnimatePresence>
        <AnimatePresence>
          {detailTarget&&<DetailModal reserva={detailTarget} onClose={()=>setDetailTarget(null)}/>}
        </AnimatePresence>
      </div>
    </>
  );
}