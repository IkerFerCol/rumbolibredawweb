import axios from "axios";

const api = axios.create({
  baseURL: "https://rumbolibredawapi.onrender.com/api",  // ← AÑADE /api AQUÍ
  headers: { 
    "Content-Type": "application/json" 
  },
});

// ─── INTERCEPTOR REQUEST ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    !config.url.includes("/usuarios/login") &&
    !config.url.includes("/usuarios/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("📤 Request:", {
    method: config.method,
    url: config.baseURL + config.url,
    hasToken: !!config.headers.Authorization,
  });

  return config;
});

// ─── INTERCEPTOR RESPONSE ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ Error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("rl_user");

      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;