const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Permitir comunicación con frontend
app.use(cors());
app.use(express.json());

// Configuración de conexión
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "contactos_db"
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor conectado a MySQL");
});


// ✅ RUTA PARA GUARDAR DATOS
app.post("/guardar", (req, res) => {

    const { nombre, correo, telefono, mensaje } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!nombre || !correo || !telefono || !mensaje) {
        return res.status(400).send("Datos incompletos");
    }

    const sql = "INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)";

    db.query(sql, [nombre, correo, telefono, mensaje], (err, result) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).send("Error en servidor");
        }

        console.log("Registro insertado:", result);
        res.send("Datos guardados correctamente");
    });
});

// Ruta para validar ingreso administrativo
app.post("/login", (req, res) => {
    const { correo, password } = req.body;
    const correoLimpio = correo ? correo.trim() : "";
    const passwordLimpio = password ? password.trim() : "";

    if (!correoLimpio || !passwordLimpio) {
        return res.status(400).json({
            ok: false,
            mensaje: "El correo y la contrasena son obligatorios"
        });
    }

    const sql = "SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ? AND password = ? LIMIT 1";

    db.query(sql, [correoLimpio, passwordLimpio], (err, results) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).json({
                ok: false,
                mensaje: "Error en el servidor"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                ok: false,
                mensaje: "Credenciales incorrectas"
            });
        }

        res.json({
            ok: true,
            mensaje: "Ingreso correcto",
            usuario: results[0]
        });
    });
});

// Validar datos obligatorios de productos
function validarProducto(producto) {
    const { nombre, descripcion, precio, categoria, stock, imagen } = producto;

    if (!nombre || !descripcion || precio === undefined || !categoria || stock === undefined || !imagen) {
        return "Todos los campos del producto son obligatorios";
    }

    if (nombre.trim() === "" || descripcion.trim() === "" || categoria.trim() === "" || imagen.trim() === "") {
        return "Los campos de texto no pueden estar vacios";
    }

    if (isNaN(precio) || Number(precio) < 0) {
        return "El precio debe ser un numero valido";
    }

    if (isNaN(stock) || Number(stock) < 0) {
        return "El stock debe ser un numero valido";
    }

    return null;
}

// Listar productos
app.get("/productos", (req, res) => {
    const sql = "SELECT * FROM productos";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).send("Error en servidor");
        }

        res.json(results);
    });
});

// Registrar producto
app.post("/productos", (req, res) => {
    const errorValidacion = validarProducto(req.body);

    if (errorValidacion) {
        return res.status(400).send(errorValidacion);
    }

    const { nombre, descripcion, precio, categoria, stock, imagen } = req.body;
    const sql = "INSERT INTO productos (nombre, descripcion, precio, categoria, stock, imagen) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [nombre, descripcion, precio, categoria, stock, imagen], (err, result) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).send("Error en servidor");
        }

        res.status(201).json({
            mensaje: "Producto registrado correctamente",
            id: result.insertId
        });
    });
});

// Actualizar producto
app.put("/productos/:id", (req, res) => {
    const { id } = req.params;
    const errorValidacion = validarProducto(req.body);

    if (errorValidacion) {
        return res.status(400).send(errorValidacion);
    }

    const { nombre, descripcion, precio, categoria, stock, imagen } = req.body;
    const sql = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, stock = ?, imagen = ? WHERE id = ?";

    db.query(sql, [nombre, descripcion, precio, categoria, stock, imagen, id], (err, result) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).send("Error en servidor");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Producto no encontrado");
        }

        res.send("Producto actualizado correctamente");
    });
});

// Eliminar producto
app.delete("/productos/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM productos WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).send("Error en servidor");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Producto no encontrado");
        }

        res.send("Producto eliminado correctamente");
    });
});


// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
