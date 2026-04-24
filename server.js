import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import itemRoutes from './src/routes/itemRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    message: '¡Bienvenido a la API Backend!',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login'
      },
      items: {
        getAll: 'GET /api/items',
        getOne: 'GET /api/items/:id',
        create: 'POST /api/items',
        update: 'PUT /api/items/:id',
        delete: 'DELETE /api/items/:id'
      }
    }
  });
});

// Rutas
app.use('/auth', authRoutes);
app.use('/api', itemRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║        🚀 API Backend Iniciada        ║
╚════════════════════════════════════════╝
  
  🌐 Server: http://localhost:${PORT}
  📝 Ambiente: ${process.env.NODE_ENV}
  🔐 JWT Configurado: Sí
  
  Para pruebas:
  - Abre: http://localhost:${PORT}
  - Registro: POST http://localhost:${PORT}/auth/register
  - Login: POST http://localhost:${PORT}/auth/login
  
═══════════════════════════════════════════
  `);
});

export default app;
