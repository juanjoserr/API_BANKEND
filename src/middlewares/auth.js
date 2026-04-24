import jwt from 'jsonwebtoken';

// Middleware para verificar JWT
export const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token no proporcionado',
        message: 'Se requiere un token en el header Authorization: Bearer <token>'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token ha expirado, por favor inicia sesión nuevamente'
      });
    }
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token proporcionado no es válido'
    });
  }
};

// Middleware para manejo de errores de autenticación
export const handleAuthError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return { status: 401, message: 'Token inválido' };
  }
  if (error.name === 'TokenExpiredError') {
    return { status: 401, message: 'Token expirado' };
  }
  return { status: 500, message: 'Error de autenticación' };
};

export default verifyToken;
