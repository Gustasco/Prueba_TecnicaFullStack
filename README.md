Pasos para ejecutar la aplicacion: 
<>
BACKEND:
1.- Ingresar con VSC al backend (cd backend)
<>
2.- Ingresar comando para entorno virtual (venv\Scripts\activate)
<>
3.- Ejecutar comando de docker, esto permitira que se ejecute el back completamente junto a la base de datos (docker-compose up --build)
<>
Opcional:
<>
Para ejecutar pruebas, se debe ejecutar, una vez creado el entorno virtual:
docker-compose run web python manage.py test
<>
FRONTEND:
<>
1.- Instalar dependencias (npm i)
<>
2.- Ejecutar comando de ejecucion (npm run dev)
<>
Las credenciales para inicio de sension en modo admin son:
<>
Nombre de usuario: admin
<>
Contraseña: 1234