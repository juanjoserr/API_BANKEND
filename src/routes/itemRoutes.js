import express from 'express';
import verifyToken from '../middlewares/auth.js';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use('/items', verifyToken);

/**
 * @route GET /api/items
 * @desc Obtener todos los items del usuario
 * @access Privado (requiere token JWT)
 */
router.get('/items', getAllItems);

/**
 * @route GET /api/items/:id
 * @desc Obtener un item específico por ID
 * @access Privado (requiere token JWT)
 * @param {number} id - ID del item
 */
router.get('/items/:id', getItemById);

/**
 * @route POST /api/items
 * @desc Crear un nuevo item
 * @access Privado (requiere token JWT)
 * @param {string} nombre - Nombre del item
 * @param {string} descripcion - Descripción del item (opcional)
 * @param {string} estado - Estado (activo, inactivo, pendiente)
 */
router.post('/items', createItem);

/**
 * @route PUT /api/items/:id
 * @desc Actualizar un item existente
 * @access Privado (requiere token JWT)
 * @param {number} id - ID del item
 * @param {string} nombre - Nombre del item
 * @param {string} descripcion - Descripción del item
 * @param {string} estado - Estado (activo, inactivo, pendiente)
 */
router.put('/items/:id', updateItem);

/**
 * @route DELETE /api/items/:id
 * @desc Eliminar un item
 * @access Privado (requiere token JWT)
 * @param {number} id - ID del item a eliminar
 */
router.delete('/items/:id', deleteItem);

export default router;
