import express from "express";
// import { isLoggedIn } from "../../middlewares.js";
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
recipeRouter.post("/createRecipe", createRecipesWithImage);
recipeRouter.put("/updateRecipe/:id", updateRecipe);
recipeRouter.delete("/recipes/:id", deleteRecipe);
recipeRouter.get("/my-recipes", getUserRecipes);
recipeRouter.post("/like", likeRecipe);
recipeRouter.get("/my-favourite", getLikedRecipes);
recipeRouter.get("/getSingelRecipe/:id", getSingelRecipe);
recipeRouter.post("/like/status", getLikeStatus);

export default recipeRouter;
