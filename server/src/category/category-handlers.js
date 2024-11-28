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
    const categoryId = req.params.categoryId; // Få categoryId från URL-parametern

    // Hämta kategorin från databasen
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori inte hittad" });
    }

    // Hämta alla recept som tillhör den kategorin
    const recipes = await RecipeModel.find({ categories: categoryId }).populate(
      "categories"
    ); // Populera kategorinamn

    res.status(200).json(recipes); // Returnera alla recept i den kategorin
  } catch (error) {
    console.error("Fel vid hämtning av recept för kategori:", error);
    res.status(500).json({ error: "Kunde inte hämta recept" });
  }
};

// Exportera categoryRouter här
export default categoryRouter; // Detta ska vara categoryRouter, inte recipeRouter
