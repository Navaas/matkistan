import express from "express";
import { isLoggedIn } from "../../middlewares.js";
import {
  createRecipesWithImage,
  deleteRecipe,
  getAllRecipes,
  getLikedRecipes,
  getUserRecipes,
  likeRecipe,
  updateRecipe,
} from "./recipe-handlers.js";

const recipeRouter = express.Router();

recipeRouter.get("/recipes", getAllRecipes);
recipeRouter.post("/recipes", isLoggedIn, createRecipesWithImage);
recipeRouter.put("/recipes/:id", updateRecipe);
recipeRouter.delete("/recipes/:id", deleteRecipe);
recipeRouter.get("/my-recipes", isLoggedIn, getUserRecipes);
recipeRouter.post("/like", isLoggedIn, likeRecipe);
recipeRouter.get("/my-favourite", isLoggedIn, getLikedRecipes);

export default recipeRouter;
