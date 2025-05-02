import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogOut from '../components/LogOut';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
  const [isStaff, setIsStaff] = useState(false); // Estado para verificar si el usuario es staff
  const navigate = useNavigate(); // Hook para redirigir al usuario

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    if (storedToken) {
      // Si el token está presente, obtener la información del perfil del usuario
      fetch('http://localhost:8000/api/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`, // Incluir el token en los headers de la solicitud
        },
      })
        .then((response) => response.json()) // Procesar la respuesta JSON
        .then((data) => {
          setUserId(data.id); // Almacenar el ID del usuario
          setIsStaff(data.is_staff); // Verificar si el usuario es staff
          fetchTasks(storedToken, data.is_staff, data.id); // Llamar a la función para obtener las tareas
        })
        .catch((error) => console.error('Error al obtener el perfil:', error)); // Manejo de errores
    }
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  const fetchTasks = async (authToken, isStaffUser, currentUserId) => {
    try {
      // Hacer una solicitud para obtener todas las tareas
      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`, // Incluir el token en los headers
        },
      });
  
      if (!response.ok) {
        console.error('Error al obtener las tareas');
        return;
      }
  
      const tasksData = await response.json(); // Procesar la respuesta JSON
  
      // Filtrar las tareas según si el usuario es staff o no
      const filteredTasks = isStaffUser
        ? tasksData // Si el usuario es staff, obtener todas las tareas
        : tasksData.filter(task => task.assigned_to === currentUserId); // Si no es staff, solo tareas asignadas a él
  
      setTasks(filteredTasks); // Actualizar el estado con las tareas filtradas
    } catch (error) {
      console.error('Error al obtener las tareas:', error); // Manejo de errores
    }
  };
  
  // Función para navegar a la página de agregar tarea
  const handleAddTask = () => {
    navigate('/add-task');
  };

  // Función para manejar la eliminación de una tarea
  const handleDeleteTask = async (taskId) => {
    const storedToken = localStorage.getItem('token'); // Obtener el token
    if (!storedToken) {
      console.error("Token no disponible.");
      return;
    }

    try {
      // Hacer una solicitud para eliminar la tarea
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${storedToken}`, // Incluir el token en los headers
        },
      });

      if (response.ok) {
        // Si la eliminación es exitosa, actualizar el estado de las tareas
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar tarea:", errorData); // Manejo de errores
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error); // Manejo de errores
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <div className="absolute right-4 top-4">
          <LogOut /> {/* Componente de cierre de sesión */}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Bienvenido!</h1>
        <p className="text-gray-600 mb-6">Este es tu panel de control.</p>

        <button
          onClick={handleAddTask} // Llamar a la función para agregar una tarea
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-4"
        >
          Añadir nueva tarea
        </button>

        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold mb-2">Tus tareas</h2>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="mb-3">
                  <div className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3> {/* Título de la tarea */}
                      <p className="text-gray-500">{task.description}</p> {/* Descripción de la tarea */}
                      <p className="text-sm text-gray-400">
                        Asignado a: {task.assigned_to_username || 'No asignado'} {/* Nombre del usuario asignado */}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteTask(task.id)} // Llamar a la función de eliminación
                        className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        Completada
                      </button>
                      <button
                        onClick={() => navigate(`/add-task/${task.id}`)} // Navegar a la página de edición de tarea
                        className="bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 transition duration-200"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tienes tareas pendientes.</p> // Mostrar mensaje si no hay tareas
          )}
        </div>
      </div>
    </div>
  );
}
