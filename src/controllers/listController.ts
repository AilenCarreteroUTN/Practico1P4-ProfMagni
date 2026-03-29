import type { Request, Response } from "express";
import pool from "../database/connection.js";

export const procesarLista = async (req: Request, res: Response) => {
    try {
        const { action } = req.query;

        // Endpoint para realizar la búsqueda.
        if (action === "BUSCAR") {
        const { usuario } = req.query;

        if (usuario) {
            const result = await pool.query(
            "SELECT id, usuario, bloqueado, apellido, nombre FROM usuarios_utn WHERE usuario LIKE $1 ORDER BY id ASC",
            [`%${usuario}%`]
            );
            return res.json(result.rows);
        } else {
            const result = await pool.query("SELECT id, usuario, bloqueado, apellido, nombre FROM usuarios_utn ORDER BY id ASC");
            return res.json(result.rows);
        }
    }

    // Endpoint para bloquear o desbloquear un usuario.
    if (action === "BLOQUEAR") {
        const { idUser, estado } = req.query;
        
        const userCheck = await pool.query("SELECT bloqueado FROM usuarios_utn WHERE id = $1", [idUser]);
        if (userCheck.rows.length > 0) {
            if (userCheck.rows[0].bloqueado === estado) {
                const estadoText = estado === 'Y' ? 'bloqueado' : 'desbloqueado';
                return res.json({
                    respuesta: "ERROR",
                    mje: `El usuario ya se encuentra ${estadoText}`
                });
            }
        }

        const result = await pool.query(
            "UPDATE usuarios_utn SET bloqueado = $1 WHERE id = $2",
            [estado, idUser]
        );

        return res.json({
            respuesta: "OK",
            mje: estado === 'Y' ? "¡El bloqueo se ha realizado con éxito!" : "¡El desbloqueo se ha realizado con éxito!"
        });
        }
        return res.json({ respuesta: "ERROR", mje: "Acción no válida" });

    } catch (error: any) {
        console.error("Error en lista:", error);
        return res.json({
        respuesta: "ERROR",
        mje: error.message || "Error interno"
        });
    }
};