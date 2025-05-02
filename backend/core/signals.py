# Importa el módulo post_save de señales para ejecutar una función después de guardar un modelo
from django.db.models.signals import post_save
# Importa el decorador receiver que conecta las señales con las funciones
from django.dispatch import receiver
# Importa el modelo User de Django para acceder a la información de usuarios
from django.contrib.auth.models import User
# Importa el modelo UserProfile, que es el perfil de usuario extendido
from .models import UserProfile

# Conecta la señal post_save con la función create_or_update_user_profile
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Esta función se ejecuta cada vez que se guarda un modelo User.
    Si el usuario es creado, crea un perfil de usuario (UserProfile).
    Si el usuario ya existe, actualiza el perfil de usuario.
    """
    if created:  # Si el usuario es creado
        # Crea un nuevo perfil de usuario asociado al usuario recién creado
        UserProfile.objects.create(user=instance)
    else:
        # Si el usuario ya existía, actualiza su perfil
        instance.userprofile.save()
