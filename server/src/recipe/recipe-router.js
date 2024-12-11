import express from "express";
import { isLoggedIn } from "../../middlewares.js";
import {
  createRecipesWithImage,
  deleteRecipe,
  getAllRecipes,
  getLikedRecipes,
  getLikeStatus,
  getSingelRecipe,
  getUserRecipes,
  likeRecipe,
  updateRecipe,
} from "./recipe-handlers.js";

const recipeRouter = express.Router();

recipeRouter.get("/getAllRecipes", getAllRecipes);
recipeRouter.post("/createRecipe", isLoggedIn, createRecipesWithImage);
recipeRouter.put("/updateRecipe/:id", isLoggedIn, updateRecipe);
recipeRouter.delete("/recipes/:id", isLoggedIn, deleteRecipe);
recipeRouter.get("/my-recipes", isLoggedIn, getUserRecipes);
recipeRouter.post("/like", isLoggedIn, likeRecipe);
recipeRouter.get("/my-favourite", isLoggedIn, getLikedRecipes);
recipeRouter.get("/getSingelRecipe/:id", getSingelRecipe);
recipeRouter.post("/like/status", isLoggedIn, getLikeStatus);

export default recipeRouter;
