import React from "react";

export default function Footer() {
    return (
        <footer
            className="w-full py-6 mt-auto text-center bg-[rgba(53,39,24,0.65)] dark:bg-[rgba(17,24,39,0.9)] backdrop-blur-[8px] text-white dark:text-gray-200 transition-colors duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <p className="text-sm">
                &copy; {new Date().getFullYear()} RumboLibre. Todos los derechos reservados.
            </p>
            <p className="text-xs mt-1 text-[rgba(255,249,242,0.8)] dark:text-gray-400">
                <span className="underline cursor-pointer hover:text-white dark:hover:text-gray-200 transition-colors">Términos y condiciones</span>{" "}
                |{" "}
                <span className="underline cursor-pointer hover:text-white dark:hover:text-gray-200 transition-colors">Política de privacidad</span>
            </p>
        </footer>
    );
}