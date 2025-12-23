import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Usuario from './Usuario.model.js';

/**
 * Modelo de Evento.
 * Representa un evento en el sistema.
 * Tiene relación con Usuario como organizador.
 */
const Evento = sequelize.define('Evento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  organizador_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  categoria: {
    type: DataTypes.STRING(50),
    defaultValue: 'otro'
  },
  imagen: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  capacidad_maxima: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'eventos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relaciones
Evento.belongsTo(Usuario, {
  foreignKey: 'organizador_id',
  as: 'organizador'
});

Usuario.hasMany(Evento, {
  foreignKey: 'organizador_id',
  as: 'eventosCreados'
});

export default Evento;

