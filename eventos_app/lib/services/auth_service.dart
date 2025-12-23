import 'package:shared_preferences/shared_preferences.dart';
import '../models/usuario.dart';
import 'api_service.dart';

/// Servicio singleton para gestión de autenticación y sesión de usuario.
/// Maneja login, registro, persistencia de sesión y logout.
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final ApiService _api = ApiService();
  Usuario? _currentUser;
  String? _token;

  /// Usuario actualmente autenticado.
  Usuario? get currentUser => _currentUser;

  /// Token JWT actual.
  String? get token => _token;

  /// Indica si hay un usuario autenticado.
  bool get isAuthenticated => _token != null && _currentUser != null;

  /// Obtiene el usuario actual desde el servidor si no está en memoria.
  /// Retorna null si no hay token o el usuario no existe.
  Future<Usuario?> getCurrentUser() async {
    if (_currentUser != null) {
      return _currentUser;
    }

    if (_token != null) {
      try {
        final response = await _api.get('/usuarios/me');
        if (response['success'] == true && response['usuario'] != null) {
          _currentUser = Usuario.fromJson(response['usuario']);
          return _currentUser;
        }
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  /// Autentica un usuario con email y contraseña.
  /// Guarda el token y los datos del usuario en memoria y SharedPreferences.
  /// Retorna el usuario autenticado.
  /// Lanza excepción si las credenciales son inválidas.
  Future<Usuario> login(String email, String password) async {
    try {
      final response = await _api.post('/usuarios/login', {
        'email': email,
        'password': password,
      });

      if (response['success'] == true) {
        _token = response['token'];
        _currentUser = Usuario.fromJson(response['usuario']);
        _api.setToken(_token!);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', _token!);
        await prefs.setString('user', _currentUser!.email);

        return _currentUser!;
      } else {
        throw Exception(response['error'] ?? 'Error en el login');
      }
    } catch (e) {
      throw Exception('Error al iniciar sesión: $e');
    }
  }

  /// Registra un nuevo usuario y realiza login automático.
  /// Retorna el usuario registrado y autenticado.
  /// Lanza excepción si el registro falla.
  Future<Usuario> register(String nombre, String email, String password) async {
    try {
      final response = await _api.post('/usuarios', {
        'nombre': nombre,
        'email': email,
        'password': password,
      });

      if (response['success'] == true) {
        return await login(email, password);
      } else {
        throw Exception(response['error'] ?? 'Error en el registro');
      }
    } catch (e) {
      throw Exception('Error al registrar: $e');
    }
  }

  /// Carga la sesión guardada desde SharedPreferences.
  /// Verifica que el token sea válido consultando al servidor.
  /// Retorna true si la sesión es válida, false en caso contrario.
  Future<bool> loadSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedToken = prefs.getString('token');

      if (savedToken != null) {
        _token = savedToken;
        _api.setToken(_token!);

        try {
          final response = await _api.get('/usuarios/me');
          if (response['success'] == true && response['usuario'] != null) {
            _currentUser = Usuario.fromJson(response['usuario']);
            return true;
          }
        } catch (e) {
          await logout();
          return false;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /// Cierra la sesión del usuario.
  /// Limpia el token y usuario de memoria y SharedPreferences.
  Future<void> logout() async {
    _token = null;
    _currentUser = null;
    _api.setToken('');

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }
}
