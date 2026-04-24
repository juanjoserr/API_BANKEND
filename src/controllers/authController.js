import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Controlador de Registro
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validaciones
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        error: 'Campos incompletos',
        message: 'Email, contraseña y confirmación son requeridos'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Contraseñas no coinciden',
        message: 'La contraseña y su confirmación deben ser iguales'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Contraseña débil',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Por favor proporciona un email válido'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Usuario ya existe',
        message: 'El email proporcionado ya está registrado'
      });
    }

    // Crear usuario
    const user = await User.create(email, password);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en register:', error.message);
    res.status(500).json({
      error: 'Error al registrar usuario',
      message: error.message
    });
  }
};

// Controlador de Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        error: 'Campos incompletos',
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({
      error: 'Error al iniciar sesión',
      message: error.message
    });
  }
};

export default { register, login };
