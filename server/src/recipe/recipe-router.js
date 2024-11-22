import express from "express";
import {
  createRecipesWithImage,
  deleteRecipe,
  getAllRecipes,
} from "./recipe-handlers.js";

const recipeRouter = express.Router();

recipeRouter.get("/recipes", getAllRecipes);
recipeRouter.post("/recipes", createRecipesWithImage);
recipeRouter.delete("/recipes/:id", deleteRecipe);

export default recipeRouter;
