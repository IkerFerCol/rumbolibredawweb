import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function PoliticaPrivacidad() {
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
              Política de Privacidad
            </h1>
            <p className="text-[#9c8060] mt-2 text-sm">
              Protección de datos de usuarios en RumboLibre
            </p>
          </motion.div>

          <div className="space-y-6">

            <Section title="1. Responsable del tratamiento">
              RumboLibre es responsable del tratamiento de los datos personales recogidos en la plataforma.
            </Section>

            <Section title="2. Datos que recopilamos">
              Recopilamos datos como nombre, email, información de reservas y datos de pago necesarios para procesar vuelos.
            </Section>

            <Section title="3. Finalidad">
              Los datos se utilizan para gestionar reservas, pagos, soporte al cliente y mejoras del servicio.
            </Section>

            <Section title="4. Base legal">
              El tratamiento se basa en la ejecución de un contrato (reserva de vuelos) y consentimiento del usuario.
            </Section>

            <Section title="5. Conservación de datos">
              Los datos se conservan mientras exista relación con el usuario o obligación legal.
            </Section>

            <Section title="6. Compartición de datos">
              No vendemos datos personales. Solo se comparten con aerolíneas y proveedores de pago necesarios para el servicio.
            </Section>

            <Section title="7. Derechos del usuario">
              Puedes acceder, rectificar o eliminar tus datos contactando con soporte de RumboLibre.
            </Section>

            <Section title="8. Seguridad">
              Implementamos medidas técnicas para proteger los datos frente a accesos no autorizados.
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