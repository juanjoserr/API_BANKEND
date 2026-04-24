import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route POST /auth/register
 * @desc Registrar un nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña (mín 6 caracteres)
 * @param {string} confirmPassword - Confirmación de contraseña
 */
router.post('/register', register);

/**
 * @route POST /auth/login
 * @desc Iniciar sesión y obtener token JWT
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 */
router.post('/login', login);

export default router;
