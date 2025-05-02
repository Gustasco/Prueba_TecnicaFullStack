import { useNavigate } from "react-router-dom";

export default function LogOut() {
    // Se crea una instancia del hook useNavigate para manejar la navegación
    const navigate = useNavigate();
  
    // Función que maneja el cierre de sesión
    const handleLogout = () => {
      // Eliminamos el token de autenticación almacenado en localStorage
      localStorage.removeItem('token');
      
      // Redirigimos al usuario a la página de inicio ("/") después de cerrar sesión
      navigate('/');
    };
  
    return (
      // Renderizamos un botón que, al hacer clic, ejecutará la función handleLogout
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:text-red-700 px-2 py-1 border border-red-300 hover:border-red-500 rounded-md transition"
        title="Cerrar sesión"
      >
        Logout
      </button>
    );
  }
  