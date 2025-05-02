# Importa las rutas necesarias de Django
from django.urls import path
# Importa las vistas para cada endpoint de la API
from .views import RegisterView, ProfileView, TaskListCreateView, TaskDetailView, CustomTokenObtainPairView, user_list

# Definición de las URLs para los endpoints de la API
urlpatterns = [
    # Ruta para el registro de nuevos usuarios
    path('register/', RegisterView.as_view()),

    # Ruta para el inicio de sesión con token JWT personalizado
    path('login/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),

    # Ruta para obtener y actualizar el perfil del usuario autenticado
    path('profile/', ProfileView.as_view()),

    # Ruta para listar todas las tareas o crear una nueva tarea
    path('tasks/', TaskListCreateView.as_view()),

    # Ruta para obtener los detalles de una tarea específica (con un id)
    path('tasks/<int:pk>/', TaskDetailView.as_view()),

    # Ruta para listar todos los usuarios
    path('users/', user_list)
]
