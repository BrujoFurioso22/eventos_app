import '../models/evento.dart';
import 'api_service.dart';

/// Servicio para operaciones relacionadas con eventos.
class EventosService {
  final ApiService _api = ApiService();

  /// Obtiene todos los eventos disponibles ordenados por fecha.
  /// Lanza excepción si hay error en la petición.
  Future<List<Evento>> getEventos() async {
    try {
      final response = await _api.get('/eventos');
      if (response['success'] == true) {
        final eventosList = response['eventos'] as List;
        return eventosList.map((e) => Evento.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      throw Exception('Error al obtener eventos: $e');
    }
  }

  /// Obtiene un evento específico por su ID.
  /// Lanza excepción si el evento no existe o hay error.
  Future<Evento> getEventoPorId(String id) async {
    try {
      final response = await _api.get('/eventos/$id');
      if (response['success'] == true) {
        return Evento.fromJson(response['evento']);
      }
      throw Exception('Evento no encontrado');
    } catch (e) {
      throw Exception('Error al obtener evento: $e');
    }
  }

  /// Obtiene los eventos donde el usuario autenticado tiene tickets.
  /// Requiere autenticación.
  /// Lanza excepción si hay error en la petición.
  Future<List<Evento>> getMisEventos() async {
    try {
      final response = await _api.get('/eventos/mis-eventos');
      if (response['success'] == true) {
        final eventosList = response['eventos'] as List;
        return eventosList.map((e) => Evento.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      throw Exception('Error al obtener mis eventos: $e');
    }
  }
}
