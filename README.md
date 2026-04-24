# 🚀 API Backend - Node.js + Express + MySQL

Backend API profesional y listo para producción construido con Node.js, Express, MySQL y autenticación JWT.

## 📋 Características

✅ Autenticación con JWT  
✅ Contraseñas encriptadas con bcrypt  
✅ Base de datos MySQL con pool de conexiones  
✅ CRUD completo para items  
✅ Manejo de errores robusto  
✅ CORS configurado  
✅ Docker y Docker Compose incluidos  
✅ Variables de entorno con dotenv  
✅ Estructura profesional y escalable  

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MySQL** - Base de datos
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **dotenv** - Gestión de variables de entorno
- **Docker** - Containerización

## 📦 Instalación

### Prerrequisitos
- Node.js v14 o superior
- npm o yarn
- MySQL (local o remoto como db4free.net)
- Docker y Docker Compose (opcional)

### Paso 1: Clonar o descargar el proyecto

```bash
cd API_BANKEND
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

Edita el archivo `.env`:

```env
# Base de Datos
DB_HOST=db4free.net          # Host de MySQL
DB_USER=root                  # Usuario de MySQL
DB_PASSWORD=password123       # Contraseña de MySQL
DB_NAME=api_backend          # Nombre de la base de datos
DB_PORT=3306                 # Puerto de MySQL

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_with_a_strong_key

# Servidor
PORT=3000
NODE_ENV=development
```

### Paso 4: Ejecutar el servidor

#### Desarrollo (con auto-reload):
```bash
npm run dev
```

#### Producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 🐳 Docker

### Compilar imagen Docker

```bash
npm run docker:build
# o
docker build -t api-backend .
```

### Ejecutar con Docker

```bash
npm run docker:run
# o
docker run -p 3000:3000 --env-file .env api-backend
```

### Ejecutar con Docker Compose

```bash
npm run docker:compose
# o
docker-compose up -d
```

### Detener servicios Docker Compose

```bash
npm run docker:compose:down
# o
docker-compose down
```

## 📁 Estructura del Proyecto

```
API_BANKEND/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión MySQL
│   ├── controllers/
│   │   ├── authController.js    # Lógica de registro y login
│   │   └── itemController.js    # Lógica CRUD de items
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   └── itemRoutes.js        # Rutas de items
│   ├── middlewares/
│   │   └── auth.js              # Middleware de verificación JWT
│   └── models/
│       ├── User.js              # Modelo de usuario
│       └── Item.js              # Modelo de item
├── server.js                    # Archivo principal del servidor
├── package.json                 # Dependencias y scripts
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── Dockerfile                   # Configuración Docker
├── docker-compose.yml           # Configuración Docker Compose
└── README.md                    # Este archivo
```

## 🔐 Autenticación

### Registro de usuario

**Endpoint:** `POST /auth/register`

**Body (JSON):**
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

### Iniciar sesión

**Endpoint:** `POST /auth/login`

**Body (JSON):**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

## 📝 Endpoints CRUD Items

Todos los endpoints de items requieren autenticación con JWT. Incluye el token en el header:

```
Authorization: Bearer {tu_token_aqui}
```

### Obtener todos los items

**Endpoint:** `GET /api/items`

**Headers requeridos:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200):**
```json
{
  "message": "Items obtenidos correctamente",
  "count": 2,
  "items": [
    {
      "id": 1,
      "nombre": "Item 1",
      "descripcion": "Descripción del item",
      "estado": "activo",
      "user_id": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Obtener item por ID

**Endpoint:** `GET /api/items/:id`

**Headers requeridos:**
```
Authorization: Bearer {token}
```

**Ejemplo:** `GET /api/items/1`

**Respuesta (200):**
```json
{
  "message": "Item obtenido correctamente",
  "item": {
    "id": 1,
    "nombre": "Item 1",
    "descripcion": "Descripción del item",
    "estado": "activo",
    "user_id": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Crear item

**Endpoint:** `POST /api/items`

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Mi Nuevo Item",
  "descripcion": "Esta es la descripción",
  "estado": "activo"
}
```

**Respuesta (201):**
```json
{
  "message": "Item creado exitosamente",
  "item": {
    "id": 2,
    "nombre": "Mi Nuevo Item",
    "descripcion": "Esta es la descripción",
    "estado": "activo",
    "user_id": 1,
    "created_at": "2024-01-15T11:00:00.000Z"
  }
}
```

### Actualizar item

**Endpoint:** `PUT /api/items/:id`

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Item Actualizado",
  "descripcion": "Nueva descripción",
  "estado": "inactivo"
}
```

**Ejemplo:** `PUT /api/items/1`

**Respuesta (200):**
```json
{
  "message": "Item actualizado correctamente",
  "item": {
    "id": 1,
    "nombre": "Item Actualizado",
    "descripcion": "Nueva descripción",
    "estado": "inactivo"
  }
}
```

### Eliminar item

**Endpoint:** `DELETE /api/items/:id`

**Headers requeridos:**
```
Authorization: Bearer {token}
```

**Ejemplo:** `DELETE /api/items/1`

**Respuesta (200):**
```json
{
  "message": "Item eliminado correctamente",
  "result": {
    "message": "Item eliminado correctamente"
  }
}
```

## 🧪 Pruebas con Postman

### 1. Importar colección a Postman

Crea estas requests en Postman:

#### Registro
- **Método:** POST
- **URL:** `http://localhost:3000/auth/register`
- **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login
- **Método:** POST
- **URL:** `http://localhost:3000/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Copia el token de la respuesta.

#### Crear Item
- **Método:** POST
- **URL:** `http://localhost:3000/api/items`
- **Headers:** 
  - `Authorization: Bearer {tu_token}`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nombre": "Tarea importante",
  "descripcion": "Esta es una tarea importante",
  "estado": "activo"
}
```

#### Obtener Items
- **Método:** GET
- **URL:** `http://localhost:3000/api/items`
- **Headers:** 
  - `Authorization: Bearer {tu_token}`

#### Actualizar Item
- **Método:** PUT
- **URL:** `http://localhost:3000/api/items/1`
- **Headers:** 
  - `Authorization: Bearer {tu_token}`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nombre": "Tarea actualizada",
  "descripcion": "Descripción actualizada",
  "estado": "pendiente"
}
```

#### Eliminar Item
- **Método:** DELETE
- **URL:** `http://localhost:3000/api/items/1`
- **Headers:** 
  - `Authorization: Bearer {tu_token}`

