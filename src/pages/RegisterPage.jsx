import { useState } from "react";
import fondo from "../assets/fondoavionloginregister.jpg";
import Footer from "../components/Footer";
import api from "../services/api";
import logo from "../assets/logorumbolibre.png";

// ─── Estilos de animación ─────────────────────────────────────────────────────
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out forwards;
  }
  
  .delay-100 {
    animation-delay: 0.1s;
  }
  
  .delay-200 {
    animation-delay: 0.2s;
  }
  
  .delay-300 {
    animation-delay: 0.3s;
  }
  
  .delay-400 {
    animation-delay: 0.4s;
  }
  
  .opacity-0 {
    opacity: 0;
  }
`;

// ─── Paleta de colores AirGold ────────────────────────────────────────────────
// Color principal: rgba(150, 95, 33, 1)  →  #965f21

// ─── Icono de avión ───────────────────────────────────────────────────────────
const PlaneIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

// ─── Icono ojo ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

// ─── Iconos de campos ─────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.02-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ─── Google Icon ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-1.12.69-1.87 1.86-1.87 3.19.02 1.63 1.09 3.07 2.66 3.64-.33.96-.76 1.9-1.34 2.79zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

// ─── Componente: Campo de texto con icono ─────────────────────────────────────
const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  rightElement,
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-[11px] font-medium uppercase tracking-widest"
      style={{ color: "rgba(92, 74, 42, 1)" }}
    >
      {label}
    </label>
    <div className="relative flex items-center">
      <span
        className="absolute left-3 pointer-events-none"
        style={{ color: "rgba(150, 95, 33, 0.55)" }}
      >
        {icon}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-11 pl-9 pr-10 text-sm rounded-xl border outline-none transition-all duration-200 placeholder:font-light"
        style={{
          background: "rgba(250, 247, 242, 1)",
          borderColor: "rgba(150, 95, 33, 0.25)",
          color: "rgba(26, 18, 8, 1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(150, 95, 33, 1)";
          e.target.style.boxShadow = "0 0 0 3px rgba(150, 95, 33, 0.1)";
          e.target.style.background = "rgba(255, 249, 242, 1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(150, 95, 33, 0.25)";
          e.target.style.boxShadow = "none";
          e.target.style.background = "rgba(250, 247, 242, 1)";
        }}
      />
      {rightElement && (
        <div className="absolute right-2">{rightElement}</div>
      )}
    </div>
  </div>
);

// ─── Componente: Barra de fortaleza de contraseña ─────────────────────────────
const PasswordStrength = ({ password }) => {
  const getScore = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    return s;
  };

  const score = password ? getScore(password) : 0;
  const colors = ["", "#e2503a", "#e2503a", "#d4900f", "#4a8c3f"];
  const labels = ["", "Débil", "Débil", "Media", "Fuerte"];

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{
              background:
                score >= i
                  ? colors[score]
                  : "rgba(150, 95, 33, 0.12)",
            }}
          />
        ))}
      </div>
      {score > 0 && (
        <span className="text-[11px]" style={{ color: colors[score] }}>
          Contraseña {labels[score]}
        </span>
      )}
    </div>
  );
};

// ─── Componente: Toast notification ──────────────────────────────────────────
const Toast = ({ message, visible }) => (
  <div
    className="absolute top-4 left-1/2 z-50 px-5 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-300"
    style={{
      transform: `translateX(-50%) translateY(${visible ? "0" : "-80px"})`,
      background: "rgba(110, 68, 18, 1)",
      color: "rgba(255, 249, 242, 1)",
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: "0 4px 20px rgba(110,68,18,0.3)",
    }}
  >
    {message}
  </div>
);

// ─── Componente: Botón social ─────────────────────────────────────────────────
const SocialButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl border text-[13px] transition-all duration-200"
    style={{
      background: "rgba(250, 247, 242, 1)",
      borderColor: "rgba(150, 95, 33, 0.22)",
      color: "rgba(92, 74, 42, 1)",
      fontFamily: "'DM Sans', sans-serif",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(150, 95, 33, 0.45)";
      e.currentTarget.style.background = "rgba(150, 95, 33, 0.06)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(150, 95, 33, 0.22)";
      e.currentTarget.style.background = "rgba(250, 247, 242, 1)";
    }}
  >
    {icon}
    {label}
  </button>
);

// ─── Formulario: Registro ─────────────────────────────────────────────────────
const RegisterForm = ({ onToast }) => {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const update = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async () => {
    // Validación de campos requeridos
    if (!form.name || !form.name.trim()) {
      onToast("Por favor ingresa tu nombre");
      return;
    }

    if (!form.lastname || !form.lastname.trim()) {
      onToast("Por favor ingresa tu apellido");
      return;
    }

    if (!form.email || !form.email.trim()) {
      onToast("Por favor ingresa tu correo electrónico");
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      onToast("Por favor ingresa un correo electrónico válido");
      return;
    }

    if (!form.password) {
      onToast("Por favor ingresa una contraseña");
      return;
    }

    if (form.password.length < 6) {
      onToast("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!form.terms) {
      onToast("Acepta los términos para continuar");
      return;
    }

    setIsLoading(true);

    try {
      // Temporalmente remover el token para el registro
      const token = localStorage.getItem("token");
      const originalAuth = api.defaults.headers.common["Authorization"];
      if (token) {
        delete api.defaults.headers.common["Authorization"];
      }

      // Enviar datos con los nombres de campos que espera el backend
      // Según el error: espera "nombre" y "apellidos" (en plural)
      const userData = {
        nombre: form.name.trim(),
        apellidos: form.lastname.trim(),  // Nota: "apellidos" en plural
        email: form.email.trim().toLowerCase(),
        telefono: form.phone?.trim() || "",
        password: form.password,
      };

      console.log("Enviando datos de registro:", userData);

      const response = await api.post("/usuarios/register", userData);

      console.log("Respuesta exitosa:", response.data);

      // Restaurar el token
      if (token) {
        api.defaults.headers.common["Authorization"] = originalAuth;
      }

      onToast("¡Cuenta creada con éxito! Por favor inicia sesión ✈");

      // Redirigir al login después de 1.5 segundos
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (error) {
      // Restaurar el token
      const token = localStorage.getItem("token");
      if (token) {
        const originalAuth = api.defaults.headers.common["Authorization"];
        if (originalAuth !== `Bearer ${token}`) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      }

      console.error("Error en registro:", error);

      // Mostrar detalles específicos del error
      if (error.response?.data) {
        console.error("Datos del error:", error.response.data);

        const errorData = error.response.data;

        if (errorData.errores) {
          // Mostrar el primer error de validación
          const primerError = Object.values(errorData.errores)[0];
          onToast(primerError || "Error de validación en los datos");
        }
        else if (errorData.mensaje) {
          onToast(errorData.mensaje);
        }
        else {
          onToast("Error al crear la cuenta. Verifica los datos ingresados");
        }
      } else if (error.request) {
        console.error("No se recibió respuesta:", error.request);
        onToast("No se pudo conectar con el servidor");
      } else {
        console.error("Error al configurar la petición:", error.message);
        onToast("Error al crear la cuenta. Intenta nuevamente");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Encabezado */}
      <h2
        className="text-[19px] font-medium mb-1 animate-fadeInUp delay-100 opacity-0"
        style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
      >
        Únete a RumboLibre
      </h2>
      <p
        className="text-[13px] font-light mb-6 animate-fadeInUp delay-200 opacity-0"
        style={{ color: "rgba(156, 128, 96, 1)" }}
      >
        Crea tu cuenta y empieza a volar
      </p>

      {/* Campos */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Nombre y Apellido */}
        <div className="flex gap-2.5">
          <div className="flex-1">
            <InputField
              label="Nombre"
              id="reg-name"
              placeholder="Carlos"
              value={form.name}
              onChange={update("name")}
              icon={<UserIcon />}
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Apellidos"
              id="reg-lastname"
              placeholder="Ruiz Pérez"
              value={form.lastname}
              onChange={update("lastname")}
              icon={<UserIcon />}
            />
          </div>
        </div>

        <InputField
          label="Correo electrónico"
          id="reg-email"
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={update("email")}
          icon={<MailIcon />}
        />

        <InputField
          label="Teléfono (opcional)"
          id="reg-phone"
          placeholder="+34 600 000 000"
          value={form.phone}
          onChange={update("phone")}
          icon={<PhoneIcon />}
        />

        {/* Contraseña con indicador de fortaleza */}
        <div className="flex flex-col gap-0">
          <InputField
            label="Contraseña"
            id="reg-pass"
            type={showPass ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={update("password")}
            icon={<LockIcon />}
            rightElement={
              <button
                onClick={() => setShowPass(!showPass)}
                className="p-1 opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "rgba(92, 74, 42, 1)" }}
              >
                <EyeIcon open={showPass} />
              </button>
            }
          />
          <PasswordStrength password={form.password} />
        </div>
      </div>

      {/* Términos y condiciones */}
      <label className="flex items-start gap-2.5 cursor-pointer mb-1">
        <input
          type="checkbox"
          checked={form.terms}
          onChange={update("terms")}
          className="mt-0.5 w-4 h-4 rounded"
          style={{ accentColor: "rgba(150, 95, 33, 1)" }}
        />
        <span
          className="text-[12px] leading-relaxed font-normal"
          style={{ color: "rgba(156, 128, 96, 1)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Acepto los{" "}
          <span
            className="underline underline-offset-2 cursor-pointer"
            style={{ color: "rgba(150, 95, 33, 1)" }}
          >
            Términos y condiciones
          </span>{" "}
          y la{" "}
          <span
            className="underline underline-offset-2 cursor-pointer"
            style={{ color: "rgba(150, 95, 33, 1)" }}
          >
            Política de privacidad
          </span>{" "}
          de RumboLibre
        </span>
      </label>

      {/* Botón principal */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full h-12 mt-4 flex items-center justify-center gap-2 rounded-xl text-[15px] font-medium transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "rgba(150, 95, 33, 1)",
          color: "rgba(255, 249, 242, 1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) e.currentTarget.style.background = "rgba(110, 68, 18, 1)";
        }}
        onMouseLeave={(e) => {
          if (!isLoading) e.currentTarget.style.background = "rgba(150, 95, 33, 1)";
        }}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <PlaneIcon className="w-4 h-4" />
        )}
        {isLoading ? "Creando cuenta..." : "Crear mi cuenta"}
      </button>

      {/* Divisor */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "rgba(150, 95, 33, 0.18)" }} />
        <span
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "rgba(156, 128, 96, 1)" }}
        >
          o regístrate con
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(150, 95, 33, 0.18)" }} />
      </div>

      {/* Botones sociales */}
      <div className="flex gap-2.5">
        <SocialButton
          icon={<GoogleIcon />}
          label="Google"
          onClick={() => onToast("Conectando con Google...")}
        />
        <SocialButton
          icon={<AppleIcon />}
          label="Apple"
          onClick={() => onToast("Conectando con Apple...")}
        />
      </div>
    </div>
  );
};

// ─── Componente principal: RegisterPage (CON ANIMACIONES) ────────────
export default function RegisterPage() {
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  return (
    <>
      <style>{animationStyles}</style>
      
      {/* Fuentes de Google */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Contenedor principal con flex column y min-h-screen */}
      <div
        className="min-h-screen flex flex-col relative"
        style={{
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        {/* Fondo imagen */}
        <div
          className="fixed inset-0 -z-10 animate-fadeIn"
          style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />

        {/* Overlay elegante */}
        <div
          className="fixed inset-0 -z-10 animate-fadeIn"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8))"
          }}
        />

        {/* Toast */}
        <Toast message={toast.message} visible={toast.visible} />

        {/* Contenido principal - flex-grow para empujar el footer hacia abajo */}
        <div className="flex-grow flex flex-col items-center justify-center pt-10 pb-8 px-4">
          {/* Marca */}
          <div className="flex flex-col items-center gap-1.5 -mt-16 mb-8 relative z-10 animate-fadeInUp">
            <img
              src={logo}
              alt="RumboLibre"
              className="w-32 h-32 object-cover animate-scaleIn"
            />
          
            <span 
              className="text-[22px] font-semibold tracking-wide animate-fadeInUp delay-100 opacity-0"
              style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255, 249, 242, 1)" }}
            >
              RumboLibre
            </span>
            <span 
              className="text-[11px] uppercase tracking-[0.14em] font-light animate-fadeInUp delay-200 opacity-0"
              style={{ color: "rgba(220, 200, 170, 1)" }}
            >
              Viaja con elegancia
            </span>
          </div>

          {/* Tarjeta */}
          <div
            className="w-full max-w-[420px] rounded-[20px] p-8 relative z-10 animate-fadeInUp delay-300 opacity-0"
            style={{
              background: "rgba(255, 249, 242, 1)",
              border: "0.5px solid rgba(150, 95, 33, 0.22)",
              boxShadow: "0 2px 32px rgba(150,95,33,0.07)",
            }}
          >
            {/* Título del registro */}
            <div className="mb-2">
              <h1
                className="text-[24px] font-medium text-center"
                style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
              >
                Crear Cuenta
              </h1>
            </div>

            {/* Formulario de registro */}
            <RegisterForm onToast={showToast} />

            {/* Enlace para volver al login */}
            <div className="mt-6 text-center">
              <span
                className="text-[12px]"
                style={{ color: "rgba(156, 128, 96, 1)" }}
              >
                ¿Ya tienes una cuenta?{" "}
                <a
                  href="/login"
                  className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: "rgba(150, 95, 33, 1)" }}
                >
                  Inicia sesión
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Footer - siempre al final */}
        <Footer />
      </div>
    </>
  );
}