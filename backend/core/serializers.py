# Importa el módulo de serializadores de Django REST framework
from rest_framework import serializers
# Importa el modelo User de Django para serializar datos de usuarios
from django.contrib.auth.models import User
# Importa los modelos Task y UserProfile que serán serializados
from .models import Task
from .models import UserProfile

# Serializador simple para representar información básica del usuario (ID y nombre de usuario)
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Define el modelo a serializar
        fields = ['id', 'username']  # Campos a incluir en la representación del usuario

# Serializador más completo para representar los datos del usuario (ID, nombre de usuario, email, permisos)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Define el modelo a serializar
        fields = ['id', 'username', 'email', 'is_superuser', 'is_staff']  # Campos a incluir en la representación

# Serializador para el registro de nuevos usuarios, incluye un campo para indicar si es staff
class RegisterSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField(required=False, default=False)  # Campo para indicar si el usuario es staff

    class Meta:
        model = User  # Define el modelo a serializar
        fields = ['username', 'email', 'password', 'is_staff']  # Campos que serán enviados
        extra_kwargs = {'password': {'write_only': True}}  # El campo 'password' solo será para escritura

    # Sobrescribe el método 'create' para registrar un usuario, asignar si es staff y crear un perfil de usuario
    def create(self, validated_data):
        is_staff = validated_data.pop('is_staff', False)  # Extrae el campo is_staff
        user = User.objects.create_user(**validated_data)  # Crea el usuario
        user.is_staff = is_staff  # Asigna si el usuario es staff
        user.save()  # Guarda el usuario en la base de datos
        UserProfile.objects.get_or_create(user=user)  # Crea un perfil de usuario si no existe
        return user  # Devuelve el usuario creado

# Serializador para las tareas, incluye el nombre de usuario del asignado
class TaskSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)  # Muestra el nombre de usuario del asignado

    class Meta:
        model = Task  # Define el modelo a serializar
        fields = ['id', 'title', 'description', 'assigned_to', 'assigned_to_username']  # Campos a incluir
