// Importa el hook useState de React para manejar estados
import { useState } from 'react';

// Importa hooks para navegación y enlaces de React Router
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  // Estado para el correo electrónico del usuario
  const [email, setEmail] = useState('');
  // Estado para la contraseña
  const [password, setPassword] = useState('');
  // Estado para el nombre de usuario
  const [username, setUsername] = useState('');
  // Estado para el código de administrador (opcional)
  const [adminCode, setAdminCode] = useState('');
  // Hook para redirigir al usuario tras el registro
  const navigate = useNavigate();

  // Función que maneja el envío del formulario de registro
  const handleRegister = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    // Determina si el usuario debe ser staff comparando el código ingresado
    const isStaff = adminCode === ADMIN_SECRET;

    try {
      // Llama a la función de registro con los datos del formulario
      alert('Usuario registrado con éxito'); // Notificación de éxito
      navigate('/'); // Redirige al login
    } catch (err) {
      // Muestra alerta en caso de error
      alert('Error al registrar usuario');
    }
  };

  return (
    // Contenedor principal con estilos centrados y fondo gris claro
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Formulario de registro */}
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        {/* Título del formulario */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registro
        </h2>

        {/* Campo para el nombre de usuario */}
        <input
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Nombre de usuario"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)} 
          required
        />

        {/* Campo para el correo electrónico */}
        <input
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Correo electrónico"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Campo para la contraseña */}
        <input
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Campo opcional para código de administrador */}
        <input
          className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Código de administrador (opcional)"
          type="text"
          value={adminCode}
          onChange={e => setAdminCode(e.target.value)}
        />

        {/* Botón de registro */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold p-3 w-full rounded-lg transition duration-200"
        >
          Registrarse
        </button>

        {/* Enlace para redirigir al formulario de inicio de sesión */}
        <p className="text-center text-sm mt-4 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="text-green-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
