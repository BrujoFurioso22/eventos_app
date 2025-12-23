# Meet2Go Backend

API REST para la aplicación Meet2Go. Proporciona endpoints para gestión de usuarios, eventos y compra de tickets.

## Instrucciones Básicas para Ejecutar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Crear archivo `.env` en la raíz del proyecto con las credenciales de tu base de datos (Supabase):
   ```env
   DB_HOST=tu_host_supabase
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=tu_password_supabase
   DB_SSL=true
   JWT_SECRET=tu_secret_key_seguro
   PORT=3000
   NODE_ENV=development
   ```
   
   **Nota:** La estructura de la base de datos ya está creada en Supabase. El archivo `config/migrations.sql` contiene el esquema de la base de datos que está subida.

3. **Ejecutar el servidor:**
   ```bash
   npm run dev
   ```

   El servidor estará disponible en `http://localhost:3000`

## Arquitectura

El backend sigue una arquitectura en capas: **Rutas → Controladores → Servicios → Modelos**. Las rutas definen los endpoints HTTP, los controladores manejan la lógica de request/response, los servicios encapsulan la lógica de negocio usando Sequelize ORM, y los modelos representan las entidades de la base de datos PostgreSQL. La autenticación se maneja mediante middleware JWT que valida tokens en rutas protegidas.
