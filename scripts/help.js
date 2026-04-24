const helpText = `Comandos disponibles:
  npm run dev
  npm run help
  npm run register -- --email=usuario@ejemplo.com --password=123456 --confirmPassword=123456
  npm run login -- --email=usuario@ejemplo.com --password=123456

Página de visualización: http://localhost:3000/view/

Registro: POST /auth/register
Login: POST /auth/login
Items protegidos: GET /api/items, GET /api/items/:id, POST /api/items, PUT /api/items/:id, DELETE /api/items/:id

Ejemplos con curl:
  curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email":"usuario@ejemplo.com","password":"123456","confirmPassword":"123456"}'
  curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"usuario@ejemplo.com","password":"123456"}'
  curl -X GET http://localhost:3000/api/items -H "Authorization: Bearer TU_TOKEN_AQUI"`

console.log(helpText);
