import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // NO enviar token para rutas de autenticación (login y register)
  if (token && 
      !config.url.includes('/usuarios/login') && 
      !config.url.includes('/usuarios/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('📤 Request:', {
    method: config.method,
    url: config.baseURL + config.url,
    hasToken: !!token && !!config.headers.Authorization
  });

  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("rl_user");
      
      // Solo redirigir si no estamos en login/register
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;