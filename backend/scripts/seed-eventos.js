// Script para insertar eventos de ejemplo en la base de datos
import { sequelize } from '../config/database.js';
import '../models/index.js'; // Importar modelos para que estén definidos
import Evento from '../models/Evento.model.js';
import Usuario from '../models/Usuario.model.js';

// Fechas en hora local de Ecuador (UTC-5: America/Guayaquil)
const eventos = [
  {
    titulo: '#CeciFest2026 por Ceci Juno',
    descripcion: 'Concierto especial de Ceci Juno. Puertas abren a las 19:00, show inicia a las 20:30. Entradas disponibles: General $25, Meet & Greet $40 (cupos limitados).',
    fecha: new Date('2026-01-07T19:00:00-05:00'), // 7 de enero 2026, 19:00 hora Ecuador
    ubicacion: 'GUAYAQUIL - ODISEA BREWING',
    categoria: 'concierto',
    precio: 25.00,
    capacidad_maxima: 500
  },
  {
    titulo: 'NO TE VA GUSTAR "FLORECE EN EL CAOS TOUR" - CUENCA',
    descripcion: 'Concierto de NO TE VA GUSTAR en el marco de su gira "Florece en el Caos Tour". Una noche inolvidable de rock en vivo.',
    fecha: new Date('2026-05-30T20:00:00-05:00'), // 30 de mayo 2026, 20:00 hora Ecuador
    ubicacion: 'Cuenca - Teatro Carlos Cueva Tamariz',
    categoria: 'concierto',
    precio: 45.00,
    capacidad_maxima: 1000
  },
  {
    titulo: 'NO TE VA GUSTAR "FLORECE EN EL CAOS TOUR" - QUITO',
    descripcion: 'Concierto de NO TE VA GUSTAR en el marco de su gira "Florece en el Caos Tour". Una noche inolvidable de rock en vivo.',
    fecha: new Date('2026-05-29T20:00:00-05:00'), // 29 de mayo 2026, 20:00 hora Ecuador
    ubicacion: 'Quito - Teatro San Gabriel',
    categoria: 'concierto',
    precio: 45.00,
    capacidad_maxima: 1000
  },
  {
    titulo: 'Campanazo Navideño: Pan de Dulce & Emir Tansel',
    descripcion: 'Evento navideño especial con Pan de Dulce y Emir Tansel. Villancicos y madrazos. Precio preventa $10.',
    fecha: new Date('2025-12-25T19:00:00-05:00'), // 25 de diciembre 2025, 19:00 hora Ecuador
    ubicacion: 'Guayaquil - Atrako Records',
    categoria: 'concierto',
    precio: 10.00,
    capacidad_maxima: 300
  },
  {
    titulo: 'PAPAYAL - Fin de Año 2025',
    descripcion: 'La mejor fiesta de fin de año en Papayal Club. DJs en vivo, ambiente festivo y celebración única.',
    fecha: new Date('2025-12-31T01:00:00-05:00'), // 31 de diciembre 2025, 01:00 hora Ecuador
    ubicacion: 'Guayaquil - Segafredo',
    categoria: 'fiesta',
    precio: 30.00,
    capacidad_maxima: 400
  },
  {
    titulo: 'THE LAST FLAME: NEW YEAR\'S EVE',
    descripcion: 'Celebra el Año Nuevo en Nila Terraza. Una experiencia única con ambiente elegante y vistas espectaculares.',
    fecha: new Date('2025-12-31T23:00:00-05:00'), // 31 de diciembre 2025, 23:00 hora Ecuador
    ubicacion: 'Cuenca - NILA ROOFTOP',
    categoria: 'fiesta',
    precio: 50.00,
    capacidad_maxima: 200
  },
  {
    titulo: 'ORIGEN CASA BLANCA',
    descripcion: 'La primera fiesta del 2026. New Year\'s Eve en un ambiente exclusivo. Powered by 180, nyte., ZCLUB.',
    fecha: new Date('2025-12-31T19:00:00-05:00'), // 31 de diciembre 2025, 19:00 hora Ecuador
    ubicacion: 'Casa Blanca - Casa Golf',
    categoria: 'fiesta',
    precio: 40.00,
    capacidad_maxima: 300
  },
  {
    titulo: 'MOËT & CHANDON X MILAGRO PRESENTAN: DESDE CERO',
    descripcion: 'New Year\'s Eve 2026. Una celebración exclusiva en Casa Patrimonial, Histórico Cuenca, Ecuador.',
    fecha: new Date('2025-12-31T23:00:00-05:00'), // 31 de diciembre 2025, 23:00 hora Ecuador
    ubicacion: 'Cuenca - Casa Patrimonial, Histórico',
    categoria: 'fiesta',
    precio: 75.00,
    capacidad_maxima: 150
  },
  {
    titulo: 'REVENTÓN 2026',
    descripcion: 'The Best Event Of The New Year. La mejor celebración de Año Nuevo con DJs en vivo.',
    fecha: new Date('2026-01-01T01:00:00-05:00'), // 1 de enero 2026, 01:00 hora Ecuador
    ubicacion: 'Santa Elena - Hotel Caridi Chipipe',
    categoria: 'fiesta',
    precio: 35.00,
    capacidad_maxima: 500
  },
  {
    titulo: 'New Year x Imsoniac & Mon Nu',
    descripcion: 'Celebración de Año Nuevo con artistas invitados: Andrés Volta, David H, Fercho Henao y más.',
    fecha: new Date('2025-12-31T23:00:00-05:00'), // 31 de diciembre 2025, 23:00 hora Ecuador
    ubicacion: 'Guayaquil - Venue por confirmar',
    categoria: 'fiesta',
    precio: 45.00,
    capacidad_maxima: 300
  },
  {
    titulo: '366 FEST - Galapagos Sound Waves',
    descripcion: 'Festival de música electrónica. All night long en Puerto Ayora. Una experiencia única en las Islas Galápagos.',
    fecha: new Date('2025-12-31T20:00:00-05:00'), // 31 de diciembre 2025, 20:00 hora Ecuador
    ubicacion: 'Puerto Ayora - Galápagos',
    categoria: 'festival',
    precio: 60.00,
    capacidad_maxima: 1000
  },
  {
    titulo: 'NEW YEAR\'S EVE 2026',
    descripcion: 'Celebración exclusiva de Año Nuevo. Una noche inolvidable con ambiente premium.',
    fecha: new Date('2025-12-31T23:00:00-05:00'), // 31 de diciembre 2025, 23:00 hora Ecuador
    ubicacion: 'Guayaquil - THE CLUB VICTORIA',
    categoria: 'fiesta',
    precio: 55.00,
    capacidad_maxima: 400
  },
  {
    titulo: 'La Viuda 2025',
    descripcion: 'La fiestita de fin de año. Desde el sur del Ecuador. Con Lequat y sus Players. Con mucho cariño.',
    fecha: new Date('2025-12-31T20:00:00-05:00'), // 31 de diciembre 2025, 20:00 hora Ecuador
    ubicacion: 'Ecuador - Venue por confirmar',
    categoria: 'fiesta',
    precio: 25.00,
    capacidad_maxima: 500
  },
  {
    titulo: 'LA FIESTA DEL FIN DEL MUNDO',
    descripcion: 'Evento épico de Año Nuevo con DJs: DJ MIC & STEFANSKI, DJ BRICK. Una experiencia única.',
    fecha: new Date('2026-01-01T00:00:00-05:00'), // 1 de enero 2026, 00:00 hora Ecuador
    ubicacion: 'Guayaquil - AGAVE',
    categoria: 'fiesta',
    precio: 40.00,
    capacidad_maxima: 600
  }
];

