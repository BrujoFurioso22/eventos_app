/// Modelo que representa un usuario en el sistema.
class Usuario {
  final String? id;
  final String nombre;
  final String email;
  final String? telefono;
  final String? fotoPerfil;

  Usuario({
    this.id,
    required this.nombre,
    required this.email,
    this.telefono,
    this.fotoPerfil,
  });

  /// Crea una instancia de Usuario desde un JSON del servidor.
  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      id: json['id']?.toString(),
      nombre: json['nombre'] ?? '',
      email: json['email'] ?? '',
      telefono: json['telefono'],
      fotoPerfil: json['fotoPerfil'],
    );
  }

  /// Convierte el usuario a formato JSON para enviar al servidor.
  Map<String, dynamic> toJson() {
    return {
      'nombre': nombre,
      'email': email,
      'telefono': telefono,
      'fotoPerfil': fotoPerfil,
    };
  }
}
