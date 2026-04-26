import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logorumbolibre.png";

// ─── Iconos ───────────────────────────────────────────────────────────────────
const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const PlaneLogo = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
);

// ─── Componente Header ────────────────────────────────────────────────────────
export default function Header() {
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [usuarioMenuAbierto, setUsuarioMenuAbierto] = useState(false);

    // Verificar si el usuario está autenticado (puedes ajustar según tu lógica de autenticación)
    const isAuthenticated = !!localStorage.getItem("token");

    // Obtener datos del usuario (ajusta según tu estructura)
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
    };

    const navItems = [
        { nombre: "Inicio", ruta: "/" },
        { nombre: "Foro", ruta: "/foro" },
        { nombre: "Ciudades", ruta: "/ciudades" },
        { nombre: "Contacto", ruta: "/contacto" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full" style={{ background: "#fff9f2", borderBottom: "1px solid rgba(150,95,33,0.1)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img
                            src={logo}
                            alt="RumboLibre"
                            className="h-15 w-auto"
                        />
                        <span
                            className="text-xl md:text-2xl font-bold transition-colors duration-200"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                color: "rgba(26,18,8,1)"
                            }}
                        >
                            RumboLibre
                        </span>
                    </Link>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.nombre}
                                to={item.ruta}
                                className="relative text-sm font-medium transition-colors duration-200 group"
                                style={{ color: "rgba(92,74,42,1)" }}
                            >
                                {item.nombre}
                                <span
                                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                                    style={{ background: "rgba(150,95,33,1)" }}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Área de usuario Desktop */}
                    <div className="hidden md:block relative">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUsuarioMenuAbierto(!usuarioMenuAbierto)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
                                    style={{
                                        background: usuarioMenuAbierto ? "rgba(150,95,33,0.1)" : "transparent",
                                        color: "rgba(150,95,33,1)",
                                        border: "1px solid rgba(150,95,33,0.2)"
                                    }}
                                >
                                    <UserIcon />
                                    <span className="text-sm font-medium">
                                        {usuario.nombre || usuario.email || "Mi cuenta"}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {usuarioMenuAbierto && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden"
                                            style={{ background: "white", border: "1px solid rgba(150,95,33,0.1)" }}
                                        >
                                            <Link
                                                to="/perfil"
                                                className="block px-4 py-2 text-sm transition-colors duration-200"
                                                style={{ color: "rgba(92,74,42,1)" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(150,95,33,0.05)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                            >
                                                Mi perfil
                                            </Link>
                                            <Link
                                                to="/mis-reservas"
                                                className="block px-4 py-2 text-sm transition-colors duration-200"
                                                style={{ color: "rgba(92,74,42,1)" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(150,95,33,0.05)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                            >
                                                Mis reservas
                                            </Link>
                                            {usuario.rol === "ADMIN" && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-sm transition-colors duration-200"
                                                    style={{ color: "rgba(150,95,33,1)" }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(150,95,33,0.05)")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                >
                                                    Panel de administración
                                                </Link>
                                            )}
                                            <hr style={{ borderColor: "rgba(150,95,33,0.1)" }} />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-2"
                                                style={{ color: "rgba(220,53,69,1)" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,53,69,0.05)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                            >
                                                <LogoutIcon />
                                                Cerrar sesión
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                                    style={{ color: "rgba(150,95,33,1)" }}
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                                    style={{ background: "rgba(150,95,33,1)", color: "white" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110,68,18,1)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(150,95,33,1)")}
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Botón menú móvil */}
                    <button
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        className="md:hidden p-2 rounded-lg transition-colors duration-200"
                        style={{ color: "rgba(150,95,33,1)" }}
                    >
                        {menuAbierto ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Menú móvil */}
            <AnimatePresence>
                {menuAbierto && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden"
                        style={{ background: "#fff9f2", borderTop: "1px solid rgba(150,95,33,0.1)" }}
                    >
                        <div className="px-4 py-4 space-y-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.nombre}
                                    to={item.ruta}
                                    onClick={() => setMenuAbierto(false)}
                                    className="block py-2 text-base font-medium transition-colors duration-200"
                                    style={{ color: "rgba(92,74,42,1)" }}
                                >
                                    {item.nombre}
                                </Link>
                            ))}

                            <hr style={{ borderColor: "rgba(150,95,33,0.1)" }} />

                            {isAuthenticated ? (
                                <>
                                    <div className="py-2 text-sm" style={{ color: "rgba(92,74,42,1)" }}>
                                        <p className="font-medium">{usuario.nombre || usuario.email}</p>
                                    </div>
                                    <Link
                                        to="/perfil"
                                        onClick={() => setMenuAbierto(false)}
                                        className="block py-2 text-base font-medium transition-colors duration-200"
                                        style={{ color: "rgba(92,74,42,1)" }}
                                    >
                                        Mi perfil
                                    </Link>
                                    <Link
                                        to="/mis-reservas"
                                        onClick={() => setMenuAbierto(false)}
                                        className="block py-2 text-base font-medium transition-colors duration-200"
                                        style={{ color: "rgba(92,74,42,1)" }}
                                    >
                                        Mis reservas
                                    </Link>
                                    {usuario.rol === "ADMIN" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setMenuAbierto(false)}
                                            className="block py-2 text-base font-medium transition-colors duration-200"
                                            style={{ color: "rgba(150,95,33,1)" }}
                                        >
                                            Panel de administración
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMenuAbierto(false);
                                        }}
                                        className="w-full text-left py-2 text-base font-medium transition-colors duration-200 flex items-center gap-2"
                                        style={{ color: "rgba(220,53,69,1)" }}
                                    >
                                        <LogoutIcon />
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2 pt-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuAbierto(false)}
                                        className="block w-full text-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                                        style={{ border: "1px solid rgba(150,95,33,0.3)", color: "rgba(150,95,33,1)" }}
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMenuAbierto(false)}
                                        className="block w-full text-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                                        style={{ background: "rgba(150,95,33,1)", color: "white" }}
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}