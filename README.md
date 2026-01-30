# App Web – Lista de Supermercado

## HTML + CSS + JavaScript + GitHub

**Desarrollado por:** MORÁN PÉREZ DENNY JAVIER

---

## Descripción del Proyecto

Aplicación web funcional que permite gestionar una lista de compras de supermercado. El usuario puede agregar productos con nombre, cantidad e imagen opcional, marcarlos como comprados, eliminarlos y filtrarlos según su estado. Toda la información se mantiene guardada incluso al cerrar el navegador gracias al uso de localStorage.

---

## Funcionalidades Implementadas

- **Agregar productos**: Formulario con validación para añadir productos con nombre, cantidad e imagen opcional
- **Visualizar lista dinámica**: Los productos se muestran en tiempo real sin recargar la página
- **Marcar como comprado**: Click en el producto para cambiar su estado visual (tachado y color diferente)
- **Eliminar productos**: Botón individual para quitar productos de la lista
- **Contadores en tiempo real**: Muestra total de productos, comprados y pendientes
- **Filtros**: Botones para mostrar todos, solo pendientes o solo comprados
- **Persistencia con localStorage**: Los datos se guardan automáticamente y se recuperan al recargar
- **Vaciar lista**: Botón para eliminar todos los productos con confirmación
- **Diseño responsive**: Se adapta a móviles, tablets y escritorio

---

## Tecnologías Usadas

- **HTML5**: Estructura semántica del documento
- **CSS3**: Estilos y diseño visual
- **JavaScript**: Lógica de la aplicación

### Recursos Externos

- **Google Fonts**: Fuente [Poppins](https://fonts.google.com/specimen/Poppins) para tipografía del proyecto

---

## Instrucciones de Uso

1. Descargar o clonar el repositorio
2. Abrir el archivo `index.html` en cualquier navegador web

### Cómo usar la aplicación

1. **Agregar producto**: Escribe el nombre, cantidad y opcionalmente selecciona una imagen. Presiona "Agregar"
2. **Marcar como comprado**: Haz clic sobre el nombre del producto
3. **Eliminar producto**: Presiona el botón rojo "Eliminar" del producto
4. **Filtrar productos**: Usa los botones "Todos", "Pendientes" o "Comprados"
5. **Vaciar lista**: Presiona "Vaciar lista" y confirma la acción

---

## Declaración de Uso de Inteligencia Artificial

Declaro que utilicé Inteligencia Artificial como apoyo para comprender partes del proyecto. El código fue adaptado, modificado y entendido por mí.

### Herramienta utilizada
- **Claude (Anthropic)**: Asistente de IA para desarrollo de código

### Prompts utilizados

1. *"¿Cómo funciona localStorage en JavaScript para guardar y recuperar datos?"*
2. *"¿Cómo usar createElement para agregar elementos dinámicamente al DOM?"*
3. *"¿Cómo implementar classList.toggle para cambiar estilos de un elemento?"*

### Qué parte ayudó la IA

- Comprensión del funcionamiento de `localStorage` y su sintaxis (`setItem`, `getItem`, `JSON.stringify`, `JSON.parse`)
- Estructura base para crear elementos del DOM dinámicamente
- Sugerencias para organizar el código en funciones reutilizables

### Qué modifiqué manualmente

- Diseño visual y estilos CSS según mis preferencias
- Lógica de filtros (todos, pendientes, comprados)
- Sistema de contadores y actualización en tiempo real
- Validaciones del formulario
- Integración de todas las partes en una aplicación funcional
- Manejo de imágenes con FileReader y conversión a base64
