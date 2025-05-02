# Importa el módulo de permisos de Django REST framework
from rest_framework import permissions
# Importa la clase base para crear permisos personalizados
from rest_framework.permissions import BasePermission

# Permiso personalizado: permite lectura a todos, pero solo el usuario asignado o staff puede modificar
class IsAssignedOrReadOnly(permissions.BasePermission):
    # Define si el usuario tiene permiso sobre un objeto específico
    def has_object_permission(self, request, view, obj):
        # Permite métodos seguros (GET, HEAD, OPTIONS) para todos los usuarios
        if request.method in permissions.SAFE_METHODS:
            return True
        # Permite escritura/modificación solo si el usuario está asignado o es staff
        return obj.assigned_to == request.user or request.user.is_staff

# Permiso personalizado: permite acceso solo a usuarios autenticados que son staff
class IsStaffUser(BasePermission):

    # Define si el usuario tiene permiso para acceder a la vista
    def has_permission(self, request, view):
        # Verifica que el usuario esté autenticado y sea staff
        return request.user and request.user.is_authenticated and request.user.is_staff
