// Importamos la librería axios para realizar solicitudes HTTP
import axios from 'axios';

// Creamos una instancia de axios con configuración personalizada
const api = axios.create({
    // Establecemos la URL base para todas las solicitudes API
    // Se toma del archivo de configuración de entorno (VITE_API_URL) o, si no existe, se utiliza una URL local por defecto.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Configuramos un interceptor para las solicitudes
api.interceptors.request.use((config) => {
    // Obtenemos el token de autenticación almacenado en el localStorage del navegador
    const token = localStorage.getItem('token');

    // Si hay un token, lo agregamos en los encabezados de la solicitud bajo el esquema 'Bearer'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Retornamos la configuración de la solicitud para que Axios continúe con la misma
    return config;
});

// Exportamos la instancia de Axios configurada para que pueda ser utilizada en otras partes de la aplicación
export default api;
