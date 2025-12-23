import EventoService from '../services/evento.service.js';

/**
 * Obtiene todos los eventos disponibles.
 * GET /api/eventos
 */
export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await EventoService.getAll();
    res.json({
      success: true,
      count: eventos.length,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos',
      message: error.message
    });
  }
};

/**
 * Obtiene un evento específico por su ID.
 * GET /api/eventos/:id
 */
export const obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await EventoService.getById(id);
    
    if (!evento) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      evento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener evento',
      message: error.message
    });
  }
};

/**
 * Crea un nuevo evento.
 * Requiere autenticación.
 * POST /api/eventos
 */
export const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, ubicacion, organizador, categoria, imagen, capacidadMaxima, precio } = req.body;

    // Validación básica
    if (!titulo || !descripcion || !fecha || !ubicacion || !organizador) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: titulo, descripcion, fecha, ubicacion, organizador'
      });
    }

    // Validar que la fecha sea válida
    const fechaEvento = new Date(fecha);
    if (isNaN(fechaEvento.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'La fecha proporcionada no es válida'
      });
    }

    // Validar que capacidadMaxima sea un número positivo si se proporciona
    if (capacidadMaxima !== null && capacidadMaxima !== undefined) {
      const capacidad = parseInt(capacidadMaxima);
      if (isNaN(capacidad) || capacidad < 1) {
        return res.status(400).json({
          success: false,
          error: 'La capacidad máxima debe ser un número positivo'
        });
      }
    }

    // Validar que precio sea un número no negativo
    const precioNum = parseFloat(precio);
    if (precio !== null && precio !== undefined && (isNaN(precioNum) || precioNum < 0)) {
      return res.status(400).json({
        success: false,
        error: 'El precio debe ser un número no negativo'
      });
    }

    const eventoData = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fecha: fechaEvento,
      ubicacion: ubicacion.trim(),
      organizador,
      categoria: categoria || 'otro',
      imagen: imagen || null,
      capacidadMaxima: capacidadMaxima ? parseInt(capacidadMaxima) : null,
      precio: precioNum || 0,
      participantes: []
    };

    const evento = await EventoService.create(eventoData);
    
    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      evento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear evento',
      message: error.message
    });
  }
};

export const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const eventoData = req.body;

    // Verificar que el evento existe
    const eventoExistente = await EventoService.getById(id);
    if (!eventoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    // Si se actualiza la fecha, convertirla a Date
    if (eventoData.fecha) {
      eventoData.fecha = new Date(eventoData.fecha);
    }

    const evento = await EventoService.update(id, eventoData);
    
    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      evento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar evento',
      message: error.message
    });
  }
};

/**
 * Elimina un evento.
 * Requiere autenticación.
 * DELETE /api/eventos/:id
 */
export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el evento existe
    const evento = await EventoService.getById(id);
    if (!evento) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    await EventoService.delete(id);
    
    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar evento',
      message: error.message
    });
  }
};

/**
 * Obtiene los eventos donde el usuario autenticado tiene tickets.
 * Requiere autenticación.
 * GET /api/eventos/mis-eventos
 */
export const obtenerMisEventos = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventos = await EventoService.getByParticipante(userId);
    
    res.json({
      success: true,
      count: eventos.length,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener mis eventos',
      message: error.message
    });
  }
};

/**
 * Obtiene la cantidad de tickets que tiene el usuario autenticado para un evento.
 * Requiere autenticación.
 * GET /api/eventos/:id/tickets
 */
export const obtenerTicketsUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const cantidadTickets = await EventoService.getTicketsUsuarioEnEvento(id, userId);
    
    res.json({
      success: true,
      cantidadTickets,
      eventoId: id,
      usuarioId: userId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener tickets del usuario',
      message: error.message
    });
  }
};

/**
 * Compra tickets para un evento.
 * Verifica capacidad disponible antes de procesar la compra.
 * Requiere autenticación.
 * POST /api/eventos/:id/comprar
 */
export const comprarTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId, cantidad } = req.body;

    if (!usuarioId || !cantidad || cantidad < 1) {
      return res.status(400).json({
        success: false,
        error: 'usuarioId y cantidad (mínimo 1) son requeridos'
      });
    }

    // Validar que cantidad sea un número entero
    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 1) {
      return res.status(400).json({
        success: false,
        error: 'La cantidad debe ser un número entero mayor a 0'
      });
    }

    const evento = await EventoService.getById(id);
    if (!evento) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    const totalTicketsVendidos = await EventoService.getTotalTicketsVendidos(id);
    const lugaresDisponibles = evento.capacidadMaxima 
      ? evento.capacidadMaxima - totalTicketsVendidos 
      : 999;

    if (cantidadNum > lugaresDisponibles) {
      return res.status(400).json({
        success: false,
        error: `Solo hay ${lugaresDisponibles} lugares disponibles`
      });
    }

    await EventoService.agregarParticipante(id, usuarioId, cantidadNum);
    const eventoActualizado = await EventoService.getById(id);
    const precioTotal = evento.precio * cantidad;

    res.json({
      success: true,
      message: 'Tickets comprados exitosamente',
      ticket: {
        eventoId: id,
        usuarioId,
        cantidad: cantidadNum,
        precioTotal,
        fechaCompra: new Date(),
        estado: 'confirmado'
      },
      evento: eventoActualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al comprar tickets',
      message: error.message
    });
  }
};

