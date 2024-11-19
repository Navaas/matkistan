import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  difficulty: String,
  cookingTime: Number,
});

const Recipe = mongoose.model("recipes", recipeSchema);

export default Recipe;
