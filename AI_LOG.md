# Registro de Uso de IA - Meet2Go

Este documento describe cómo utilicé herramientas de IA durante el desarrollo de este proyecto.

## Enfoque

Usé IA principalmente para acelerar tareas repetitivas y obtener sugerencias rápidas. Todo el código fue revisado y ajustado según las necesidades del proyecto.

## Uso Específico

### Estructura Base de Pantallas
La IA me ayudó a generar la estructura inicial de las pantallas Flutter (widgets, layouts básicos). Luego las modifiqué para que se ajustaran a los requisitos específicos y a la UX que necesitaba.

### Tema y Estilos
Obtuve sugerencias para la configuración de colores y tipografías. Ajusté manualmente los colores para que coincidieran con la marca Meet2Go y cambié la fuente a Roboto cuando Google Sans no estaba disponible.

### Sincronización Backend-Frontend
La IA me ayudó a identificar cuando los modelos del backend no coincidían con los del frontend (por ejemplo, campos faltantes o tipos de datos diferentes). Validé cada cambio manualmente para asegurarme de que todo funcionara correctamente.

### Documentación
Usé IA para generar comentarios JSDoc en el backend y comentarios Dart en Flutter. Revisé y ajusté la documentación para que fuera clara y útil para otros desarrolladores.

### Corrección de Errores
La IA me ayudó a encontrar errores de sintaxis y problemas de linting rápidamente. Revisé cada corrección antes de aplicarla.

### Mejoras y Optimizaciones
Obtuve sugerencias para mejoras de código, manejo de errores y validaciones. Evalué cada una y las implementé solo si tenían sentido para el proyecto.

## Decisiones Técnicas

Decisiones importantes tomadas:
- Usar Sequelize como ORM en lugar de SQL directo
- Implementar autenticación con JWT
- Usar el patrón singleton para servicios compartidos
- Estructura de la base de datos y relaciones entre tablas
- Validaciones y reglas de negocio

## Conclusión

La IA fue útil para acelerar tareas repetitivas y obtener sugerencias, pero requiere revisión constante. Muchas veces las sugerencias necesitaban ajustes significativos o no aplicaban directamente al contexto del proyecto. Lo más valioso fue usarla para identificar inconsistencias entre componentes y generar estructuras base que luego personalicé.
