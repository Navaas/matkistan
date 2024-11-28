import express from "express";
import { getCategories, getRecipesByCategory } from "./category-handlers.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:categoryId/recipes", getRecipesByCategory);

export default categoryRouter;
