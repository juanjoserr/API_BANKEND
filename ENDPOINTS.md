# 🔌 GUÍA COMPLETA DE ENDPOINTS

## BASE URL
```
http://localhost:3000
```

---

# 🟢 AUTENTICACIÓN

## 1. Registro (POST /auth/register)

Registra un nuevo usuario en el sistema.

### Endpoint
```
POST /auth/register
```

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Validaciones
- Email es requerido y debe ser válido
- Password debe tener mínimo 6 caracteres
- confirmPassword debe coincidir con password
- El email no puede estar ya registrado

### Response 201 (Éxito)
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

### Response 400 (Validación fallida)
```json
{
  "error": "Campos incompletos",
  "message": "Email, contraseña y confirmación son requeridos"
}
```

### Response 409 (Usuario ya existe)
```json
{
  "error": "Usuario ya existe",
  "message": "El email proporcionado ya está registrado"
}
```

### Ejemplo con Curl
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123",
    "confirmPassword": "securepass123"
  }'
```

### Ejemplo con JavaScript
```javascript
const response = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securepass123',
    confirmPassword: 'securepass123'
  })
});
const data = await response.json();
console.log(data);
```

---

## 2. Login (POST /auth/login)

Inicia sesión y obtiene un token JWT.

### Endpoint
```
POST /auth/login
```

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Validaciones
- Email es requerido
- Password es requerido
- Las credenciales deben ser correctas

### Response 200 (Éxito)
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwigbmFpbCI6InVzdWFyaW9AZXhhbXBsZS5jb20iLCJpYXQiOjE2NzMyMDAwMDAsImV4cCI6MTY3MzI4NjQwMH0.signature_here",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

### Response 401 (Credenciales inválidas)
```json
{
  "error": "Credenciales inválidas",
  "message": "Email o contraseña incorrectos"
}
```

### Ejemplo con Curl
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### ⚠️ IMPORTANTE: Guardar el Token
El token en la respuesta se usa en todas las peticiones protegidas:

```
Authorization: Bearer {token_aqui}
```

---

# 📦 CRUD DE ITEMS

**Todos los endpoints de items requieren autenticación**

Debes incluir el token en cada petición:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3. Obtener Todos los Items (GET /api/items)

Obtiene todos los items del usuario autenticado.

### Endpoint
```
GET /api/items
```

### Headers
```
Authorization: Bearer {tu_token_jwt}
Content-Type: application/json
```

### Request Body
```
(Sin body)
```

### Response 200 (Éxito)
```json
{
  "message": "Items obtenidos correctamente",
  "count": 2,
  "items": [
    {
      "id": 1,
      "nombre": "Mi primer item",
      "descripcion": "Esta es la descripción",
      "estado": "activo",
      "user_id": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "nombre": "Segundo item",
      "descripcion": "Otra descripción",
      "estado": "pendiente",
      "user_id": 1,
      "created_at": "2024-01-15T11:45:00.000Z",
      "updated_at": "2024-01-15T11:45:00.000Z"
    }
  ]
}
```

### Response 401 (Sin token)
```json
{
  "error": "Token no proporcionado",
  "message": "Se requiere un token en el header Authorization: Bearer <token>"
}
```

### Ejemplo con Curl
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Ejemplo con JavaScript
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const response = await fetch('http://localhost:3000/api/items', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.items);
```

---

## 4. Obtener Item por ID (GET /api/items/:id)

Obtiene un item específico por su ID.

### Endpoint
```
GET /api/items/:id
```

### Headers
```
Authorization: Bearer {tu_token_jwt}
Content-Type: application/json
```

### Path Parameters
```
id: number (ID del item)
```

### Request Body
```
(Sin body)
```

### Response 200 (Éxito)
```json
{
  "message": "Item obtenido correctamente",
  "item": {
    "id": 1,
    "nombre": "Mi primer item",
    "descripcion": "Esta es la descripción",
    "estado": "activo",
    "user_id": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response 404 (No encontrado)
```json
{
  "error": "Item no encontrado",
  "message": "El item solicitado no existe o no pertenece al usuario"
}
```

### Ejemplo
```bash
curl -X GET http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Crear Item (POST /api/items)

Crea un nuevo item.

### Endpoint
```
POST /api/items
```

### Headers
```
Authorization: Bearer {tu_token_jwt}
Content-Type: application/json
```

### Request Body
```json
{
  "nombre": "Mi nuevo item",
  "descripcion": "Una descripción completa",
  "estado": "activo"
}
```

### Validaciones
- nombre (string, requerido) - Mínimo 3 caracteres
- descripcion (string, opcional) - Puede estar vacío
- estado (enum, opcional) - "activo" | "inactivo" | "pendiente"

### Response 201 (Éxito)
```json
{
  "message": "Item creado exitosamente",
  "item": {
    "id": 3,
    "nombre": "Mi nuevo item",
    "descripcion": "Una descripción completa",
    "estado": "activo",
    "user_id": 1,
    "created_at": "2024-01-15T12:00:00.000Z"
  }
}
```

