import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import recipeRouter from "./src/recipe/recipe-router.js";
import userRouter from "./src/user/user-router.js";

const app = express();

// Middleware-konfiguration
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
dotenv.config();

// Routing-konfiguration
app.use("/", userRouter);
app.use("/", recipeRouter);

export default app;
