import mongoose from "mongoose";
import { z } from "zod";

const recipeZodSchema = z.object({
  title: z.string().min(1, "titel är obligatoriskt"),
  ingredients: z.array(z.string()).nonempty("Minst en ingrediens krävs"),
  steps: z.array(z.string()).nonempty("Minst ett steg krävs"),
  difficulty: z.enum(["Lätt", "Medel", "Svår"]),
  cookingTime: z.string().min(1, "Ange din tillagningstid"),
  imageUrl: z.array(z.string().url("Kräver giltig url")).optional(),
  createdBy: z.string().optional(),
  likedBy: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  difficulty: String,
  cookingTime: { type: String, required: true },
  imageUrl: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

export { recipeSchema, recipeZodSchema };
export const RecipeModel = mongoose.model("Recipe", recipeSchema);
