const URL_PRODUCTOS = "http://localhost:3000/productos";
const catalogoProductos = document.getElementById("catalogoProductos");

function crearTexto(etiqueta, valor) {
    const parrafo = document.createElement("p");
    parrafo.className = "card-text mb-2";
    parrafo.textContent = `${etiqueta}: ${valor}`;
    return parrafo;
}

function mostrarMensajeCatalogo(mensaje) {
    catalogoProductos.innerHTML = "";

    const columna = document.createElement("div");
    columna.className = "col-12";

    const alerta = document.createElement("div");
    alerta.className = "alert alert-info text-center mb-0";
    alerta.textContent = mensaje;

    columna.appendChild(alerta);
    catalogoProductos.appendChild(columna);
}

function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col-sm-6 col-lg-4";

    const tarjeta = document.createElement("div");
    tarjeta.className = "card h-100";

    const imagen = document.createElement("img");
    imagen.className = "card-img-top";
    imagen.src = producto.imagen || "https://placehold.co/600x400/e9ecef/212529?text=Producto";
    imagen.alt = producto.nombre || "Imagen del producto";

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const categoria = document.createElement("span");
    categoria.className = "badge text-bg-primary align-self-start mb-2";
    categoria.textContent = producto.categoria;

    const nombre = document.createElement("h2");
    nombre.className = "card-title h5";
    nombre.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement("p");
    precio.className = "fw-bold mt-auto mb-2";
    precio.textContent = `Precio: $${producto.precio}`;

    const stock = crearTexto("Stock", producto.stock);

    cuerpo.appendChild(categoria);
    cuerpo.appendChild(nombre);
    cuerpo.appendChild(descripcion);
    cuerpo.appendChild(precio);
    cuerpo.appendChild(stock);

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
}

async function cargarProductos() {
    try {
        const respuesta = await fetch(URL_PRODUCTOS);

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar la lista de productos");
        }

        const productos = await respuesta.json();

        if (productos.length === 0) {
            mostrarMensajeCatalogo("No hay productos registrados.");
            return;
        }

        catalogoProductos.innerHTML = "";

        productos.forEach((producto) => {
            const tarjeta = crearTarjetaProducto(producto);
            catalogoProductos.appendChild(tarjeta);
        });
    } catch (error) {
        console.error(error);
        mostrarMensajeCatalogo("No se pudieron cargar los productos.");
    }
}

cargarProductos();
