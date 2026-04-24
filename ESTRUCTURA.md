# 📁 ESTRUCTURA DEL PROYECTO

```
API_BANKEND/                    # Raíz del proyecto
├── 📦 src/                     # Código fuente principal
│   ├── 📂 config/
│   │   └── database.js         # Configuración y conexión a MySQL (pool de conexiones)
│   │
│   ├── 📂 controllers/         # Lógica de negocio
│   │   ├── authController.js   # Register y Login
│   │   └── itemController.js   # CRUD de items
│   │
│   ├── 📂 routes/              # Definición de endpoints
│   │   ├── authRoutes.js       # Rutas: /auth/register, /auth/login
│   │   └── itemRoutes.js       # Rutas: GET/POST/PUT/DELETE /api/items
│   │
│   ├── 📂 middlewares/         # Funciones intermedias
│   │   └── auth.js             # Verificación de JWT
│   │
│   └── 📂 models/              # Modelos de datos
│       ├── User.js             # Operaciones BD: crear, buscar, verificar usuarios
│       └── Item.js             # Operaciones BD: CRUD de items
│
├── 📄 server.js                # Archivo principal - Inicia Express en puerto 3000
├── 📄 package.json             # Dependencias y scripts npm
├── 📄 .env                     # Variables de entorno (DB, JWT, etc)
├── 📄 .env.example             # Template del .env
├── 📄 .gitignore               # Archivos ignorados por Git
├── 📄 Dockerfile               # Configuración para Docker
├── 📄 docker-compose.yml       # Orquestación de contenedores
├── 📄 README.md                # Documentación completa
├── 📄 INICIO_RAPIDO.sh         # Guía de inicio rápido
├── 📄 PRUEBAS_API.md           # Ejemplos de pruebas con curl
└── 📄 ESTRUCTURA.md            # Este archivo

```

# 🔍 EXPLICACIÓN DE CADA COMPONENTE

## 📄 server.js
**Archivo principal del servidor Express**

- Inicia Express en puerto 3000
- Configura middlewares (CORS, JSON, etc)
- Registra las rutas (auth y items)
- Maneja errores globales
- Imprime bonito banner al iniciar

```
Ejecución: npm start | npm run dev
```

---

## 📂 src/config/database.js
**Configuración de conexión a MySQL**

- Crea un pool de conexiones a MySQL
- Usa mysql2/promise para conexiones asincrónicas
- Obtiene credenciales del .env
- Prueba la conexión al iniciar
- Permite reutilizar conexiones (mejor rendimiento)

```
Importado por: User.js, Item.js
```

---

## 📂 src/models/User.js
**Modelo de usuario - Operaciones en base de datos**

Métodos:
- `createTable()` - Crea tabla si no existe
- `create(email, password)` - Registra nuevo usuario con password encriptado
- `findByEmail(email)` - Busca usuario por email
- `findById(id)` - Obtiene usuario por ID
- `verifyPassword(plain, hashed)` - Verifica contraseña con bcrypt

```
Tablas SQL:
- users (id, email, password, created_at, updated_at)
```

---

## 📂 src/models/Item.js
**Modelo de item - CRUD en base de datos**

Métodos:
- `createTable()` - Crea tabla si no existe
- `getAllByUser(userId)` - Obtiene items del usuario
- `getById(id, userId)` - Obtiene item específico
- `create()` - Crea nuevo item
- `update()` - Actualiza item
- `delete()` - Elimina item

```
Tabla SQL:
- items (id, nombre, descripcion, estado, user_id, created_at, updated_at)
- estado: enum (activo, inactivo, pendiente)
```

---

## 🔐 src/middlewares/auth.js
**Middleware de autenticación con JWT**

Función:
- `verifyToken()` - Middleware que verifica token JWT en header Authorization
- Extrae token de: `Authorization: Bearer <token>`
- Valida token con JWT_SECRET
- Añade datos del usuario a `req.user`
- Devuelve 401 si token es inválido o expirado

```
Usado en: itemRoutes (todas las rutas CRUD)
```

---

## 👤 src/controllers/authController.js
**Lógica de autenticación**

Funciones:
- `register()` - POST /auth/register
  - Valida email y contraseña
  - Encripta password con bcrypt
  - Crea usuario en BD
  
- `login()` - POST /auth/login
  - Valida credenciales
  - Genera token JWT válido 24 horas
  - Devuelve token al cliente

```
Respuestas: JSON con estado, mensajes y datos
```

---

## 📦 src/controllers/itemController.js
**Lógica CRUD de items**

Funciones:
- `getAllItems()` - GET /api/items
- `getItemById()` - GET /api/items/:id
- `createItem()` - POST /api/items
- `updateItem()` - PUT /api/items/:id
- `deleteItem()` - DELETE /api/items/:id

```
Todas requieren autenticación (verificación JWT)
Devuelven JSON con mensajes descriptivos
```

---

## 🛣️ src/routes/authRoutes.js
**Definición de rutas de autenticación**

Rutas:
```
POST /auth/register    → register()
POST /auth/login       → login()
```

```
No requiere autenticación
Devuelve token JWT en login
```

---

## 🛣️ src/routes/itemRoutes.js
**Definición de rutas de items**

Rutas:
```
GET    /api/items      → getAllItems()
GET    /api/items/:id  → getItemById()
POST   /api/items      → createItem()
PUT    /api/items/:id  → updateItem()
DELETE /api/items/:id  → deleteItem()
```

