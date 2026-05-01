import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Header";
import Footer from "../components/Footer";

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
  .animate-fadeIn   { animation: fadeIn 0.3s ease-out forwards; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .opacity-0 { opacity: 0; }
`;

const STATUS_LABELS = {
  confirmed: { label: "Confirmado", emoji: "✅", bg: "rgba(34,120,60,0.1)", color: "rgba(22,101,52,1)" },
  pending:   { label: "Pendiente",  emoji: "⏳", bg: "rgba(150,95,33,0.1)", color: "rgba(110,68,18,1)" },
  cancelled: { label: "Cancelado",  emoji: "❌", bg: "rgba(180,50,50,0.1)", color: "rgba(180,50,50,1)" },
};

function ConfirmModal({ booking, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-7 animate-fadeInUp opacity-0"
        style={{
          background: "rgba(255, 249, 242, 1)",
          border: "0.5px solid rgba(150, 95, 33, 0.22)",
          boxShadow: "0 16px 48px rgba(150, 95, 33, 0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <span className="text-4xl block mb-3">⚠️</span>
          <h3
            className="text-[18px] font-semibold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
          >
            Cancelar reserva
          </h3>
          <p className="text-[13px]" style={{ color: "rgba(92, 74, 42, 0.85)" }}>
            ¿Estás seguro de que quieres cancelar el vuelo{" "}
            <strong>{booking.origin} → {booking.destination}</strong>?<br />
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl text-[13px] font-medium transition-all"
            style={{
              border: "0.5px solid rgba(150, 95, 33, 0.3)",
              color: "rgba(92, 74, 42, 1)",
              background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl text-[13px] font-medium transition-all"
            style={{ background: "rgba(180, 50, 50, 1)", color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(140, 30, 30, 1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(180, 50, 50, 1)")}
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ booking, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-7 animate-fadeInUp opacity-0"
        style={{
          background: "rgba(255, 249, 242, 1)",
          border: "0.5px solid rgba(150, 95, 33, 0.22)",
          boxShadow: "0 16px 48px rgba(150, 95, 33, 0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-[20px] font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
          >
            Detalle del vuelo
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[18px] transition-all"
            style={{ color: "rgba(156, 128, 96, 1)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            ×
          </button>
        </div>

        {/* Ruta visual */}
        <div
          className="flex items-center justify-between py-5 px-4 rounded-xl mb-5"
          style={{ background: "rgba(150, 95, 33, 0.07)" }}
        >
          <div className="text-center">
            <p className="text-[28px] font-bold" style={{ color: "rgba(150, 95, 33, 1)" }}>
              {booking.originCode}
            </p>
            <p className="text-[12px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {booking.origin}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[20px]">✈</div>
            <p className="text-[11px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {booking.duration}
            </p>
            {booking.direct && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: "rgba(34,120,60,0.12)", color: "rgba(22,101,52,1)" }}
              >
                Directo
              </span>
            )}
          </div>
          <div className="text-center">
            <p className="text-[28px] font-bold" style={{ color: "rgba(150, 95, 33, 1)" }}>
              {booking.destCode}
            </p>
            <p className="text-[12px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {booking.destination}
            </p>
          </div>
        </div>

        {/* Detalles */}
        {[
          { label: "Aerolínea",   val: booking.airline },
          { label: "Fecha",       val: booking.date },
          { label: "Horario",     val: `${booking.departure} → ${booking.arrival}` },
          { label: "Referencia",  val: booking.ref },
          { label: "Pasajero",    val: booking.passenger },
          { label: "Precio",      val: booking.price },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between py-2.5"
            style={{ borderBottom: "0.5px solid rgba(150, 95, 33, 0.1)" }}
          >
            <span className="text-[13px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {row.label}
            </span>
            <span className="text-[13px] font-semibold" style={{ color: "rgba(26, 18, 8, 1)" }}>
              {row.val}
            </span>
          </div>
        ))}

        <button
          onClick={onClose}
          className="w-full h-11 mt-5 rounded-xl text-[14px] font-medium transition-all"
          style={{ background: "rgba(150, 95, 33, 1)", color: "rgba(255, 249, 242, 1)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110, 68, 18, 1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 1)")}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, onDetail, delay }) {
  const status = STATUS_LABELS[booking.status] || STATUS_LABELS.confirmed;

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 animate-fadeInUp opacity-0 delay-${delay}`}
      style={{
        background: "rgba(255, 249, 242, 1)",
        border: "0.5px solid rgba(150, 95, 33, 0.18)",
        boxShadow: "0 2px 16px rgba(150, 95, 33, 0.07)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 8px 28px rgba(150, 95, 33, 0.14)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 16px rgba(150, 95, 33, 0.07)")
      }
    >
      {/* Cabecera con ruta */}
      <div
        className="px-6 py-5 flex items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(150,95,33,0.08) 0%, rgba(200,160,100,0.04) 100%)",
          borderBottom: "0.5px solid rgba(150, 95, 33, 0.1)",
        }}
      >
        <div className="flex items-center gap-5">
          {/* Origen */}
          <div className="text-center">
            <p
              className="text-[26px] font-bold leading-none"
              style={{ color: "rgba(150, 95, 33, 1)", fontFamily: "'DM Sans', sans-serif" }}
            >
              {booking.originCode}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {booking.origin}
            </p>
          </div>

          {/* Línea central */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <div
                className="w-12 h-px"
                style={{ background: "rgba(150, 95, 33, 0.3)" }}
              />
              <span className="text-[16px]">✈</span>
              <div
                className="w-12 h-px"
                style={{ background: "rgba(150, 95, 33, 0.3)" }}
              />
            </div>
            <p className="text-[10px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {booking.duration}
            </p>
            {booking.direct && (
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(34,120,60,0.12)", color: "rgba(22,101,52,1)" }}
              >
                Directo
              </span>
            )}
          </div>

          {/* Destino */}
          <div className="text-center">
            <p
              className="text-[26px] font-bold leading-none"
              style={{ color: "rgba(150, 95, 33, 1)", fontFamily: "'DM Sans', sans-serif" }}
            >
              {booking.destCode}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(156, 128, 96, 1)" }}>
              {booking.destination}
            </p>
          </div>
        </div>

        {/* Precio y estado */}
        <div className="text-right shrink-0">
          <p
            className="text-[24px] font-bold"
            style={{ color: "rgba(150, 95, 33, 1)", fontFamily: "'DM Sans', sans-serif" }}
          >
            {booking.price}
          </p>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium mt-1"
            style={{ background: status.bg, color: status.color }}
          >
            {status.emoji} {status.label}
          </span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-5 flex-wrap text-[12px]" style={{ color: "rgba(156, 128, 96, 1)" }}>
          <span>🏢 <strong style={{ color: "rgba(92,74,42,1)" }}>{booking.airline}</strong></span>
          <span>📅 <strong style={{ color: "rgba(92,74,42,1)" }}>{booking.date}</strong></span>
          <span>🕐 <strong style={{ color: "rgba(92,74,42,1)" }}>{booking.departure} → {booking.arrival}</strong></span>
          <span>📋 Ref: <strong style={{ color: "rgba(92,74,42,1)" }}>{booking.ref}</strong></span>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onDetail(booking)}
            className="px-4 h-9 rounded-xl text-[12px] font-medium transition-all"
            style={{
              border: "0.5px solid rgba(150, 95, 33, 0.35)",
              color: "rgba(110, 68, 18, 1)",
              background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(150, 95, 33, 0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Ver detalles
          </button>
          {booking.status !== "cancelled" && (
            <button
              onClick={() => onCancel(booking)}
              className="px-4 h-9 rounded-xl text-[12px] font-medium transition-all"
              style={{
                border: "0.5px solid rgba(180, 50, 50, 0.4)",
                color: "rgba(180, 50, 50, 1)",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(180, 50, 50, 0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const MOCK_BOOKINGS = [
  {
    id: 1, originCode: "MAD", origin: "Madrid", destCode: "CDG", destination: "París",
    airline: "Iberia", date: "15 mayo 2025", departure: "06:30", arrival: "09:15",
    duration: "2h 45m", direct: true, price: "€89", ref: "RL4F2K9A",
    passenger: "Usuario", status: "confirmed", bookedAt: "1 may 2025",
  },
  {
    id: 2, originCode: "BCN", origin: "Barcelona", destCode: "LHR", destination: "Londres",
    airline: "Vueling", date: "20 mayo 2025", departure: "10:00", arrival: "11:30",
    duration: "1h 30m", direct: true, price: "€68", ref: "RL7B3M1C",
    passenger: "Usuario", status: "pending", bookedAt: "2 may 2025",
  },
];

export default function ReservasPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("rl_user")
    ? JSON.parse(localStorage.getItem("rl_user"))
    : null;

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("rl_bookings");
    return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });

  const [cancelTarget, setCancelTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  function confirmCancel() {
    const updated = bookings.map((b) =>
      b.id === cancelTarget.id ? { ...b, status: "cancelled" } : b
    );
    setBookings(updated);
    localStorage.setItem("rl_bookings", JSON.stringify(updated));
    setCancelTarget(null);
  }

  if (!user) {
    return (
      <>
        <style>{animationStyles}</style>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <div
          className="min-h-screen flex flex-col"
          style={{ background: "rgba(250, 247, 242, 1)" }}
        >
          <Navbar />
          <div className="flex-grow flex items-center justify-center px-4">
            <div className="text-center">
              <span className="text-5xl block mb-4">🔒</span>
              <h2
                className="text-[22px] font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
              >
                Acceso restringido
              </h2>
              <p className="text-[14px] mb-6" style={{ color: "rgba(156, 128, 96, 1)" }}>
                Inicia sesión para ver tus reservas
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 rounded-xl text-[14px] font-medium"
                style={{ background: "rgba(150, 95, 33, 1)", color: "rgba(255, 249, 242, 1)" }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const active    = bookings.filter((b) => b.status !== "cancelled");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <>
      <style>{animationStyles}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {cancelTarget && (
        <ConfirmModal
          booking={cancelTarget}
          onConfirm={confirmCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}
      {detailTarget && (
        <DetailModal
          booking={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}

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
            className="text-[32px] font-semibold mb-1 animate-fadeInUp opacity-0"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
          >
            Mis reservas
          </h1>
          <p
            className="text-[14px] font-light animate-fadeInUp delay-100 opacity-0"
            style={{ color: "rgba(156, 128, 96, 1)" }}
          >
            {active.length} reserva{active.length !== 1 ? "s" : ""} activa{active.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-10">

          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">✈️</span>
              <h3
                className="text-[20px] font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
              >
                No tienes reservas aún
              </h3>
              <p className="text-[14px] mb-6" style={{ color: "rgba(156, 128, 96, 1)" }}>
                Explora nuestros vuelos y reserva tu próximo destino
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 rounded-xl text-[14px] font-medium"
                style={{ background: "rgba(150, 95, 33, 1)", color: "rgba(255, 249, 242, 1)" }}
              >
                Buscar vuelos
              </button>
            </div>
          ) : (
            <>
              {/* Activas */}
              {active.length > 0 && (
                <div className="mb-8">
                  <h2
                    className="text-[16px] font-semibold mb-4 animate-fadeInUp opacity-0"
                    style={{ color: "rgba(92, 74, 42, 1)" }}
                  >
                    Reservas activas
                  </h2>
                  <div className="flex flex-col gap-4">
                    {active.map((b, i) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        delay={(i + 1) * 100}
                        onCancel={setCancelTarget}
                        onDetail={setDetailTarget}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Canceladas */}
              {cancelled.length > 0 && (
                <div>
                  <h2
                    className="text-[16px] font-semibold mb-4"
                    style={{ color: "rgba(156, 128, 96, 1)" }}
                  >
                    Reservas canceladas
                  </h2>
                  <div className="flex flex-col gap-4 opacity-60">
                    {cancelled.map((b, i) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        delay={(i + 1) * 100}
                        onCancel={setCancelTarget}
                        onDetail={setDetailTarget}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}