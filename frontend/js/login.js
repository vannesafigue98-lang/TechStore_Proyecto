console.log("Login cargado correctamente");

// Capturar formulario de login
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();
        const mensajeLogin = document.getElementById("mensajeLogin");

        if (correo === "" || password === "") {
            mensajeLogin.className = "alert alert-warning mt-4 mb-0";
            mensajeLogin.textContent = "Debes ingresar correo y contrasena.";
            return;
        }

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo,
                password: password
            })
        })
        .then(respuesta => respuesta.json())
        .then(data => {
            if (data.ok) {
                localStorage.setItem("usuario", JSON.stringify(data.usuario));

                mensajeLogin.className = "alert alert-success mt-4 mb-0";
                mensajeLogin.textContent = data.mensaje;

                setTimeout(function() {
                    window.location.href = "admin-productos.html";
                }, 1000);
            } else {
                mensajeLogin.className = "alert alert-danger mt-4 mb-0";
                mensajeLogin.textContent = data.mensaje;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mensajeLogin.className = "alert alert-danger mt-4 mb-0";
            mensajeLogin.textContent = "No se pudo conectar con el servidor.";
        });
    });
}