### Response 400 (Validación fallida)
```json
{
  "error": "Nombre muy corto",
  "message": "El nombre debe tener al menos 3 caracteres"
}
```

### Ejemplo con Curl
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Comprar leche",
    "descripcion": "Ir al supermercado a comprar leche",
    "estado": "activo"
  }'
```

### Ejemplo con JavaScript
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const response = await fetch('http://localhost:3000/api/items', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: 'Comprar leche',
    descripcion: 'Ir al supermercado a comprar leche',
    estado: 'activo'
  })
});

const newItem = await response.json();
console.log(newItem);
```

---

## 6. Actualizar Item (PUT /api/items/:id)

Actualiza un item existente.

### Endpoint
```
PUT /api/items/:id
```

### Headers
```
Authorization: Bearer {tu_token_jwt}
Content-Type: application/json
```

### Path Parameters
```
id: number (ID del item a actualizar)
```

### Request Body
```json
{
  "nombre": "Item actualizado",
  "descripcion": "Nueva descripción",
  "estado": "completado"
}
```

### Validaciones
- nombre (string, requerido) - Mínimo 3 caracteres
- descripcion (string, requerido pero puede estar vacío)
- estado (enum, requerido) - "activo" | "inactivo" | "pendiente"

### Response 200 (Éxito)
```json
{
  "message": "Item actualizado correctamente",
  "item": {
    "id": 1,
    "nombre": "Item actualizado",
    "descripcion": "Nueva descripción",
    "estado": "completado"
  }
}
```

### Response 404 (No encontrado)
```json
{
  "error": "Item no encontrado",
  "message": "Item no encontrado o no pertenece al usuario"
}
```

### Ejemplo con Curl
```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Comprar leche - HECHO",
    "descripcion": "Ya compré la leche en el supermercado",
    "estado": "inactivo"
  }'
```

### Ejemplo con JavaScript
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const itemId = 1;

const response = await fetch(`http://localhost:3000/api/items/${itemId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: 'Comprar leche - HECHO',
    descripcion: 'Ya compré la leche en el supermercado',
    estado: 'inactivo'
  })
});

const updatedItem = await response.json();
console.log(updatedItem);
```

---

## 7. Eliminar Item (DELETE /api/items/:id)

Elimina un item existente.

### Endpoint
```
DELETE /api/items/:id
```

### Headers
```
Authorization: Bearer {tu_token_jwt}
Content-Type: application/json
```

### Path Parameters
```
id: number (ID del item a eliminar)
```

### Request Body
```
(Sin body)
```

### Response 200 (Éxito)
```json
{
  "message": "Item eliminado correctamente",
  "result": {
    "message": "Item eliminado correctamente"
  }
}
```

### Response 404 (No encontrado)
```json
{
  "error": "Item no encontrado",
  "message": "Item no encontrado o no pertenece al usuario"
}
```

### Ejemplo con Curl
```bash
curl -X DELETE http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Ejemplo con JavaScript
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const itemId = 1;

const response = await fetch(`http://localhost:3000/api/items/${itemId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log(result.message);
```

---

# 🧪 TEST COMPLETO - FLUJO COMPLETO

Este es un ciclo completo de todas las operaciones:

### 1. Registrar usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

Respuesta:
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

### 2. Iniciar sesión
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

**Guardar token:** `TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`

### 3. Crear item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi primer item",
    "descripcion": "Descripción del primer item",
    "estado": "activo"
  }'
```

### 4. Obtener todos los items
```bash
curl -X GET http://localhost:3000/api/items \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Obtener item específico (supongamos id=1)
```bash
curl -X GET http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Actualizar item
```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Item actualizado",
    "descripcion": "Nueva descripción",
    "estado": "pendiente"
  }'
```

### 7. Eliminar item
```bash
curl -X DELETE http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

# 🚨 CÓDIGOS DE RESPUESTA

| Código | Significado | Ejemplo |
|--------|------------|---------|
| **200** | OK - Petición exitosa | GET item, PUT item |
| **201** | Created - Recurso creado | POST register, POST item |
| **400** | Bad Request - Validación fallida | Email inválido |
| **401** | Unauthorized - Sin token o inválido | Sin header Authorization |
| **404** | Not Found - Recurso no existe | GET item que no existe |
| **409** | Conflict - Conflicto (ej: email duplicado) | POST register con email existente |
| **500** | Server Error - Error interno | Error en BD |

---

# 💡 TIPS

1. **Guarda el token** después de login para usar en peticiones protegidas
2. **El token expira** en 24 horas, necesitarás hacer login de nuevo
3. **Incluye siempre** el header `Authorization: Bearer {token}`
4. **Valida en frontend** antes de enviar al servidor
5. **Usa Postman** para probar fácilmente
6. **Verifica el .env** antes de cambiar de BD

---

**¡Listo! Ahora tienes todos los endpoints documentados y listos para usar.** 🚀
