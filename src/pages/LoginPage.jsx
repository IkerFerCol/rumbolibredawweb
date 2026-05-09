import { useState } from "react";
import fondo from "../assets/fondoavionloginregister.jpg";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";


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

// ─── Formulario: Login ────────────────────────────────────────────────────────
const LoginForm = ({ onToast }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      onToast("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      onToast("Login correcto ✈");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      onToast(result.message || "Credenciales incorrectas");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-0">
      <h2
        className="text-[19px] font-medium mb-1 animate-fadeInUp delay-100 opacity-0"
        style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
      >
        Bienvenido de vuelta
      </h2>
      <p
        className="text-[13px] font-light mb-6 animate-fadeInUp delay-200 opacity-0"
        style={{ color: "rgba(156, 128, 96, 1)" }}
      >
        Accede a tus reservas y vuelos
      </p>

      <div className="flex flex-col gap-4 mb-4">
        <InputField
          label="Correo electrónico"
          id="login-email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<MailIcon />}
        />
        <InputField
          label="Contraseña"
          id="login-pass"
          type={showPass ? "text" : "password"}
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      </div>

      <div className="flex justify-end mb-1">
        <button
          onClick={() => onToast("Revisa tu correo para restablecer tu contraseña")}
          className="text-[12px] underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "rgba(150, 95, 33, 1)", fontFamily: "'DM Sans', sans-serif" }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

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
        {isLoading ? "Iniciando sesión..." : "Entrar a mi cuenta"}
      </button>



      <div className="mt-6 text-center">
        <span
          className="text-[12px]"
          style={{ color: "rgba(156, 128, 96, 1)" }}
        >
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "rgba(150, 95, 33, 1)" }}
          >
            Crea una aquí
          </a>
        </span>
      </div>
    </div>
  );
};

// ─── Componente principal: LoginPage ────────────────────────────────────────
export default function LoginPage() {
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  return (
    <>
      <style>{animationStyles}</style>
      
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex flex-col relative"
        style={{
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <div
          className="fixed inset-0 -z-10 animate-fadeIn"
          style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />

        <div
          className="fixed inset-0 -z-10 animate-fadeIn"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8))"
          }}
        />

        <Toast message={toast.message} visible={toast.visible} />

        <div className="flex-grow flex flex-col items-center justify-center pt-10 pb-8 px-4">
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

          <div
            className="w-full max-w-[420px] rounded-[20px] p-8 relative z-10 animate-fadeInUp delay-300 opacity-0"
            style={{
              background: "rgba(255, 249, 242, 1)",
              border: "0.5px solid rgba(150, 95, 33, 0.22)",
              boxShadow: "0 2px 32px rgba(150,95,33,0.07)",
            }}
          >
            <div className="mb-2">
              <h1
                className="text-[24px] font-medium text-center"
                style={{ fontFamily: "'Playfair Display', serif", color: "rgba(26, 18, 8, 1)" }}
              >
                Iniciar Sesión
              </h1>
            </div>

            <LoginForm onToast={showToast} />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}