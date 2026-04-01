import type { Request, Response } from "express";
import pool from "../database/connection.js";

// Métodos CRUD para Usuario

// Crear un nuevo usuario.
export const createUser = async (req: Request, res: Response) => {
    try {
        const { usuario, clave, apellido, nombre } = req.body;

        if (!usuario || !clave || !apellido || !nombre) {
            return res.status(400).json({ respuesta: "ERROR", mje: "Todos los campos (usuario, clave, apellido, nombre) son obligatorios" });
        }

        // Por defecto, al crearlo lo ponemos como no bloqueado ('N')
        const result = await pool.query(
        "INSERT INTO usuarios_utn (usuario, clave, apellido, nombre, bloqueado) VALUES ($1, $2, $3, $4, 'N') RETURNING id, usuario, apellido, nombre, bloqueado",
        [usuario, clave, apellido, nombre]
        );
        return res.status(201).json({ respuesta: "OK", mje: "Usuario creado exitosamente", data: result.rows[0] });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({ respuesta: "ERROR", mje: "Error al crear el usuario" });
    }
};

// Leer un nuevo usuario mediante su ID.
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT id, usuario, apellido, nombre, bloqueado FROM usuarios_utn WHERE id = $1", [id]);
        
        if (result.rows.length > 0) {
        return res.status(200).json(result.rows[0]);
        } else {
        return res.status(404).json({ respuesta: "ERROR", mje: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        return res.status(500).json({ respuesta: "ERROR", mje: "Error al buscar el usuario" });
    }
};

// Actualizar un usuario.
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { usuario, clave, apellido, nombre } = req.body;
        
        if (!usuario || !clave || !apellido || !nombre) {
            return res.status(400).json({ respuesta: "ERROR", mje: "Todos los campos (usuario, clave, apellido, nombre) son obligatorios" });
        }

        const result = await pool.query(
        "UPDATE usuarios_utn SET usuario = $1, clave = $2, apellido = $3, nombre = $4 WHERE id = $5 RETURNING id, usuario, apellido, nombre, bloqueado",
        [usuario, clave, apellido, nombre, id]
        );
        
        if (result.rowCount && result.rowCount > 0) {
        return res.status(200).json({ respuesta: "OK", mje: "Usuario actualizado", data: result.rows[0] });
        } else {
        return res.status(404).json({ respuesta: "ERROR", mje: "Usuario no encontrado para actualizar" });
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({ respuesta: "ERROR", mje: "Error al actualizar el usuario" });
    }
};

// Eliminar a un usuario.
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM usuarios_utn WHERE id = $1", [id]);
        
        if (result.rowCount && result.rowCount > 0) {
        return res.status(200).json({ respuesta: "OK", mje: "Usuario eliminado correctamente" });
        } else {
        return res.status(404).json({ respuesta: "ERROR", mje: "Usuario no encontrado para eliminar" });
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({ respuesta: "ERROR", mje: "Error al eliminar el usuario" });
    }
};