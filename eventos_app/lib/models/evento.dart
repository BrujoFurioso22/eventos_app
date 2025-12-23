/// Modelo que representa un evento en el sistema.
/// Incluye información del evento, capacidad, precio y tickets vendidos.
class Evento {
  final String? id;
  final String titulo;
  final String descripcion;
  final DateTime fecha;
  final String ubicacion;
  final String organizador;
  final String categoria;
  final String? imagen;
  final int? capacidadMaxima;
  final double precio;
  final List<String> participantes;
  final int? totalTicketsVendidos;

  Evento({
    this.id,
    required this.titulo,
    required this.descripcion,
    required this.fecha,
    required this.ubicacion,
    required this.organizador,
    this.categoria = 'otro',
    this.imagen,
    this.capacidadMaxima,
    this.precio = 0,
    this.participantes = const [],
    this.totalTicketsVendidos,
  });

  /// Crea una instancia de Evento desde un JSON del servidor.
  /// Maneja diferentes formatos de fecha y precio.
  factory Evento.fromJson(Map<String, dynamic> json) {
    DateTime parseFecha(dynamic fecha) {
      if (fecha is String) {
        return DateTime.parse(fecha);
      } else if (fecha is Map && fecha['seconds'] != null) {
        return DateTime.fromMillisecondsSinceEpoch(
          (fecha['seconds'] as int) * 1000,
        );
      }
      return DateTime.now();
    }

    double parsePrecio(dynamic precio) {
      if (precio == null) return 0.0;
      if (precio is double) return precio;
      if (precio is int) return precio.toDouble();
      if (precio is String) {
        return double.tryParse(precio) ?? 0.0;
      }
      return 0.0;
    }

    return Evento(
      id: json['id']?.toString(),
      titulo: json['titulo'] ?? '',
      descripcion: json['descripcion'] ?? '',
      fecha: parseFecha(json['fecha']),
      ubicacion: json['ubicacion'] ?? '',
      organizador: json['organizador']?.toString() ?? '',
      categoria: json['categoria'] ?? 'otro',
      imagen: json['imagen'],
      capacidadMaxima: json['capacidadMaxima'],
      precio: parsePrecio(json['precio']),
      participantes: json['participantes'] != null
          ? List<String>.from(json['participantes'].map((e) => e.toString()))
          : [],
      totalTicketsVendidos: json['totalTicketsVendidos'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'titulo': titulo,
      'descripcion': descripcion,
      'fecha': fecha.toIso8601String(),
      'ubicacion': ubicacion,
      'organizador': organizador,
      'categoria': categoria,
      'imagen': imagen,
      'capacidadMaxima': capacidadMaxima,
      'precio': precio,
      'participantes': participantes,
    };
  }

  /// Indica si el evento tiene capacidad disponible.
  /// Usa totalTicketsVendidos si está disponible, sino usa participantes.length.
  bool get tieneCapacidad {
    if (capacidadMaxima == null) return true;
    final ticketsVendidos = totalTicketsVendidos ?? participantes.length;
    return ticketsVendidos < capacidadMaxima!;
  }

  /// Calcula los lugares disponibles para el evento.
  /// Retorna 999 si no hay capacidad máxima definida.
  /// Usa totalTicketsVendidos si está disponible, sino usa participantes.length.
  int get lugaresDisponibles {
    if (capacidadMaxima == null) return 999;
    final ticketsVendidos = totalTicketsVendidos ?? participantes.length;
    return capacidadMaxima! - ticketsVendidos;
  }
}
