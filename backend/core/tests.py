# Importa el modelo User de Django para crear un usuario en las pruebas
from django.contrib.auth.models import User
# Importa las herramientas de prueba de Django Rest Framework
from rest_framework.test import APITestCase
# Importa los estados de respuesta HTTP para las afirmaciones
from rest_framework import status
# Importa el modelo Task que se está probando
from .models import Task

# Clase de prueba para las tareas
class TaskTests(APITestCase):
    def setUp(self):
        """
        Método que se ejecuta antes de cada prueba.
        Aquí se crea un usuario de prueba y se realiza el login para obtener un token.
        """
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='pass')
        # Iniciar sesión con el usuario creado para obtener el token de autenticación
        self.client.login(username='testuser', password='pass')
        # Realiza una petición POST para hacer login y obtener el token de acceso
        self.client.post('/api/login/', {'username': 'testuser', 'password': 'pass'}, format='json')
        # Almacena el token de acceso
        self.token = self.client.post('/api/login/', {'username': 'testuser', 'password': 'pass'}).data['access']
        # Configura el encabezado de autorización para las pruebas de autenticación
        self.auth_header = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}
        
        # Crear una tarea de prueba
        self.task = Task.objects.create(
            title='Test Task',
            description='Test description',
            assigned_to=self.user,
            status='pending'
        )

    def test_register_user(self):
        """
        Prueba para verificar el registro de un nuevo usuario.
        Se realiza una petición POST a la ruta de registro.
        """
        response = self.client.post('/api/register/', {'username': 'new', 'password': 'pass'})
        # Verifica que el código de respuesta sea 201 (creación exitosa)
        self.assertEqual(response.status_code, 201)

    def test_create_task(self):
        """
        Prueba para crear una nueva tarea asignada al usuario creado.
        Se envía una petición POST con los datos de la tarea.
        """
        response = self.client.post('/api/tasks/', {
            'title': 'Sample Task',  # Título de la tarea
            'description': 'Test',   # Descripción de la tarea
            'assigned_to': self.user.id,  # Asignación de tarea al usuario de prueba
            'status': 'pending',         # Estado de la tarea
        }, **self.auth_header)  # Se incluyen los encabezados de autorización
        # Verifica que la tarea fue creada correctamente con el código 201
        self.assertEqual(response.status_code, 201)

    def test_get_task(self):
        """
        Prueba para obtener una tarea específica del usuario logueado.
        Se hace una solicitud GET a la ruta de tareas.
        """
        response = self.client.get(f'/api/tasks/{self.task.id}/', **self.auth_header)
        # Verifica que la respuesta sea exitosa (código 200)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Task')  # Verifica que el título de la tarea esté en la respuesta

    def test_update_task(self):
        """
        Prueba para actualizar una tarea existente.
        Se envía una petición PUT para modificar la tarea.
        """
        response = self.client.put(f'/api/tasks/{self.task.id}/', {
            'title': 'Updated Task',  # Nuevo título de la tarea
            'description': 'Updated description',  # Nueva descripción
            'assigned_to': self.user.id,  # Mismo usuario asignado
            'status': 'completed',  # Estado actualizado de la tarea
        }, **self.auth_header)  # Se incluyen los encabezados de autorización
        # Verifica que la tarea fue actualizada correctamente con el código 200
        self.assertEqual(response.status_code, 200)
        self.task.refresh_from_db()  # Recargar la tarea desde la base de datos
        self.assertEqual(self.task.title, 'Updated Task')  # Verifica que el título se haya actualizado

    def test_delete_task(self):
        """
        Prueba para eliminar una tarea existente.
        Se envía una petición DELETE para borrar la tarea.
        """
        response = self.client.delete(f'/api/tasks/{self.task.id}/', **self.auth_header)
        # Verifica que la tarea se eliminó correctamente con el código 204
        self.assertEqual(response.status_code, 204)
        # Verifica que la tarea ya no existe en la base de datos
        self.assertEqual(Task.objects.count(), 0)

    def test_get_profile(self):
        """
        Prueba para obtener el perfil del usuario logueado.
        Se hace una solicitud GET a la ruta de perfil.
        """
        response = self.client.get('/api/profile/', **self.auth_header)
        # Verifica que la respuesta sea exitosa (código 200)
        self.assertEqual(response.status_code, 200)
