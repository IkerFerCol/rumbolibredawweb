import React from "react";

export default function Footer() {
    return (
        <footer
            className="w-full py-6 mt-auto text-center"
            style={{
                background: "rgba(53, 39, 24, 0.65)", // 0.85 = 85% opaco, 15% transparente
                color: "rgba(255, 249, 242, 1)",
                fontFamily: "'DM Sans', sans-serif",
                backdropFilter: "blur(8px)", // opcional: añade efecto de desenfoque
            }}
        >
            <p className="text-sm">
                &copy; {new Date().getFullYear()} RumboLibre. Todos los derechos reservados.
            </p>
            <p className="text-xs mt-1">
                <span className="underline cursor-pointer">Términos y condiciones</span> |{" "}
                <span className="underline cursor-pointer">Política de privacidad</span>
            </p>
        </footer>
    );
}