import mongoose from "mongoose";
import { z } from "zod";

const userZodSchema = z.object({
  firstname: z.string().min(1, "Förnamn är obligatoriskt"),
  username: z
    .string()
    .min(1, "Användarnamn är obligatoriskt")
    .max(30, "Användarnamnet får inte vara längre än 30 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken"),
  recipesCreated: z.array(z.string().uuid("Ogiltigt ID")).optional(), // Om det är en lista med ObjectId:s som kan vara tom
  likedRecipes: z.array(z.string().uuid("Ogiltigt ID")).optional(), // Om det är en lista med ObjectId:s som kan vara tom
});

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
userZodSchema;
export { UserModel, userZodSchema };
