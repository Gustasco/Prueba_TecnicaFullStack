// Importa React y el hook useState
import React, { useState } from "react";
// Importa la instancia de la API para hacer solicitudes HTTP
import api from "../api/api";

// Componente funcional que recibe una tarea opcional y una función onSubmit
const TaskForm = ({ task = null, onSubmit }) => {
  // Estado para el título de la tarea. Si se está editando, usa el valor existente
  const [title, setTitle] = useState(task ? task.title : "");
  // Estado para la descripción de la tarea
  const [description, setDescription] = useState(task ? task.description : "");
  // Estado para el campo "asignado a"
  const [assignedTo, setAssignedTo] = useState(task ? task.assigned_to : "");

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Objeto que representa la nueva tarea
    const newTask = { title, description, assigned_to: assignedTo };

    // Si hay una tarea (modo edición), se actualiza con PUT
    if (task) {
      await api.put(`/tasks/${task.id}`, newTask);
    } else {
      // Si no hay tarea (modo creación), se crea con POST
      await api.post("/tasks", newTask);
    }

    // Ejecuta la función callback pasada por props (posiblemente para refrescar una lista)
    onSubmit();
  };

  // Renderiza el formulario
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-lg">
      {/* Campo para el título */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="mb-2 p-2 w-full border border-gray-300 rounded"
      />

      {/* Campo para la descripción */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="mb-2 p-2 w-full border border-gray-300 rounded"
      ></textarea>

      {/* Campo para el nombre del asignado */}
      <input
        type="text"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        placeholder="Assigned To"
        className="mb-4 p-2 w-full border border-gray-300 rounded"
      />

      {/* Botón de envío del formulario que cambia de texto según si es creación o edición */}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {task ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
};

// Exporta el componente para su uso en otros archivos
export default TaskForm;
