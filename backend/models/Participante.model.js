import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Usuario from './Usuario.model.js';
import Evento from './Evento.model.js';

/**
 * Modelo de Participante.
 * Tabla de unión entre Usuario y Evento (muchos a muchos).
 * Almacena la relación de participación con la cantidad de tickets comprados.
 */
const Participante = sequelize.define('Participante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  evento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Evento,
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  fecha_inscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'participantes',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['evento_id', 'usuario_id']
    }
  ]
});

// Relaciones
Participante.belongsTo(Evento, {
  foreignKey: 'evento_id',
  as: 'evento'
});

Participante.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Evento.belongsToMany(Usuario, {
  through: Participante,
  foreignKey: 'evento_id',
  otherKey: 'usuario_id',
  as: 'participantes'
});

Usuario.belongsToMany(Evento, {
  through: Participante,
  foreignKey: 'usuario_id',
  otherKey: 'evento_id',
  as: 'eventosParticipando'
});

export default Participante;

