import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

categorySchema.index({ name: 1 });
export const CategoryModel = mongoose.model("Category", categorySchema);
