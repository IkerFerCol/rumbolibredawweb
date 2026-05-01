import { useState } from "react";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import emailjs from "@emailjs/browser";

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

const SUBJECTS = [
  "Problema con una reserva",
  "Pregunta sobre un vuelo",
  "Cancelación o reembolso",
  "Problema técnico",
  "Sugerencia de mejora",
  "Otro",
];

const InputField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-[11px] font-medium uppercase tracking-widest"
      style={{ color: "rgba(92, 74, 42, 1)" }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  background: "rgba(250, 247, 242, 1)",
  border: "0.5px solid rgba(150, 95, 33, 0.25)",
  color: "rgba(26, 18, 8, 1)",
  fontFamily: "'DM Sans', sans-serif",
};

export default function ContactoPage() {
  const user = localStorage.getItem("rl_user")
    ? JSON.parse(localStorage.getItem("rl_user"))
    : null;

  const [form, setForm] = useState({
    name:    user?.name  || "",
    email:   user?.email || "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState("");

  function handleChange(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Por favor rellena todos los campos obligatorios.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // EmailJS — reemplaza con tus IDs reales
      await emailjs.send(
        "YOUR_SERVICE_ID",   // Service ID de EmailJS
        "YOUR_TEMPLATE_ID",  // Template ID de EmailJS
        {
          from_name:    form.name,
          from_email:   form.email,
          subject:      form.subject,
          message:      form.message,
          to_email:     "ikerfc09@gmail.com",
        },
        "YOUR_PUBLIC_KEY"    // Public Key de EmailJS
      );
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
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
            Contacto
          </h1>
          <p
            className="text-[14px] font-light animate-fadeInUp delay-100 opacity-0"
            style={{ color: "rgba(156, 128, 96, 1)" }}
          >
            ¿Tienes alguna duda o problema? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="flex-grow flex items-start justify-center px-4 py-12">
          <div className="w-full max-w-2xl">

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-4 mb-8 animate-fadeInUp delay-100 opacity-0">
              {[
                { icon: "📧", label: "Email", val: "ikerfc09@gmail.com" },
                { icon: "📞", label: "Teléfono", val: "+34 900 123 456" },
                { icon: "🕐", label: "Horario", val: "Lun–Vie 9:00–18:00" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: "rgba(255, 249, 242, 1)",
                    border: "0.5px solid rgba(150, 95, 33, 0.18)",
                    boxShadow: "0 2px 12px rgba(150, 95, 33, 0.06)",
                  }}
                >
                  <div className="text-2xl mb-1.5">{item.icon}</div>
                  <p
                    className="text-[10px] uppercase tracking-widest mb-0.5"
                    style={{ color: "rgba(156, 128, 96, 1)" }}
                  >
                    {item.label}
                  </p>
                  <p className="text-[12px] font-semibold" style={{ color: "rgba(92, 74, 42, 1)" }}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Formulario o confirmación */}
            {sent ? (
              <div
                className="rounded-2xl p-10 text-center animate-fadeInUp opacity-0"
                style={{
                  background: "rgba(255, 249, 242, 1)",
                  border: "0.5px solid rgba(150, 95, 33, 0.18)",
                  boxShadow: "0 4px 24px rgba(150, 95, 33, 0.08)",
                }}
              >
                <span className="text-5xl block mb-4">✉️</span>
                <h3
                  className="text-[22px] font-semibold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
                >
                  ¡Mensaje enviado!
                </h3>
                <p className="text-[14px] mb-6" style={{ color: "rgba(156, 128, 96, 1)" }}>
                  Hemos recibido tu consulta y te responderemos en menos de 24h.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ ...form, message: "" }); }}
                  className="px-6 py-2.5 rounded-xl text-[13px] font-medium"
                  style={{ background: "rgba(150, 95, 33, 1)", color: "rgba(255, 249, 242, 1)" }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 animate-fadeInUp delay-200 opacity-0"
                style={{
                  background: "rgba(255, 249, 242, 1)",
                  border: "0.5px solid rgba(150, 95, 33, 0.18)",
                  boxShadow: "0 4px 24px rgba(150, 95, 33, 0.08)",
                }}
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <InputField label="Nombre *">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Tu nombre"
                      className="h-11 px-4 rounded-xl text-[14px] outline-none transition-all"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(150, 95, 33, 1)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(150, 95, 33, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(150, 95, 33, 0.25)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </InputField>
                  <InputField label="Email *">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      className="h-11 px-4 rounded-xl text-[14px] outline-none transition-all"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(150, 95, 33, 1)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(150, 95, 33, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(150, 95, 33, 0.25)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </InputField>
                </div>

                <InputField label="Asunto">
                  <select
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className="h-11 px-4 rounded-xl text-[14px] outline-none transition-all cursor-pointer"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 1)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(150, 95, 33, 0.25)")}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </InputField>

                <div className="mt-4">
                  <InputField label="Mensaje *">
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Describe tu consulta con el mayor detalle posible..."
                      rows={5}
                      className="px-4 py-3 rounded-xl text-[14px] outline-none transition-all resize-none"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(150, 95, 33, 1)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(150, 95, 33, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(150, 95, 33, 0.25)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </InputField>
                </div>

                {error && (
                  <p
                    className="text-[12px] mt-3"
                    style={{ color: "rgba(180, 50, 50, 1)" }}
                  >
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-5 flex items-center justify-center gap-2 rounded-xl text-[15px] font-medium transition-all duration-200 active:scale-[0.99]"
                  style={{
                    background: loading ? "rgba(150, 95, 33, 0.5)" : "rgba(150, 95, 33, 1)",
                    color: "rgba(255, 249, 242, 1)",
                  }}
                  onMouseEnter={(e) =>
                    !loading && (e.currentTarget.style.background = "rgba(110, 68, 18, 1)")
                  }
                  onMouseLeave={(e) =>
                    !loading && (e.currentTarget.style.background = "rgba(150, 95, 33, 1)")
                  }
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>📤 Enviar mensaje</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}