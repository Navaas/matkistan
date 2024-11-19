// src/user/user-handlers.js
import User from "./user-model.js";

// Funktion för att hämta alla användare
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Hämta alla användare från databasen

    if (!users || users.length === 0) {
      console.log("Inga användare hittades.");
      return res.status(404).json({ message: "No users found" });
    }

    console.log("Användare från databasen:", JSON.stringify(users, null, 2));
    res.json(users); // Skicka användardata som JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};
