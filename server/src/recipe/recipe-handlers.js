import express from "express";
import Recipe from "./recipe-model.js";

// Funktion för att hämta alla recept
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();

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
};

const recipeRouter = express.Router();

recipeRouter.post("/", async (req, res) => {
  console.log("POST /recipes hit with body:", req.body); // Loggar inkommande data
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    req.body;

  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      difficulty,
      cookingTime,
      imageUrl, // Här sparas bildens ID
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Failed to create recipe" });
  }
});

export default recipeRouter;
