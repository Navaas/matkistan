import express from "express";
import { RecipeModel } from "./recipe-model.js";

const recipeRouter = express.Router();

/* Get all recipes */
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find();

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

/* Create new recipes */
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

/* Create new recipes with image */
export const createRecipesWithImage = async (req, res) => {
  try {
    const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
      req.body;
    console.log("Inkommande data:", req.body);

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

/* Update recipes, found by Id */
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    req.body;

  try {
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      {
        title,
        ingredients,
        steps,
        difficulty,
        cookingTime,
        imageUrl,
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
    console.log("Uppdaterat recept:", updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

/* Delete recipe with ID */
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
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
