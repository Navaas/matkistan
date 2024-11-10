import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
dotenv.config();

// Model för ett recept
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  difficulty: String,
  cookingTime: Number,
});

const recipe = mongoose.model("recipes", recipeSchema);

// GET-anrop för att hämta alla recept
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await recipe.find();

    if (!recipes || recipes.length === 0) {
      console.log("Inga recept hittades.");
      return res.status(404).json({ message: "No recipes found" });
    }

    console.log("Recept från databasen:", JSON.stringify(recipes, null, 2));
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

// Anslut till rätt databas
async function main() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Successfully connected to MongoDB!");

    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

main().catch((error) => console.error(error));
