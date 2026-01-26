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

// ============================================
// REFERENCIAS AL DOM
// ============================================

const formProducto = document.getElementById('form-producto');
const inputNombre = document.getElementById('nombre-producto');
const inputCantidad = document.getElementById('cantidad-producto');
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
}

/**
 * Carga los productos desde localStorage
 * @returns {Array} Array de productos o array vacío si no hay datos
 */
function cargarDeStorage() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
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
    if (!nombre || nombre.trim() === '') {
        return 'Por favor, ingresa el nombre del producto.';
    }

    if (!cantidad || cantidad < 1) {
        return 'La cantidad debe ser mayor a 0.';
    }

    return null;
}

/**
 * Muestra un mensaje de error en el formulario
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
}

/**
 * Limpia el mensaje de error
 */
function limpiarError() {
    mensajeError.textContent = '';
}

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

/**
 * Genera un ID único para cada producto
 * @returns {string} ID único
 */
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Agrega un nuevo producto a la lista
 * @param {string} nombre - Nombre del producto
 * @param {number} cantidad - Cantidad del producto
 */
function agregarProducto(nombre, cantidad) {
    const producto = {
        id: generarId(),
        nombre: nombre.trim(),
        cantidad: parseInt(cantidad),
        comprado: false
    };

    productos.push(producto);
    guardarEnStorage();
    renderizarProducto(producto);
    actualizarContadores();
}

/**
 * Elimina un producto de la lista
 * @param {string} id - ID del producto a eliminar
 */
function eliminarProducto(id) {
    productos = productos.filter(producto => producto.id !== id);
    guardarEnStorage();

    // Eliminar el elemento del DOM
    const elemento = document.querySelector(`[data-id="${id}"]`);
    if (elemento) {
        elemento.remove();
    }

    actualizarContadores();
}

/**
 * Alterna el estado de comprado de un producto
 * @param {string} id - ID del producto
 */
function toggleComprado(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        producto.comprado = !producto.comprado;
        guardarEnStorage();

        // Actualizar clase en el DOM
        const elemento = document.querySelector(`[data-id="${id}"]`);
        if (elemento) {
            elemento.classList.toggle('comprado');
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
    // Crear elemento li
    const li = document.createElement('li');
    li.setAttribute('data-id', producto.id);

    if (producto.comprado) {
        li.classList.add('comprado');
    }

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
        toggleComprado(producto.id);
    });

    // Crear botón de eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn-eliminar');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', function() {
        eliminarProducto(producto.id);
    });

    // Agregar elementos al li
    li.appendChild(infoDiv);
    li.appendChild(btnEliminar);

    // Agregar li a la lista
    listaProductos.appendChild(li);
}

/**
 * Renderiza todos los productos desde el array
 */
function renderizarTodosLosProductos() {
    // Limpiar lista actual
    listaProductos.innerHTML = '';

    // Renderizar cada producto
    productos.forEach(producto => {
        renderizarProducto(producto);
    });
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
    inputNombre.focus();
}

/**
 * Maneja el envío del formulario
 * @param {Event} evento - Evento del formulario
 */
function manejarEnvioFormulario(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value;
    const cantidad = inputCantidad.value;

    // Validar datos
    const error = validarFormulario(nombre, cantidad);

    if (error) {
        mostrarError(error);
        return;
    }

    // Limpiar error y agregar producto
    limpiarError();
    agregarProducto(nombre, cantidad);
    limpiarFormulario();
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa la aplicación
 */
function inicializarApp() {
    // Cargar productos desde localStorage
    productos = cargarDeStorage();

    // Renderizar productos existentes
    renderizarTodosLosProductos();

    // Actualizar contadores
    actualizarContadores();

    // Agregar evento al formulario
    formProducto.addEventListener('submit', manejarEnvioFormulario);
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);
