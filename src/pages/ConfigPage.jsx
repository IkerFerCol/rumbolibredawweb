import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";

// ─── Estilos de animación ─────────────────────────────────────────────────────
const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .opacity-0 { opacity: 0; }
`;

// ─── Iconos SVG ───────────────────────────────────────────────────────────────
const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const EyeIcon = ({ open }) =>
    open ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

const ThemeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        <circle cx="12" cy="12" r="4" />
    </svg>
);

const CurrencyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const LanguageIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const SaveIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m2 7 10 7 10-7" />
    </svg>
);

// ─── Toast Notification ──────────────────────────────────────────────────────
const Toast = ({ message, type = "success", visible }) => (
    <div
        className="fixed top-4 left-1/2 z-50 px-5 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-300"
        style={{
            transform: `translateX(-50%) translateY(${visible ? "0" : "-80px"})`,
            background: type === "success" ? "rgba(74, 140, 63, 1)" : "rgba(226, 80, 58, 1)",
            color: "white",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
    >
        {message}
    </div>
);

// ─── Sección de Configuración ────────────────────────────────────────────────
const ConfigSection = ({ icon, title, description, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-[rgba(150,95,33,0.12)] dark:border-gray-700 shadow-sm transition-colors duration-300"
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(150,95,33,0.08)] text-[#965f21] dark:text-[#b8753b]">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-[15px] text-[#1a1208] dark:text-gray-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {title}
                </h3>
                <p className="text-xs text-[#9c8060] dark:text-gray-400">
                    {description}
                </p>
            </div>
        </div>
        {children}
    </motion.div>
);

// ─── Input Field ─────────────────────────────────────────────────────────────
const InputField = ({ label, id, type = "text", placeholder, value, onChange, icon, rightElement, disabled }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-400">
            {label}
        </label>
        <div className="relative flex items-center">
            {icon && (
                <span className="absolute left-3 pointer-events-none text-[rgba(150,95,33,0.55)] dark:text-gray-500">
                    {icon}
                </span>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full h-11 pl-9 pr-10 text-sm rounded-xl border outline-none transition-all duration-200 placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed
                   bg-[#faf7f2] dark:bg-gray-700 
                   border-[rgba(150,95,33,0.25)] dark:border-gray-600 
                   text-[#1a1208] dark:text-gray-100
                   focus:border-[#965f21] dark:focus:border-[#b8753b] 
                   focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)] dark:focus:shadow-[0_0_0_3px_rgba(184,117,59,0.2)]
                   focus:bg-[#fff9f2] dark:focus:bg-gray-600"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {rightElement && <div className="absolute right-2">{rightElement}</div>}
        </div>
    </div>
);

// ─── Select Field ────────────────────────────────────────────────────────────
const SelectField = ({ label, id, value, onChange, options, icon }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-400">
            {label}
        </label>
        <div className="relative flex items-center">
            {icon && (
                <span className="absolute left-3 pointer-events-none z-10 text-[rgba(150,95,33,0.55)] dark:text-gray-500">
                    {icon}
                </span>
            )}
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="w-full h-11 pl-9 pr-10 text-sm rounded-xl border outline-none transition-all duration-200 cursor-pointer appearance-none
                   bg-[#faf7f2] dark:bg-gray-700 
                   border-[rgba(150,95,33,0.25)] dark:border-gray-600 
                   text-[#1a1208] dark:text-gray-100
                   focus:border-[#965f21] dark:focus:border-[#b8753b] 
                   focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)] dark:focus:shadow-[0_0_0_3px_rgba(184,117,59,0.2)]
                   focus:bg-[#fff9f2] dark:focus:bg-gray-600"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <span className="absolute right-3 pointer-events-none text-[rgba(150,95,33,0.55)] dark:text-gray-500 text-[10px]">
                ▼
            </span>
        </div>
    </div>
);

// ─── PÁGINA PRINCIPAL ───────────────────────────────────────────────────────
export default function ConfiguracionPage() {
    const { user } = useAuth();
    const { preferences, updatePreference } = useSettings();
    const [toast, setToast] = useState({ message: "", type: "success", visible: false });
    const [isSaving, setIsSaving] = useState(false);

    // Datos del perfil
    const [profileData, setProfileData] = useState({
        nombre: "",
        apellidos: "",
        email: "",
    });

    // Datos de cambio de contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    // Cargar datos del usuario
    useEffect(() => {
        if (user) {
            setProfileData({
                nombre: user.nombre || "",
                apellidos: user.apellidos || "",
                email: user.email || "",
            });
        }
    }, [user]);


    document.documentElement.classList.toggle('dark');


    // Mostrar toast
    const showToast = (message, type = "success") => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast({ message: "", type: "success", visible: false }), 2800);
    };

    // ✅ Manejar cambio de tema (cambio inmediato)
    const handleThemeChange = (e) => {
        updatePreference("theme", e.target.value);
    };

    // ✅ Manejar cambio de divisa (cambio inmediato)
    const handleCurrencyChange = (e) => {
        updatePreference("currency", e.target.value);
    };

    // ✅ Manejar cambio de idioma (cambio inmediato)
    const handleLanguageChange = (e) => {
        updatePreference("language", e.target.value);
    };

    // ─── GUARDAR PERFIL ──────────────────────────────────────────────────
    const handleSaveProfile = async () => {
        if (!profileData.nombre.trim()) {
            showToast("El nombre es obligatorio", "error");
            return;
        }

        setIsSaving(true);
        try {
            const updateData = {
                nombre: profileData.nombre.trim(),
                apellidos: profileData.apellidos.trim(),
                email: profileData.email.trim(),
                telefono: user?.telefono || "",
                rol: user?.rol || "USER",
            };

            await api.put(`/usuarios/${user.id}`, updateData);

            const updatedUser = { ...user, nombre: profileData.nombre.trim(), apellidos: profileData.apellidos.trim() };
            localStorage.setItem("rl_user", JSON.stringify(updatedUser));

            showToast("Perfil actualizado correctamente ✈");
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            const mensaje = error.response?.data?.mensaje || error.response?.data?.message || "Error al actualizar el perfil";
            showToast(mensaje, "error");
        } finally {
            setIsSaving(false);
        }
    };

    // ─── CAMBIAR CONTRASEÑA ──────────────────────────────────────────────
    const handleChangePassword = async () => {
        if (!passwordData.currentPassword) {
            showToast("Ingresa tu contraseña actual", "error");
            return;
        }
        if (!passwordData.newPassword) {
            showToast("Ingresa la nueva contraseña", "error");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showToast("La nueva contraseña debe tener al menos 6 caracteres", "error");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("Las contraseñas no coinciden", "error");
            return;
        }

        setIsSaving(true);
        try {
            const updateData = {
                nombre: user.nombre,
                apellidos: user.apellidos || "",
                email: user.email,
                telefono: user.telefono || "",
                password: passwordData.newPassword,
                rol: user.rol || "USER",
            };

            await api.put(`/usuarios/${user.id}`, updateData);

            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            showToast("Contraseña actualizada correctamente 🔒");
        } catch (error) {
            console.error("Error cambiando contraseña:", error);
            const mensaje = error.response?.data?.mensaje || error.response?.data?.message || "Error al cambiar la contraseña";
            showToast(mensaje, "error");
        } finally {
            setIsSaving(false);
        }
    };

    const currencyOptions = [
        { value: "EUR", label: "€ Euro (EUR)" },
        { value: "GBP", label: "£ Libra esterlina (GBP)" },
        { value: "USD", label: "$ Dólar estadounidense (USD)" },
    ];

    const languageOptions = [
        { value: "es", label: "🇪🇸 Español" },
        { value: "en", label: "🇬🇧 English" },
    ];

    return (
        <>
            <style>{animationStyles}</style>
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                <Header />

                <Toast message={toast.message} type={toast.type} visible={toast.visible} />

                <main className="flex-grow max-w-3xl mx-auto px-4 py-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1
                            className="text-3xl font-bold mb-2 text-[#1a1208] dark:text-white"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Configuración
                        </h1>
                        <p className="text-sm text-[#9c8060] dark:text-gray-400">
                            Personaliza tu experiencia en RumboLibre
                        </p>
                    </motion.div>

                    {/* PERFIL */}
                    <ConfigSection
                        icon={<UserIcon />}
                        title="Información personal"
                        description="Actualiza tu nombre y datos de contacto"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InputField
                                label="Nombre"
                                id="profile-name"
                                placeholder="Tu nombre"
                                value={profileData.nombre}
                                onChange={(e) => setProfileData((p) => ({ ...p, nombre: e.target.value }))}
                                icon={<UserIcon />}
                            />
                            <InputField
                                label="Apellidos"
                                id="profile-lastname"
                                placeholder="Tus apellidos"
                                value={profileData.apellidos}
                                onChange={(e) => setProfileData((p) => ({ ...p, apellidos: e.target.value }))}
                                icon={<UserIcon />}
                            />
                        </div>
                        <InputField
                            label="Correo electrónico"
                            id="profile-email"
                            type="email"
                            placeholder="tu@email.com"
                            value={profileData.email}
                            disabled
                            icon={<MailIcon />}
                        />
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="mt-4 w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50
                         bg-[#965f21] hover:bg-[#6e4412] text-white border-none cursor-pointer"
                        >
                            <SaveIcon />
                            {isSaving ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </ConfigSection>

                    {/* CONTRASEÑA */}
                    <ConfigSection
                        icon={<LockIcon />}
                        title="Cambiar contraseña"
                        description="Actualiza tu contraseña de acceso"
                    >
                        <div className="grid grid-cols-1 gap-4">
                            <InputField
                                label="Contraseña actual"
                                id="current-password"
                                type={showCurrentPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                                icon={<LockIcon />}
                                rightElement={
                                    <button
                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                        className="p-1 opacity-50 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-[#5c4a2a] dark:text-gray-400"
                                    >
                                        <EyeIcon open={showCurrentPass} />
                                    </button>
                                }
                            />
                            <InputField
                                label="Nueva contraseña"
                                id="new-password"
                                type={showNewPass ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                                icon={<LockIcon />}
                                rightElement={
                                    <button
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="p-1 opacity-50 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-[#5c4a2a] dark:text-gray-400"
                                    >
                                        <EyeIcon open={showNewPass} />
                                    </button>
                                }
                            />
                            <InputField
                                label="Confirmar nueva contraseña"
                                id="confirm-password"
                                type="password"
                                placeholder="Repite la nueva contraseña"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                                icon={<LockIcon />}
                            />
                        </div>
                        <button
                            onClick={handleChangePassword}
                            disabled={isSaving}
                            className="mt-4 w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50
                         bg-[#965f21] hover:bg-[#6e4412] text-white border-none cursor-pointer"
                        >
                            <LockIcon />
                            {isSaving ? "Actualizando..." : "Cambiar contraseña"}
                        </button>
                    </ConfigSection>

                    {/* ✅ PREFERENCIAS - CAMBIO INMEDIATO */}
                    {/* PREFERENCIAS */}
                    <ConfigSection
                        icon={<ThemeIcon />}
                        title="Preferencias"
                        description="Los cambios se aplican automáticamente"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* 🌙 / ☀️ TEMA (esto activa dark mode) */}
                            <SelectField
                                label="Tema"
                                id="theme-select"
                                icon={<ThemeIcon />}
                                value={preferences.theme}
                                onChange={(e) => updatePreference("theme", e.target.value)}
                                options={[
                                    { value: "light", label: "☀️ Claro" },
                                    { value: "dark", label: "🌙 Oscuro" },
                                ]}
                            />

                            

                            {/* 💱 DIVISA */}
                            <SelectField
                                label="Divisa"
                                id="currency-select"
                                icon={<CurrencyIcon />}
                                value={preferences.currency}
                                onChange={(e) => updatePreference("currency", e.target.value)}
                                options={[
                                    { value: "EUR", label: "€ Euro (EUR)" },
                                    { value: "GBP", label: "£ Libra esterlina (GBP)" },
                                    { value: "USD", label: "$ Dólar estadounidense (USD)" },
                                ]}
                            />

                            {/* 🌐 IDIOMA */}
                            <SelectField
                                label="Idioma"
                                id="language-select"
                                icon={<LanguageIcon />}
                                value={preferences.language}
                                onChange={(e) => updatePreference("language", e.target.value)}
                                options={[
                                    { value: "es", label: "🇪🇸 Español" },
                                    { value: "en", label: "🇬🇧 English" },
                                ]}
                            />

                        </div>

                        <p className="mt-4 text-xs text-[#9c8060] dark:text-gray-400 flex items-center gap-1">
                            <span>✅</span> Los cambios se guardan automáticamente
                        </p>
                    </ConfigSection>

                    {/* INFORMACIÓN DE LA CUENTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-8 border border-[rgba(150,95,33,0.12)] dark:border-gray-700 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(150,95,33,0.08)] text-[#965f21] dark:text-[#b8753b]">
                                <UserIcon />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[15px] text-[#1a1208] dark:text-gray-100">
                                    Información de la cuenta
                                </h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#9c8060] dark:text-gray-400">Rol</p>
                                <p className="font-medium text-[#1a1208] dark:text-gray-100">{user?.rol || "Usuario"}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#9c8060] dark:text-gray-400">ID de usuario</p>
                                <p className="font-medium text-[#1a1208] dark:text-gray-100">#{user?.id || "—"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs uppercase tracking-wider text-[#9c8060] dark:text-gray-400">Email</p>
                                <p className="font-medium text-[#1a1208] dark:text-gray-100">{user?.email || "—"}</p>
                            </div>
                        </div>
                    </motion.div>
                </main>

                <Footer />
            </div>
        </>
    );
}