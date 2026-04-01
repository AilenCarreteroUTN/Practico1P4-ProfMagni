import { Pool } from "pg";

// Configuración de conexión a la base de datos PostgreSQL.
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "utn_db",
    password: "4251",
    port: 5432,
});

pool.connect()
    .then(() => console.log("¡Conectado a PostgreSQL con éxito!"))
    .catch((err) => console.error("Error conectando a la base de datos", err.stack));

export default pool;