```
Todas requieren middleware verifyToken
Token debe estar en header: Authorization: Bearer <token>
```

---

## 📦 package.json
**Configuración del proyecto Node.js**

Scripts disponibles:
```bash
npm start              # Modo producción
npm run dev            # Modo desarrollo con nodemon
npm run docker:build   # Compilar imagen Docker
npm run docker:run     # Ejecutar en Docker
npm run docker:compose # Ejecutar con Docker Compose
```

Dependencias:
- **express** - Framework web
- **mysql2** - Driver para MySQL (promise-based)
- **jsonwebtoken** - Generar y verificar JWT
- **bcryptjs** - Encriptación de contraseñas
- **dotenv** - Cargar variables de entorno
- **cors** - Permitir solicitudes cross-origin
- **nodemon** (dev) - Auto-reload durante desarrollo

---

## 🐳 Dockerfile
**Configuración para ejecutar en contenedor Docker**

```dockerfile
- FROM node:18-alpine
- WORKDIR /app
- COPY package.json
- RUN npm install
- COPY código fuente
- EXPOSE 3000
- CMD npm start
```

Construir:
```bash
docker build -t api-backend .
```

Ejecutar:
```bash
docker run -p 3000:3000 --env-file .env api-backend
```

---

## 🐳 docker-compose.yml
**Orquestación con Docker Compose**

Servicios:
- **backend** - Contenedor de la API
- **mysql-init** - Contenedor MySQL (opcional, para desarrollo)

Características:
- Volumen persistente para BD
- Red compartida entre contenedores
- Health checks
- Variables de entorno configurables

```bash
docker-compose up -d     # Iniciar
docker-compose down      # Detener
```

---

## ⚙️ .env
**Variables de entorno - IMPORTANTE: NO commitear a Git**

```
DB_HOST          → Host de MySQL
DB_USER          → Usuario de MySQL
DB_PASSWORD      → Contraseña (encriptada)
DB_NAME          → Nombre de base de datos
DB_PORT          → Puerto MySQL (default 3306)
JWT_SECRET       → Clave secreta para JWT
PORT             → Puerto del servidor (default 3000)
NODE_ENV         → development | production
```

⚠️ **NUNCA commitear este archivo**

---

## 📄 .gitignore
**Archivos ignorados por Git**

```
node_modules/
.env
dist/
build/
*.log
.DS_Store
.vscode/
```

---

# 🔄 FLUJO DE UNA PETICIÓN

## 1️⃣ Usuario se registra
```
POST /auth/register
↓
authRoutes → register()
↓
Valida datos
↓
User.create() → Encripta password
↓
Inserta en BD
↓
Devuelve usuario sin password
```

## 2️⃣ Usuario inicia sesión
```
POST /auth/login
↓
authRoutes → login()
↓
Valida credenciales
↓
User.findByEmail() → Busca en BD
↓
User.verifyPassword() → Compara passwords
↓
jwt.sign() → Genera token
↓
Devuelve token + user
```

## 3️⃣ Usuario accede a items
```
GET /api/items
↓
Header: Authorization: Bearer <token>
↓
itemRoutes → verifyToken (middleware)
↓
jwt.verify() → Valida token
↓
req.user = datos del token
↓
getAllItems()
↓
Item.getAllByUser(req.user.id)
↓
Query BD
↓
Devuelve items en JSON
```

---

# 🧪 CICLO DE DESARROLLO

1. **Modificas un archivo**
   ```bash
   npm run dev
   ```
   
2. **nodemon detecta cambios**

3. **Servidor reinicia automáticamente**

4. **Pruebas en http://localhost:3000**

---

# 🚀 CICLO DE PRODUCCIÓN

1. **Compilar Dockerfile**
   ```bash
   docker build -t api-backend .
   ```

2. **Ejecutar contenedor**
   ```bash
   docker run -p 3000:3000 --env-file .env api-backend
   ```

3. **O usar Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **API accesible en el puerto 3000**

---

# 📊 TABLAS DE BASE DE DATOS

### users
```sql
id               INT PRIMARY KEY AUTO_INCREMENT
email            VARCHAR(255) UNIQUE NOT NULL
password         VARCHAR(255) NOT NULL (bcrypted)
created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at       TIMESTAMP
```

### items
```sql
id               INT PRIMARY KEY AUTO_INCREMENT
nombre           VARCHAR(255) NOT NULL
descripcion      TEXT
estado           ENUM('activo', 'inactivo', 'pendiente')
user_id          INT FOREIGN KEY → users.id
created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at       TIMESTAMP
```

---

# 🔑 SEGURIDAD

✅ Contraseñas encriptadas con bcrypt (10 salt rounds)
✅ JWT con expiración de 24 horas
✅ Middleware de autenticación en rutas sensibles
✅ Validación de entrada en todos los endpoints
✅ CORS configurado
✅ Manejo de errores sin exponer detalles internos
✅ Variables sensibles en .env

---

# 📈 MEJORAS FUTURAS

- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Logging centralizado
- [ ] Validación con schemas (Joi, Zod)
- [ ] Tests automatizados
- [ ] Swagger/OpenAPI documentation
- [ ] Caching con Redis
- [ ] Transacciones de BD
- [ ] Paginación
- [ ] Filtros y búsqueda

---

**Creado:** 2024
**Versión:** 1.0.0
**Estado:** Production Ready ✅
