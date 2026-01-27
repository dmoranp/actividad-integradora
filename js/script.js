/**
 * Lista de Supermercado - Script Principal
 * Aplicación para gestionar una lista de compras con persistencia en localStorage
 */

// ============================================
// VARIABLES GLOBALES
// ============================================

// Clave para almacenar datos en localStorage
const STORAGE_KEY = 'listaSupermercado';

// Array que contiene todos los productos
let productos = [];

// Imagen por defecto cuando no se proporciona una URL
const IMAGEN_DEFAULT = 'img/placeholder.jpg';

// ============================================
// REFERENCIAS AL DOM
// ============================================

const formProducto = document.getElementById('form-producto');
const inputNombre = document.getElementById('nombre-producto');
const inputCantidad = document.getElementById('cantidad-producto');
const inputImagen = document.getElementById('imagen-producto');
const mensajeError = document.getElementById('mensaje-error');
const listaProductos = document.getElementById('lista-productos');
const contadorTotal = document.getElementById('contador-total');
const contadorComprados = document.getElementById('contador-comprados');
const contadorPendientes = document.getElementById('contador-pendientes');

// ============================================
// FUNCIONES DE LOCALSTORAGE
// ============================================
// Nota: Se utilizó IA (Claude) para comprender el funcionamiento
// del localStorage y su compatibilidad con los navegadores modernos.

/**
 * Guarda el array de productos en localStorage
 */
function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
    console.log('[localStorage] Datos guardados:', productos);
}

/**
 * Carga los productos desde localStorage
 * @returns {Array} Array de productos o array vacío si no hay datos
 */
function cargarDeStorage() {
    const datos = localStorage.getItem(STORAGE_KEY);
    const productosRecuperados = datos ? JSON.parse(datos) : [];
    console.log('[localStorage] Datos cargados:', productosRecuperados);
    return productosRecuperados;
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Valida los datos del formulario
 * @param {string} nombre - Nombre del producto
 * @param {number} cantidad - Cantidad del producto
 * @returns {string|null} Mensaje de error o null si es válido
 */
function validarFormulario(nombre, cantidad) {
    console.log('[Validación] Validando formulario:', { nombre, cantidad });

    if (!nombre || nombre.trim() === '') {
        console.warn('[Validación] Error: Nombre vacío');
        return 'Por favor, ingresa el nombre del producto.';
    }

    if (!cantidad || cantidad < 1) {
        console.warn('[Validación] Error: Cantidad inválida');
        return 'La cantidad debe ser mayor a 0.';
    }

    console.log('[Validación] Formulario válido');
    return null;
}

/**
 * Muestra un mensaje de error en el formulario
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    console.error('[Error] Mostrando error al usuario:', mensaje);
}

/**
 * Limpia el mensaje de error
 */
function limpiarError() {
    mensajeError.textContent = '';
    console.log('[Error] Mensaje de error limpiado');
}

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

/**
 * Genera un ID único para cada producto
 * @returns {string} ID único
 */
function generarId() {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.log('[ID] Nuevo ID generado:', id);
    return id;
}

/**
 * Agrega un nuevo producto a la lista
 * @param {string} nombre - Nombre del producto
 * @param {number} cantidad - Cantidad del producto
 * @param {string} imagen - URL de la imagen del producto
 */
function agregarProducto(nombre, cantidad, imagen) {
    const producto = {
        id: generarId(),
        nombre: nombre.trim(),
        cantidad: parseInt(cantidad),
        imagen: imagen || IMAGEN_DEFAULT,
        comprado: false
    };

    console.log('[Producto] Agregando nuevo producto:', producto);
    productos.push(producto);
    guardarEnStorage();
    renderizarProducto(producto);
    actualizarContadores();
    console.log('[Producto] Producto agregado exitosamente. Total de productos:', productos.length);
}

/**
 * Elimina un producto de la lista
 * @param {string} id - ID del producto a eliminar
 */
function eliminarProducto(id) {
    const productoEliminado = productos.find(producto => producto.id === id);
    console.log('[Producto] Eliminando producto:', productoEliminado);

    productos = productos.filter(producto => producto.id !== id);
    guardarEnStorage();

    // Eliminar el elemento del DOM
    const elemento = document.querySelector(`[data-id="${id}"]`);
    if (elemento) {
        elemento.remove();
        console.log('[DOM] Elemento eliminado del DOM');
    }

    actualizarContadores();
    console.log('[Producto] Producto eliminado exitosamente. Total de productos:', productos.length);
}

/**
 * Alterna el estado de comprado de un producto
 * @param {string} id - ID del producto
 */
function toggleComprado(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        producto.comprado = !producto.comprado;
        console.log('[Producto] Estado de compra cambiado:', {
            nombre: producto.nombre,
            comprado: producto.comprado
        });

        guardarEnStorage();

        // Actualizar clase en el DOM
        const elemento = document.querySelector(`[data-id="${id}"]`);
        if (elemento) {
            elemento.classList.toggle('comprado');
            console.log('[DOM] Clase "comprado" alternada en el elemento');
        }

        actualizarContadores();
    }
}

// ============================================
// FUNCIONES DE RENDERIZADO
// ============================================

/**
 * Crea y agrega un elemento de producto al DOM
 * @param {Object} producto - Objeto con los datos del producto
 */
