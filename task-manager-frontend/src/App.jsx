// Importación de componentes necesarios desde react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importación de las páginas (vistas) que se utilizarán en las rutas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTaskForm from './pages/AddTaskForm';

// Componente principal de la aplicación
function App() {
  return (
    // Envolvemos las rutas en un BrowserRouter para habilitar el enrutamiento
    <BrowserRouter>
      {/* Routes agrupa todos los Route */}
      <Routes>
        {/* Ruta raíz que muestra el formulario de login */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta para el formulario de registro */}
        <Route path="/register" element={<Register />} />
        
        {/* Ruta del panel principal del usuario (dashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Ruta para agregar una nueva tarea */}
        <Route path="/add-task" element={<AddTaskForm />} />

        {/* Ruta para editar una tarea existente, utilizando un parámetro :id */}
        <Route path="/add-task/:id" element={<AddTaskForm />} />
      </Routes>
    </BrowserRouter>
  );
}

// Exportamos el componente para usarlo como punto de entrada de la app
export default App;
