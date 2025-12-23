import { Usuario } from '../models/index.js';

/**
 * Servicio para operaciones relacionadas con usuarios.
 * Maneja la lógica de negocio para autenticación y gestión de usuarios.
 */
class UsuarioService {
  /**
   * Obtiene todos los usuarios excluyendo las contraseñas.
   * @returns {Promise<Array>} Lista de usuarios ordenados por fecha de creación
   */
  static async getAll() {
    return await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Obtiene un usuario por su ID excluyendo la contraseña.
   * @param {number|string} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario o null si no existe
   */
  static async getById(id) {
    return await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  /**
   * Busca un usuario por email. Incluye la contraseña para uso en autenticación.
   * @param {string} email - Email del usuario (se convierte a minúsculas)
   * @returns {Promise<Object|null>} Usuario con contraseña o null si no existe
   */
  static async getByEmail(email) {
    return await Usuario.findOne({
      where: { email: email.toLowerCase() }
    });
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * La contraseña se hashea automáticamente mediante hooks del modelo.
   * @param {Object} usuarioData - Datos del usuario
   * @param {string} usuarioData.nombre - Nombre del usuario
   * @param {string} usuarioData.email - Email del usuario
   * @param {string} usuarioData.password - Contraseña en texto plano
   * @param {string} [usuarioData.telefono] - Teléfono del usuario
   * @returns {Promise<Object>} Usuario creado (sin contraseña)
   * @throws {Error} Si el email ya está registrado
   */
  static async create(usuarioData) {
    const existingUser = await this.getByEmail(usuarioData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const usuario = await Usuario.create({
      nombre: usuarioData.nombre.trim(),
      email: usuarioData.email.toLowerCase().trim(),
      password: usuarioData.password,
      telefono: usuarioData.telefono || null
    });

    return usuario;
  }

  /**
   * Actualiza los datos de un usuario existente.
   * Si se actualiza el email, verifica que no esté en uso por otro usuario.
   * @param {number|string} id - ID del usuario a actualizar
   * @param {Object} usuarioData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   * @throws {Error} Si el usuario no existe o el email ya está en uso
   */
  static async update(id, usuarioData) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (usuarioData.email && usuarioData.email !== usuario.email) {
      const existingUser = await this.getByEmail(usuarioData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
    }

    await usuario.update({
      nombre: usuarioData.nombre?.trim(),
      email: usuarioData.email?.toLowerCase().trim(),
      password: usuarioData.password,
      telefono: usuarioData.telefono
    });

    await usuario.reload();
    return usuario;
  }

  /**
   * Elimina un usuario de la base de datos.
   * @param {number|string} id - ID del usuario a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  static async delete(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return false;
    }
    await usuario.destroy();
    return true;
  }

  /**
   * Verifica las credenciales de un usuario para autenticación.
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<Object|null>} Usuario si las credenciales son válidas, null en caso contrario
   */
  static async verifyCredentials(email, password) {
    const usuario = await this.getByEmail(email);
    if (!usuario) {
      return null;
    }

    const isPasswordValid = await usuario.verifyPassword(password);
    if (!isPasswordValid) {
      return null;
    }

    return usuario;
  }
}

export default UsuarioService;

