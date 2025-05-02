import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LogOut from '../components/LogOut';

export default function AddTaskForm() {
  // Definir los estados locales para almacenar los datos del formulario
  const [title, setTitle] = useState(''); // Título de la tarea
  const [description, setDescription] = useState(''); // Descripción de la tarea
  const [token, setToken] = useState(null); // Token de autenticación del usuario
  const [assignedTo, setAssignedTo] = useState(''); // Usuario asignado a la tarea
  const [isStaff, setIsStaff] = useState(false); // Indica si el usuario es un staff (administrador)
  const [selectedUserId, setSelectedUserId] = useState(''); // ID del usuario seleccionado para asignar la tarea
  const [users, setUsers] = useState([]); // Lista de usuarios para asignar la tarea
  const [isEditing, setIsEditing] = useState(false); // Indica si estamos en modo de edición o creación de una tarea

  const { id: taskId } = useParams(); // Obtiene el ID de la tarea de los parámetros de la URL
  const navigate = useNavigate(); // Hook para redirigir a otra página

  useEffect(() => {
    // Comprobar si hay un token guardado en el almacenamiento local
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken); // Almacenar el token en el estado

      // Hacer una solicitud para obtener la información del perfil del usuario autenticado
      fetch('http://localhost:8000/api/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`, // Incluir el token de autenticación en los headers
        },
      })
        .then(res => res.json())
        .then(data => {
          setAssignedTo(data.id); // Asignar el ID del usuario al campo 'assignedTo'
          setIsStaff(data.is_staff); // Comprobar si el usuario es staff (administrador)
          
          // Si el usuario es staff, cargar la lista de usuarios disponibles para asignar tareas
          if (data.is_staff) {
            fetch('http://localhost:8000/api/users/', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`, // Incluir el token de autenticación en los headers
              },
            })
              .then(res => res.json())
              .then(usersData => setUsers(usersData)) // Almacenar la lista de usuarios
              .catch(err => console.error("Error al obtener usuarios:", err));
          }
        })
        .catch(err => console.error("Error al obtener perfil:", err));
    }

    // Si hay un taskId y un token, se está editando una tarea existente
    if (taskId && storedToken) {
      setIsEditing(true); // Cambiar a modo de edición
      fetch(`http://localhost:8000/api/tasks/${taskId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`, // Incluir el token de autenticación en los headers
        },
      })
        .then(res => res.json())
        .then(task => {
          // Cargar los datos de la tarea para editar
          setTitle(task.title); // Establecer el título de la tarea
          setDescription(task.description); // Establecer la descripción de la tarea
          setAssignedTo(task.assigned_to); // Establecer el usuario asignado
        })
        .catch(err => console.error("Error al cargar la tarea:", err));
    }
  }, [taskId]); // Se vuelve a ejecutar cuando taskId cambia

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if (!token) {
      console.error("Token no disponible.");
      return;
    }

    // Definir a quién se asigna la tarea dependiendo de si el usuario es staff
    const finalAssignedTo = isStaff && selectedUserId ? selectedUserId : assignedTo;

    if (!finalAssignedTo) {
      console.error("ID de usuario asignado no disponible.");
      return;
    }

    const url = isEditing
      ? `http://localhost:8000/api/tasks/${taskId}/` // URL para actualizar la tarea
      : "http://localhost:8000/api/tasks/"; // URL para crear una nueva tarea

    const method = isEditing ? "PUT" : "POST"; // Determinar el método HTTP (PUT para edición, POST para creación)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json", // Indicar que el cuerpo es JSON
          "Authorization": `Bearer ${token}`, // Incluir el token de autenticación en los headers
        },
        body: JSON.stringify({
          title, // Enviar el título de la tarea
          description, // Enviar la descripción de la tarea
          assigned_to: finalAssignedTo, // Enviar el usuario asignado
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la tarea:", errorText); // Manejo de errores
        return;
      }

      // Limpiar los campos y redirigir al dashboard después de guardar o actualizar la tarea
      setTitle('');
      setDescription('');
      navigate('/dashboard');
    } catch (error) {
      console.error("Error al enviar tarea:", error); // Manejo de errores
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <div className="absolute right-4 top-4">
          <LogOut /> {/* Componente de cierre de sesión */}
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
        </h2>

        <input
          type="text"
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Actualizar el título de la tarea
          required
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Actualizar la descripción de la tarea
          rows="4"
          className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {isStaff && (
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)} // Actualizar el usuario asignado
            className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Seleccione un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 w-full rounded-lg transition duration-200"
        >
          {isEditing ? 'Actualizar Tarea' : 'Guardar Tarea'}
        </button>
      </form>
    </div>
  );
}
