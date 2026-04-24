# 🏗️ ARQUITECTURA DEL PROYECTO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    🚀 CLIENTE (Postman, Navegador, etc)                     │
│                                                                             │
└────────────────────────────┬──────────────────────────────────────────────┘
                             │
                    HTTP/HTTPS (JSON)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         📦 EXPRESS SERVER                                   │
│                      (server.js - Puerto 3000)                             │
│                                                                             │
└────────────────────────────┬──────────────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │    CORS      │  │  JSON Body   │  │  Error       │
    │ Middleware   │  │  Parser      │  │  Handler     │
    └──────────────┘  └──────────────┘  └──────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
          ┌─────────────────┐  ┌─────────────────┐
          │  /auth/...      │  │  /api/items/... │
          │ (Auth Routes)   │  │ (Item Routes)   │
          └────────┬────────┘  └────────┬────────┘
                   │                    │
         ┌─────────┴─────────┐          │
         │                   │          ▼
         ▼                   ▼    ┌──────────────────┐
    ┌─────────────┐   ┌─────────────┐  │ JWT Middleware │
    │ Register    │   │  Login      │  │ (verifyToken)  │
    │ Controller  │   │ Controller  │  └──────────────┬─┘
    └──────┬──────┘   └──────┬──────┘                 │
           │                 │                        │
           ▼                 ▼                        ▼
    ┌─────────────┐   ┌─────────────┐   ┌──────────────────────┐
    │ bcrypt      │   │ bcrypt      │   │ Item Controllers:    │
    │ .hash()     │   │ .compare()  │   │ - getAllItems()      │
    │             │   │             │   │ - getItemById()      │
    │ jwt.sign()  │   │ jwt.sign()  │   │ - createItem()       │
    └──────┬──────┘   └──────┬──────┘   │ - updateItem()       │
           │                 │           │ - deleteItem()       │
           └─────────┬───────┘           └──────────┬───────────┘
                     │                              │
                     └──────────────┬───────────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        ▼                       ▼
                   ┌──────────────┐      ┌──────────────┐
                   │ User Model   │      │  Item Model  │
                   │ (User.js)    │      │  (Item.js)   │
                   └──────┬───────┘      └──────┬───────┘
                          │                     │
            ┌─────────────┴──────────┬──────────┴────────────┐
            │                        │                       │
            ▼                        ▼                       ▼
    ┌────────────────────┐  ┌────────────────────┐  ┌────────────────┐
    │ mysql2/promise     │  │ Connection Pool    │  │ Query Builders │
    │ (mysql2.js)        │  │ (Pool Manager)     │  │                │
    └────────────┬───────┘  └────────────────────┘  └────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────┐
    │                                        │
    │         🗄️ MYSQL DATABASE              │
    │                                        │
    │  ┌──────────────────────────────────┐ │
    │  │ TABLE: users                     │ │
    │  │ ├─ id (PK, AI)                   │ │
    │  │ ├─ email (UNIQUE)                │ │
    │  │ ├─ password (hashed)             │ │
    │  │ ├─ created_at                    │ │
    │  │ └─ updated_at                    │ │
    │  └──────────────────────────────────┘ │
    │                                        │
    │  ┌──────────────────────────────────┐ │
    │  │ TABLE: items                     │ │
    │  │ ├─ id (PK, AI)                   │ │
    │  │ ├─ nombre                        │ │
    │  │ ├─ descripcion                   │ │
    │  │ ├─ estado (enum)                 │ │
    │  │ ├─ user_id (FK)                  │ │
    │  │ ├─ created_at                    │ │
    │  │ └─ updated_at                    │ │
    │  └──────────────────────────────────┘ │
    │                                        │
    └────────────────────────────────────────┘
```

---

## 📊 FLUJO DE AUTENTICACIÓN

```
┌─────────────────────────┐
│   Usuario sin token     │
└────────────┬────────────┘
             │
             ▼
    ┌──────────────────┐
    │ POST /register   │
    │ {email, pass}    │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ bcrypt.hash()    │ ← Encriptar password
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ INSERT user      │
    │ en BD            │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ POST /login      │
    │ {email, pass}    │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ SELECT user      │
    │ de BD            │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ bcrypt.compare() │ ← Verificar password
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ jwt.sign()       │ ← Generar token
    │ {id, email}      │    Válido 24 horas
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ ✅ DEVOLVER      │
    │ token + user     │
    └──────────────────┘
             │
             ▼
    ┌──────────────────┐
    │ Usuario con      │
    │ token JWT        │
    │ válido 24 horas  │
    └──────────────────┘
