import express from "express";
import {
  createRecipesWithImage,
  deleteRecipe,
  getAllRecipes,
  updateRecipe,
} from "./recipe-handlers.js";

const recipeRouter = express.Router();

recipeRouter.get("/recipes", getAllRecipes);
recipeRouter.post("/recipes", createRecipesWithImage);
recipeRouter.put("/recipes/:id", updateRecipe);
recipeRouter.delete("/recipes/:id", deleteRecipe);

export default recipeRouter;
