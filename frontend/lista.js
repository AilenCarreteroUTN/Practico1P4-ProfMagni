document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const usersTbody = document.getElementById("users-tbody");
    const errorMessage = document.getElementById("error-message");

    const fetchUsers = async (searchTerm = "") => {
        try {
            let url = "http://localhost:3000/Practico1/list?action=BUSCAR";
            if (searchTerm) {
                url += `&usuario=${encodeURIComponent(searchTerm)}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            usersTbody.innerHTML = "";
            errorMessage.style.display = "none";

            if (!Array.isArray(data) || data.length === 0) {
                errorMessage.style.display = "block";
                return;
            }

            data.forEach(user => {
                const tr = document.createElement("tr");

                const isBlocked = user.bloqueado === 'Y';
                const barColor = isBlocked ? '#991b1b' : '#16a34a';

                tr.innerHTML = `
                    <td style="border-left: 4px solid ${barColor};">${user.id || ''}</td>
                    <td>${user.usuario || ''}</td>
                    <td>
                        <div class="password-cell">
                            <span class="password-text" data-visible="false">${'•'.repeat((user.clave || '').length || 6)}</span>
                            <button class="icon-btn toggle-pass-btn" onclick="togglePassword(this, '${(user.clave || '').replace(/'/g, "\\'")}')"
                                title="Mostrar/Ocultar contraseña">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#566573" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${user.nombre || ''}</td>
                    <td>
                        <div class="actions-cell">
                            <div class="left-actions">
                                <button class="icon-btn" onclick="toggleStatus(${user.id}, 'N')" title="Desbloquear">
                                    <img src="./resources/icons8-me-gusta-64.png" alt="Desbloquear" class="icon-action-image">
                                </button>
                                <button class="icon-btn" onclick="toggleStatus(${user.id}, 'Y')" title="Bloquear">
                                    <img src="./resources/icons8-pulgar-para-arriba-64.png" alt="Bloquear" class="icon-action-image">
                                </button>
                            </div>
                            <button class="icon-btn" onclick="openEditModal(${user.id})" title="Editar">
                                <img src="./resources/edit-button.png" alt="Editar" class="icon-action-image">
                            </button>
                        </div>
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

    window.toggleStatus = async (idUser, estado) => {
        try {
            const url = `http://localhost:3000/Practico1/list?action=BLOQUEAR&idUser=${idUser}&estado=${estado}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.respuesta === "OK") {
                fetchUsers(searchInput.value.trim());
            } else {
                alert("Error al actualizar: " + result.mje);
            }
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            alert("Error al intentar comunicarse con el servidor.");
        }
    };

    window.deleteUser = async (idUser) => {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
        try {
            const url = `http://localhost:3000/Practico1/user/${idUser}`;
            const response = await fetch(url, { method: 'DELETE' });
            const result = await response.json();

            if (result.respuesta === "OK") {
                fetchUsers(searchInput.value.trim());
            } else {
                alert("Error al eliminar: " + result.mje);
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Error al intentar comunicarse con el servidor.");
        }
    };

    // ===== Toggling password visibility in grid =====
    window.togglePassword = (btn, realPassword) => {
        const span = btn.parentElement.querySelector('.password-text');
        const isVisible = span.getAttribute('data-visible') === 'true';
        if (isVisible) {
            span.textContent = '•'.repeat(realPassword.length || 6);
            span.setAttribute('data-visible', 'false');
        } else {
            span.textContent = realPassword;
            span.setAttribute('data-visible', 'true');
        }
    };

    // ===== Modal de edición =====
    const editModal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const btnCancelEdit = document.getElementById("btn-cancel-edit");
    const modalDeleteBtn = document.getElementById("modal-delete-btn");

    window.openEditModal = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/Practico1/user/${userId}`);
            const user = await response.json();

            if (user.respuesta === "ERROR") {
                alert(user.mje);
                return;
            }

            document.getElementById("edit-id").value = user.id;
            document.getElementById("edit-usuario").value = user.usuario || '';
            document.getElementById("edit-clave").value = '';
            document.getElementById("edit-apellido").value = user.apellido || '';
            document.getElementById("edit-nombre").value = user.nombre || '';

            editModal.style.display = "flex";
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            alert("Error al cargar los datos del usuario.");
        }
    };

    const closeEditModal = () => {
        editModal.style.display = "none";
    };

    btnCancelEdit.addEventListener("click", closeEditModal);

    editModal.addEventListener("click", (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("edit-id").value;
        const usuario = document.getElementById("edit-usuario").value.trim();
        const clave = document.getElementById("edit-clave").value;
        const apellido = document.getElementById("edit-apellido").value.trim();
        const nombre = document.getElementById("edit-nombre").value.trim();

        if (!usuario || !clave || !apellido || !nombre) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/Practico1/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, clave, apellido, nombre })
            });
            const result = await response.json();

            if (result.respuesta === "OK") {
                closeEditModal();
                fetchUsers(searchInput.value.trim());
            } else {
                alert("Error al actualizar: " + result.mje);
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert("Error al intentar comunicarse con el servidor.");
        }
    });

    modalDeleteBtn.addEventListener("click", async () => {
        const id = document.getElementById("edit-id").value;
        if (!confirm("¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return;

        try {
            const response = await fetch(`http://localhost:3000/Practico1/user/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.respuesta === "OK") {
                closeEditModal();
                fetchUsers(searchInput.value.trim());
            } else {
                alert("Error al eliminar: " + result.mje);
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Error al intentar comunicarse con el servidor.");
        }
    });

    // ===== Modal de creación =====
    const createModal = document.getElementById("create-modal");
    const createForm = document.getElementById("create-form");
    const btnCancelCreate = document.getElementById("btn-cancel-create");

    const openCreateModal = () => {
        document.getElementById("create-usuario").value = '';
        document.getElementById("create-clave").value = '';
        document.getElementById("create-apellido").value = '';
        document.getElementById("create-nombre").value = '';
        createModal.style.display = "flex";
    };

    const closeCreateModal = () => {
        createModal.style.display = "none";
    };

    btnCancelCreate.addEventListener("click", closeCreateModal);

    createModal.addEventListener("click", (e) => {
        if (e.target === createModal) {
            closeCreateModal();
        }
    });

    createForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = document.getElementById("create-usuario").value.trim();
        const clave = document.getElementById("create-clave").value;
        const apellido = document.getElementById("create-apellido").value.trim();
        const nombre = document.getElementById("create-nombre").value.trim();

        if (!usuario || !clave || !apellido || !nombre) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/Practico1/user/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, clave, apellido, nombre })
            });
            const result = await response.json();

            if (result.respuesta === "OK") {
                closeCreateModal();
                fetchUsers(searchInput.value.trim());
            } else {
                alert("Error al crear: " + result.mje);
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
            alert("Error al intentar comunicarse con el servidor.");
        }
    });

    fetchUsers();

    if(searchBtn) {
        searchBtn.addEventListener("click", () => {
            fetchUsers(searchInput.value.trim());
        });
    }

    if(searchInput) {
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
    }

    // Lógica del menú desplegable del usuario
    const avatarBtn = document.getElementById("user-avatar-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (avatarBtn && dropdownMenu) {
        avatarBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        document.addEventListener("click", () => {
            if (dropdownMenu.classList.contains("show")) {
                dropdownMenu.classList.remove("show");
            }
        });

        dropdownMenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    const btnNuevoUsuario = document.getElementById("btn-nuevo-usuario");
    if (btnNuevoUsuario) {
        btnNuevoUsuario.addEventListener("click", () => {
            dropdownMenu.classList.remove("show");
            openCreateModal();
        });
    }
});