import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No hay token');
      setLoading(false);
      return;
    }

    try {
      console.log('Verificando token...');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/usuarios/me');
      console.log('Usuario verificado:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Error al verificar token:', error.response?.status);
      localStorage.removeItem('token');
      localStorage.removeItem('rl_user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    try {
      // Limpiar cualquier token viejo
      localStorage.removeItem('token');
      localStorage.removeItem('rl_user');
      delete api.defaults.headers.common['Authorization'];
      
      console.log('Intentando login:', { email });
      const response = await api.post('/usuarios/login', { email, password });
      console.log('Respuesta login:', response.data);
      
      // ✅ CORREGIDO: El backend devuelve los datos directamente
      const { token, ...userData } = response.data;
      
      if (!token) {
        console.error('No se recibió token');
        return { success: false, message: 'Error: No se recibió token' };
      }
      
      // Guardar token y datos del usuario (sin el token)
      localStorage.setItem('token', token);
      localStorage.setItem('rl_user', JSON.stringify(userData));
      
      // Configurar header para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Guardar usuario en el estado (sin el token)
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error.response?.status, error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.mensaje || 
                 error.response?.data?.message || 
                 'Credenciales incorrectas' 
      };
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rl_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  }

  function updateUser(changes) {
    const updated = { ...user, ...changes };
    localStorage.setItem('rl_user', JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}