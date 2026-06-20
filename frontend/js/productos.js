const API_URL = "http://localhost:3000";

const formProducto = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");

let productoEditando = null;

function mostrarMensaje(mensaje, esError = false) {
    if (esError) {
        console.error(mensaje);
    } else {
        console.log(mensaje);
    }

    alert(mensaje);
}

function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: document.getElementById("precio").value,
        categoria: document.getElementById("categoria").value.trim(),
        stock: document.getElementById("stock").value,
        imagen: document.getElementById("imagen").value.trim()
    };
}

function limpiarFormulario() {
    formProducto.reset();
    productoEditando = null;
}

function llenarFormulario(producto) {
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("imagen").value = producto.imagen;

    productoEditando = producto.id;
}

async function listarProductos() {
    try {
        const respuesta = await fetch(`${API_URL}/productos`);
        const productos = await respuesta.json();

        tablaProductos.innerHTML = "";

        productos.forEach((producto) => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar" type="button">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-eliminar" type="button">
                        Eliminar
                    </button>
                </td>
            `;

            fila.querySelector(".btn-editar").addEventListener("click", () => {
                llenarFormulario(producto);
            });

            fila.querySelector(".btn-eliminar").addEventListener("click", () => {
                eliminarProducto(producto.id);
            });

            tablaProductos.appendChild(fila);
        });
    } catch (error) {
        mostrarMensaje("No se pudieron cargar los productos", true);
    }
}

async function guardarProducto(producto) {
    const respuesta = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo guardar el producto");
    }
}

async function actualizarProducto(id, producto) {
    const respuesta = await fetch(`${API_URL}/productos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el producto");
    }
}

async function eliminarProducto(id) {
    const confirmar = confirm("Deseas eliminar este producto?");

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/productos/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo eliminar el producto");
        }

        mostrarMensaje("Producto eliminado correctamente");
        listarProductos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}

formProducto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const producto = obtenerDatosFormulario();

    try {
        if (productoEditando) {
            await actualizarProducto(productoEditando, producto);
            mostrarMensaje("Producto actualizado correctamente");
        } else {
            await guardarProducto(producto);
            mostrarMensaje("Producto guardado correctamente");
        }

        limpiarFormulario();
        listarProductos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
});

listarProductos();
