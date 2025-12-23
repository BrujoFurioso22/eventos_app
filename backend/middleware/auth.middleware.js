import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticación JWT.
 * Verifica que el request incluya un token válido en el header Authorization.
 * Si el token es válido, agrega la información del usuario a req.user.
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido'
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: 'Error de configuración del servidor'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido o expirado'
      });
    }
    req.user = user;
    next();
  });
};

/**
 * Middleware de autenticación opcional.
 * Si existe un token válido, agrega la información del usuario a req.user.
 * No falla si no hay token o es inválido.
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token && process.env.JWT_SECRET) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

