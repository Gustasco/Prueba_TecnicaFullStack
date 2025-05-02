# Importa las clases necesarias de DRF y otros módulos
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .models import Task
from .serializers import UserSerializer, RegisterSerializer, TaskSerializer, SimpleUserSerializer
from .permissions import IsAssignedOrReadOnly, IsStaffUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser


# Vista para registrar un nuevo usuario
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]  # Permite el acceso sin necesidad de autenticación

    def create(self, request, *args, **kwargs):
        try:
            # Llama al método de creación para registrar al usuario
            response = super().create(request, *args, **kwargs)
            return response
        except ValidationError as e:
            # Si hay un error, retorna un mensaje de error
            return Response({"detail": "Error en el registro de usuario"}, status=400)


# Vista para obtener y mostrar el perfil del usuario autenticado
class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Solo accesible para usuarios autenticados
    authentication_classes = [JWTAuthentication]  # Autenticación usando JWT

    def get_object(self):
        # Retorna el usuario autenticado
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        # Serializa y retorna los datos del usuario
        response_data = UserSerializer(user).data
        return Response(response_data)


# Vista para listar todas las tareas o crear una nueva tarea
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]  # Solo accesible para usuarios autenticados
    authentication_classes = [JWTAuthentication]  # Autenticación usando JWT

    def get_queryset(self):
        # Filtra las tareas según el usuario autenticado
        user = self.request.user
        if user.is_staff:
            return Task.objects.all()  # Los administradores pueden ver todas las tareas
        return Task.objects.filter(assigned_to=user)  # Los usuarios comunes solo ven las tareas asignadas a ellos

    def perform_create(self, serializer):
        # Permite que el admin asigne tareas a cualquier usuario, los usuarios comunes solo pueden asignarse tareas a sí mismos
        if self.request.user.is_staff:
            serializer.save()
        else:
            serializer.save(assigned_to=self.request.user)


# Vista para obtener, actualizar o eliminar una tarea específica
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsAssignedOrReadOnly]  # Permiso personalizado que verifica si el usuario está asignado
    authentication_classes = [JWTAuthentication]  # Autenticación usando JWT


# Vista personalizada para obtener el token de acceso y el perfil del usuario
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Llama al método original para obtener los tokens
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(username=request.data['username'])
        user_data = UserSerializer(user).data  # Obtiene los datos del usuario
        user_data['is_staff'] = user.is_staff  # Añade si el usuario es administrador
        # Retorna los tokens junto con los datos del usuario
        return Response({
            'access': response.data['access'],
            'refresh': response.data['refresh'],
            'user': user_data
        })


# Vista para listar todos los usuarios (solo accesible para administradores)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffUser])  # Solo accesible para usuarios autenticados y administradores
def user_list(request):
    users = User.objects.all()  # Obtiene todos los usuarios
    serializer = SimpleUserSerializer(users, many=True)  # Serializa los usuarios
    return Response(serializer.data)  # Retorna los datos serializados
