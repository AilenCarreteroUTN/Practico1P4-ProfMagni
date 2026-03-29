document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const usersTbody = document.getElementById("users-tbody");
    const errorMessage = document.getElementById("error-message");

    // Función para procesar y buscar usuarios
    const fetchUsers = async (searchTerm = "") => {
        try {
            // Construir la URL llamando a listController con action=BUSCAR
            let url = "http://localhost:3000/Practico1/list?action=BUSCAR";
            if (searchTerm) {
                url += `&usuario=${encodeURIComponent(searchTerm)}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            // Limpiar resultados anteriores y ocultar error
            usersTbody.innerHTML = "";
            errorMessage.style.display = "none";

            // Si es un array vacío, mostramos el mensaje de que no se encontró
            if (!Array.isArray(data) || data.length === 0) {
                errorMessage.style.display = "block";
                return;
            }

            // Llenar tabla
            data.forEach(user => {
                const tr = document.createElement("tr");

                // Color dinámico según el estado
                const bgColor = user.bloqueado === 'Y' ? '#fd9f8b' : '#cef8c6';
                tr.style.backgroundColor = bgColor;

                tr.innerHTML = `
                    <td>${user.id || ''}</td>
                    <td>${user.usuario || ''}</td>
                    <td>${user.bloqueado || ''}</td>
                    <td>${user.apellido || ''}</td>
                    <td>${user.nombre || ''}</td>
                    <td>
                        <button class="icon-btn" onclick="toggleStatus(${user.id}, 'Y')">
                            <img src="./resources/icons8-pulgar-para-arriba-64.png" alt="Bloquear" width="40">
                        </button>
                    </td>
                    <td>
                        <button class="icon-btn" onclick="toggleStatus(${user.id}, 'N')">
                            <img src="./resources/icons8-me-gusta-64.png" alt="Desbloquear" width="40">
                        </button>
                    </td>
                `;
                usersTbody.appendChild(tr);
            });

        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            errorMessage.textContent = "Error al conectar con el servidor.";
            errorMessage.style.display = "block";
        }
    };

    // Función para bloquear o desbloquear
    window.toggleStatus = async (idUser, estado) => {
        try {
            const url = `http://localhost:3000/Practico1/list?action=BLOQUEAR&idUser=${idUser}&estado=${estado}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.respuesta === "OK") {
                alert(result.mje);
                fetchUsers(searchInput.value.trim());
            } else {
                alert("Error al actualizar: " + result.mje);
            }
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            alert("Error al intentar comunicarse con el servidor.");
        }
    };

    // Al iniciar, cargar todos los usuarios
    fetchUsers();

    // Eventos de búsqueda
    searchBtn.addEventListener("click", () => {
        fetchUsers(searchInput.value.trim());
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            fetchUsers(searchInput.value.trim());
        }
    });

    searchInput.addEventListener("input", (e) => {
        if (e.target.value.trim() === "") {
            fetchUsers("");
        }
    });
});