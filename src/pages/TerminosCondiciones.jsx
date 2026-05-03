import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <Header />

      <div className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a1208] dark:text-gray-100"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Términos y Condiciones
            </h1>
            <p className="text-[#9c8060] mt-2 text-sm">
              Última actualización: Mayo 2026
            </p>
          </motion.div>

          {/* Contenido */}
          <div className="space-y-6">

            <Section title="1. Aceptación de los términos">
              Al utilizar RumboLibre aceptas estos términos. Si no estás de acuerdo, no debes usar la plataforma.
            </Section>

            <Section title="2. Uso del servicio">
              RumboLibre permite buscar, comparar y reservar vuelos. El usuario se compromete a usar la plataforma de forma legal y responsable.
            </Section>

            <Section title="3. Reservas">
              Todas las reservas están sujetas a disponibilidad. La confirmación se realiza una vez completado el pago correctamente.
            </Section>

            <Section title="4. Precios">
              Los precios pueden cambiar sin previo aviso hasta la confirmación final de la reserva.
            </Section>

            <Section title="5. Cancelaciones">
              Las cancelaciones dependerán de la política de la aerolínea correspondiente al vuelo reservado.
            </Section>

            <Section title="6. Responsabilidad">
              RumboLibre no se hace responsable de cambios, retrasos o cancelaciones de aerolíneas.
            </Section>

            <Section title="7. Modificaciones">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
            </Section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl p-5 bg-white dark:bg-gray-800 border border-[rgba(150,95,33,0.15)]"
      style={{
        boxShadow: "0 6px 20px rgba(150,95,33,0.08)"
      }}
    >
      <h2 className="text-[16px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100">
        {title}
      </h2>
      <p className="text-sm text-[#9c8060] leading-relaxed">
        {children}
      </p>
    </motion.div>
  );
}