import 'package:flutter/material.dart';
import '../models/evento.dart';
import '../services/tickets_service.dart';
import '../services/auth_service.dart';
import '../utils/evento_images.dart';
import '../theme/app_theme.dart';
import 'compra_resultado_screen.dart';

class EventoDetailScreen extends StatefulWidget {
  final Evento evento;
  final bool esMiEvento;

  const EventoDetailScreen({
    super.key,
    required this.evento,
    this.esMiEvento = false,
  });

  @override
  State<EventoDetailScreen> createState() => _EventoDetailScreenState();
}

class _EventoDetailScreenState extends State<EventoDetailScreen> {
  final _ticketsService = TicketsService();
  final _authService = AuthService();
  int _cantidad = 1;
  bool _isLoading = false;
  bool _isLoadingTickets = true;
  int _ticketsUsuario = 0;

  @override
  void initState() {
    super.initState();
    if (widget.esMiEvento) {
      _loadTicketsUsuario();
    } else {
      _isLoadingTickets = false;
    }
  }

  Future<void> _loadTicketsUsuario() async {
    if (widget.evento.id == null) {
      setState(() => _isLoadingTickets = false);
      return;
    }

    try {
      final cantidad = await _ticketsService.getTicketsUsuario(
        widget.evento.id!,
      );
      setState(() {
        _ticketsUsuario = cantidad;
        _isLoadingTickets = false;
      });
    } catch (e) {
      setState(() => _isLoadingTickets = false);
    }
  }

  double get _precioTotal => widget.evento.precio * _cantidad;

  Future<void> _comprarTickets() async {
    if (!widget.evento.tieneCapacidad) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('No hay lugares disponibles'),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
      return;
    }

    if (_cantidad > widget.evento.lugaresDisponibles) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Solo hay ${widget.evento.lugaresDisponibles} lugares disponibles',
          ),
          backgroundColor: Theme.of(context).colorScheme.secondary,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final usuario = _authService.currentUser;
      if (usuario == null || usuario.id == null) {
        throw Exception('Usuario no autenticado');
      }

      final ticket = await _ticketsService.comprarTicket(
        eventoId: widget.evento.id!,
        usuarioId: usuario.id!,
        cantidad: _cantidad,
        precioUnitario: widget.evento.precio,
      );

      if (mounted) {
        if (widget.esMiEvento) {
          await _loadTicketsUsuario();
        }

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                CompraResultadoScreen(ticket: ticket, evento: widget.evento),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.toString().replaceAll('Exception: ', '')),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detalle del Evento')),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Imagen o placeholder
            Container(
              height: 250,
              color: Theme.of(
                context,
              ).colorScheme.primary.withValues(alpha: 0.1),
              child: _buildEventImage(),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.evento.titulo,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        '${widget.evento.fecha.day}/${widget.evento.fecha.month}/${widget.evento.fecha.year} ${widget.evento.fecha.hour}:${widget.evento.fecha.minute.toString().padLeft(2, '0')}',
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 16),
                      const SizedBox(width: 4),
                      Expanded(child: Text(widget.evento.ubicacion)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.category, size: 16),
                      const SizedBox(width: 4),
                      Text(widget.evento.categoria.toUpperCase()),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text(
                    'Descripción',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(widget.evento.descripcion),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),

                  if (widget.esMiEvento && !_isLoadingTickets) ...[
                    Card(
                      color: Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.1),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.confirmation_number,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Mis Tickets',
                                  style: Theme.of(context).textTheme.titleLarge
                                      ?.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.primary,
                                      ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Tickets que tienes:'),
                                Text(
                                  '$_ticketsUsuario',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary,
                                  ),
                                ),
                              ],
                            ),
                            if (_ticketsUsuario > 0) ...[
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text('Total pagado:'),
                                  Text(
                                    '\$${(widget.evento.precio * _ticketsUsuario).toStringAsFixed(2)}',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.primary,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Divider(),
                    const SizedBox(height: 8),
                    Text(
                      'Agregar más tickets',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                  ],

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.esMiEvento
                            ? 'Precio por ticket adicional:'
                            : 'Precio por ticket:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        '\$${widget.evento.precio.toStringAsFixed(2)}',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                  if (widget.evento.capacidadMaxima != null) ...[
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Lugares disponibles:'),
                        Text(
                          '${widget.evento.lugaresDisponibles} / ${widget.evento.capacidadMaxima}',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: widget.evento.tieneCapacidad
                                ? AppTheme.successColor
                                : Theme.of(context).colorScheme.error,
                          ),
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 24),
                  const Text(
                    'Cantidad de tickets:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      IconButton(
                        onPressed: _cantidad > 1
                            ? () => setState(() => _cantidad--)
                            : null,
                        icon: const Icon(Icons.remove_circle_outline),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '$_cantidad',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: widget.evento.lugaresDisponibles > _cantidad
                            ? () => setState(() => _cantidad++)
                            : null,
                        icon: const Icon(Icons.add_circle_outline),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total:',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '\$${_precioTotal.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading || !widget.evento.tieneCapacidad
                          ? null
                          : _comprarTickets,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: _isLoading
                          ? SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Theme.of(context).colorScheme.onPrimary,
                              ),
                            )
                          : Text(
                              widget.esMiEvento
                                  ? 'Agregar Tickets'
                                  : 'Comprar Tickets',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEventImage() {
    final imagePath = EventoImages.getImagePath(widget.evento.titulo);

    if (imagePath != null) {
      return Image.asset(
        imagePath,
        fit: BoxFit.cover,
        width: double.infinity,
        errorBuilder: (context, error, stackTrace) => _buildPlaceholderImage(),
      );
    }

    if (widget.evento.imagen != null && widget.evento.imagen!.isNotEmpty) {
      return Image.network(
        widget.evento.imagen!,
        fit: BoxFit.cover,
        width: double.infinity,
        errorBuilder: (context, error, stackTrace) => _buildPlaceholderImage(),
      );
    }

    return _buildPlaceholderImage();
  }

  Widget _buildPlaceholderImage() {
    return Container(
      color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.2),
      child: Center(
        child: Icon(
          Icons.event,
          size: 80,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}
