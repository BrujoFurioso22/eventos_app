/// Modelo que representa un ticket o compra de tickets.
/// Un ticket puede representar múltiples entradas (cantidad > 1).
class Ticket {
  final String? id;
  final String eventoId;
  final String usuarioId;
  final int cantidad;
  final double precioTotal;
  final DateTime fechaCompra;
  final String estado;

  Ticket({
    this.id,
    required this.eventoId,
    required this.usuarioId,
    required this.cantidad,
    required this.precioTotal,
    required this.fechaCompra,
    this.estado = 'confirmado',
  });

  /// Crea una instancia de Ticket desde un JSON del servidor.
  /// Maneja diferentes formatos de precio.
  factory Ticket.fromJson(Map<String, dynamic> json) {
    double parsePrecio(dynamic precio) {
      if (precio == null) return 0.0;
      if (precio is double) return precio;
      if (precio is int) return precio.toDouble();
      if (precio is String) {
        return double.tryParse(precio) ?? 0.0;
      }
      return 0.0;
    }

    return Ticket(
      id: json['id']?.toString(),
      eventoId: json['eventoId']?.toString() ?? '',
      usuarioId: json['usuarioId']?.toString() ?? '',
      cantidad: json['cantidad'] ?? 1,
      precioTotal: parsePrecio(json['precioTotal']),
      fechaCompra: json['fechaCompra'] is String
          ? DateTime.parse(json['fechaCompra'])
          : DateTime.now(),
      estado: json['estado'] ?? 'confirmado',
    );
  }

  /// Convierte el ticket a formato JSON para enviar al servidor.
  Map<String, dynamic> toJson() {
    return {
      'eventoId': eventoId,
      'usuarioId': usuarioId,
      'cantidad': cantidad,
      'precioTotal': precioTotal,
      'fechaCompra': fechaCompra.toIso8601String(),
      'estado': estado,
    };
  }
}
