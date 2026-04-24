import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route GET /auth/register
 * @desc Mensaje de instrucción para usar el endpoint correctamente
 */
router.get('/register', (req, res) => {
  res.status(200).json({
    message: 'Para registrar un usuario usa POST /auth/register con body JSON: email, password, confirmPassword'
  });
});

/**
 * @route POST /auth/register
 * @desc Registrar un nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña (mín 6 caracteres)
 * @param {string} confirmPassword - Confirmación de contraseña
 */
router.post('/register', register);

/**
 * @route GET /auth/login
 * @desc Mensaje de instrucción para usar el endpoint correctamente
 */
router.get('/login', (req, res) => {
  res.status(200).json({
    message: 'Para iniciar sesión usa POST /auth/login con body JSON: email, password'
  });
});

/**
 * @route POST /auth/login
 * @desc Iniciar sesión y obtener token JWT
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 */
router.post('/login', login);

export default router;
