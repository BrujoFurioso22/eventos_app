import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

/// Servicio singleton para realizar peticiones HTTP al backend.
/// Maneja automáticamente la autenticación mediante tokens JWT.
class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  /// URL base del backend API.
  /// Para producción, cambiar a la URL del servidor desplegado.
  /// Para Android emulador: usar 'http://10.0.2.2:3000/api'
  /// Para iOS simulador: usar 'http://localhost:3000/api'
  /// Para dispositivo físico: usar la IP de tu máquina (ej: 'http://192.168.1.X:3000/api')
  static const String baseUrl = 'http://10.0.2.2:3000/api';
  
  /// Timeout para las peticiones HTTP (30 segundos)
  static const Duration timeout = Duration(seconds: 30);
  
  String? _token;

  /// Establece el token de autenticación para las peticiones.
  /// El token se incluye automáticamente en el header Authorization.
  void setToken(String token) {
    _token = token;
  }

  /// Headers HTTP con Content-Type y Authorization si hay token.
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  /// Procesa la respuesta HTTP y lanza excepción si hay error.
  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      try {
        return json.decode(response.body);
      } catch (e) {
        throw Exception('Error al procesar la respuesta del servidor');
      }
    } else {
      try {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Error en la petición');
      } catch (e) {
        // Si no se puede parsear el JSON, usar el mensaje de estado HTTP
        throw Exception('Error del servidor (${response.statusCode})');
      }
    }
  }

  /// Realiza una petición GET al endpoint especificado.
  /// [endpoint] debe comenzar con '/' (ej: '/eventos').
  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      ).timeout(timeout);
      return _handleResponse(response);
    } on FormatException {
      throw Exception('Error al procesar la respuesta del servidor');
    } on http.ClientException {
      throw Exception('Error de conexión. Verifica tu conexión a internet');
    } on TimeoutException {
      throw Exception('Tiempo de espera agotado. El servidor no respondió a tiempo');
    } catch (e) {
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Error de conexión: $e');
    }
  }

  /// Realiza una petición POST al endpoint con el body especificado.
  /// [endpoint] debe comenzar con '/' (ej: '/usuarios/login').
  Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
        body: json.encode(body),
      ).timeout(timeout);
      return _handleResponse(response);
    } on FormatException {
      throw Exception('Error al procesar la respuesta del servidor');
    } on http.ClientException {
      throw Exception('Error de conexión. Verifica tu conexión a internet');
    } on TimeoutException {
      throw Exception('Tiempo de espera agotado. El servidor no respondió a tiempo');
    } catch (e) {
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Error de conexión: $e');
    }
  }

  /// Realiza una petición PUT al endpoint con el body especificado.
  Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
        body: json.encode(body),
      ).timeout(timeout);
      return _handleResponse(response);
    } on FormatException {
      throw Exception('Error al procesar la respuesta del servidor');
    } on http.ClientException {
      throw Exception('Error de conexión. Verifica tu conexión a internet');
    } on TimeoutException {
      throw Exception('Tiempo de espera agotado. El servidor no respondió a tiempo');
    } catch (e) {
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Error de conexión: $e');
    }
  }

  /// Realiza una petición DELETE al endpoint especificado.
  Future<Map<String, dynamic>> delete(String endpoint) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      ).timeout(timeout);
      return _handleResponse(response);
    } on FormatException {
      throw Exception('Error al procesar la respuesta del servidor');
    } on http.ClientException {
      throw Exception('Error de conexión. Verifica tu conexión a internet');
    } on TimeoutException {
      throw Exception('Tiempo de espera agotado. El servidor no respondió a tiempo');
    } catch (e) {
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Error de conexión: $e');
    }
  }
}
