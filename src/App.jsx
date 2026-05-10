import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import ProtectedRoute from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import Ciudades from "./pages/CiudadesPage";
import Foro from "./pages/ForoPage";
import Reservas from "./pages/ReservasPage";
import Contacto from "./pages/ContactoPage";
import Config from "./pages/ConfigPage";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PoliticaCookies from "./pages/PoliticaCookiesPage";  
import CookieConsent from "./components/CookieConsent";     

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <CookieConsent />
          
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />

            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/ciudades" element={
              <ProtectedRoute>
                <Ciudades />
              </ProtectedRoute>
            } />
            <Route path="/foro" element={
              <ProtectedRoute>
                <Foro />
              </ProtectedRoute>
            } />
            <Route path="/reservas" element={
              <ProtectedRoute>
                <Reservas />
              </ProtectedRoute>
            } />
            <Route path="/contacto" element={
              <ProtectedRoute>
                <Contacto />
              </ProtectedRoute>
            } />
            <Route path="/configuracion" element={
              <ProtectedRoute>
                <Config />
              </ProtectedRoute>
            } />
            <Route path="/terminos-condiciones" element={
              <ProtectedRoute>
                <TerminosCondiciones />
              </ProtectedRoute>
            } />
            <Route path="/politica-privacidad" element={
              <ProtectedRoute>
                <PoliticaPrivacidad />
              </ProtectedRoute>
            } />
            <Route path="/politica-cookies" element={
              <ProtectedRoute>
                <PoliticaCookies />
              </ProtectedRoute>
            } />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  )
}