import express from "express";
import { createRecipesWithImage, getAllRecipes } from "./recipe-handlers.js";

const recipeRouter = express.Router();

recipeRouter.get("/recipes", getAllRecipes);
recipeRouter.post("/recipes", createRecipesWithImage);

export default recipeRouter;
