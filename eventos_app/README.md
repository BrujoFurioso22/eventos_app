# Meet2Go - Aplicación Móvil

Aplicación Flutter para descubrir eventos y comprar tickets. Permite a los usuarios explorar eventos disponibles, ver sus compras y gestionar su perfil.

## Instrucciones Básicas para Ejecutar

1. **Instalar dependencias:**
   ```bash
   flutter pub get
   ```

2. **Conectar al backend:**
   - Asegúrate de que el backend esté corriendo (ver `../backend/README.md`)
   - Editar `lib/services/api_service.dart` y actualizar `baseUrl` con la URL de tu backend:
   ```dart
   static const String baseUrl = 'http://localhost:3000/api';
   ```
   - Para dispositivos físicos o emuladores, usar la IP de tu máquina en lugar de `localhost`:
   ```dart
   static const String baseUrl = 'http://192.168.1.X:3000/api';
   ```

3. **Ejecutar la aplicación:**
   ```bash
   flutter run
   ```

   Para Android/iOS específico:
   ```bash
   flutter run -d android
   flutter run -d ios
   ```

## Arquitectura

La aplicación sigue el patrón **MVCS (Model-View-Controller-Service)**: los **Modelos** representan los datos (Evento, Usuario, Ticket), las **Vistas** son las pantallas Flutter (screens), los **Servicios** manejan la lógica de negocio y comunicación HTTP (singleton pattern), y el **Controller** es el estado de los widgets StatefulWidget. La autenticación se persiste localmente con SharedPreferences y se valida mediante tokens JWT en cada petición HTTP.
