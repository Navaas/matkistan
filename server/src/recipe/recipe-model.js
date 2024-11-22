import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  difficulty: String,
  cookingTime: Number,
  imageUrl: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export { recipeSchema };
export const RecipeModel = mongoose.model("Recipe", recipeSchema);
