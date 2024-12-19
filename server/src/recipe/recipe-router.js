import express from "express";
// import { isLoggedIn } from "../../middlewares.js";
import { authenticateToken } from "../../middlewares.js";
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
recipeRouter.post("/createRecipe", authenticateToken, createRecipesWithImage);
recipeRouter.put("/updateRecipe/:id", updateRecipe);
recipeRouter.delete("/recipes/:id", authenticateToken, deleteRecipe);
recipeRouter.get("/my-recipes", authenticateToken, getUserRecipes);
recipeRouter.post("/like", authenticateToken, likeRecipe);
recipeRouter.get("/my-favourite", authenticateToken, getLikedRecipes);
recipeRouter.get("/getSingelRecipe/:id", getSingelRecipe);
recipeRouter.post("/like/status", authenticateToken, getLikeStatus);

export default recipeRouter;
