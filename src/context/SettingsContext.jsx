import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

// ─── Tasas de conversión base EUR ────────────────────────────────────────────
export const CURRENCY_RATES = { EUR: 1, USD: 1.08, GBP: 0.86 };
export const CURRENCY_SYMBOLS = { EUR: "€", USD: "$", GBP: "£" };

// ─── Traducciones ─────────────────────────────────────────────────────────────
export const TRANSLATIONS = {
  es: {
    // Navbar
    nav_home: "Inicio",
    nav_cities: "Ciudades",
    nav_forum: "Foro",
    nav_bookings: "Reservas",
    nav_login: "Iniciar sesión",
    nav_register: "Registrarse",
    nav_config: "Configuración",
    nav_contact: "Contacto",
    nav_logout: "Cerrar sesión",

    // HomePage
    home_title: "Encuentra tu próximo vuelo",
    home_subtitle: "Los mejores precios en vuelos con RumboLibre",
    home_origin: "Origen",
    home_destination: "Destino",
    home_search: "Buscar vuelos",
    home_results: "Resultados de búsqueda",
    home_available: "Vuelos disponibles",
    home_show_all: "← Mostrar todos",
    home_per_person: "por persona",
    home_seats: "plazas",
    home_select: "Seleccionar vuelo ✈",
    home_searching: "Buscando vuelos…",
    home_no_flights: "No hay vuelos disponibles.",
    home_cheap: "Vuelos baratos",
    home_cheap_desc: "Compara y ahorra",
    home_secure: "Pago seguro",
    home_secure_desc: "Transacciones protegidas",
    home_no_fees: "Sin comisiones",
    home_no_fees_desc: "Precios transparentes",
    home_methods: "Múltiples métodos",
    home_methods_desc: "Paga como quieras",

    // Reserva drawer
    booking_title: "Completar reserva",
    booking_passengers: "Número de pasajeros",
    booking_passenger: "Pasajero",
    booking_name: "Nombre",
    booking_lastname: "Apellidos",
    booking_doc_type: "Tipo doc.",
    booking_doc_num: "Nº documento",
    booking_birthdate: "Fecha nacimiento",
    booking_nationality: "Nacionalidad",
    booking_continue: "Continuar al pago →",
    booking_back: "← Volver",
    booking_pay: "Pagar",
    booking_processing: "Procesando...",
    booking_secure: "🔒 Pago cifrado y seguro",
    booking_taxes: "Tasas incluidas",
    booking_luggage: "Equipaje de mano",
    booking_total: "Total",
    booking_flight_x: "Vuelo ×",
    booking_payment: "Método de pago",
    booking_credit: "Crédito",
    booking_debit: "Débito",
    booking_card_num: "Número de tarjeta",
    booking_holder: "Titular",
    booking_expiry: "Caducidad",
    booking_paypal_msg: "Serás redirigido a PayPal para completar el pago.",

    // Modal éxito reserva
    booking_success: "¡Reserva confirmada!",
    booking_success_sub: "Tu vuelo ha sido reservado con éxito",
    booking_code: "Código",
    booking_status: "Estado",
    booking_confirmed: "Confirmada ✅",
    booking_paid: "Total pag.",
    booking_keep: "Seguir buscando",
    booking_view: "Ver mis reservas",

    // Reservas page
    res_title: "Mis Reservas",
    res_subtitle: "Gestiona todas tus reservas de vuelo",
    res_loading: "Cargando reservas...",
    res_empty: "No tienes reservas",
    res_empty_sub: "Encuentra tu próximo vuelo y realiza tu primera reserva",
    res_search: "Buscar vuelos ✈",
    res_retry: "Reintentar",
    res_detail: "Ver detalle",
    res_cancel: "Cancelar",
    res_active: "✓ Confirmada",
    res_cancelled_st: "Cancelada",
    res_confirm_cancel: "¿Cancelar reserva?",
    res_confirm_sub: "Esta acción no se puede deshacer",
    res_code_label: "Código",
    res_date_label: "Fecha",
    res_flight_label: "Vuelo",
    res_dep_label: "Salida",
    res_pax_label: "Pasajeros",
    res_go_back: "Volver",
    res_yes_cancel: "Sí, cancelar",
    res_cancelling: "Cancelando...",
    res_detail_title: "Detalle de la reserva",
    res_info_flight: "✈ Información del vuelo",
    res_info_booking: "📋 Datos de la reserva",
    res_info_payment: "💰 Información del pago",
    res_info_pax: "👥 Pasajeros",
    res_close: "Cerrar",
    res_origin: "Origen",
    res_destination: "Destino",
    res_arrival: "Llegada",
    res_duration: "Duración",
    res_airline: "Aerolínea",
    res_flight_num: "Nº vuelo",
    res_price_each: "Precio/vuelo",
    res_booking_date: "Fecha reserva",
    res_total_price: "Precio total",
    res_method: "Método pago",
    res_status_pay: "Estado",
    res_amount: "Monto",
    res_reference: "Referencia",
    res_passengers: "Pasajeros",

    // Ciudades
    cities_title: "Destinos del mundo",
    cities_sub: "Descubre datos, curiosidades y vuelos hacia cada destino",
    cities_search: "Buscar ciudad, país o código IATA...",
    cities_count: "destino",
    cities_count_p: "destinos",
    cities_avail: "disponible",
    cities_avail_p: "disponibles",
    cities_loading: "Cargando destinos...",
    cities_empty: "No encontramos ese destino",
    cities_empty_s: "Prueba con otro nombre, país o código",
    cities_currency: "Divisa",
    cities_name: "Nombre",
    cities_museums: "Museos",
    cities_airports: "Aeropuertos",
    cities_retry: "Reintentar",

    // Foro
    foro_title: "Foro de viajeros",
    foro_sub: "Comparte tu experiencia y descubre los consejos de otros viajeros",
    foro_new: "✍️ Nuevo tema",
    foro_cancel: "✕ Cancelar",
    foro_new_title: "Nuevo tema",
    foro_placeholder_title: "Título del tema",
    foro_placeholder_content: "Cuéntanos tu experiencia, opinión o duda...",
    foro_publish: "Publicar tema",
    foro_publishing: "Publicando...",
    foro_cancel_btn: "Cancelar",
    foro_empty: "No hay temas aún",
    foro_empty_user: "¡Sé el primero en abrir un tema!",
    foro_empty_guest: "Inicia sesión para participar.",
    foro_like: "me gusta",
    foro_reply: "Responder",
    foro_hide: "Ocultar",
    foro_first: "Sé el primero en responder",
    foro_write: "Escribe una respuesta...",
    foro_send: "Enviar",
    foro_login_rep: "para responder",
    foro_user: "Usuario",
    foro_delete: "¿Eliminar este tema?",
    foro_del_err: "No se pudo eliminar el tema.",
    foro_user_num: "Usuario #",

    // Contacto
    contact_title: "Contacto",
    contact_sub: "¿Tienes alguna duda o problema? Estamos aquí para ayudarte",
    contact_email: "Email",
    contact_phone: "Teléfono",
    contact_hours: "Horario",
    contact_name: "Nombre *",
    contact_mail: "Email *",
    contact_subject: "Asunto",
    contact_message: "Mensaje *",
    contact_send: "📤 Enviar mensaje",
    contact_sending: "Enviando...",
    contact_sent: "¡Mensaje enviado!",
    contact_sent_sub: "Hemos recibido tu consulta y te responderemos en menos de 24h.",
    contact_another: "Enviar otro mensaje",
    contact_error: "Por favor rellena todos los campos obligatorios.",
    contact_hours_val: "Lun–Vie 9:00–18:00",
    contact_subjects: [
      "Problema con una reserva",
      "Pregunta sobre un vuelo",
      "Cancelación o reembolso",
      "Problema técnico",
      "Sugerencia de mejora",
      "Otro",
    ],

    // Configuración
    config_title: "Configuración",
    config_sub: "Personaliza tu experiencia en RumboLibre",
    config_profile: "Información personal",
    config_prof_sub: "Actualiza tu nombre y datos de contacto",
    config_name: "Nombre",
    config_lastname: "Apellidos",
    config_email: "Correo electrónico",
    config_save: "Guardar cambios",
    config_saving: "Guardando...",
    config_pass: "Cambiar contraseña",
    config_pass_sub: "Actualiza tu contraseña de acceso",
    config_cur_pass: "Contraseña actual",
    config_new_pass: "Nueva contraseña",
    config_rep_pass: "Confirmar nueva contraseña",
    config_change: "Cambiar contraseña",
    config_changing: "Actualizando...",
    config_pref: "Preferencias",
    config_pref_sub: "Los cambios se aplican automáticamente",
    config_theme: "Tema",
    config_theme_l: "☀️ Claro",
    config_theme_d: "🌙 Oscuro",
    config_currency: "Divisa",
    config_language: "Idioma",
    config_auto: "✅ Los cambios se guardan automáticamente",
    config_account: "Información de la cuenta",
    config_role: "Rol",
    config_userid: "ID de usuario",

    // Login
    login_title: "Bienvenido de nuevo",
    login_sub: "Inicia sesión en tu cuenta RumboLibre",
    login_email: "Correo electrónico",
    login_pass: "Contraseña",
    login_remember: "Recordarme",
    login_forgot: "¿Olvidaste tu contraseña?",
    login_btn: "Entrar a mi cuenta",
    login_loading: "Iniciando sesión...",
    login_or: "o continúa con",
    login_no_acc: "¿No tienes una cuenta?",
    login_create: "Crea una aquí",

    // Register
    reg_title: "Crea tu cuenta",
    reg_sub: "Únete a miles de viajeros en RumboLibre",
    reg_name: "Nombre completo",
    reg_email: "Correo electrónico",
    reg_pass: "Contraseña",
    reg_rep_pass: "Repetir contraseña",
    reg_terms: "Acepto los",
    reg_terms2: "y la",
    reg_terms3: "de RumboLibre",
    reg_btn: "Crear cuenta",
    reg_loading: "Creando cuenta...",
    reg_have_acc: "¿Ya tienes cuenta?",
    reg_login: "Inicia sesión",

    // Footer
    footer_rights: "Todos los derechos reservados",
    footer_privacy: "Política de privacidad",
    footer_terms: "Términos y condiciones",
  },

  en: {
    // Navbar
    nav_home: "Home",
    nav_cities: "Cities",
    nav_forum: "Forum",
    nav_bookings: "Bookings",
    nav_login: "Log in",
    nav_register: "Sign up",
    nav_config: "Settings",
    nav_contact: "Contact",
    nav_logout: "Log out",

    // HomePage
    home_title: "Find your next flight",
    home_subtitle: "The best flight prices with RumboLibre",
    home_origin: "Origin",
    home_destination: "Destination",
    home_search: "Search flights",
    home_results: "Search results",
    home_available: "Available flights",
    home_show_all: "← Show all",
    home_per_person: "per person",
    home_seats: "seats",
    home_select: "Select flight ✈",
    home_searching: "Searching flights…",
    home_no_flights: "No flights available.",
    home_cheap: "Cheap flights",
    home_cheap_desc: "Compare and save",
    home_secure: "Secure payment",
    home_secure_desc: "Protected transactions",
    home_no_fees: "No hidden fees",
    home_no_fees_desc: "Transparent pricing",
    home_methods: "Multiple methods",
    home_methods_desc: "Pay your way",

    // Vuelo sorpresa
    home_surprise_title: "Vuelo Sorpresa",
    home_surprise_desc: "¿No sabes dónde viajar? Selecciona tu aeropuerto de origen y RumboLibre elegirá aleatoriamente un destino para ti. Descubre ciudades inesperadas y vive una experiencia diferente.",
    home_surprise_placeholder: "Selecciona aeropuerto de origen",
    home_surprise_button: "Buscar Vuelo Sorpresa",
    home_surprise_searching: "Buscando aventura...",
    home_surprise_error_empty: "No se encontró ningún vuelo sorpresa. ¡Prueba con otro origen!",
    home_surprise_error_generic: "Error al buscar vuelo sorpresa. Intenta de nuevo.",

    home_surprise_title: "Surprise Flight",
    home_surprise_desc: "Don't know where to travel? Select your departure airport and RumboLibre will randomly choose a destination for you. Discover unexpected cities and live a different experience.",
    home_surprise_placeholder: "Select departure airport",
    home_surprise_button: "Find Surprise Flight",
    home_surprise_searching: "Searching for adventure...",
    home_surprise_error_empty: "No surprise flights found. Try another origin!",
    home_surprise_error_generic: "Error searching for surprise flight. Please try again.",

    // Reserva drawer
    booking_title: "Complete booking",
    booking_passengers: "Number of passengers",
    booking_passenger: "Passenger",
    booking_name: "First name",
    booking_lastname: "Last name",
    booking_doc_type: "Doc. type",
    booking_doc_num: "Document number",
    booking_birthdate: "Date of birth",
    booking_nationality: "Nationality",
    booking_continue: "Continue to payment →",
    booking_back: "← Back",
    booking_pay: "Pay",
    booking_processing: "Processing...",
    booking_secure: "🔒 Encrypted & secure payment",
    booking_taxes: "Taxes included",
    booking_luggage: "Carry-on luggage",
    booking_total: "Total",
    booking_flight_x: "Flight ×",
    booking_payment: "Payment method",
    booking_credit: "Credit",
    booking_debit: "Debit",
    booking_card_num: "Card number",
    booking_holder: "Cardholder",
    booking_expiry: "Expiry",
    booking_paypal_msg: "You will be redirected to PayPal to complete payment.",

    // Modal éxito reserva
    booking_success: "Booking confirmed!",
    booking_success_sub: "Your flight has been booked successfully",
    booking_code: "Code",
    booking_status: "Status",
    booking_confirmed: "Confirmed ✅",
    booking_paid: "Total paid",
    booking_keep: "Keep searching",
    booking_view: "View my bookings",

    // Reservas page
    res_title: "My Bookings",
    res_subtitle: "Manage all your flight bookings",
    res_loading: "Loading bookings...",
    res_empty: "No bookings yet",
    res_empty_sub: "Find your next flight and make your first booking",
    res_search: "Search flights ✈",
    res_retry: "Retry",
    res_detail: "View details",
    res_cancel: "Cancel",
    res_active: "✓ Confirmed",
    res_cancelled_st: "Cancelled",
    res_confirm_cancel: "Cancel booking?",
    res_confirm_sub: "This action cannot be undone",
    res_code_label: "Code",
    res_date_label: "Date",
    res_flight_label: "Flight",
    res_dep_label: "Departure",
    res_pax_label: "Passengers",
    res_go_back: "Go back",
    res_yes_cancel: "Yes, cancel",
    res_cancelling: "Cancelling...",
    res_detail_title: "Booking details",
    res_info_flight: "✈ Flight information",
    res_info_booking: "📋 Booking data",
    res_info_payment: "💰 Payment information",
    res_info_pax: "👥 Passengers",
    res_close: "Close",
    res_origin: "Origin",
    res_destination: "Destination",
    res_arrival: "Arrival",
    res_duration: "Duration",
    res_airline: "Airline",
    res_flight_num: "Flight no.",
    res_price_each: "Price/flight",
    res_booking_date: "Booking date",
    res_total_price: "Total price",
    res_method: "Payment method",
    res_status_pay: "Status",
    res_amount: "Amount",
    res_reference: "Reference",
    res_passengers: "Passengers",

    // Ciudades
    cities_title: "World destinations",
    cities_sub: "Discover facts, curiosities and flights to each destination",
    cities_search: "Search city, country or IATA code...",
    cities_count: "destination",
    cities_count_p: "destinations",
    cities_avail: "available",
    cities_avail_p: "available",
    cities_loading: "Loading destinations...",
    cities_empty: "Destination not found",
    cities_empty_s: "Try another name, country or code",
    cities_currency: "Currency",
    cities_name: "Name",
    cities_museums: "Museums",
    cities_airports: "Airports",
    cities_retry: "Retry",

    // Foro
    foro_title: "Travellers Forum",
    foro_sub: "Share your experience and discover tips from other travellers",
    foro_new: "✍️ New topic",
    foro_cancel: "✕ Cancel",
    foro_new_title: "New topic",
    foro_placeholder_title: "Topic title",
    foro_placeholder_content: "Tell us about your experience, opinion or question...",
    foro_publish: "Publish topic",
    foro_publishing: "Publishing...",
    foro_cancel_btn: "Cancel",
    foro_empty: "No topics yet",
    foro_empty_user: "Be the first to open a topic!",
    foro_empty_guest: "Log in to participate.",
    foro_like: "likes",
    foro_reply: "Reply",
    foro_hide: "Hide",
    foro_first: "Be the first to reply",
    foro_write: "Write a reply...",
    foro_send: "Send",
    foro_login_rep: "to reply",
    foro_user: "User",
    foro_delete: "Delete this topic?",
    foro_del_err: "Could not delete the topic.",
    foro_user_num: "User #",

    // Contacto
    contact_title: "Contact",
    contact_sub: "Have a question or problem? We're here to help",
    contact_email: "Email",
    contact_phone: "Phone",
    contact_hours: "Hours",
    contact_name: "Name *",
    contact_mail: "Email *",
    contact_subject: "Subject",
    contact_message: "Message *",
    contact_send: "📤 Send message",
    contact_sending: "Sending...",
    contact_sent: "Message sent!",
    contact_sent_sub: "We received your query and will reply within 24h.",
    contact_another: "Send another message",
    contact_error: "Please fill in all required fields.",
    contact_hours_val: "Mon–Fri 9:00–18:00",
    contact_subjects: [
      "Problem with a booking",
      "Question about a flight",
      "Cancellation or refund",
      "Technical issue",
      "Improvement suggestion",
      "Other",
    ],

    // Configuración
    config_title: "Settings",
    config_sub: "Customize your RumboLibre experience",
    config_profile: "Personal information",
    config_prof_sub: "Update your name and contact details",
    config_name: "First name",
    config_lastname: "Last name",
    config_email: "Email address",
    config_save: "Save changes",
    config_saving: "Saving...",
    config_pass: "Change password",
    config_pass_sub: "Update your access password",
    config_cur_pass: "Current password",
    config_new_pass: "New password",
    config_rep_pass: "Confirm new password",
    config_change: "Change password",
    config_changing: "Updating...",
    config_pref: "Preferences",
    config_pref_sub: "Changes apply automatically",
    config_theme: "Theme",
    config_theme_l: "☀️ Light",
    config_theme_d: "🌙 Dark",
    config_currency: "Currency",
    config_language: "Language",
    config_auto: "✅ Changes are saved automatically",
    config_account: "Account information",
    config_role: "Role",
    config_userid: "User ID",

    // Login
    login_title: "Welcome back",
    login_sub: "Log in to your RumboLibre account",
    login_email: "Email address",
    login_pass: "Password",
    login_remember: "Remember me",
    login_forgot: "Forgot your password?",
    login_btn: "Log in",
    login_loading: "Logging in...",
    login_or: "or continue with",
    login_no_acc: "Don't have an account?",
    login_create: "Create one here",

    // Register
    reg_title: "Create your account",
    reg_sub: "Join thousands of travellers on RumboLibre",
    reg_name: "Full name",
    reg_email: "Email address",
    reg_pass: "Password",
    reg_rep_pass: "Repeat password",
    reg_terms: "I accept the",
    reg_terms2: "and the",
    reg_terms3: "of RumboLibre",
    reg_btn: "Create account",
    reg_loading: "Creating account...",
    reg_have_acc: "Already have an account?",
    reg_login: "Log in",

    // Footer
    footer_rights: "All rights reserved",
    footer_privacy: "Privacy policy",
    footer_terms: "Terms and conditions",
  },
};

export function SettingsProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("rl_settings");
      return saved
        ? JSON.parse(saved)
        : { theme: "light", currency: "EUR", language: "es" };
    } catch {
      return { theme: "light", currency: "EUR", language: "es" };
    }
  });

  // Aplicar tema al arrancar
  useEffect(() => {
    applyTheme(preferences.theme);
  }, []);

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function updatePreference(key, value) {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem("rl_settings", JSON.stringify(updated));
    if (key === "theme") applyTheme(value);
  }

  // Función de formateo de precio
  function formatPrice(amountEUR) {
    if (amountEUR == null) return "—";
    const rate = CURRENCY_RATES[preferences.currency] || 1;
    const symbol = CURRENCY_SYMBOLS[preferences.currency] || "€";
    return `${symbol}${(amountEUR * rate).toFixed(2)}`;
  }

  // Traducciones activas
  const t = TRANSLATIONS[preferences.language] || TRANSLATIONS.es;

  return (
    <SettingsContext.Provider value={{ preferences, updatePreference, formatPrice, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings debe usarse dentro de SettingsProvider");
  return ctx;
}