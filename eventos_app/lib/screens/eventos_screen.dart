import 'package:flutter/material.dart';
import '../models/evento.dart';
import '../services/eventos_service.dart';
import '../widgets/evento_image_widget.dart';
import 'evento_detail_screen.dart';

class EventosScreen extends StatefulWidget {
  const EventosScreen({super.key});

  @override
  State<EventosScreen> createState() => _EventosScreenState();
}

class _EventosScreenState extends State<EventosScreen> {
  final _eventosService = EventosService();
  List<Evento> _eventos = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadEventos();
  }

  Future<void> _loadEventos() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final eventos = await _eventosService.getEventos();
      setState(() {
        _eventos = eventos;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString().replaceAll('Exception: ', '');
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const Center(child: CircularProgressIndicator())
        : _error != null
        ? Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline,
                  size: 64,
                  color: Theme.of(context).colorScheme.error,
                ),
                const SizedBox(height: 16),
                Text(
                  _error!,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _loadEventos,
                  child: const Text('Reintentar'),
                ),
              ],
            ),
          )
        : _eventos.isEmpty
        ? const Center(
            child: Text(
              'No hay eventos disponibles',
              style: TextStyle(fontSize: 18),
            ),
          )
        : RefreshIndicator(
            onRefresh: _loadEventos,
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: _eventos.length,
              itemBuilder: (context, index) {
                final evento = _eventos[index];
                return Card(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  child: ListTile(
                    leading: EventoImageWidget(evento: evento),
                    title: Text(
                      evento.titulo,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text(
                          evento.descripcion.length > 50
                              ? '${evento.descripcion.substring(0, 50)}...'
                              : evento.descripcion,
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              '${evento.fecha.day}/${evento.fecha.month}/${evento.fecha.year}',
                              style: const TextStyle(fontSize: 12),
                            ),
                            const SizedBox(width: 16),
                            const Icon(Icons.location_on, size: 14),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                evento.ubicacion,
                                style: const TextStyle(fontSize: 12),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Precio: \$${evento.precio.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              EventoDetailScreen(evento: evento),
                        ),
                      ).then((_) => _loadEventos());
                    },
                  ),
                );
              },
            ),
          );
  }
}
