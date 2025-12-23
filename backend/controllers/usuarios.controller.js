import UsuarioService from '../services/usuario.service.js';
import jwt from 'jsonwebtoken';

/**
 * Obtiene todos los usuarios registrados.
 * GET /api/usuarios
 */
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioService.getAll();
    res.json({
      success: true,
      count: usuarios.length,
      usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
      message: error.message
    });
  }
};

/**
 * Obtiene un usuario específico por su ID.
 * GET /api/usuarios/:id
 */
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioService.getById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuario',
      message: error.message
    });
  }
};

/**
 * Crea un nuevo usuario y realiza login automático.
 * POST /api/usuarios
 */
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, telefono, fotoPerfil } = req.body;

    // Validación básica
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: nombre, email, password'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'El formato del email no es válido'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const usuarioData = {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      telefono: telefono || null,
      fotoPerfil: fotoPerfil || null
    };

    const usuario = await UsuarioService.create(usuarioData);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear usuario',
      message: error.message
    });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioData = req.body;

    // Verificar que el usuario existe
    const usuarioExistente = await UsuarioService.getById(id);
    if (!usuarioExistente) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Validar longitud de contraseña si se actualiza
    if (usuarioData.password && usuarioData.password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Validar formato de email si se actualiza
    if (usuarioData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usuarioData.email)) {
        return res.status(400).json({
          success: false,
          error: 'El formato del email no es válido'
        });
      }
    }

    const usuario = await UsuarioService.update(id, usuarioData);
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario
    });
  } catch (error) {
    // Manejar errores específicos del servicio
    if (error.message.includes('email ya está registrado')) {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al actualizar usuario',
      message: error.message
    });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe
    const usuario = await UsuarioService.getById(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    await UsuarioService.delete(id);
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario',
      message: error.message
    });
  }
};

export const obtenerUsuarioActual = async (req, res) => {
  try {
    const userId = req.user.id;
    const usuario = await UsuarioService.getById(userId);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuario',
      message: error.message
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'El formato del email no es válido'
      });
    }

    // Verificar credenciales
    const usuario = await UsuarioService.verifyCredentials(email, password);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generar JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Error de configuración del servidor'
      });
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en el login',
      message: error.message
    });
  }
};