## 🔧 Configuración de Base de Datos

### Usando db4free.net (Recomendado para desarrollo)

1. Registrate en [db4free.net](https://www.db4free.net/)
2. Crea una base de datos
3. Actualiza las variables en `.env`:

```env
DB_HOST=db4free.net
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_de_datos
DB_PORT=3306
```

### Usando MySQL local

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=api_backend
DB_PORT=3306
```

Las tablas se crearán automáticamente al iniciar el servidor.

## 📊 Esquema de Base de Datos

### Tabla: users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla: items
```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'activo',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 Despliegue en Producción

### Cambios necesarios antes de producción:

1. **Cambiar JWT_SECRET:**
```env
JWT_SECRET=un_secreto_muy_largo_y_aleatorio_de_al_menos_32_caracteres_xyz123
```

2. **Cambiar NODE_ENV:**
```env
NODE_ENV=production
```

3. **Usar base de datos remota:**
```env
DB_HOST=tu_servidor_mysql.com
DB_USER=usuario_produccion
DB_PASSWORD=contraseña_fuerte_muy_segura
```

4. **Configurar HTTPS** (nginx o similar)

5. **Usar variables de entorno del servidor** en lugar de archivo `.env`

## 📝 Scripts disponibles

```bash
npm start                   # Iniciar servidor en producción
npm run dev                 # Iniciar servidor con nodemon (desarrollo)
npm run docker:build        # Compilar imagen Docker
npm run docker:run          # Ejecutar en Docker
npm run docker:compose      # Ejecutar con Docker Compose
npm run docker:compose:down # Detener Docker Compose
```

## ⚠️ Solución de problemas

### Error: "Error al conectar a MySQL"
- Verifica que la base de datos esté disponible
- Revisa las credenciales en `.env`
- Confirma que el host y puerto son correctos

### Error: "Token inválido"
- Asegúrate de enviar el token en el formato correcto
- Verifica que el JWT_SECRET sea el mismo en `.env`
- El token puede haber expirado (regenera haciendo login nuevamente)

### Error: "Puerto 3000 ya está en uso"
```bash
# Cambia el puerto en .env
PORT=3001
```

### Error en Docker: "Cannot connect to database"
- Asegúrate de que el contenedor MySQL esté corriendo
- Verifica las variables de entorno en docker-compose.yml

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la sección de troubleshooting
2. Verifica los logs del servidor
3. Consulta la documentación de las dependencias

## 📄 Licencia

MIT

## 👨‍💻 Autor

Backend Team - 2024

---

**¡Listo para producción!** 🎉

Este proyecto está completamente funcional y listo para ser desplegado. ¡Éxito con tu API!
# API_BANKEND
