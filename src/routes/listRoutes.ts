import { Router } from "express";
import { procesarLista } from "../controllers/listController.js";

const router = Router();

router.get("/", procesarLista);

export default router;