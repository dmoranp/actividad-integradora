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
// CLASE PRODUCTO
// ============================================

/**
 * Clase que representa un producto de la lista
 */
class Producto {
    constructor(nombre, cantidad, imagen = IMAGEN_DEFAULT) {
        this.id = this.generarId();
        this.nombre = nombre.trim();
        this.cantidad = parseInt(cantidad);
        this.imagen = imagen || IMAGEN_DEFAULT;
        this.comprado = false;
    }

    // Genera un ID único para el producto
    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Devuelve información del producto
    info() {
        return `${this.nombre} (${this.cantidad}) - ${this.comprado ? 'Comprado' : 'Pendiente'}`;
    }

    // Alterna el estado de comprado
    toggleComprado() {
        this.comprado = !this.comprado;
        return this.comprado;
    }
}

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
const mensajeVacio = document.getElementById('mensaje-vacio');
const btnVaciar = document.getElementById('btn-vaciar');
const mensajeExito = document.getElementById('mensaje-exito');
const filtros = document.querySelectorAll('.btn-filtro');

// Variable para el filtro activo
let filtroActual = 'todos';

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
 * Carga los productos desde localStorage y los convierte en instancias de Producto
 * @returns {Array} Array de productos o array vacío si no hay datos
 */
function cargarDeStorage() {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) {
        console.log('[localStorage] No hay datos guardados');
        return [];
    }

    // Convertir objetos del localStorage en instancias de la clase Producto
    const datosParseados = JSON.parse(datos);
    const productosRecuperados = datosParseados.map(function(item) {
        const producto = new Producto(item.nombre, item.cantidad, item.imagen);
        producto.id = item.id; // Mantener el ID original
        producto.comprado = item.comprado; // Mantener el estado de comprado
        return producto;
    });

    console.log('[localStorage] Datos cargados:', productosRecuperados.length, 'productos');
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

    // Validar que el nombre solo contenga letras y espacios
    if (!regexNombreValido.test(nombre.trim())) {
        console.warn('[Validación] Error: Nombre con caracteres inválidos');
        return 'El nombre solo puede contener letras y espacios.';
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

/**
 * Muestra un mensaje de éxito temporalmente
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarExito(mensaje) {
    mensajeExito.textContent = mensaje;
    mensajeExito.classList.add('visible');
    console.log('[Éxito] Mostrando mensaje:', mensaje);

    // Ocultar después de 2 segundos
    setTimeout(function() {
        mensajeExito.classList.remove('visible');
        mensajeExito.textContent = '';
    }, 2000);
}

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

/**
 * Agrega un nuevo producto a la lista usando la clase Producto
 * @param {string} nombre - Nombre del producto
 * @param {number} cantidad - Cantidad del producto
 * @param {string} imagen - URL de la imagen del producto
 */
function agregarProducto(nombre, cantidad, imagen) {
    // Crear nueva instancia de la clase Producto
    const producto = new Producto(nombre, cantidad, imagen);

    console.log('[Producto] Agregando nuevo producto:', producto.info());
    productos.push(producto);
    guardarEnStorage();
    renderizarProducto(producto);
    actualizarContadores();
    filtrarProductos(filtroActual); // Reaplicar filtro actual
    mostrarExito('¡Producto "' + producto.nombre + '" agregado correctamente!');
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
    actualizarVisibilidadLista();
    console.log('[Producto] Producto eliminado exitosamente. Total de productos:', productos.length);
}

/**
 * Vacía toda la lista de productos previa confirmación
 */
function vaciarLista() {
    if (productos.length === 0) {
        console.log('[Lista] La lista ya está vacía');
        return;
    }

    const confirmacion = confirm('¿Estás seguro de que deseas vaciar toda la lista?');

    if (confirmacion) {
        console.log('[Lista] Vaciando lista completa...');
        productos = [];
        guardarEnStorage();
        listaProductos.innerHTML = '';
        actualizarContadores();
        actualizarVisibilidadLista();
        console.log('[Lista] Lista vaciada exitosamente');
    } else {
        console.log('[Lista] Vaciado cancelado por el usuario');
    }
}

/**
 * Alterna el estado de comprado de un producto usando el método de la clase
 * @param {string} id - ID del producto
 */
function toggleComprado(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        // Usar el método de la clase Producto
        producto.toggleComprado();
        console.log('[Producto] Estado de compra cambiado:', producto.info());

        guardarEnStorage();

        // Actualizar clase en el DOM
        const elemento = document.querySelector(`[data-id="${id}"]`);
        if (elemento) {
            elemento.classList.toggle('comprado');
            console.log('[DOM] Clase "comprado" alternada en el elemento');
        }

        actualizarContadores();
        filtrarProductos(filtroActual); // Reaplicar filtro actual
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
    btnEliminar.setAttribute('aria-label', 'Eliminar ' + producto.nombre + ' de la lista');
    btnEliminar.addEventListener('click', function() {
        console.log('[Evento] Click en botón eliminar para:', producto.nombre);
        eliminarProducto(producto.id);
    });

    // Agregar elementos al li
    li.appendChild(img);
    li.appendChild(infoDiv);
    li.appendChild(btnEliminar);

    // Agregar li a la lista con animación
    li.classList.add('nuevo');
    listaProductos.appendChild(li);

    // Remover clase de animación después de que termine
    setTimeout(function() {
        li.classList.remove('nuevo');
    }, 300);

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

/**
 * Muestra u oculta el mensaje de lista vacía y el botón vaciar
 */
function actualizarVisibilidadLista() {
    if (productos.length === 0) {
        mensajeVacio.classList.add('visible');
        btnVaciar.classList.remove('visible');
        console.log('[UI] Mostrando mensaje de lista vacía');
    } else {
        mensajeVacio.classList.remove('visible');
        btnVaciar.classList.add('visible');
        console.log('[UI] Ocultando mensaje de lista vacía');
    }
}

// ============================================
// FUNCIONES DE FILTRADO
// ============================================

/**
 * Filtra los productos según el filtro seleccionado
 * @param {string} filtro - Tipo de filtro: 'todos', 'pendientes', 'comprados'
 */
function filtrarProductos(filtro) {
    filtroActual = filtro;
    console.log('[Filtro] Aplicando filtro:', filtro);

    const elementosLista = listaProductos.querySelectorAll('li');

    elementosLista.forEach(function(elemento) {
        const id = elemento.getAttribute('data-id');
        const producto = productos.find(p => p.id === id);

        if (!producto) return;

        // Determinar si debe mostrarse según el filtro
        let mostrar = false;

        if (filtro === 'todos') {
            mostrar = true;
        } else if (filtro === 'pendientes') {
            mostrar = !producto.comprado;
        } else if (filtro === 'comprados') {
            mostrar = producto.comprado;
        }

        // Aplicar clase oculto
        if (mostrar) {
            elemento.classList.remove('oculto');
        } else {
            elemento.classList.add('oculto');
        }
    });

    // Actualizar botones de filtro
    filtros.forEach(function(btn) {
        if (btn.getAttribute('data-filtro') === filtro) {
            btn.classList.add('activo');
        } else {
            btn.classList.remove('activo');
        }
    });

    console.log('[Filtro] Filtro aplicado correctamente');
}

// ============================================
// VALIDACIÓN EN TIEMPO REAL
// ============================================

// Expresión regular para validar nombres (solo letras, espacios y acentos)
const regexNombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

/**
 * Valida el nombre del producto mientras el usuario escribe
 */
function validarNombreEnTiempoReal() {
    const nombre = inputNombre.value.trim();

    if (nombre.length === 0) {
        inputNombre.style.borderColor = '#ddd';
        return;
    }

    // Validar longitud mínima y que solo contenga letras
    if (nombre.length < 2) {
        inputNombre.style.borderColor = '#e74c3c';
        console.log('[Validación tiempo real] Nombre muy corto:', nombre.length);
    } else if (!regexNombreValido.test(nombre)) {
        inputNombre.style.borderColor = '#e74c3c';
        console.log('[Validación tiempo real] Nombre con caracteres inválidos');
    } else {
        inputNombre.style.borderColor = '#27ae60';
        console.log('[Validación tiempo real] Nombre válido');
    }
}

/**
 * Valida la cantidad mientras el usuario escribe
 */
function validarCantidadEnTiempoReal() {
    const cantidad = parseInt(inputCantidad.value);

    if (inputCantidad.value === '') {
        inputCantidad.style.borderColor = '#ddd';
        return;
    }

    if (isNaN(cantidad) || cantidad < 1) {
        inputCantidad.style.borderColor = '#e74c3c';
        console.log('[Validación tiempo real] Cantidad inválida:', cantidad);
    } else {
        inputCantidad.style.borderColor = '#27ae60';
        console.log('[Validación tiempo real] Cantidad válida');
    }
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
    // Resetear estilos de validación
    inputNombre.style.borderColor = '#ddd';
    inputCantidad.style.borderColor = '#ddd';
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
    actualizarVisibilidadLista();
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

    // Agregar validación en tiempo real (mientras el usuario escribe)
    inputNombre.addEventListener('input', validarNombreEnTiempoReal);
    inputCantidad.addEventListener('input', validarCantidadEnTiempoReal);
    console.log('[App] Validación en tiempo real activada');

    // Agregar evento al botón vaciar
    btnVaciar.addEventListener('click', vaciarLista);
    console.log('[App] Evento click registrado en botón vaciar');

    // Agregar eventos a los filtros
    filtros.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const filtro = this.getAttribute('data-filtro');
            console.log('[Evento] Click en filtro:', filtro);
            filtrarProductos(filtro);
        });
    });
    console.log('[App] Eventos de filtros registrados');

    // Actualizar visibilidad inicial
    actualizarVisibilidadLista();

    console.log('[App] Aplicación inicializada correctamente');
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('[App] DOM cargado completamente');
    inicializarApp();
});
