import 'package:flutter/material.dart';
import '../models/evento.dart';
import '../utils/evento_images.dart';

/// Widget reutilizable para mostrar la imagen de un evento.
/// Muestra la imagen si está disponible, o un placeholder con la inicial del título.
class EventoImageWidget extends StatelessWidget {
  final Evento evento;
  final double width;
  final double height;

  const EventoImageWidget({
    super.key,
    required this.evento,
    this.width = 60,
    this.height = 60,
  });

  @override
  Widget build(BuildContext context) {
    final imagePath = EventoImages.getImagePath(evento.titulo);

    if (imagePath != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Image.asset(
          imagePath,
          width: width,
          height: height,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) =>
              _buildPlaceholder(context),
        ),
      );
    }

    return _buildPlaceholder(context);
  }

  Widget _buildPlaceholder(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: Text(
          evento.titulo.isNotEmpty ? evento.titulo[0].toUpperCase() : '?',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onPrimary,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
      ),
    );
  }
}
