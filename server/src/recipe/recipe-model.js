import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  difficulty: String,
  cookingTime: Number,
  imageUrl: [String],
});

export { recipeSchema };
// export const Recipe = mongoose.model("Recipe", recipeSchema);
export const RecipeModel = mongoose.model("Recipe", recipeSchema);
// export default Recipe;
