<h1>SIGE - Sistema de Gestión</h1>
<p align="center">
  <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="https://www.mongodb.com/try/download/community-kubernetes-operator" target="_blank"><img src="https://www.pngall.com/wp-content/uploads/13/Mongodb-PNG-Image-HD.png" width="200" alt="Mongo Logo" /></a>
  <a href="https://ionicframework.com/" target="_blank"><img src="https://ionicframework.com/img/meta/logo.png" width="200" alt="Ionic Logo" /></a>
</p>
<p align="center">npm v10.2.4</p>
<p align="center">node v20.9.0</p>

## 📋 Estructura del Proyecto

El proyecto SIGE está organizado como un monorepo con múltiples aplicaciones:

### Backend:
- **app-usuarios**: API principal para gestión de usuarios
- **app-bodega**: API para gestión de inventario
- **app-tareas**: API para sistema de asignación de tareas

### Frontend:
- **ionic-sige**: Aplicación móvil/web desarrollada con Ionic

## 📥 Clonar el repositorio
Se puede descargar y descomprimir el código fuente en el equipo, o ejecutar los siguientes comandos en la terminal:
```bash
cd C:/SIGE/
```
```bash
git clone https://github.com/LinkinCypher/sige.git
```
```bash
cd sige
```

## 📥 Instalación en Windows
Las siguientes herramientas son importantes:
<li><a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a></li>
<li><a href="https://git-scm.com/" target="_blank">Git</a></li>
<li><a href="https://nodejs.org/en" target="_blank">Node</a></li>
<li><a href="https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.4-signed.msi" target="_blank">MongoDB</a></li>
<li><a href="https://downloads.mongodb.com/compass/mongodb-compass-1.41.0-win32-x64.exe" target="_blank">MongoDB - Compass</a></li>
<li><a href="https://www.npmjs.com/package/pm2" target="_blank">PM2</a></li>

## ⚙️ Ejecutar las aplicaciones backend

### API de Usuarios
```bash
cd backend/app-usuarios
```
```bash
npm install
```
```bash
npm run build
```
```bash
npm run start:dev
```

## ⚙️ Ejecutar la aplicación frontend
```bash
cd frontend/ionic-sige
```
```bash
npm install
```
```bash
ionic serve
```

## 📦 Gestión con PM2
Para gestionar todas las APIs con PM2, Instalar PM2 globalmente si aún no está instalado:
```bash
npm install -g pm2
```

Iniciar todas las APIs
```bash
pm2 start backend/app-usuarios/dist/main.js --name app-usuarios
```

Ver status
```bash
pm2 status
```

Detener todas las aplicaciones
```bash
pm2 stop all
```

## 🔑 Cargar usuarios iniciales a MongoDB
<li>Abrir MongoDB Compass y conectar a la instancia local.</li>
<li>Seleccionar la base de datos 'sige'.</li>
<li>Abrir la colección de usuarios ('users').</li>
<li>Insertar el siguiente JSON:</li>

```json
[
  {
    "_id": { "$oid": "6793ea20bbc86804ca46e7ec" },
    "username": "admin",
    "password": "$2b$10$XkrdHERnWGN4tKV6Ug1hveqgJ9g/MXl3xfJe7XiQKbQrMkIaKVRhy",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "cargo": "Administrador",
    "fechaNacimiento": "1990-01-01",
    "role": "admin",
    "__v": 0
  }
]
```

### ✅ Credenciales de acceso:
<li>Usuario: admin</li>
<li>Contraseña: admin</li>