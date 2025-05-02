import api from '../api/api';

// Función para manejar el inicio de sesión de un usuario
export const login = async (username, password) => {
    try {
        // Realizamos una solicitud POST a la API de login con el nombre de usuario y la contraseña
        const response = await api.post('/login/', { username, password });

        // Desestructuramos la respuesta para obtener el token de acceso y los datos del usuario
        const { access, user } = response.data;

        // Si el token de acceso es recibido, lo almacenamos en el localStorage junto con los datos del usuario
        if (access) {
            localStorage.setItem('token', access); // Almacena el token de acceso
            localStorage.setItem('userData', JSON.stringify(user)); // Almacena los datos del usuario como una cadena JSON
        } else {
            console.error("Token no recibido en la respuesta");
        }

        // Retornamos el token de acceso
        return access;
    } catch (error) {
        // En caso de error, se captura y se muestra un mensaje de error
        console.error("Error al iniciar sesión:", error.response?.data || error.message);
        throw error; // Lanza el error para que se pueda manejar externamente
    }
};
