import express from "express";
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

// Exportera categoryRouter här
export default categoryRouter; // Detta ska vara categoryRouter, inte recipeRouter
