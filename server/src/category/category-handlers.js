import express from "express";
import { RecipeModel } from "../recipe/recipe-model.js";
import { CategoryModel } from "./category-model.js";

const categoryRouter = express.Router();
const categories = ["Pasta", "Bakning", "Vegetariskt", "Kött", "Soppor"];

export const createCategories = async () => {
  for (const name of categories) {
    const existingCategory = await CategoryModel.findOne({ name });
    if (!existingCategory) {
      await CategoryModel.create({ name });
      console.log(`Kategori '${name}' skapad.`);
    }
  }
  console.log("Kategorier skapade eller redan existerande");
};

// GET /categories - Hämta alla kategorier
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find(); // Hämta alla kategorier
    res.status(200).json(categories); // Returnera kategorierna som JSON
  } catch (error) {
    console.error("Fel vid hämtning av kategorier:", error);
    res.status(500).json({ error: "Kunde inte hämta kategorier" });
  }
};

export const getRecipesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori inte hittad" });
    }

    const recipes = await RecipeModel.find({ categories: categoryId }).populate(
      "categories"
    );

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Fel vid hämtning av recept för kategori:", error);
    res.status(500).json({ error: "Kunde inte hämta recept" });
  }
};

export const searchRecipesByTitle = async (req, res) => {
  try {
    const searchQuery = req.query.title; // Hämta söktexten från query-parametern

    if (!searchQuery) {
      return res.status(400).json({ message: "Ingen söktext angiven" });
    }

    const recipes = await RecipeModel.find({
      title: { $regex: searchQuery, $options: "i" }, // "i" gör sökningen case-insensitive
    }).populate("categories");

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Fel vid sökning av recept:", error);
    res.status(500).json({ error: "Kunde inte söka recept" });
  }
};

export default categoryRouter;
