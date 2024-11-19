// src/user/user-router.js
import express from "express";
import { getUsers } from "./user-handlers.js"; // Importera handler-funktionen

const router = express.Router();

// Rutt för att hämta alla användare
router.get("/users", getUsers);

export default router;
