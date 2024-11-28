import express from "express";
import { getCategories } from "./category-handlers.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);

export default categoryRouter;
