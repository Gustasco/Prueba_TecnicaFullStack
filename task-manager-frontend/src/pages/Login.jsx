// Importa el hook useState de React para manejar estados
import { useState } from 'react';
// Importa la función login desde el módulo de autenticación
import { login } from '../auth/auth';
// Importa hooks de navegación y enlace de React Router
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  // Estado para almacenar el nombre de usuario ingresado
  const [username, setUsername] = useState('');
  // Estado para almacenar la contraseña ingresada
  const [password, setPassword] = useState('');
  // Estado para mostrar un mensaje de error si ocurre un fallo en el login
  const [errorMessage, setErrorMessage] = useState('');
  // Estado para gestionar si el usuario tiene rol de administrador
  const [isAdmin, setIsAdmin] = useState(false);
  // Hook para redirigir programáticamente al usuario a otra ruta
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario (recargar la página)
    try {
      // Intenta iniciar sesión con las credenciales proporcionadas
      const token = await login(username, password);

      // Obtiene los datos del usuario desde el localStorage
      const user = JSON.parse(localStorage.getItem('userData'));
      // Establece si el usuario es administrador
      setIsAdmin(user?.is_superuser || false);

      // Redirige según el rol del usuario
      if (isAdmin) {
        navigate('/admin-dashboard'); // Ruta para administradores
      } else {
        navigate('/dashboard'); // Ruta para usuarios normales
      }
    } catch (err) {
      // Muestra mensaje de error si las credenciales no son válidas o hay otro fallo
      console.error('Error al iniciar sesión:', err.response?.data || err.message);
      setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    // Contenedor principal con estilos centrados
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        {/* Título del formulario */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Iniciar sesión
        </h2>

        {/* Mensaje de error si existe */}
        {errorMessage && (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        )}

        {/* Campo para ingresar nombre de usuario */}
        <input
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nombre de usuario"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        {/* Campo para ingresar contraseña */}
        <input
          className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Botón para enviar el formulario */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 w-full rounded-lg transition duration-200"
        >
          Entrar
        </button>

        {/* Enlace para registrarse si no se tiene cuenta */}
        <p className="text-center text-sm mt-4 text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