function renderizarProducto(producto) {
    console.log('[Renderizado] Renderizando producto:', producto.nombre);

    // Crear elemento li
    const li = document.createElement('li');
    li.setAttribute('data-id', producto.id);

    if (producto.comprado) {
        li.classList.add('comprado');
    }

    // Crear imagen del producto
    const img = document.createElement('img');
    img.classList.add('producto-imagen');
    img.src = producto.imagen || IMAGEN_DEFAULT;
    img.alt = producto.nombre;
    img.onerror = function() {
        console.warn('[Imagen] Error al cargar imagen, usando placeholder:', producto.imagen);
        this.src = IMAGEN_DEFAULT;
    };

    // Crear contenedor de información del producto
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('producto-info');

    // Crear span para el nombre
    const nombreSpan = document.createElement('span');
    nombreSpan.classList.add('producto-nombre');
    nombreSpan.textContent = producto.nombre;

    // Crear span para la cantidad
    const cantidadSpan = document.createElement('span');
    cantidadSpan.classList.add('producto-cantidad');
    cantidadSpan.textContent = `(${producto.cantidad})`;

    // Agregar nombre y cantidad al contenedor de info
    infoDiv.appendChild(nombreSpan);
    infoDiv.appendChild(cantidadSpan);

    // Evento para marcar como comprado al hacer clic en la info
    infoDiv.addEventListener('click', function() {
        console.log('[Evento] Click en producto:', producto.nombre);
        toggleComprado(producto.id);
    });

    // Crear botón de eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn-eliminar');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', function() {
        console.log('[Evento] Click en botón eliminar para:', producto.nombre);
        eliminarProducto(producto.id);
    });

    // Agregar elementos al li
    li.appendChild(img);
    li.appendChild(infoDiv);
    li.appendChild(btnEliminar);

    // Agregar li a la lista
    listaProductos.appendChild(li);
    console.log('[DOM] Producto agregado al DOM:', producto.nombre);
}

/**
 * Renderiza todos los productos desde el array
 */
function renderizarTodosLosProductos() {
    console.log('[Renderizado] Renderizando todos los productos...');
    // Limpiar lista actual
    listaProductos.innerHTML = '';

    // Renderizar cada producto
    productos.forEach(producto => {
        renderizarProducto(producto);
    });
    console.log('[Renderizado] Renderizado completo. Total:', productos.length, 'productos');
}

// ============================================
// FUNCIONES DE CONTADORES
// ============================================

/**
 * Actualiza los contadores de productos
 */
function actualizarContadores() {
    const total = productos.length;
    const comprados = productos.filter(p => p.comprado).length;
    const pendientes = total - comprados;

    contadorTotal.textContent = total;
    contadorComprados.textContent = comprados;
    contadorPendientes.textContent = pendientes;

    console.log('[Contadores] Actualizados:', { total, comprados, pendientes });
}

// ============================================
// FUNCIONES DE FORMULARIO
// ============================================

/**
 * Limpia los campos del formulario
 */
function limpiarFormulario() {
    inputNombre.value = '';
    inputCantidad.value = '';
    inputImagen.value = '';
    inputNombre.focus();
    console.log('[Formulario] Campos limpiados');
}

/**
 * Convierte un archivo de imagen a base64
 * @param {File} archivo - Archivo de imagen
 * @returns {Promise<string>} Promesa que resuelve con la imagen en base64
 */
function convertirImagenABase64(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('[Imagen] Imagen convertida a base64');
            resolve(e.target.result);
        };
        reader.onerror = function(error) {
            console.error('[Imagen] Error al convertir imagen:', error);
            reject(error);
        };
        reader.readAsDataURL(archivo);
    });
}

/**
 * Maneja el envío del formulario
 * @param {Event} evento - Evento del formulario
 */
async function manejarEnvioFormulario(evento) {
    evento.preventDefault();
    console.log('[Formulario] Formulario enviado');

    const nombre = inputNombre.value;
    const cantidad = inputCantidad.value;
    const archivoImagen = inputImagen.files[0];

    console.log('[Formulario] Datos recibidos:', { nombre, cantidad, tieneImagen: !!archivoImagen });

    // Validar datos
    const error = validarFormulario(nombre, cantidad);

    if (error) {
        mostrarError(error);
        return;
    }

    // Procesar imagen si existe
    let imagenBase64 = null;
    if (archivoImagen) {
        try {
            console.log('[Imagen] Procesando imagen:', archivoImagen.name);
            imagenBase64 = await convertirImagenABase64(archivoImagen);
        } catch (err) {
            console.error('[Imagen] Error al procesar imagen:', err);
        }
    }

    // Limpiar error y agregar producto
    limpiarError();
    agregarProducto(nombre, cantidad, imagenBase64);
    limpiarFormulario();
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa la aplicación
 */
function inicializarApp() {
    console.log('[App] Inicializando aplicación...');

    // Cargar productos desde localStorage
    productos = cargarDeStorage();

    // Renderizar productos existentes
    renderizarTodosLosProductos();

    // Actualizar contadores
    actualizarContadores();

    // Agregar evento al formulario
    formProducto.addEventListener('submit', manejarEnvioFormulario);
    console.log('[App] Evento submit registrado en el formulario');

    console.log('[App] Aplicación inicializada correctamente');
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('[App] DOM cargado completamente');
    inicializarApp();
});
