# 🧪 PRUEBAS DE API - EJEMPLOS CON CURL

# Este archivo contiene ejemplos de comandos curl para probar la API
# Asegúrate de que el servidor esté corriendo en http://localhost:3000

# ═══════════════════════════════════════════════════════════════════════════
# 1️⃣ PROBAR SERVIDOR
# ═══════════════════════════════════════════════════════════════════════════

curl -X GET http://localhost:3000/


# ═══════════════════════════════════════════════════════════════════════════
# 2️⃣ REGISTRO DE USUARIO
# ═══════════════════════════════════════════════════════════════════════════

curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Respuesta esperada (201):
# {
#   "message": "Usuario registrado exitosamente",
#   "user": {
#     "id": 1,
#     "email": "usuario@example.com"
#   }
# }


# ═══════════════════════════════════════════════════════════════════════════
# 3️⃣ LOGIN - OBTENER TOKEN JWT
# ═══════════════════════════════════════════════════════════════════════════

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'

# Respuesta esperada (200):
# {
#   "message": "Inicio de sesión exitoso",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": 1,
#     "email": "usuario@example.com"
#   }
# }

# ⚠️  IMPORTANTE: Guarda el token para las siguientes peticiones
# TOKEN_AQUI="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."


# ═══════════════════════════════════════════════════════════════════════════
# 4️⃣ CREAR ITEM (requiere autenticación)
# ═══════════════════════════════════════════════════════════════════════════

curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer COLOCA_TU_TOKEN_AQUI" \
  -d '{
    "nombre": "Mi primer item",
    "descripcion": "Esta es una descripción de prueba",
    "estado": "activo"
  }'

# Respuesta esperada (201):
# {
#   "message": "Item creado exitosamente",
#   "item": {
#     "id": 1,
#     "nombre": "Mi primer item",
#     "descripcion": "Esta es una descripción de prueba",
#     "estado": "activo",
#     "user_id": 1,
#     "created_at": "2024-01-15T10:30:00.000Z"
#   }
# }


# ═══════════════════════════════════════════════════════════════════════════
# 5️⃣ OBTENER TODOS LOS ITEMS
# ═══════════════════════════════════════════════════════════════════════════

curl -X GET http://localhost:3000/api/items \
  -H "Authorization: Bearer COLOCA_TU_TOKEN_AQUI"

# Respuesta esperada (200):
# {
#   "message": "Items obtenidos correctamente",
#   "count": 1,
#   "items": [...]
# }


# ═══════════════════════════════════════════════════════════════════════════
# 6️⃣ OBTENER UN ITEM ESPECÍFICO
# ═══════════════════════════════════════════════════════════════════════════

curl -X GET http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer COLOCA_TU_TOKEN_AQUI"

# Respuesta esperada (200):
# {
#   "message": "Item obtenido correctamente",
#   "item": {...}
# }


# ═══════════════════════════════════════════════════════════════════════════
# 7️⃣ ACTUALIZAR UN ITEM
# ═══════════════════════════════════════════════════════════════════════════

curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer COLOCA_TU_TOKEN_AQUI" \
  -d '{
    "nombre": "Item actualizado",
    "descripcion": "Nueva descripción",
    "estado": "pendiente"
  }'

# Respuesta esperada (200):
# {
#   "message": "Item actualizado correctamente",
#   "item": {...}
# }


# ═══════════════════════════════════════════════════════════════════════════
# 8️⃣ ELIMINAR UN ITEM
# ═══════════════════════════════════════════════════════════════════════════

curl -X DELETE http://localhost:3000/api/items/1 \
  -H "Authorization: Bearer COLOCA_TU_TOKEN_AQUI"

# Respuesta esperada (200):
# {
#   "message": "Item eliminado correctamente",
#   "result": {
#     "message": "Item eliminado correctamente"
#   }
# }


# ═══════════════════════════════════════════════════════════════════════════
# GUÍA RÁPIDA CON POSTMAN
# ═══════════════════════════════════════════════════════════════════════════
#
# 1. Copia estos comandos curl directamente en Postman:
#    - Abre Postman
#    - Haz clic en "Import"
#    - Selecciona "Raw text"
#    - Pega los comandos
#
# O crea las requests manualmente:
#
# Request 1 - Registro:
#   Método: POST
#   URL: http://localhost:3000/auth/register
#   Body (raw JSON): 
#     {
#       "email": "test@example.com",
#       "password": "password123",
#       "confirmPassword": "password123"
#     }
#
# Request 2 - Login:
#   Método: POST
#   URL: http://localhost:3000/auth/login
#   Body (raw JSON):
#     {
#       "email": "test@example.com",
#       "password": "password123"
#     }
#
# Request 3 - Crear Item:
#   Método: POST
#   URL: http://localhost:3000/api/items
#   Headers: Authorization: Bearer {token_del_login}
#   Body (raw JSON):
#     {
#       "nombre": "Mi item",
#       "descripcion": "Descripción",
#       "estado": "activo"
#     }
#
# Request 4 - Obtener Items:
#   Método: GET
#   URL: http://localhost:3000/api/items
#   Headers: Authorization: Bearer {token_del_login}
#
# ═══════════════════════════════════════════════════════════════════════════
