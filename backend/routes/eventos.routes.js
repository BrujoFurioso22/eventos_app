import express from 'express';
import { 
  obtenerEventos, 
  obtenerEventoPorId, 
  obtenerMisEventos,
  obtenerTicketsUsuario,
  crearEvento, 
  actualizarEvento, 
  eliminarEvento,
  comprarTickets
} from '../controllers/eventos.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/eventos - Obtener todos los eventos
router.get('/', obtenerEventos);

// GET /api/eventos/mis-eventos - Obtener eventos del usuario actual (requiere autenticación)
router.get('/mis-eventos', authenticateToken, obtenerMisEventos);

// GET /api/eventos/:id/tickets - Obtener cantidad de tickets del usuario para un evento (requiere autenticación)
router.get('/:id/tickets', authenticateToken, obtenerTicketsUsuario);

// GET /api/eventos/:id - Obtener un evento por ID
router.get('/:id', obtenerEventoPorId);

// POST /api/eventos - Crear un nuevo evento (requiere autenticación)
router.post('/', authenticateToken, crearEvento);

// POST /api/eventos/:id/comprar - Comprar tickets para un evento (requiere autenticación)
router.post('/:id/comprar', authenticateToken, comprarTickets);

// PUT /api/eventos/:id - Actualizar un evento (requiere autenticación)
router.put('/:id', authenticateToken, actualizarEvento);

// DELETE /api/eventos/:id - Eliminar un evento (requiere autenticación)
router.delete('/:id', authenticateToken, eliminarEvento);

export default router;

