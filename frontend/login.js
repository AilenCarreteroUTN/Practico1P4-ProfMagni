document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        
        errorMessage.textContent = "";

        const user = document.getElementById("user").value.trim();
        const pass = document.getElementById("pass").value.trim();

        try {
            // Realizamos la petición POST al backend
            const response = await fetch("http://localhost:3000/Practico1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user, pass })
            });

            const data = await response.json();

            // Lógica para redireccionar a la lista en caso de que esté todo correcto o mostrar mensaje de error.
            if (data.respuesta === "OK") {
                window.location.href = "lista.html";
            } else if (data.respuesta === "ERROR") {
                errorMessage.textContent = data.mje;
            } else {
                errorMessage.textContent = "Respuesta no esperada del servidor.";
            }

        } catch (error) {
            console.error("Error al realizar la petición:", error);
            errorMessage.textContent = "Error de conexión con el servidor.";
        }
    });
});
