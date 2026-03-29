## **Práctico n°1:** Aplicación FullStack.

El Trabajo Practico N° 1 consiste en el desarrollo de una aplicación Full Stack, gestionando tanto la parte visible para el usuario (Frontend) como la lógica del servidor, bases de datos y APIs (Backend). Este proyecto fue desarrollado para la cátedra de Programación 4 de la Universidad Tecnológica Nacional (UTN) Facultad Regional Mendoza.

---

### 🛠️ **Tecnologías y conceptos cubiertos.**

* **Backend RESTful:** Desarrollo de una API REST utilizando Node.js y TypeScript para procesar las peticiones emitidas desde el cliente y retornar las respuestas correspondientes en formato JSON.
* **Frontend Nativo:** Implementación de la interfaz web haciendo uso únicamente de HTML, CSS y JavaScript nativo, respetando estrictamente la restricción de no utilizar librerías ni frameworks externos
* **Acceso a Datos:** Codificación de la capa de acceso a datos integrando una base de datos relacional PostgreSQL (utn_db) para gestionar e interactuar con la tabla usuarios_utn.
* **Autenticación y Redirección:** Creación del archivo login.html que envía credenciales al backend, manejando la redirección automática a la vista principal en caso de éxito o mostrando mensajes de error dinámicos por pantalla en caso de rechazo.
* **Renderizado Dinámico y Búsqueda:** Generación de una grilla de usuarios en lista.html a partir de los datos obtenidos del backend. Incorporación de filtros de búsqueda que aplican consultas LIKE directamente en la base de datos.
* **Gestión de Estados y UI:** Implementación de botones de acción para modificar el estado del usuario enviando parámetros a la API (Bloquear/Desbloquear). Uso de reglas de CSS nativo para reflejar dichos estados, aplicando el color de fondo #fd9f8b a las filas bloqueadas y #cef8c6 a las filas no bloqueadas. 

---

### 🚀 **¿Cómo ejecutarlo y ponerlo a prueba?**

Para poner a prueba la aplicación en tu entorno local, sigue estos pasos:

1. **Clonar el repositorio:** Descarga el proyecto y abre una terminal en la carpeta raíz.
2. **Preparar la Base de Datos:** En tu gestor de PostgreSQL, crea una base de datos llamada `utn_db` y ejecuta el script SQL de inicialización para crear la tabla `usuarios_utn` e insertar los datos de prueba pertinentes.
3. **Configurar Credenciales:** En el archivo de conexión de la base de datos (dentro de `src/database/connection.ts`), reemplaza el campo del password por tu contraseña local de PostgreSQL.
4. **Instalar las dependencias:** npm install
5. **Ejecutar el servidor local:** npm run dev
6. **Probar la Aplicación:** Abre tu navegador web de preferencia e ingresa a `http://localhost:3000/login.html` para acceder al sistema.