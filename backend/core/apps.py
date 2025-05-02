# Importa la clase base para la configuración de aplicaciones en Django
from django.apps import AppConfig

# Define una clase de configuración para la aplicación 'core'
class CoreConfig(AppConfig):
    # Especifica el tipo de campo automático por defecto para las claves primarias en los modelos
    default_auto_field = 'django.db.models.BigAutoField'
    # Nombre de la aplicación, debe coincidir con el nombre del directorio de la app
    name = 'core'

    # Método que se ejecuta cuando la aplicación está lista
    def ready(self):
        # Importa el módulo de señales para que Django las registre
        import core.signals
