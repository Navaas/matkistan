import express from "express";
import {
  getCategories,
  getRecipesByCategory,
  searchRecipesByTitle,
} from "./category-handlers.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:categoryId/recipes", getRecipesByCategory);
categoryRouter.get("/search", searchRecipesByTitle);

export default categoryRouter;
