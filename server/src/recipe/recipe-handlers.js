import express from "express";
import { RecipeModel } from "./recipe-model.js";

const recipeRouter = express.Router();

// Funktion för att hämta alla recept
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find(); // Använd RecipeModel

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

export const createNewRecipe = async (recipeData) => {
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    recipeData;

  const newRecipe = new RecipeModel({
    title,
    ingredients,
    steps,
    difficulty,
    cookingTime,
    imageUrl,
  });

  await newRecipe.save();
  return newRecipe;
};

export const createRecipesWithImage = async (req, res) => {
  try {
    const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
      req.body;
    console.log("Inkommande data:", req.body);
    // Skapa en ny post i databasen
    const newRecipe = new RecipeModel({
      title,
      ingredients,
      steps,
      difficulty,
      cookingTime,
      imageUrl, // Lägg till bildens URL eller ID
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params; // Hämtar id från URL:en

  try {
    // Försöker hitta och ta bort receptet
    const recipe = await RecipeModel.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully", recipe });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

export default recipeRouter;
