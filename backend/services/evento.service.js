import { Evento, Participante, Usuario } from '../models/index.js';
import { sequelize } from '../config/database.js';

/**
 * Servicio para operaciones relacionadas con eventos.
 * Maneja la lógica de negocio para eventos, participantes y tickets.
 */
class EventoService {
  /**
   * Obtiene todos los eventos con información de participantes y tickets vendidos.
   * Los eventos se ordenan por fecha ascendente.
   * @returns {Promise<Array>} Lista de eventos con totalTicketsVendidos calculado
   */
  static async getAll() {
    const eventos = await Evento.findAll({
      include: [{
        model: Usuario,
        as: 'participantes',
        attributes: ['id'],
        through: { attributes: [] }
      }],
      order: [['fecha', 'ASC']]
    });

    // Obtener el total de tickets vendidos para cada evento
    const eventosConTickets = await Promise.all(
      eventos.map(async (evento) => {
        const totalTickets = await this.getTotalTicketsVendidos(evento.id);
        return { evento, totalTickets };
      })
    );

    const eventosMapeados = eventosConTickets.map(({ evento, totalTickets }) => {
      const eventoData = evento.toJSON();
      return {
        ...eventoData,
        id: eventoData.id,
        organizador: eventoData.organizador_id,
        capacidadMaxima: eventoData.capacidad_maxima,
        createdAt: eventoData.created_at,
        updatedAt: eventoData.updated_at,
        participantes: eventoData.participantes?.map(p => p.id.toString()) || [],
        totalTicketsVendidos: totalTickets
      };
    });

    // Ordenar por fecha (ascendente - eventos más próximos primero)
    return eventosMapeados.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  /**
   * Obtiene un evento por su ID con información completa.
   * @param {number|string} id - ID del evento
   * @returns {Promise<Object|null>} Evento con totalTicketsVendidos o null si no existe
   */
  static async getById(id) {
    const evento = await Evento.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'participantes',
        attributes: ['id'],
        through: { attributes: [] }
      }]
    });

    if (!evento) {
      return null;
    }

    const totalTickets = await this.getTotalTicketsVendidos(id);
    const eventoData = evento.toJSON();
    return {
      ...eventoData,
      organizador: eventoData.organizador_id,
      capacidadMaxima: eventoData.capacidad_maxima,
      createdAt: eventoData.created_at,
      updatedAt: eventoData.updated_at,
      participantes: eventoData.participantes?.map(p => p.id.toString()) || [],
      totalTicketsVendidos: totalTickets
    };
  }

  static async create(eventoData) {
    const evento = await Evento.create({
      titulo: eventoData.titulo.trim(),
      descripcion: eventoData.descripcion.trim(),
      fecha: eventoData.fecha,
      ubicacion: eventoData.ubicacion.trim(),
      organizador_id: eventoData.organizador,
      categoria: eventoData.categoria || 'otro',
      imagen: eventoData.imagen || null,
      capacidad_maxima: eventoData.capacidadMaxima || null,
      precio: eventoData.precio || 0
    });

    const eventoJson = evento.toJSON();
    return {
      ...eventoJson,
      organizador: eventoJson.organizador_id,
      capacidadMaxima: eventoJson.capacidad_maxima,
      createdAt: eventoJson.created_at,
      updatedAt: eventoJson.updated_at,
      participantes: []
    };
  }

  /**
   * Actualiza un evento existente.
   * @param {number|string} id - ID del evento a actualizar
   * @param {Object} eventoData - Datos a actualizar
   * @returns {Promise<Object>} Evento actualizado
   * @throws {Error} Si el evento no existe
   */
  static async update(id, eventoData) {
    const evento = await Evento.findByPk(id);
    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    await evento.update({
      titulo: eventoData.titulo?.trim(),
      descripcion: eventoData.descripcion?.trim(),
      fecha: eventoData.fecha,
      ubicacion: eventoData.ubicacion?.trim(),
      organizador_id: eventoData.organizador,
      categoria: eventoData.categoria,
      imagen: eventoData.imagen,
      capacidad_maxima: eventoData.capacidadMaxima,
      precio: eventoData.precio
    });

    return await this.getById(id);
  }

  /**
   * Elimina un evento de la base de datos.
   * @param {number|string} id - ID del evento a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async delete(id) {
    const evento = await Evento.findByPk(id);
    if (!evento) {
      return false;
    }
    await evento.destroy();
    return true;
  }

  /**
   * Obtiene todos los eventos creados por un organizador.
   * @param {number|string} organizadorId - ID del usuario organizador
   * @returns {Promise<Array>} Lista de eventos del organizador
   */
  static async getByOrganizador(organizadorId) {
    const eventos = await Evento.findAll({
      where: { organizador_id: organizadorId },
      include: [{
        model: Usuario,
        as: 'participantes',
        attributes: ['id'],
        through: { attributes: [] }
      }],
      order: [['fecha', 'ASC']]
    });

    return eventos.map(evento => {
      const eventoData = evento.toJSON();
      return {
        ...eventoData,
        organizador: eventoData.organizador_id,
        capacidadMaxima: eventoData.capacidad_maxima,
        createdAt: eventoData.created_at,
        updatedAt: eventoData.updated_at,
        participantes: eventoData.participantes?.map(p => p.id.toString()) || []
      };
    });
  }

  /**
   * Agrega un participante a un evento o incrementa la cantidad de tickets si ya existe.
   * @param {number|string} eventoId - ID del evento
   * @param {number|string} usuarioId - ID del usuario
   * @param {number} [cantidad=1] - Cantidad de tickets a agregar
   * @returns {Promise<boolean>} true si se agregó correctamente
   * @throws {Error} Si hay un error al agregar el participante
   */
  static async agregarParticipante(eventoId, usuarioId, cantidad = 1) {
    try {
      const [participante, created] = await Participante.findOrCreate({
        where: {
          evento_id: eventoId,
          usuario_id: usuarioId
        },
        defaults: {
          evento_id: eventoId,
          usuario_id: usuarioId,
          cantidad: cantidad
        }
      });

      if (!created) {
        participante.cantidad = (participante.cantidad || 1) + cantidad;
        await participante.save();
      }

      return true;
    } catch (error) {
      throw new Error(`Error al agregar participante: ${error.message}`);
    }
  }

  /**
   * Remueve un participante de un evento.
   * @param {number|string} eventoId - ID del evento
   * @param {number|string} usuarioId - ID del usuario
   * @returns {Promise<boolean>} true si se removió, false si no existía
   */
  static async removerParticipante(eventoId, usuarioId) {
    const result = await Participante.destroy({
      where: {
        evento_id: eventoId,
        usuario_id: usuarioId
      }
    });
    return result > 0;
  }

  /**
   * Obtiene todos los eventos donde un usuario es participante.
   * Incluye el total de tickets vendidos para cada evento.
   * @param {number|string} usuarioId - ID del usuario
   * @returns {Promise<Array>} Lista de eventos ordenados por fecha
   */
  static async getByParticipante(usuarioId) {
    const participantes = await Participante.findAll({
      where: { usuario_id: usuarioId },
      include: [{
        model: Evento,
        as: 'evento',
        include: [{
          model: Usuario,
          as: 'participantes',
          attributes: ['id'],
          through: { attributes: [] }
        }]
      }]
    });

    const eventos = participantes.map(p => p.evento).filter(e => e != null);

    // Obtener el total de tickets vendidos para cada evento
    const eventosConTickets = await Promise.all(
      eventos.map(async (evento) => {
        const totalTickets = await this.getTotalTicketsVendidos(evento.id);
        return { evento, totalTickets };
      })
    );

    const eventosMapeados = eventosConTickets.map(({ evento, totalTickets }) => {
      const eventoData = evento.toJSON();
      return {
        ...eventoData,
        organizador: eventoData.organizador_id,
        capacidadMaxima: eventoData.capacidad_maxima,
        createdAt: eventoData.created_at,
        updatedAt: eventoData.updated_at,
        participantes: eventoData.participantes?.map(p => p.id.toString()) || [],
        totalTicketsVendidos: totalTickets
      };
    });

    // Ordenar por fecha (ascendente - eventos más próximos primero)
    return eventosMapeados.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  /**
   * Obtiene la cantidad de tickets que tiene un usuario para un evento específico.
   * @param {number|string} eventoId - ID del evento
   * @param {number|string} usuarioId - ID del usuario
   * @returns {Promise<number>} Cantidad de tickets (0 si no tiene)
   */
  static async getTicketsUsuarioEnEvento(eventoId, usuarioId) {
    const participante = await Participante.findOne({
      where: {
        evento_id: eventoId,
        usuario_id: usuarioId
      }
    });
    return participante ? (participante.cantidad || 1) : 0;
  }

  /**
   * Calcula el total de tickets vendidos para un evento.
   * Suma todas las cantidades de la tabla participantes.
   * @param {number|string} eventoId - ID del evento
   * @returns {Promise<number>} Total de tickets vendidos
   */
  static async getTotalTicketsVendidos(eventoId) {
    const result = await Participante.sum('cantidad', {
      where: {
        evento_id: eventoId
      }
    });

    return parseInt(result) || 0;
  }
}

export default EventoService;

