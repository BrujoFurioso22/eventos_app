import express from 'express';
import { 
  obtenerUsuarios, 
  obtenerUsuarioPorId, 
  obtenerUsuarioActual,
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario,
  loginUsuario
} from '../controllers/usuarios.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/usuarios/login - Login de usuario
router.post('/login', loginUsuario);

// GET /api/usuarios/me - Obtener usuario actual (requiere autenticación)
router.get('/me', authenticateToken, obtenerUsuarioActual);

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', crearUsuario);

// PUT /api/usuarios/:id - Actualizar un usuario (requiere autenticación)
router.put('/:id', authenticateToken, actualizarUsuario);

// DELETE /api/usuarios/:id - Eliminar un usuario (requiere autenticación)
router.delete('/:id', authenticateToken, eliminarUsuario);

export default router;

