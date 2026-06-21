// Verificar si el usuario inicio sesion
const usuario = localStorage.getItem("usuario");

if (!usuario) {
    alert("Debes iniciar sesion para ingresar al panel administrativo.");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function() {
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function() {
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
        });
    }
});