```

---

## 🔄 FLUJO DE PETICIÓN PROTEGIDA (CRUD)

```
┌─────────────────────────────────┐
│  GET /api/items                 │
│  Header: Authorization: Bearer  │
│  {token}                        │
└────────────┬────────────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Middleware:          │
    │ verifyToken()        │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ jwt.verify(token)    │
    │ contra JWT_SECRET    │
    └────────┬─────────────┘
             │
        ┌────┴────┐
        │          │
       ✅          ❌
    Token OK   Token Inválido
        │          │
        ▼          ▼
    Continuar   401 Unauthorized
        │
        ▼
    ┌──────────────────────┐
    │ req.user = {         │
    │   id: 1,             │
    │   email: "..."       │
    │ }                    │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ getAllItems()        │
    │ (Controller)         │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Item.getAllByUser    │
    │ (req.user.id)        │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ SELECT * FROM items  │
    │ WHERE user_id = 1    │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Resulados de BD      │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ 200 OK               │
    │ {items: [...]}       │
    └──────────────────────┘
```

---

## 🐳 ARQUITECTURA CON DOCKER

```
┌──────────────────────────────────────────────────┐
│                                                  │
│          🐳 DOCKER CONTAINER                     │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │                                            │ │
│  │      🟢 Node.js 18 Alpine                  │ │
│  │                                            │ │
│  │  ┌──────────────────────────────────────┐ │ │
│  │  │  Express Server (Puerto 3000)        │ │ │
│  │  │  ✓ Todas las rutas                   │ │ │
│  │  │  ✓ Middlewares                       │ │ │
│  │  │  ✓ Controllers                       │ │ │
│  │  │  ✓ Modelos                           │ │ │
│  │  └──────────────────────────────────────┘ │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Volumen: /app/code                             │
│  Puerto: 3000 → localhost:3000                  │
│                                                  │
└────────────────┬───────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
 ┌──────────────┐  ┌──────────────────┐
 │ 🗄️  MySQL    │  │  .env variables  │
 │ (Contenedor  │  │                  │
 │  o remota)   │  │ - DB credentials │
 │              │  │ - JWT_SECRET     │
 │ - users      │  │ - NODE_ENV       │
 │ - items      │  │                  │
 └──────────────┘  └──────────────────┘
```

---

## 🔐 CAPAS DE SEGURIDAD

```
┌─────────────────────────────────────────────┐
│  1️⃣  Encriptación de Contraseñas            │
│  ├─ bcryptjs: 10 salt rounds                │
│  └─ Password → Hash de 60 caracteres        │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  2️⃣  Tokens JWT                             │
│  ├─ Generados en Login                      │
│  ├─ Expiran en 24 horas                     │
│  └─ Firmados con JWT_SECRET                 │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  3️⃣  Middleware de Autenticación            │
│  ├─ Verifica token en header                │
│  ├─ Valida firma JWT                        │
│  └─ Rechaza requests sin token              │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  4️⃣  Validación de Entrada                  │
│  ├─ Email válido                            │
│  ├─ Password mínimo 6 caracteres            │
│  └─ Datos requeridos presentes              │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  5️⃣  Manejo de Errores                      │
│  ├─ No expone detalles internos             │
│  ├─ JSON con mensajes claros                │
│  └─ Status codes HTTP apropiados            │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  6️⃣  Variables de Entorno                   │
│  ├─ Credenciales en .env                    │
│  ├─ No versionadas en Git                   │
│  └─ NODE_ENV para producción                │
└─────────────────────────────────────────────┘
```

---

## 📈 ESCALABILIDAD FUTURA

```
┌─────────────────────────────────────────┐
│      Proyecto Actual v1.0               │
│      ✓ Funcional                        │
│      ✓ Listo para producción            │
│      ✓ Base sólida                      │
└────────────────┬────────────────────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Mejoras Sugeridas:     │
    ├─ Cache con Redis       │
    ├─ Rate Limiting         │
    ├─ Swagger/OpenAPI       │
    ├─ Tests Automatizados   │
    ├─ Logging Centralizado  │
    ├─ Validación Schemas    │
    ├─ Refresh Tokens        │
    ├─ Paginación            │
    ├─ Filtros Avanzados     │
    ├─ Transacciones BD      │
    ├─ Microservicios        │
    └─ CI/CD Pipeline        │
```

---

## 🔄 CICLO DE VIDA DE UNA TRANSACCIÓN COMPLETA

```
User Interaction:
  1. Usuario abre Postman
  2. Ingresa credenciales

Network:
  3. HTTP POST al servidor
  4. Servidor recibe JSON

Validation:
  5. Express parsea JSON
  6. Validaciones de datos

Authentication:
  7. bcrypt compara passwords
  8. jwt.sign() genera token

Database:
  9. Query INSERT a MySQL
  10. Respuesta de BD

Response:
  11. Express formatea JSON
  12. Envía 201 + token

Client:
  13. Postman muestra respuesta
  14. Usuario copia token
  15. Lo usa en siguientes requests
```

---

Esta arquitectura es:
✅ **Modular** - Fácil de mantener y escalar
✅ **Segura** - Múltiples capas de protección
✅ **Escalable** - Preparada para crecer
✅ **Documentada** - Código limpio y comentado
✅ **Profesional** - Producción-ready
