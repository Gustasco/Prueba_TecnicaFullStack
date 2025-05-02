# Importa los modelos de Django y el modelo de usuario incorporado
from django.db import models
from django.contrib.auth.models import User

# Define el modelo Task que representa una tarea en la base de datos
class Task(models.Model):
    # Nombre personalizado para la tabla en la base de datos
    class Meta:
        db_table = 'plataforma_tareas'

    # Opciones disponibles para el estado de la tarea
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]

    # Título de la tarea (campo obligatorio, máximo 255 caracteres)
    title = models.CharField(max_length=255)
    # Descripción opcional de la tarea (puede estar en blanco)
    description = models.TextField(blank=True)
    # Usuario asignado a la tarea (relación con el modelo User, eliminación en cascada)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', null=True)
    # Estado de la tarea (pendiente o completada, valor por defecto: 'pending')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    # Representación en texto de la tarea (usada en el panel de administración, por ejemplo)
    def __str__(self):
        return self.title

# Define un modelo de perfil de usuario que extiende el modelo User
class UserProfile(models.Model):
    # Relación uno a uno con el modelo User (cada usuario tiene un perfil)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Representación en texto del perfil de usuario
    def __str__(self):
        return f"Perfil de {self.user.username}"