const seedEventos = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');

    // Buscar o crear un usuario organizador por defecto
    let organizador = await Usuario.findOne({ where: { email: 'organizador@meet2go.com' } });
    
    if (!organizador) {
      console.log('📝 Creando usuario organizador por defecto...');
      organizador = await Usuario.create({
        nombre: 'Organizador Meet2Go',
        email: 'organizador@meet2go.com',
        password: 'organizador123', // El hook beforeCreate lo hasheará
        telefono: '+593999999999'
      });
      console.log('✅ Usuario organizador creado (ID: ' + organizador.id + ')');
    } else {
      console.log('✅ Usuario organizador encontrado (ID: ' + organizador.id + ')');
    }

    console.log('\n🔄 Insertando eventos...');
    let creados = 0;
    let existentes = 0;

    for (const eventoData of eventos) {
      // Verificar si el evento ya existe (por título y fecha)
      const eventoExistente = await Evento.findOne({
        where: {
          titulo: eventoData.titulo,
          fecha: eventoData.fecha
        }
      });

      if (eventoExistente) {
        console.log(`   ⏭️  Ya existe: "${eventoData.titulo}"`);
        existentes++;
      } else {
        await Evento.create({
          ...eventoData,
          organizador_id: organizador.id
        });
        console.log(`   ✅ Creado: "${eventoData.titulo}"`);
        creados++;
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   ✅ Eventos creados: ${creados}`);
    console.log(`   ⏭️  Eventos existentes: ${existentes}`);
    console.log(`   📝 Total procesados: ${eventos.length}`);
    console.log('\n✅ Proceso completado exitosamente!');
  } catch (error) {
    console.error('❌ Error al insertar eventos:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
};

// Ejecutar el script
seedEventos()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });

