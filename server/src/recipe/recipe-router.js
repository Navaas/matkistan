import express from "express";
import { getAllRecipes } from "./recipe-handlers.js";

const recipeRouter = express.Router();

recipeRouter.get("/recipes", getAllRecipes);

export default recipeRouter;
