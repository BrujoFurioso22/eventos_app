import '../models/ticket.dart';
import 'api_service.dart';

/// Servicio para operaciones relacionadas con tickets.
class TicketsService {
  final ApiService _api = ApiService();

  /// Obtiene la cantidad de tickets que tiene el usuario autenticado para un evento.
  /// Retorna 0 si no tiene tickets o hay error.
  /// Requiere autenticación.
  Future<int> getTicketsUsuario(String eventoId) async {
    try {
      final response = await _api.get('/eventos/$eventoId/tickets');
      if (response['success'] == true) {
        return response['cantidadTickets'] ?? 0;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  /// Compra tickets para un evento.
  /// [eventoId] - ID del evento
  /// [usuarioId] - ID del usuario que compra
  /// [cantidad] - Cantidad de tickets a comprar
  /// [precioUnitario] - Precio por ticket (no se envía al servidor, solo para referencia)
  /// Retorna el ticket creado.
  /// Lanza excepción si la compra falla.
  /// Requiere autenticación.
  Future<Ticket> comprarTicket({
    required String eventoId,
    required String usuarioId,
    required int cantidad,
    required double precioUnitario,
  }) async {
    try {
      final response = await _api.post('/eventos/$eventoId/comprar', {
        'usuarioId': usuarioId,
        'cantidad': cantidad,
      });

      if (response['success'] == true) {
        final ticketData = response['ticket'];
        return Ticket.fromJson(ticketData);
      } else {
        throw Exception(response['error'] ?? 'Error al comprar tickets');
      }
    } catch (e) {
      throw Exception('Error al comprar tickets: $e');
    }
  }
}
