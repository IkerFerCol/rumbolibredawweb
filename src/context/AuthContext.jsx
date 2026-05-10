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
      localStorage.removeItem('token');
      localStorage.removeItem('rl_user');
      delete api.defaults.headers.common['Authorization'];
      
      console.log('Intentando login:', { email });
      const response = await api.post('/usuarios/login', { email, password });
      console.log('Respuesta login:', response.data);
      
      const { token, ...userData } = response.data;
      
      if (!token) {
        console.error('No se recibió token');
        return { success: false, message: 'Error: No se recibió token' };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('rl_user', JSON.stringify(userData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
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