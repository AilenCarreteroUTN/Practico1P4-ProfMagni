import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import listRoutes from "./routes/listRoutes.js";

const app = express();

app.use(express.json());

// Sirviendo el frontend directamente desde Express para evitar problemas cruzados (CORS)
app.use('/Practico1', express.static('frontend'));

app.use("/Practico1/auth", authRoutes);
app.use("/Practico1/user", userRoutes);
app.use("/Practico1/list", listRoutes);

app.listen(3000, () => {
    console.log("Servidor en puerto 3000", 3000);
})