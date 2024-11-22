import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recipesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
