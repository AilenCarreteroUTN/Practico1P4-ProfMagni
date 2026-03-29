import type { Request, Response } from "express";
import pool from "../database/connection.js";

export const login = async (req: Request, res: Response) => {
    try {
        const { user, pass } = req.body;
        
        const result = await pool.query(
        "SELECT * FROM usuarios_utn WHERE usuario = $1 AND clave = $2",
        [user, pass]
        );

        if (result.rows.length > 0) {
            const loggedUser = result.rows[0];
            if (loggedUser.bloqueado === 'Y') {
                return res.json({
                    respuesta: "ERROR",
                    mje: "Comuniquese con el administrador, el usuario se encuentra bloqueado"
                });
            }

            res.json({
                respuesta: "OK",
                mje: `Ingreso Valido. Usuario ${user}`
            });
        } else {
        res.json({
            respuesta: "ERROR",
            mje: "Ingreso Invalido, usuario y/o clave incorrecta"
        });
        }

    } catch (error) {
        console.error("Error en el login:", error);
        res.json({
        respuesta: "ERROR",
        mje: "Error interno del servidor"
        });
    }
};